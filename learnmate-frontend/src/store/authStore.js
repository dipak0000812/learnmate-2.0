// src/store/authStore.js - Updated with refresh token support
import { create } from 'zustand';
import api from '../services/api';
import tokenService from '../services/tokenService';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log('🔐 Attempting login...', email);
      const response = await api.post('/api/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      const { token, refreshToken, user } = response.data.data;
      
      // Store both access and refresh tokens
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
      
      // Initialize token refresh schedule
      tokenService.scheduleTokenRefresh(token);
      
      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      console.log('📝 Attempting registration...', userData.email);
      const response = await api.post('/api/auth/register', userData);
      console.log('✅ Register response:', response.data);
      
      const { token, refreshToken, user } = response.data.data;
      
      // Store tokens
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
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

  logout: () => {
    console.log('👋 Logging out...');
    
    // Clear tokens and stop refresh
    tokenService.clearTokens();
    
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
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
}));

export default useAuthStore;