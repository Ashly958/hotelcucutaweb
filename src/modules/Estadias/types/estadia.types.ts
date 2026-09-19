export interface Huesped {
  id?: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  telefono?: string;
  ciudad_procedencia?: string;
  direccion?: string;
  profesion?: string;
}

export interface Acompanante {
  nombres: string;
  tipo_documento: string;
  numero_documento: string;
  parentesco?: string;
}

export interface Estadia {
  id: number;
  codigo_estadia: string;
  habitacion_id: number;
  habitacion_numero?: string;
  huesped_id: number;
  huesped?: Huesped;
  fecha_checkin: string;
  fecha_checkout_real?: string | null;
  fecha_prevista_checkout?: string;
  dias_estadia: number;
  valor_habitacion: number;
  iva: number;
  total: number;
  saldo_pendiente: number;
  abonos_totales: number;
  estado: 'activa' | 'finalizada' | 'cancelada';
  observaciones?: string;
  firma_url?: string;
  acompanantes?: Acompanante[];
}

export interface RegistrarCheckInDTO {
  habitacion_id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  ciudad_procedencia?: string;
  direccion?: string;
  profesion?: string;
  fecha_checkin: string;
  fecha_prevista_checkout?: string;
  dias_estadia: number;
  valor_habitacion: number;
  iva?: number;
  abono_inicial?: number;
  observaciones?: string;
  firma_url?: string;
  acompanantes?: Acompanante[];
}

export interface RespuestaCheckInDTO {
  codigo_estadia: string;
  estadia_id: number;
  huesped_id: number;
}
