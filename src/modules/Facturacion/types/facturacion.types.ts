export interface DetalleFactura {
  id?: number;
  factura_id?: number;
  concepto: string;
  descripcion?: string;
  cantidad: number;
  valor_unitario: number;
  precio_unitario?: number;
  subtotal: number;
}

export interface ReciboCaja {
  id: number;
  numero_recibo: string;
  estadia_id?: number | null;
  factura_id?: number | null;
  usuario_id?: number;
  usuario_nombre?: string;
  fecha_pago: string;
  valor: number;
  valor_recibido?: number;
  metodo_pago: string;
  concepto: string;
  observaciones?: string | null;
}

export interface Factura {
  id: number;
  codigo_factura: string;
  numero_factura?: string;
  estadia_id?: number | null;
  cliente_nombre: string;
  cliente_documento: string;
  cliente_telefono?: string;
  fecha_emision: string;
  subtotal: number;
  iva: number;
  impuesto_consumo?: number;
  total: number;
  total_factura?: number;
  saldo_pendiente_dinamico: number;
  estado: 'pagada' | 'pagada_total' | 'pagada_parcial' | 'pendiente' | 'anulada';
  cufe?: string;
  detalles?: DetalleFactura[];
  recibos?: ReciboCaja[];
}

export type CategoriaEgreso = 
  | 'suministros'
  | 'aseo'
  | 'transporte'
  | 'mantenimiento_menor'
  | 'alimentos_bebidas'
  | 'otros';

export interface EgresoCaja {
  id: number;
  arqueo_caja_id: number;
  usuario_id: number;
  concepto: string;
  categoria: CategoriaEgreso | string;
  monto: number;
  beneficiario: string;
  comprobante?: string | null;
  observaciones?: string | null;
  created_at?: string;
}

export interface RegistrarEgresoDTO {
  monto: number;
  concepto: string;
  categoria: CategoriaEgreso | string;
  beneficiario: string;
  comprobante?: string;
  observaciones?: string;
}

export interface TurnoCaja {
  id?: number | null;
  usuario_id?: number;
  usuario_nombre?: string;
  estado: 'abierta' | 'cerrada';
  fecha_apertura?: string | null;
  fecha_cierre?: string | null;
  base_inicial: number;
  total_recaudado?: number;
  total_egresos?: number;
  total_efectivo?: number;
  saldo_esperado?: number;
  saldo_real?: number;
  diferencia?: number;
  observaciones?: string | null;
  movimientos_count?: number;
}

export interface AbrirCajaDTO {
  base_inicial: number;
}

export interface CerrarCajaDTO {
  saldo_real: number;
  observaciones?: string;
}

export interface RegistrarRecaudoDTO {
  valor: number;
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta';
  concepto: string;
  estadia_id?: number;
  factura_id?: number;
}

export interface EmitirFacturaEstadiaDTO {
  estadia_id: number;
}

export interface ConsumoFolio {
  producto_id: number;
  nombre: string;
  precio_venta: number;
  cantidad: number;
  subtotal: number;
  created_at?: string;
}

export interface CuentaCentralizadaEstadia {
  estadia_id: number;
  codigo_estadia: string;
  habitacion: {
    id?: number;
    numero?: string;
    tipo?: string;
  };
  huesped: {
    id?: number;
    nombre_completo: string;
    documento: string;
    telefono?: string;
  };
  hospedaje: {
    fecha_checkin: string;
    fecha_prevista_checkout: string;
    dias_estadia: number;
    tarifa_noche: number;
    subtotal?: number;
    iva?: number;
    impuesto_consumo?: number;
    total_hospedaje: number;
  };
  subtotal?: number;
  iva?: number;
  impuesto_consumo?: number;
  total_hospedaje: number;
  consumos: ConsumoFolio[];
  total_consumos: number;
  abonos: ReciboCaja[];
  total_abonos: number;
  total_cargos: number;
  saldo_pendiente: number;
  factura?: {
    id: number;
    numero_factura?: string;
    codigo_factura?: string;
    fecha_emision: string;
    subtotal: number;
    total: number;
    estado: string;
  } | null;
}

export interface InformeHuespedData {
  hotel: {
    nombre: string;
    nit: string;
    direccion: string;
    ciudad: string;
    telefono: string;
    whatsapp: string;
    email: string;
    logo_url?: string | null;
  };
  estadia: {
    id: number;
    codigo_estadia: string;
    estado: string;
    fecha_checkin: string;
    fecha_prevista_checkout: string;
    fecha_real_checkout?: string | null;
    dias_estadia: number;
    cantidad_personas: number;
    tarifa_noche: number;
    subtotal?: number;
    iva?: number;
    impuesto_consumo?: number;
    total_hospedaje: number;
    observaciones?: string | null;
  };
  habitacion: {
    id?: number;
    numero?: string;
    tipo?: string;
    piso?: number;
    precio_base?: number;
  };
  huesped_titular: {
    id?: number;
    nombre_completo: string;
    tipo_documento: string;
    numero_documento: string;
    telefono?: string;
    email?: string;
    ciudad_procedencia?: string;
    ciudad_destino?: string;
    nacionalidad: string;
  };
  acompanantes: Array<{
    id: number;
    nombre_completo: string;
    documento: string;
    parentesco: string;
    telefono?: string;
  }>;
  consumos: Array<{
    producto_id: number;
    nombre: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
    fecha?: string | null;
  }>;
  abonos: Array<{
    id: number;
    numero_recibo: string;
    fecha_pago: string;
    concepto: string;
    metodo_pago: string;
    valor: number;
    observaciones?: string | null;
  }>;
  totales: {
    subtotal_hospedaje?: number;
    iva_hospedaje?: number;
    impuesto_consumo_hospedaje?: number;
    total_hospedaje: number;
    subtotal_consumos?: number;
    total_consumos: number;
    subtotal_general?: number;
    iva_general?: number;
    impuesto_consumo_general?: number;
    total_cargos: number;
    total_abonos: number;
    saldo_pendiente: number;
    estado_pago: 'PAZ Y SALVO' | 'PENDIENTE DE PAGO';
  };
  factura?: {
    id: number;
    numero_factura?: string;
    cufe?: string;
    fecha_emision: string;
    subtotal: number;
    total: number;
    estado: string;
  } | null;
  metadatos: {
    fecha_impresion: string;
    atendido_por: string;
  };
}
