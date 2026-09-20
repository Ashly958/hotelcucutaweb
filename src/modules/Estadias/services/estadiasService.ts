import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Estadia,
  RegistrarCheckInDTO,
  RespuestaCheckInDTO,
} from '../types/estadia.types';

function mapearEstadiaDesdeApi(item: any): Estadia {
  return {
    id: Number(item.id),
    codigo_estadia: String(item.codigoEstadia || item.codigo_estadia || `EST-${item.id}`),
    habitacion_id: Number(item.habitacionId || item.habitacion_id || 0),
    habitacion_numero: String(item.habitacionId || item.habitacion_numero || '00'),
    huesped_id: Number(item.huespedTitularId || item.huesped_id || 1),
    huesped: {
      nombres: 'Huésped',
      apellidos: 'Titular',
      tipo_documento: 'CC',
      numero_documento: '000000',
      telefono: 'N/A',
      ciudad_procedencia: 'N/A',
      direccion: 'N/A',
      profesion: 'N/A',
    },
    fecha_checkin: item.fechaCheckin || item.fecha_checkin || new Date().toISOString(),
    fecha_prevista_checkout: item.fechaPrevistaCheckout || item.fecha_prevista_checkout || new Date().toISOString(),
    fecha_checkout_real: item.fechaRealCheckout || item.fecha_checkout_real,
    dias_estadia: 1, // Compute if needed
    valor_habitacion: Number(item.tarifaPactadaNoche || item.valor_habitacion || 0),
    iva: 0,
    total: Number(item.totalHospedaje || item.total || 0),
    abonos_totales: 0,
    saldo_pendiente: Number(item.totalHospedaje || item.total || 0),
    estado: item.estado || 'activa',
    observaciones: item.observaciones || '',
    acompanantes: [],
  };
}

export const estadiasService = {
  async obtenerTodas(): Promise<Estadia[]> {
    try {
      const response = await api.get<RespuestaApi<any[]>>('/estadias');
      return (response.data.data || []).map(mapearEstadiaDesdeApi);
    } catch {
      return [];
    }
  },

  async obtenerPorId(id: number): Promise<Estadia> {
    const response = await api.get<RespuestaApi<any>>(`/estadias/${id}`);
    return mapearEstadiaDesdeApi(response.data.data);
  },

  async registrarCheckIn(datos: RegistrarCheckInDTO): Promise<RespuestaCheckInDTO> {
    const response = await api.post<RespuestaApi<RespuestaCheckInDTO>>(
      '/check-in/manual',
      datos
    );
    return response.data.data;
  },

  async realizarCheckOut(id: number): Promise<void> {
    await api.post<RespuestaApi<null>>(`/estadias/${id}/check-out`);
  },
};
