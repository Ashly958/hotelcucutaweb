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
}
