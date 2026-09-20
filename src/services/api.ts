import axios from 'axios';
import { store } from '@/store';
import { cerrarSesion } from '@/store/slices/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(cerrarSesion());
      const rutasPublicas = ['/login', '/onboarding'];
      if (!rutasPublicas.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } else if (error.response?.status >= 500) {
      console.error('Error interno del servidor:', error.response?.data);
      alert('Error interno del servidor. Por favor, intente de nuevo más tarde.');
    }
    return Promise.reject(error);
  }
);
