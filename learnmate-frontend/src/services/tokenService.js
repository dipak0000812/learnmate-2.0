// src/services/tokenService.js
import api from './axiosInstance';
import { jwtDecode } from 'jwt-decode';

const REFRESH_ENDPOINT = '/auth/refresh';

class TokenService {
  constructor() {
    this.refreshTimer = null;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  // Decode JWT token
  decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  // Check if token is expired (DEMO MODE: ALWAYS FALSE)
  isTokenExpired(token) {
      try {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // convert seconds to milliseconds

    return Date.now() > expiry;
  } catch (error) {
    // if token is invalid or corrupted, treat it as expired
    return true;
  }
  }

  // Get token expiry time
  getTokenExpiryTime(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return decoded.exp * 1000; // Convert to milliseconds
  }

  // Refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await api.post(REFRESH_ENDPOINT);

      const { token: newToken } = response.data?.data || {};
      if (!newToken) {
        throw new Error('Refresh token response missing access token');
      }

      // Update tokens
      localStorage.setItem('token', newToken);

      // Notify all waiting requests
      this.refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
      this.refreshSubscribers = [];

      // Schedule next refresh
      this.scheduleTokenRefresh(newToken);

      return newToken;
    } catch (error) {
      // Notify all waiting requests of failure
      this.refreshSubscribers.forEach(({ reject }) => reject(error));
      this.refreshSubscribers = [];

      // Clear tokens and redirect to login
      this.clearTokens();
      window.location.href = '/login';

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Schedule automatic token refresh
  scheduleTokenRefresh(token) {
    const expiry = this.getTokenExpiryTime(token);
    if (!expiry) return;

    // Refresh 1 minute before expiry
    const timeout = expiry - Date.now() - (60 * 1000);

    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    if (timeout > 0) {
      console.log(`Token refresh scheduled in ${Math.round(timeout / 1000)}s`);
      this.refreshTimer = setTimeout(() => {
        this.refreshToken().catch(err => console.error('Auto-refresh failed', err));
      }, timeout);
    } else {
      // If already expired or close to it, refresh immediately
      this.refreshToken().catch(err => console.error('Immediate refresh failed', err));
    }
  }

  // Initialize token refresh on app start
  initTokenRefresh() {
    const token = localStorage.getItem('token');
    if (token) {
      this.scheduleTokenRefresh(token);
    }
  }

  // Clear all tokens
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Stop token refresh
  stopTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Create singleton instance
const tokenService = new TokenService();

export default tokenService;