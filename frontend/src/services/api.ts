import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a centralized Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;