import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Reserva,
  CrearReservaDTO,
  ConvertirReservaDTO,
  FiltrosReserva,
  RackData,
} from '../types/reserva.types';

function mapearReservaDesdeApi(item: Record<string, unknown>): Reserva {
  return {
    id: Number(item.id),
    codigo_reserva: String(item.codigoReserva || item.codigo_reserva || `RS-${item.id}`),
    habitacion_id: Number(item.habitacionId || item.habitacion_id || 0),
    habitacion_numero: String(item.habitacionNumero || item.habitacion_numero || ''),
    huesped_id: item.huespedId ? Number(item.huespedId) : undefined,
    nombres: String(item.nombres || ''),
    apellidos: String(item.apellidos || ''),
    nombre_completo: String(item.nombreCompleto || `${item.nombres || ''} ${item.apellidos || ''}`.trim()),
    tipo_documento: String(item.tipoDocumento || item.tipo_documento || 'CC'),
    numero_documento: String(item.numeroDocumento || item.numero_documento || ''),
    telefono: item.telefono ? String(item.telefono) : undefined,
    email: item.email ? String(item.email) : undefined,
    fecha_llegada: String(item.fechaLlegada || item.fecha_llegada || ''),
    fecha_salida: String(item.fechaSalida || item.fecha_salida || ''),
    adultos: Number(item.adultos || 1),
    ninos: Number(item.ninos || 0),
    valor_noche: Number(item.valorNoche || item.valor_noche || 0),
    noches: Number(item.noches || 1),
    total_estimado: Number(item.totalEstimado || item.total_estimado || 0),
    abono_anticipo: Number(item.abonoAnticipo || item.abono_anticipo || 0),
    saldo_pendiente: Number(item.saldoPendiente || item.saldo_pendiente || 0),
    estado: (item.estado as Reserva['estado']) || 'pendiente',
    origen: (item.origen as Reserva['origen']) || 'directa',
    motivo_cancelacion: item.motivoCancelacion ? String(item.motivoCancelacion) : undefined,
    notas: item.notas ? String(item.notas) : undefined,
    usuario_id: item.usuarioId ? Number(item.usuarioId) : undefined,
    estadia_id: item.estadiaId ? Number(item.estadiaId) : undefined,
  };
}

export const reservasService = {
  async obtenerTodas(filtros?: FiltrosReserva): Promise<Reserva[]> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.habitacion_id) params.append('habitacion_id', String(filtros.habitacion_id));
    if (filtros?.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros?.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros?.termino) params.append('termino', filtros.termino);

    const response = await api.get<RespuestaApi<Record<string, unknown>[]>>(`/reservas?${params.toString()}`);
    return (response.data.data || []).map(mapearReservaDesdeApi);
  },

  async obtenerRack(fechaDesde: string, fechaHasta: string): Promise<RackData> {
    const response = await api.get<RespuestaApi<RackData>>(
      `/reservas/rack?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`
    );
    return response.data.data;
  },

  async crear(datos: CrearReservaDTO): Promise<Reserva> {
    const response = await api.post<RespuestaApi<Record<string, unknown>>>('/reservas', datos);
    return mapearReservaDesdeApi(response.data.data);
  },

  async cancelar(id: number, motivo: string): Promise<Reserva> {
    const response = await api.post<RespuestaApi<Record<string, unknown>>>(`/reservas/${id}/cancelar`, { motivo });
    return mapearReservaDesdeApi(response.data.data);
  },

  async convertirACheckIn(id: number, datos?: ConvertirReservaDTO): Promise<{ estadia_id: number; codigo_estadia: string; mensaje: string }> {
    const response = await api.post<RespuestaApi<{ estadia_id: number; codigo_estadia: string; mensaje: string }>>(
      `/reservas/${id}/check-in`,
      datos || {}
    );
    return response.data.data;
  },

  async buscarHuespedPorDocumento(numero: string): Promise<import('../types/reserva.types').HuespedEncontradoDTO | null> {
    try {
      const response = await api.get<RespuestaApi<import('../types/reserva.types').HuespedEncontradoDTO>>(`/huespedes/documento/${numero}`);
      return response.data.data;
    } catch {
      return null;
    }
  },
};
