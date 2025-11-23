import axios from 'axios';

const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: BASE_URL + '/api',   // ✅ ALWAYS adds /api
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true
});

export default axiosInstance;





