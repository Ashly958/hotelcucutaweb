export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  categoriaId?: number;
  categoria_id?: number;
  categoriaNombre?: string;
  categoria_nombre?: string;
  codigoReferencia?: string;
  codigo_referencia?: string;
  nombre: string;
  descripcion?: string;
  unidadMedida?: string;
  unidad_medida?: string;
  precioCompra?: number;
  precio_compra?: number;
  precioVenta?: number;
  precio_venta?: number;
  stockActual: number;
  stock_actual?: number;
  stockMinimoAlerta?: number;
  stock_minimo_alerta?: number;
  activo?: boolean;
  bajo_stock?: boolean;
  bajoStock?: boolean;
}

export type TipoMovimientoInventario =
  | 'entrada_compra'
  | 'salida_merma'
  | 'ajuste_merma'
  | 'salida_consumo'
  | 'salida_consumo_huesped'
  | 'salida_dotacion'
  | 'ajuste_inventario';

export interface Movimiento {
  id: number;
  producto_id: number;
  productoId?: number;
  producto_nombre?: string;
  productoNombre?: string;
  usuario_id?: number;
  usuarioId?: number;
  usuario_nombre?: string;
  usuarioNombre?: string;
  tipo_movimiento: TipoMovimientoInventario;
  tipoMovimiento?: TipoMovimientoInventario;
  cantidad: number;
  stock_anterior?: number;
  stockAnterior?: number;
  stock_posterior?: number;
  stockPosterior?: number;
  motivo?: string;
  estadia_id?: number | null;
  estadiaId?: number | null;
  created_at?: string;
  fecha_movimiento?: string;
  fechaMovimiento?: string;
}

export interface GuardarProductoDTO {
  categoriaId: number;
  codigoReferencia: string;
  nombre: string;
  descripcion?: string;
  unidadMedida?: string;
  precioCompra?: number;
  precioVenta?: number;
  stockActual?: number;
  stockMinimoAlerta?: number;
  activo?: boolean;
}

export interface GuardarCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

export interface RegistrarMovimientoDTO {
  producto_id: number;
  tipo_movimiento: TipoMovimientoInventario;
  cantidad: number;
  motivo?: string;
  estadia_id?: number;
}
