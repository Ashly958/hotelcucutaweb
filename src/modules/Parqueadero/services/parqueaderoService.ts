import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  ParqueaderoDashboardResponse,
  RegistroParqueadero,
  RegistrarIngresoParqueaderoDTO,
  FiltrosParqueadero,
} from '../types/parqueadero.types';

export const parqueaderoService = {
  async obtenerDatos(filtros?: FiltrosParqueadero): Promise<ParqueaderoDashboardResponse> {
    const res = await api.get<RespuestaApi<ParqueaderoDashboardResponse>>('/parqueadero', {
      params: filtros,
    });
    return res.data.data;
  },

  async actualizarTarifas(datos: { tarifa_moto: number; tarifa_carro: number }): Promise<{ moto: number; carro: number }> {
    const res = await api.put<RespuestaApi<{ moto: number; carro: number }>>('/parqueadero/tarifas', datos);
    return res.data.data;
  },

  async registrarIngreso(datos: RegistrarIngresoParqueaderoDTO): Promise<RegistroParqueadero> {
    const res = await api.post<RespuestaApi<RegistroParqueadero>>('/parqueadero/ingresos', datos);
    return res.data.data;
  },

  async registrarSalida(id: number, observaciones?: string): Promise<RegistroParqueadero> {
    const res = await api.post<RespuestaApi<RegistroParqueadero>>(`/parqueadero/${id}/salida`, {
      observaciones,
    });
    return res.data.data;
  },
};
