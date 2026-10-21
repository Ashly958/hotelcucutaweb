export type TipoServicio = 'luz' | 'agua' | 'gas' | 'internet' | 'aseo' | 'otro';

export type EstadoServicio = 'pendiente' | 'pagado' | 'vencido' | 'parcial';

export type MetodoPagoServicio = 'efectivo' | 'transferencia' | 'tarjeta' | 'debito_automatico' | 'otro';

export interface ServicioPublico {
  id: number;
  tipo_servicio: TipoServicio;
  empresa_proveedor: string;
  numero_factura_referencia: string | null;
  periodo_mes: number;
  periodo_anio: number;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  fecha_pago: string | null;
  monto_facturado: number;
  monto_pagado: number;
  saldo_pendiente: number;
  estado: EstadoServicio;
  metodo_pago: MetodoPagoServicio | null;
  soporte_recibo_url: string | null;
  soporte_pago_url: string | null;
  observaciones: string | null;
  registrado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrarServicioDTO {
  tipo_servicio: TipoServicio;
  empresa_proveedor?: string;
  numero_factura_referencia?: string;
  periodo_mes: number;
  periodo_anio: number;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  fecha_pago?: string;
  monto_facturado: number;
  monto_pagado?: number;
  metodo_pago?: MetodoPagoServicio;
  soporte_recibo?: File | null;
  soporte_recibo_url?: string;
  soporte_pago?: File | null;
  soporte_pago_url?: string;
  observaciones?: string;
}

export interface PagarServicioDTO {
  monto_pagado: number;
  fecha_pago?: string;
  metodo_pago: MetodoPagoServicio;
  soporte_pago?: File | null;
  soporte_pago_url?: string;
  observaciones?: string;
}

export interface ResumenKpisServicios {
  total_facturado_anio: number;
  total_pagado_anio: number;
  total_pendiente_anio: number;
  promedio_mensual: number;
  total_recibos: number;
  recibos_pagados: number;
  recibos_pendientes: number;
  recibos_vencidos: number;
  mes_mayor_gasto: {
    mes: number;
    nombre_mes: string;
    monto: number;
  } | null;
}

export interface TotalPorTipoServicio {
  tipo: TipoServicio;
  total_facturado: number;
  total_pagado: number;
  total_pendiente: number;
  porcentaje: number;
  cantidad_recibos: number;
}

export interface DesgloseTipoMes {
  facturado: number;
  pagado: number;
  pendiente: number;
  proveedor?: string;
  estado: EstadoServicio | 'sin_recibo';
  recibo_id?: number;
}

export interface MesEstadistica {
  mes: number;
  nombre_mes: string;
  total_facturado: number;
  total_pagado: number;
  total_pendiente: number;
  cantidad_recibos: number;
  servicios: Record<TipoServicio, DesgloseTipoMes>;
}

export interface EstadisticasAnualesServicios {
  anio: number;
  anios_disponibles: number[];
  kpis: ResumenKpisServicios;
  totales_por_tipo: Record<TipoServicio, TotalPorTipoServicio>;
  matriz_mensual: MesEstadistica[];
}

export interface FiltrosServicios {
  anio: number | 'todos';
  mes: number | 'todos';
  tipo_servicio: TipoServicio | 'todos';
  estado: EstadoServicio | 'todos';
  search: string;
}
