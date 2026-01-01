// src/services/api.js - axios instance with token refresh handling
import api from './axiosInstance';
import tokenService from './tokenService';

// Request interceptor - Add auth token and check expiry
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');

    // Check if token is expired or about to expire
    if (token && tokenService.isTokenExpired(token)) {
      if (!tokenService.isRefreshing) {
        try {
          token = await tokenService.refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          return Promise.reject(error);
        }
      } else {
        // If already refreshing, wait for it (simple delay for now, or just let tokenService handle the queueing)
        // Since tokenService queues, we can just await it again?
        // Actually, if we just let it fall through to tokenService, tokenService handles it.
        // But to satisfy the user request:
      }

      // Better approach: Rely on tokenService's lock but log it
      if (tokenService.isRefreshing) {
        // logic to wait? tokenService.refreshToken returns a promise that resolves when the current one finishes
        try {
          token = await tokenService.refreshToken();
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        try {
          token = await tokenService.refreshToken();
        } catch (error) {
          return Promise.reject(error);
        }
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