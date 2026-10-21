export type EstadoReserva = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
export type OrigenReserva = 'directa' | 'telefono' | 'whatsapp' | 'web';

export interface Reserva {
  id: number;
  codigo_reserva: string;
  habitacion_id: number;
  habitacion_numero?: string;
  huesped_id?: number;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  telefono?: string;
  email?: string;
  fecha_llegada: string;
  fecha_salida: string;
  adultos: number;
  ninos: number;
  valor_noche: number;
  noches: number;
  total_estimado: number;
  abono_anticipo: number;
  saldo_pendiente: number;
  estado: EstadoReserva;
  origen: OrigenReserva;
  motivo_cancelacion?: string;
  notas?: string;
  usuario_id?: number;
  estadia_id?: number;
}

export interface CrearReservaDTO {
  habitacion_id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  telefono?: string;
  email?: string;
  fecha_llegada: string;
  fecha_salida: string;
  adultos: number;
  ninos: number;
  valor_noche: number;
  abono_anticipo: number;
  origen: OrigenReserva;
  notas?: string;
}

export interface ConvertirReservaDTO {
  abono_adicional?: number;
  metodo_pago?: string;
}

export interface FiltrosReserva {
  estado?: string;
  habitacion_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  termino?: string;
}

export interface RackPiso {
  id: number;
  numero_piso: number;
  nombre: string;
}

export interface RackHabitacion {
  id: number;
  piso_id: number;
  numero: string;
  capacidad_maxima: number;
  estado: string;
  precio_noche_base: number;
  detalle_camas?: string;
}

export interface RackReservaItem {
  id: number;
  codigo_reserva: string;
  habitacion_id: number;
  huesped_nombre: string;
  telefono?: string;
  fecha_llegada: string;
  fecha_salida: string;
  noches: number;
  total_estimado: number;
  abono_anticipo: number;
  saldo_pendiente: number;
  estado: EstadoReserva;
  origen: OrigenReserva;
}

export interface RackEstadiaItem {
  id: number;
  codigo_estadia: string;
  habitacion_id: number;
  huesped_nombre: string;
  fecha_checkin: string;
  fecha_prevista_checkout?: string | null;
  estado: string;
}

export interface RackData {
  fecha_desde: string;
  fecha_hasta: string;
  pisos: RackPiso[];
  habitaciones: RackHabitacion[];
  reservas: RackReservaItem[];
  estadias: RackEstadiaItem[];
}

export interface HuespedEncontradoDTO {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  nacionalidad?: string;
  ciudad_procedencia?: string;
  ciudad_destino?: string;
}

