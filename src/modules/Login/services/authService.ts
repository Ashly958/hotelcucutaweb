import { api } from '@/services/api';
import type { CredencialesDTO, RespuestaAutenticacion, Usuario, RolUsuario } from '../types/auth.types';
import type { RespuestaApi } from '@/types/api';

/**
 * Mapea el usuario recibido desde el backend Laravel a la interfaz requerida por el frontend
 */
function mapearUsuarioBackend(u: any): Usuario {
  if (!u) {
    throw new Error("No se recibió información del usuario desde el servidor.");
  }

  const nombreCompleto = u.nombre_completo || u.nombre || 'Usuario';
  const partes = String(nombreCompleto).trim().split(' ');
  const nombre = partes[0] || 'Usuario';
  const apellido = partes.slice(1).join(' ') || '';

  // Normalizar rol entre mayúsculas y minúsculas
  let rolNormalizado: RolUsuario = 'RECEPCION';
  const rolStr = String(u.rol || '').toLowerCase();
  if (rolStr.includes('admin')) {
    rolNormalizado = 'ADMIN';
  } else if (rolStr.includes('recep')) {
    rolNormalizado = 'RECEPCION';
  } else if (rolStr.includes('lavand')) {
    rolNormalizado = 'LAVANDERIA';
  } else if (rolStr.includes('manten')) {
    rolNormalizado = 'MANTENIMIENTO';
  }

  const rolNombres: Record<RolUsuario, string> = {
    ADMIN: 'Gerencia General',
    RECEPCION: 'Recepción & Front Desk',
    LAVANDERIA: 'Lavandería Piso 5',
    MANTENIMIENTO: 'Mantenimiento Técnico',
  };

  return {
    id: String(u.id || '1'),
    nombre,
    apellido,
    email: u.email || '',
    rol: rolNormalizado,
    rolNombre: rolNombres[rolNormalizado],
    estado: u.activo ? 'ACTIVO' : 'INACTIVO',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta',
    ultimoAcceso: new Date().toISOString(),
  };
}

export const authService = {
  /**
   * Realiza la petición de inicio de sesión con las credenciales suministradas.
   */
  async iniciarSesion(credenciales: CredencialesDTO): Promise<RespuestaAutenticacion> {
    try {
      // Petición real hacia la API de Laravel
      const respuesta = await api.post<RespuestaApi<{ token: string; usuario?: any }>>(
        '/autenticacion/login',
        {
          email: credenciales.email.trim().toLowerCase(),
          password: credenciales.password.trim(),
        }
      );

      const payload = respuesta.data.data;
      const usuarioMapeado = mapearUsuarioBackend(payload.usuario);

      return {
        usuario: usuarioMapeado,
        token: payload.token,
        expiraEn: '24h',
        tipoToken: 'Bearer',
      };
    } catch (err: any) {
      const esErrorConexion =
        !err.response ||
        err.code === 'ERR_NETWORK' ||
        err.code === 'ECONNABORTED' ||
        err.message?.includes('Network Error');

      const mensajeError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (esErrorConexion
          ? 'No se pudo conectar con el servidor backend (http://localhost:8000/api). Asegúrese de que el servidor esté activo.'
          : err.message || 'Error al autenticar con el servidor');
      throw new Error(mensajeError);
    }
  },

  /**
   * Notifica el cierre de sesión al backend para invalidar el token.
   */
  async cerrarSesion(): Promise<void> {
    try {
      await api.post('/autenticacion/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    }
  },

  /**
   * Obtiene la información del usuario autenticado actual.
   */
  async obtenerPerfilActual(): Promise<Usuario> {
    try {
      const respuesta = await api.get<RespuestaApi<any>>('/autenticacion/me');
      return mapearUsuarioBackend(respuesta.data.data);
    } catch (error) {
      throw new Error('No se pudo obtener el perfil del usuario');
    }
  },
};
