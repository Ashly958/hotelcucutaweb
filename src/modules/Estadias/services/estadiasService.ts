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
    huesped: item.huesped ? {
      nombres: item.huesped.nombres || 'Huésped',
      apellidos: item.huesped.apellidos || 'Titular',
      tipo_documento: item.huesped.tipoDocumento || item.huesped.tipo_documento || 'CC',
      numero_documento: item.huesped.numeroDocumento || item.huesped.numero_documento || '000000',
      telefono: item.huesped.telefono || 'N/A',
      ciudad_procedencia: item.huesped.ciudadProcedencia || item.huesped.ciudad_procedencia || 'N/A',
      direccion: item.huesped.ciudadDestino || item.huesped.ciudad_destino || 'N/A',
      profesion: item.huesped.profesion || 'N/A',
    } : {
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
    dias_estadia: item.diasEstadia || item.dias_estadia || 1,
    valor_habitacion: Number(item.tarifaPactadaNoche || item.valor_habitacion || 0),
    subtotal: item.subtotal !== undefined ? Number(item.subtotal) : undefined,
    iva: Number(item.iva || 0),
    impuesto_consumo: Number(item.impuestoConsumo ?? item.impuesto_consumo ?? 0),
    total: Number(item.totalHospedaje || item.total || 0),
    abonos_totales: 0,
    saldo_pendiente: item.saldoPendiente !== undefined ? Number(item.saldoPendiente) : Number(item.saldo_pendiente ?? item.totalHospedaje ?? item.total ?? 0),
    estado: item.estado || 'activa',
    alerta_tiempo: item.alertaTiempo || item.alerta_tiempo || 'vigente',
    observaciones: item.observaciones || '',
    acompanantes: item.acompanantes || [],
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

  async extenderEstadia(
    id: number,
    datos: { dias_adicionales: number; tarifa_noche?: number }
  ): Promise<Estadia> {
    const response = await api.post<RespuestaApi<any>>(`/estadias/${id}/extender`, datos);
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

  async buscarHuespedPorDocumento(numero: string): Promise<any> {
    try {
      const response = await api.get<RespuestaApi<any>>(`/huespedes/documento/${numero}`);
      return response.data.data;
    } catch {
      return null;
    }
  },
};
