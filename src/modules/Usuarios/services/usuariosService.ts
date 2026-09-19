import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  UsuarioSistema,
  GuardarUsuarioDTO,
  CambiarClaveDTO,
} from '../types/usuario.types';

let memoriaUsuarios: UsuarioSistema[] = [
  {
    id: 1,
    nombre_completo: 'Patricia Ramírez',
    email: 'admin@hotelcucuta.com',
    telefono: '+57 300 1234567',
    rol: 'ADMIN',
    activo: true,
    created_at: '2026-01-15 08:00:00',
  },
  {
    id: 2,
    nombre_completo: 'Carlos Mendoza',
    email: 'recepcion@hotelcucuta.com',
    telefono: '+57 310 9876543',
    rol: 'RECEPCION',
    activo: true,
    created_at: '2026-02-01 07:00:00',
  },
  {
    id: 3,
    nombre_completo: 'Rosa Gómez',
    email: 'lavanderia@hotelcucuta.com',
    telefono: '+57 315 2345678',
    rol: 'LAVANDERIA',
    activo: true,
    created_at: '2026-02-10 08:30:00',
  },
  {
    id: 4,
    nombre_completo: 'Javier Blanco',
    email: 'mantenimiento@hotelcucuta.com',
    telefono: '+57 320 8765432',
    rol: 'MANTENIMIENTO',
    activo: true,
    created_at: '2026-02-15 09:00:00',
  },
];

export const usuariosService = {
  async obtenerTodos(): Promise<UsuarioSistema[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      return [...memoriaUsuarios];
    }
    try {
      const res = await api.get<RespuestaApi<UsuarioSistema[]>>('/usuarios');
      return res.data.data;
    } catch {
      return [...memoriaUsuarios];
    }
  },

  async crear(datos: GuardarUsuarioDTO): Promise<UsuarioSistema> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      const nuevo: UsuarioSistema = {
        id: memoriaUsuarios.length + 1,
        nombre_completo: datos.nombre_completo,
        email: datos.email,
        telefono: datos.telefono,
        rol: datos.rol,
        activo: true,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      memoriaUsuarios.push(nuevo);
      return nuevo;
    }
    const res = await api.post<RespuestaApi<UsuarioSistema>>('/usuarios', datos);
    return res.data.data;
  },

  async actualizar(id: number, datos: GuardarUsuarioDTO): Promise<UsuarioSistema> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      memoriaUsuarios = memoriaUsuarios.map((u) =>
        u.id === id
          ? {
              ...u,
              nombre_completo: datos.nombre_completo,
              email: datos.email,
              telefono: datos.telefono,
              rol: datos.rol,
            }
          : u
      );
      const updated = memoriaUsuarios.find((u) => u.id === id);
      if (!updated) throw new Error('Usuario no encontrado');
      return updated;
    }
    const res = await api.put<RespuestaApi<UsuarioSistema>>(`/usuarios/${id}`, datos);
    return res.data.data;
  },

  async alternarInactivar(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      memoriaUsuarios = memoriaUsuarios.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      );
      return;
    }
    await api.patch<RespuestaApi<null>>(`/usuarios/${id}/inactivar`);
  },

  async eliminar(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      memoriaUsuarios = memoriaUsuarios.filter((u) => u.id !== id);
      return;
    }
    await api.delete<RespuestaApi<null>>(`/usuarios/${id}`);
  },

  async cambiarClave(id: number, datos: CambiarClaveDTO): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      return;
    }
    await api.patch<RespuestaApi<null>>(`/usuarios/${id}/clave`, datos);
  },
};
