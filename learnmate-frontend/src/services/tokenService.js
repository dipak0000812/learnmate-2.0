// src/services/tokenService.js
import api from './axiosInstance';
import { jwtDecode } from 'jwt-decode';

const REFRESH_ENDPOINT = '/api/auth/refresh';

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

  // Check if token is expired or about to expire
  isTokenExpired(token) {
    if (!token) return true;
    
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Token is considered expired if less than 5 minutes remain
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60; // 5 minutes
    
    return decoded.exp - currentTime < bufferTime;
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
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const expiryTime = this.getTokenExpiryTime(token);
    if (!expiryTime) return;

    // Refresh 5 minutes before expiry
    const refreshTime = expiryTime - Date.now() - (5 * 60 * 1000);

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);

      // Better formatted console message
      const hours = Math.floor(refreshTime / 1000 / 60 / 60);
      const minutes = Math.floor((refreshTime / 1000 / 60) % 60);
      console.log(`⏰ Token expires in ${hours}h ${minutes}m`);
    } else {
      this.refreshToken().catch(() => {
        // noop - downstream handlers already redirect on failure
      });
    }
  }

  // Initialize token refresh on app start
  initTokenRefresh() {
    const token = localStorage.getItem('token');
    
    if (!token) return;

    if (this.isTokenExpired(token)) {
      // Token already expired, try to refresh immediately
      this.refreshToken().catch(() => {
        // Refresh failed, user will be redirected to login
      });
    } else {
      // Schedule refresh for later
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