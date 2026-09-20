import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  UsuarioSistema,
  GuardarUsuarioDTO,
  CambiarClaveDTO,
} from '../types/usuario.types';

export const usuariosService = {
  async obtenerTodos(): Promise<UsuarioSistema[]> {
    try {
      const res = await api.get<RespuestaApi<UsuarioSistema[]>>('/usuarios');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async crear(datos: GuardarUsuarioDTO): Promise<UsuarioSistema> {
    const res = await api.post<RespuestaApi<UsuarioSistema>>('/usuarios', datos);
    return res.data.data;
  },

  async actualizar(id: number, datos: GuardarUsuarioDTO): Promise<UsuarioSistema> {
    const res = await api.put<RespuestaApi<UsuarioSistema>>(`/usuarios/${id}`, datos);
    return res.data.data;
  },

  async alternarInactivar(id: number): Promise<void> {
    await api.patch<RespuestaApi<null>>(`/usuarios/${id}/inactivar`);
  },

  async eliminar(id: number): Promise<void> {
    await api.delete<RespuestaApi<null>>(`/usuarios/${id}`);
  },

  async cambiarClave(id: number, datos: CambiarClaveDTO): Promise<void> {
    await api.patch<RespuestaApi<null>>(`/usuarios/${id}/clave`, datos);
  },
};
