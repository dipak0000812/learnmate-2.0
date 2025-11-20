// src/services/api.js - axios instance with token refresh handling
import api from './axiosInstance';
import tokenService from './tokenService';

// Request interceptor - Add auth token and check expiry
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    
    // Check if token is expired or about to expire
    if (token && tokenService.isTokenExpired(token)) {
      console.log('Token expired or expiring soon, refreshing...');
      try {
        token = await tokenService.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const newToken = await tokenService.refreshToken();
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If 403 (Forbidden) - user might not have permission
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

export default api;