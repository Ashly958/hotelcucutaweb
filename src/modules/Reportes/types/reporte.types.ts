export type ReportesTab =
  | 'ocupacion'
  | 'ingresos'
  | 'dian'
  | 'policia'
  | 'sire'
  | 'mincit'
  | 'auditoria'
  | 'directorio';

export interface FiltroReportes {
  fechaInicio?: string;
  fechaFin?: string;
  filtroPeriodo?: 'hoy' | 'semana' | 'mes' | 'anio' | 'personalizado';
  estado?: string;
  mes?: number;
  anio?: number;
  pisoId?: number;
}

export interface ReporteOcupacionResponse {
  fecha: string;
  total_habitaciones: number;
  habitaciones_ocupadas: number;
  habitaciones_disponibles: number;
  porcentaje_ocupacion: number;
  detalle_habitaciones: {
    habitacion_id: number;
    numero: string;
    estado_actual: string;
  }[];
}

export interface ReporteIngresosResponse {
  periodo: {
    inicio: string;
    fin: string;
  };
  total_facturado: number;
  total_recaudado: number;
  cantidad_facturas: number;
  cantidad_recibos: number;
}

export interface FacturaDianItem {
  numero_factura: string;
  fecha_emision: string;
  cliente_nombre: string;
  cliente_documento: string;
  subtotal: number;
  valor_iva: number;
  impuesto_consumo: number;
  total_factura: number;
  metodo_pago: string;
  estado: string;
  cufe: string;
}

export interface ReporteDianResponse {
  total_ventas: number;
  total_iva: number;
  total_impoconsumo: number;
  facturas: FacturaDianItem[];
}

export interface RegistroPoliciaTraItem {
  codigo_estadia: string;
  habitacion: string;
  huesped_titular: {
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    nacionalidad: string;
    ciudad_procedencia: string;
    ciudad_destino: string;
    telefono: string;
  };
  fecha_checkin: string;
  fecha_prevista_checkout: string;
  fecha_real_checkout: string | null;
  dias_estadia: number;
  cantidad_personas: number;
  estado: string;
  acompanantes: any[];
}

export interface ReportePoliciaTraResponse {
  registros: RegistroPoliciaTraItem[];
}

export interface RegistroSireItem {
  id: number;
  tipo_documento_sire: string;
  numero_documento_sire: string;
  huesped_nombre: string;
  pais_emision_doc: string;
  nacionalidad: string;
  fecha_nacimiento: string | null;
  fecha_ingreso_colombia: string | null;
  motivo_viaje: string;
  habitacion: string;
  codigo_estadia: string;
  fecha_checkin: string;
  estado_reporte: string;
  codigo_confirmacion_sire: string | null;
}

export interface ReporteSireResponse {
  total_registros: number;
  pendientes_exportar: number;
  registros: RegistroSireItem[];
}

export interface ReporteMincitResponse {
  mes: number;
  anio: number;
  total_huespedes_nacionales: number;
  total_huespedes_extranjeros: number;
  total_habitaciones_ocupadas_mes: number;
  porcentaje_ocupacion_mes: number;
  motivos_viaje: any[];
  ingresos_totales_alojamiento: number;
}

export interface ReporteAuditoriaDiariaResponse {
  fecha: string;
  cajas_abiertas: number;
  total_ingresos_dia: number;
  total_efectivo_caja: number;
  estado_auditoria: string;
  detalles_caja: {
    usuario_id: number;
    base: number;
    ingresos: number;
    estado: string;
  }[];
}
