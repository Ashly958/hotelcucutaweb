import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Habitacion,
  CheckInDTO,
  EstadoHabitacion,
  CrearHabitacionDTO,
  ActualizarHabitacionDTO,
} from '../types/habitacion.types';

// Interfaz que refleja el DTO del backend
interface HabitacionBackendDTO {
  id: number;
  piso_id?: number;
  pisoId?: number;
  numero: string;
  capacidad_maxima?: number;
  capacidadMaxima?: number;
  tiene_aire?: boolean;
  tieneAire?: boolean;
  tiene_ventilador?: boolean;
  tieneVentilador?: boolean;
  detalle_camas?: string | null;
  detalleCamas?: string | null;
  precio_noche_base?: number;
  precioNocheBase?: number;
  estado: string;
  observaciones: string | null;
  imagen_url?: string | null;
  imagenUrl?: string | null;
  // TODO: Añadir 'tipo' y 'huesped' si el backend lo empieza a soportar
}

// Función auxiliar para mapear el backend DTO a la interfaz de frontend
const mapHabitacionToFrontend = (backendData: HabitacionBackendDTO): Habitacion => {
  return {
    id: backendData.id.toString(),
    numero: backendData.numero,
    piso: backendData.piso_id ?? backendData.pisoId ?? 1,
    // Como el backend no devuelve 'tipo' por ahora, inferimos algo o ponemos 'Estándar'
    tipo: 'Estándar',
    camas: backendData.detalle_camas ?? backendData.detalleCamas ?? '1 cama',
    capacidadMax: backendData.capacidad_maxima ?? backendData.capacidadMaxima ?? 1,
    tieneAire: backendData.tiene_aire ?? backendData.tieneAire ?? false,
    tieneVentilador: backendData.tiene_ventilador ?? backendData.tieneVentilador ?? false,
    precioNoche: backendData.precio_noche_base ?? backendData.precioNocheBase ?? 0,
    estado: backendData.estado as EstadoHabitacion,
    observaciones: backendData.observaciones || undefined,
    imagenUrl: backendData.imagen_url ?? backendData.imagenUrl ?? undefined,
  };
};

export const getHabitaciones = async (): Promise<Habitacion[]> => {
  const { data } = await api.get<RespuestaApi<HabitacionBackendDTO[]>>('/habitaciones');
  return data.data.map(mapHabitacionToFrontend);
};

export const getHabitacionById = async (id: string): Promise<Habitacion> => {
  const { data } = await api.get<RespuestaApi<HabitacionBackendDTO>>(`/habitaciones/${id}`);
  return mapHabitacionToFrontend(data.data);
};

export const crearHabitacion = async (dto: CrearHabitacionDTO): Promise<Habitacion> => {
  const { data } = await api.post<RespuestaApi<HabitacionBackendDTO>>('/habitaciones', dto);
  return mapHabitacionToFrontend(data.data);
};

export const updateHabitacion = async (id: string, dto: ActualizarHabitacionDTO): Promise<Habitacion> => {
  const { data } = await api.put<RespuestaApi<HabitacionBackendDTO>>(`/habitaciones/${id}`, dto);
  return mapHabitacionToFrontend(data.data);
};

export const checkIn = async (id: string, dto: CheckInDTO): Promise<Habitacion> => {
  const { data } = await api.post<RespuestaApi<HabitacionBackendDTO>>(`/habitaciones/${id}/checkin`, dto);
  return mapHabitacionToFrontend(data.data);
};

export const checkOut = async (id: string): Promise<Habitacion> => {
  const { data } = await api.post<RespuestaApi<HabitacionBackendDTO>>(`/habitaciones/${id}/checkout`);
  return mapHabitacionToFrontend(data.data);
};

export const cambiarEstado = async (id: string, estado: EstadoHabitacion): Promise<Habitacion> => {
  const { data } = await api.patch<RespuestaApi<HabitacionBackendDTO>>(`/habitaciones/${id}/estado`, { estado });
  return mapHabitacionToFrontend(data.data);
};

export const eliminarHabitacion = async (id: string): Promise<void> => {
  await api.delete<RespuestaApi<null>>(`/habitaciones/${id}`);
};

export interface EventoHistorialHabitacion {
  id?: number;
  tipo: 'estadia' | 'mantenimiento' | 'reserva';
  fecha: string;
  fecha_hora?: string;
  titulo: string;
  descripcion: string;
  estado: string;
  monto?: number;
  costo?: number;
  reserva_id?: number;
  codigo_reserva?: string;
  habitacion_id?: number;
  fecha_salida?: string;
  numero_documento?: string;
  tipo_documento?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  noches?: number;
  adultos?: number;
  ninos?: number;
  valor_noche?: number;
  abono_anticipo?: number;
  notas?: string;
}

export interface MantenimientoHabitacion {
  id: number;
  habitacion_id: number;
  usuario_id?: number;
  titulo_averia: string;
  descripcion: string;
  categoria: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  costo_repuestos: number;
  tecnico_responsable?: string;
  estado: 'reportada' | 'en_reparacion' | 'resuelta' | 'cancelada';
  fecha_reporte: string;
  fecha_solucion?: string;
  notas_solucion?: string;
  habitacion?: {
    id: number;
    numero: string;
  };
}

export const obtenerHistorialHabitacion = async (id: string | number): Promise<EventoHistorialHabitacion[]> => {
  const { data } = await api.get<RespuestaApi<EventoHistorialHabitacion[]>>(`/habitaciones/${id}/historial`);
  return data.data || [];
};

export const listarMantenimientos = async (params?: { habitacion_id?: number; estado?: string }): Promise<MantenimientoHabitacion[]> => {
  const { data } = await api.get<RespuestaApi<MantenimientoHabitacion[]>>('/habitaciones/mantenimientos', { params });
  return data.data || [];
};

export const reportarMantenimiento = async (dto: {
  habitacion_id: number;
  titulo_averia: string;
  descripcion: string;
  categoria?: string;
  prioridad?: string;
  costo_repuestos?: number;
  tecnico_responsable?: string;
}): Promise<MantenimientoHabitacion> => {
  const { data } = await api.post<RespuestaApi<MantenimientoHabitacion>>('/habitaciones/mantenimientos', dto);
  return data.data;
};

export const resolverMantenimiento = async (id: number, dto?: { notas_solucion?: string; costo_repuestos?: number }): Promise<MantenimientoHabitacion> => {
  const { data } = await api.post<RespuestaApi<MantenimientoHabitacion>>(`/habitaciones/mantenimientos/${id}/resolver`, dto);
  return data.data;
};

