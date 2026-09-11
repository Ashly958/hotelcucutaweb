import { api } from '@/services/api';
import { simularLoginApi } from '@/services/mockAuth';
import type { CredencialesDTO, RespuestaAutenticacion, Usuario } from '../types/auth.types';
import type { RespuestaApi } from '@/types/api';

/**
 * Servicio de Autenticación del Módulo Login.
 * Cumple con la directiva:
 * - No contiene estado de React.
 * - Respeta la arquitectura de capas.
 * - Utiliza mock data cuando VITE_USE_MOCK_DATA está activo o como fallback en desarrollo.
 */
export const authService = {
  /**
   * Realiza la petición de inicio de sesión con las credenciales suministradas.
   */
  async iniciarSesion(credenciales: CredencialesDTO): Promise<RespuestaAutenticacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

    if (usarMock) {
      const respuestaMock = await simularLoginApi(credenciales);
      return respuestaMock.data;
    }

    // Ruta real hacia el backend Laravel
    const respuesta = await api.post<RespuestaApi<RespuestaAutenticacion>>(
      '/v1/auth/login',
      credenciales
    );
    return respuesta.data.data;
  },

  /**
   * Notifica el cierre de sesión al backend para invalidar el token.
   */
  async cerrarSesion(): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      return;
    }

    try {
      await api.post<RespuestaApi<null>>('/v1/auth/logout');
    } catch {
      // Si falla la revocación remota, el frontend igualmente limpia el estado local
    }
  },

  /**
   * Obtiene la información del usuario autenticado actual.
   */
  async obtenerPerfilActual(): Promise<Usuario> {
    const respuesta = await api.get<RespuestaApi<Usuario>>('/v1/auth/me');
    return respuesta.data.data;
  },
};
