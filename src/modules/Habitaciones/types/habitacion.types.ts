// Tipos del módulo de Habitaciones de Hotel Cúcuta
export type EstadoHabitacion = 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento';

export type TipoHabitacion = 'Estándar' | 'Individual' | 'Matrimonial' | 'Familiar';

export interface HuespedActual {
  nombre: string;
  documento: string;
  nacionalidad: string;
  telefono: string;
  procedencia: string;
  destino: string;
  pax: number;
  noches: number;
  fechaIngreso: string;
  saldoPendiente: number;
  abonoInicial: number;
  estadiaId?: number;
  alertaTiempo?: 'vigente' | 'vence_hoy' | 'vencida';
}

export interface Habitacion {
  id: string;
  numero: string;
  piso: number;
  tipo: TipoHabitacion;
  camas: string;
  capacidadMax: number;
  tieneAire: boolean;
  tieneVentilador: boolean;
  precioNoche: number;
  estado: EstadoHabitacion;
  huesped?: HuespedActual | null;
  observaciones?: string;
  imagenUrl?: string;
  estadiaId?: number;
}

export interface CheckInDTO {
  habitacionId: string;
  nombre: string;
  documentoTipo: string;
  documentoNumero: string;
  nacionalidad: string;
  telefono: string;
  procedencia: string;
  destino: string;
  pax: number;
  noches: number;
  abonoEfectivo: number;
  acompanantes?: Array<{
    nombres: string;
    tipo_documento: string;
    numero_documento: string;
    parentesco?: string;
  }>;
}

export interface CrearHabitacionDTO {
  numero: string;
  piso_id: number;
  tipo?: TipoHabitacion;
  detalle_camas: string;
  capacidad_maxima: number;
  tiene_aire: boolean;
  tiene_ventilador: boolean;
  precio_noche_base: number;
  estado?: EstadoHabitacion;
  observaciones?: string;
  imagen_url?: string;
}

export interface ActualizarHabitacionDTO extends Partial<CrearHabitacionDTO> {
  estado?: EstadoHabitacion;
}
