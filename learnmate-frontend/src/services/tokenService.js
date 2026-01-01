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
    return false;
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

  // Schedule automatic token refresh (DISABLED FOR STABILITY)
  scheduleTokenRefresh(token) {
    // console.log('Auto-refresh disabled for stability.');
    return;
  }

  // Initialize token refresh on app start
  initTokenRefresh() {
    // console.log('Auto-refresh disabled for stability.');
    return;
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