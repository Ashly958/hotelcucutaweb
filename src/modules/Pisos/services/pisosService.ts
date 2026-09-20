import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type { Piso, GuardarPisoDTO } from '../types/piso.types';

function mapearPisoDesdeApi(item: any): Piso {
  return {
    id: Number(item.id),
    numero_piso: Number(item.numeroPiso ?? item.numero_piso ?? 0),
    nombre: String(item.nombre ?? ''),
    descripcion: item.descripcion ?? '',
    total_habitaciones: 0, // El backend actual no devuelve este dato
    areas_servicio: 'N/A', // El backend actual no devuelve este dato
  };
}

export const pisosService = {
  async obtenerTodos(): Promise<Piso[]> {
    const res = await api.get<RespuestaApi<any[]>>('/pisos');
    if (Array.isArray(res.data.data)) {
      return res.data.data.map(mapearPisoDesdeApi);
    }
    return [];
  },

  async crear(datos: GuardarPisoDTO): Promise<Piso> {
    const payload = {
      numero_piso: datos.numero_piso,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    };
    const res = await api.post<RespuestaApi<any>>('/pisos', payload);
    return mapearPisoDesdeApi(res.data.data);
  },

  async actualizar(id: number, datos: GuardarPisoDTO): Promise<Piso> {
    const payload = {
      numero_piso: datos.numero_piso,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    };
    const res = await api.put<RespuestaApi<any>>(`/pisos/${id}`, payload);
    return mapearPisoDesdeApi(res.data.data);
  },

  async eliminar(id: number): Promise<void> {
    await api.delete<RespuestaApi<null>>(`/pisos/${id}`);
  },
};
