import axios from 'axios';
import { store } from '@/store';
import { cerrarSesion } from '@/store/slices/authSlice';

/**
 * Cliente HTTP centralizado para la aplicación Hotel Cúcuta.
 * Cumple estrictamente las directivas de AGENTS.md y estado-y-servicios.md:
 * - Una única instancia global.
 * - Inyección automática de Bearer Token en peticiones salientes.
 * - Captura global del error 401 Unauthorized para limpieza y redirección.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de Petición: Inyección automática de Bearer Token
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

// Interceptor de Respuesta: Manejo centralizado de expiración de sesión (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(cerrarSesion());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
