import axios from 'axios';

const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: BASE_URL + '/api',   // ✅ ALWAYS adds /api
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401, it means the token is invalid/expired
      // and the backend rejected us.
      // We should ideally try to refresh, but for stability/demo:
      // just log out to avoid infinite loops or broken states.

      // Prevent redirect loop if already on login
      if (!window.location.pathname.includes('/login')) {
        console.warn('⚠️ 401 Unauthorized - Redirecting to Login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
