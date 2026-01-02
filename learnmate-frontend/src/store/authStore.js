// src/store/authStore.js - Updated with refresh token support
import { create } from 'zustand';
import api from '../services/api';
import tokenService from '../services/tokenService';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      // Store access token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Initialize token refresh schedule
      tokenService.scheduleTokenRefresh(token);

      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMsg = 'Login failed. Please check your credentials.';

      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Cannot connect to server. Please ensure the Backend is running on Port 5000.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Login with existing token (OAuth)
  loginWithToken: async (token) => {
    set({ loading: true, error: null });
    try {
      localStorage.setItem('token', token);
      // Fetch user data with this token
      const user = await get().fetchUser();

      if (user) {
        tokenService.scheduleTokenRefresh(token);
        set({ token, isAuthenticated: true, loading: false });
        return { success: true };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('OAuth Hydration error:', error);
      set({ error: 'OAuth failed', loading: false, token: null, isAuthenticated: false });
      localStorage.removeItem('token');
      return { success: false, error: 'Authentication failed' };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Initialize token refresh schedule
      tokenService.scheduleTokenRefresh(token);

      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      console.error('❌ Register error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore logout errors
    }
    tokenService.clearTokens();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: async (userData) => {
    try {
      // Optimistic update
      set({ user: { ...get().user, ...userData } });
      localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));

      // Persist to backend
      const response = await api.put('/users/me', userData);

      // Update with server response (in case of sanitization)
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });

      return { success: true };
    } catch (error) {
      console.error('Update profile failed:', error);
      // Revert? For now just return error
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  },

  // Manual token refresh (if needed)
  refreshToken: async () => {
    try {
      const newToken = await tokenService.refreshToken();
      set({ token: newToken });
      return { success: true };
    } catch (error) {
      set({ error: 'Token refresh failed', isAuthenticated: false });
      return { success: false };
    }
  },
  // Fetch fresh user data (for real-time stats updates)
  fetchUser: async () => {
    try {
      const response = await api.get('/auth/me'); // Assuming /me endpoint exists or similar
      const user = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      return user;
    } catch (error) {
      console.error('Failed to fetch fresh user data:', error);
      return null;
    }
  },
}));

export default useAuthStore;
export { useAuthStore };