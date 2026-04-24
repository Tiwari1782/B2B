import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// JWT Interceptor — attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('b2b_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('b2b_token');
      localStorage.removeItem('b2b_user');
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/superadmin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
