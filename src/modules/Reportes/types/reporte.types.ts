export type ReportesTab =
  | 'ocupacion'
  | 'ingresos'
  | 'dian'
  | 'policia'
  | 'sire'
  | 'mincit'
  | 'auditoria';

export interface FiltroReportes {
  fechaInicio?: string;
  fechaFin?: string;
  filtroPeriodo?: 'hoy' | 'semana' | 'mes' | 'anio' | 'personalizado';
  estado?: string;
  mes?: number;
  anio?: number;
  pisoId?: number;
}

// --- 1. OCUPACIÓN ---
export interface MetricasGlobalesOcupacion {
  ocupadas: number;
  disponibles: number;
  limpieza: number;
  mantenimiento: number;
  fuera_servicio: number;
  tasa_ocupacion: number;
}

export interface OcupacionPorPiso {
  piso_id: number;
  numero_piso: number;
  nombre_piso: string;
  total_habitaciones: number;
  ocupadas: number;
  disponibles: number;
  limpieza: number;
  mantenimiento: number;
  tasa_ocupacion: number;
}

export interface HistoricoOcupacionDia {
  fecha: string;
  dia_semana: string;
  ocupadas: number;
  disponibles: number;
  tasa_ocupacion: number;
}

export interface CheckoutPendienteItem {
  estadia_id: number;
  codigo_estadia: string;
  habitacion: string;
  huesped: string;
  fecha_prevista: string;
  vencido: boolean;
}

export interface CheckinHoyItem {
  estadia_id: number;
  codigo_estadia: string;
  habitacion: string;
  huesped: string;
  hora: string;
}

export interface HabitacionReporteItem {
  id: number;
  numero: string;
  piso_id: number;
  capacidad_maxima: number;
  tiene_aire: boolean;
  precio_noche_base: number;
  estado: string;
  huesped_actual: string | null;
  codigo_estadia: string | null;
}

export interface ReporteOcupacionResponse {
  fecha_consulta: string;
  total_habitaciones: number;
  metricas_globales: MetricasGlobalesOcupacion;
  ocupacion_por_piso: OcupacionPorPiso[];
  historico_diario: HistoricoOcupacionDia[];
  checkouts_pendientes_hoy: CheckoutPendienteItem[];
  checkins_hoy: CheckinHoyItem[];
  habitaciones: HabitacionReporteItem[];
}

// --- 2. INGRESOS & MINIBAR ---
export interface ResumenGeneralIngresos {
  total_ingresos: number;
  total_facturado: number;
  subtotal: number;
  total_iva: number;
  saldo_cartera_pendiente: number;
}

export interface DesgloseConceptoIngresos {
  hospedaje: number;
  minibar_inventario: number;
  otros_servicios: number;
}

export interface DesgloseMetodosPago {
  efectivo: number;
  porcentaje_efectivo: number;
  transferencia: number;
  tarjeta: number;
  otros: number;
}

export interface HistoricoIngresosDia {
  fecha: string;
  etiqueta: string;
  total: number;
  efectivo: number;
  cantidad_transacciones: number;
}

export interface TransaccionRecienteItem {
  id: number;
  numero_recibo: string;
  fecha_pago: string;
  concepto: string;
  habitacion: string;
  huesped: string;
  metodo_pago: string;
  valor_recibido: number;
}

