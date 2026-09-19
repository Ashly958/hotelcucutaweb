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
  fecha_emision: string;
  subtotal: number;
  iva: number;
  total: number;
  total_factura?: number;
  saldo_pendiente_dinamico: number;
  estado: 'pagada' | 'pagada_total' | 'pagada_parcial' | 'pendiente' | 'anulada';
  detalles?: DetalleFactura[];
  recibos?: ReciboCaja[];
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
    total_hospedaje: number;
  };
  total_hospedaje: number;
  consumos: ConsumoFolio[];
  total_consumos: number;
  abonos: ReciboCaja[];
  total_abonos: number;
  total_cargos: number;
  saldo_pendiente: number;
  factura?: {
    id: number;
    numero_factura: string;
    codigo_factura: string;
    fecha_emision: string;
    subtotal: number;
    total: number;
    estado: string;
  } | null;
}
