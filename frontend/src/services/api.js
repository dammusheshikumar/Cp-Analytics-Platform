// src/services/api.js
// All API calls related to authentication and platform data fetching.

import axios from 'axios';

// Vite reads environment variables via import.meta.env instead of process.env.
// We fallback directly to your live Render backend URL if the env variable isn't set.
const API_URL = import.meta.env.VITE_API_URL || 'https://cp-analytics-platform-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request if it exists in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid or expired, clear it and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;