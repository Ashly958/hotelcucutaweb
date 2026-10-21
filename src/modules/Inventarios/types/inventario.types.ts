export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface ProductoPresentacion {
  id: number;
  producto_id: number;
  nombre_presentacion: string;
  factor_conversion: number;
  precio_compra_presentacion?: number;
  codigo_barras?: string;
  activo?: boolean;
}

export type CentroConsumo = 'bodega' | 'nevera' | 'habitaciones' | 'areas_operativas';

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
  stockNevera: number;
  stock_nevera?: number;
  stockBodega: number;
  stock_bodega?: number;
  stockHabitaciones?: number;
  stock_habitaciones?: number;
  stockAreasOperativas?: number;
  stock_areas_operativas?: number;
  stockMinimoAlerta?: number;
  stock_minimo_alerta?: number;
  activo?: boolean;
  bajo_stock?: boolean;
  bajoStock?: boolean;
  presentaciones?: ProductoPresentacion[];
}

export type FiltroUbicacionInventario =
  | 'todos'
  | 'bodega'
  | 'nevera'
  | 'habitaciones'
  | 'areas_operativas'
  | 'por_reponer'
  | 'agotados';

export type TipoMovimientoInventario =
  | 'entrada_compra'
  | 'traslado_nevera'
  | 'salida_dotacion'
  | 'traslado_habitaciones'
  | 'traslado_operativas'
  | 'salida_merma'
  | 'ajuste_merma'
  | 'salida_consumo'
  | 'salida_consumo_huesped'
  | 'ajuste_inventario';

export interface Movimiento {
  id: number;
  producto_id: number;
  productoId?: number;
  producto_nombre?: string;
  productoNombre?: string;
  presentacion_id?: number | null;
  presentacionId?: number | null;
  centro_consumo?: CentroConsumo;
  centroConsumo?: CentroConsumo;
  cantidad_presentacion?: number | null;
  cantidadPresentacion?: number | null;
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
  stockNevera?: number;
  stockBodega?: number;
  stockHabitaciones?: number;
  stockAreasOperativas?: number;
  stockMinimoAlerta?: number;
  activo?: boolean;
}

export interface GuardarCategoriaDTO {
  nombre: string;
  descripcion?: string;
}

export interface RegistrarMovimientoDTO {
  producto_id: number;
  presentacion_id?: number;
  centro_consumo?: CentroConsumo;
  tipo_movimiento: TipoMovimientoInventario;
  cantidad: number;
  motivo?: string;
  estadia_id?: number;
}

