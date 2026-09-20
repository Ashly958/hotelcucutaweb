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
  pisoId: number;
  numero: string;
  capacidadMaxima: number;
  tieneAire: boolean;
  tieneVentilador: boolean;
  detalleCamas: string | null;
  precioNocheBase: number;
  estado: string;
  observaciones: string | null;
  imagenUrl: string | null;
  // TODO: Añadir 'tipo' y 'huesped' si el backend lo empieza a soportar
}

// Función auxiliar para mapear el backend DTO a la interfaz de frontend
const mapHabitacionToFrontend = (backendData: HabitacionBackendDTO): Habitacion => {
  return {
    id: backendData.id.toString(),
    numero: backendData.numero,
    piso: backendData.pisoId,
    // Como el backend no devuelve 'tipo' por ahora, inferimos algo o ponemos 'Estándar'
    tipo: 'Estándar',
    camas: backendData.detalleCamas || '1 cama',
    capacidadMax: backendData.capacidadMaxima,
    tieneAire: backendData.tieneAire,
    tieneVentilador: backendData.tieneVentilador,
    precioNoche: backendData.precioNocheBase,
    estado: backendData.estado as EstadoHabitacion,
    observaciones: backendData.observaciones || undefined,
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
