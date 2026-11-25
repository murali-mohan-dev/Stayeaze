import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token automatically if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stayease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear stale auth data
      const token = localStorage.getItem('stayease_token');
      if (token && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('stayease_token');
        localStorage.removeItem('stayease_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