export interface ReporteIngresosResponse {
  periodo: {
    filtro: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
  resumen_general: ResumenGeneralIngresos;
  desglose_por_concepto: DesgloseConceptoIngresos;
  desglose_metodos_pago: DesgloseMetodosPago;
  historico_diario: HistoricoIngresosDia[];
  transacciones_recientes: TransaccionRecienteItem[];
}

// --- 3. DIAN ---
export interface ResolucionDianReporte {
  id: number;
  numero_resolucion: string;
  prefijo: string;
  rango_desde: number;
  rango_hasta: number;
  consecutivo_actual: number;
  facturas_emitidas: number;
  facturas_restantes: number;
  porcentaje_uso: number;
  fecha_inicio_vigencia: string;
  fecha_fin_vigencia: string;
  vigente: boolean;
}

export interface ResumenTributarioDian {
  total_facturas_emitidas: number;
  subtotal: number;
  ventas_gravadas: number;
  ventas_exentas: number;
  total_iva: number;
  total_impoconsumo: number;
  total_facturado: number;
}

export interface FacturaDianItem {
  id: number;
  numero_factura: string;
  fecha_emision: string;
  cliente_nombre: string;
  cliente_documento: string;
  subtotal: number;
  porcentaje_iva: number;
  valor_iva: number;
  impuesto_consumo: number;
  total_factura: number;
  metodo_pago: string;
  estado: string;
  cufe: string;
  items_cantidad: number;
}

export interface ReporteDianResponse {
  resolucion_dian: ResolucionDianReporte | null;
  resumen_tributario: ResumenTributarioDian;
  facturas: FacturaDianItem[];
}

// --- 4. POLICÍA TRA ---
export interface HuespedTitularTra {
  id: number | null;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  telefono: string | null;
  nacionalidad: string;
  pais_residencia: string;
  ciudad_procedencia: string;
  ciudad_destino: string;
  direccion: string | null;
  profesion: string | null;
  es_extranjero: boolean;
}

export interface AcompananteTra {
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
  parentesco: string;
}

export interface RegistroPoliciaTraItem {
  estadia_id: number;
  codigo_estadia: string;
  habitacion: string;
  fecha_checkin: string;
  fecha_prevista_checkout: string;
  fecha_real_checkout: string | null;
  dias_estadia: number;
  cantidad_personas: number;
  estado: string;
  huesped_titular: HuespedTitularTra;
  acompanantes: AcompananteTra[];
  observaciones: string | null;
}

export interface ReportePoliciaTraResponse {
  total_registros: number;
  total_personas_alojadas: number;
  estadias_activas: number;
  estadias_finalizadas: number;
  registros: RegistroPoliciaTraItem[];
}

// --- 5. SIRE (MIGRACIÓN COLOMBIA) ---
export interface RegistroSireItem {
  id: number;
  estadia_id: number;
  huesped_id: number;
  codigo_estadia: string;
  habitacion: string;
  huesped_nombre: string;
  tipo_documento_sire: string;
  numero_documento_sire: string;
  pais_emision_doc: string;
  nacionalidad: string;
  fecha_nacimiento: string | null;
  fecha_ingreso_colombia: string | null;
  motivo_viaje: string;
  estado_reporte: 'pendiente' | 'exportado_sire' | 'completado';
  codigo_confirmacion_sire: string | null;
  fecha_exportacion: string | null;
  fecha_checkin: string | null;
  fecha_checkout: string | null;
  observaciones: string | null;
}

export interface ReporteSireResponse {
  total_extranjeros: number;
  pendientes_reporte: number;
  exportados_sire: number;
  completados: number;
  registros: RegistroSireItem[];
}

// --- 6. MINCIT / DANE ---
export interface MotivoViajeItem {
  motivo: string;
  porcentaje: number;
}

export interface ReporteMincitResponse {
  periodo: {
    mes: number;
    anio: number;
    nombre_mes: string;
    dias_mes: number;
  };
  capacidad: {
    total_habitaciones_fisicas: number;
    habitaciones_disponibles_mes: number;
    habitaciones_noche_ocupadas: number;
    tasa_ocupacion_mensual: number;
  };
  flujo_huespedes: {
    total_huespedes: number;
    nacionales: number;
    extranjeros: number;
    pernoctaciones_totales: number;
    promedio_estadia_dias: number;
  };
  indicadores_financieros: {
    ingresos_alojamiento_total: number;
    adr_tarifa_promedio_diaria: number;
    revpar: number;
  };
  motivos_viaje: MotivoViajeItem[];
}

// --- 7. AUDITORÍA DIARIA / CIERRE OPERATIVO ---
export interface ChecklistAuditoriaItem {
  item: string;
  ok: boolean;
  detalle: string;
}

export interface ReciboDiaItem {
  id: number;
  numero_recibo: string;
  concepto: string;
  metodo_pago: string;
  valor: number;
  hora: string;
  cajero: string;
}

export interface MovimientoInventarioDiaItem {
  id: number;
  producto: string;
  tipo: string;
  cantidad: number;
  motivo: string;
  hora: string;
}

export interface AlertaStockItem {
  id: number;
  nombre: string;
  stock_actual: number;
  stock_minimo_alerta: number;
}

export interface AuditoriaOficialInfo {
  id: number;
  usuario_auditor: string;
  cerrado_el: string;
  observaciones: string;
  total_ingresos: number;
  total_efectivo: number;
  tasa_ocupacion: number;
}

export interface ReporteAuditoriaDiariaResponse {
  fecha_auditoria: string;
  estado_auditoria: 'pendiente' | 'cerrada';
  auditoria_oficial: AuditoriaOficialInfo | null;
  metricas_habitaciones: {
    total_habitaciones: number;
    ocupadas: number;
    disponibles: number;
    limpieza: number;
    mantenimiento: number;
    tasa_ocupacion: number;
  };
  metricas_financieras: {
    total_recaudos_dia: number;
    total_efectivo: number;
    otros_metodos: number;
    total_facturado: number;
    saldo_cartera_pendiente: number;
    folios_con_saldo: number;
  };
  checkouts_pendientes: {
    id: number;
    codigo_estadia: string;
    habitacion: string;
    huesped: string;
    prevista: string;
    total_hospedaje: number;
  }[];
  recibos_dia: ReciboDiaItem[];
  alertas_stock: AlertaStockItem[];
  movimientos_inventario_dia: MovimientoInventarioDiaItem[];
  checklist: ChecklistAuditoriaItem[];
  turno_caja_abierto: {
    id: number;
    cajero: string;
    base_inicial: number;
    apertura: string;
  } | null;
}
