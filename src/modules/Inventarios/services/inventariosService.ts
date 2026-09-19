import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Categoria,
  Producto,
  Movimiento,
  GuardarProductoDTO,
  GuardarCategoriaDTO,
  RegistrarMovimientoDTO,
} from '../types/inventario.types';

let categoriasMemoria: Categoria[] = [
  { id: 1, nombre: 'Lencería & Blancos', descripcion: 'Sábanas, fundas, protectores y toallas de baño' },
  { id: 2, nombre: 'Insumos de Aseo', descripcion: 'Detergentes, desinfectantes, ambientadores y jabones' },
  { id: 3, nombre: 'Lavandería Piso 5', descripcion: 'Suavizantes, blanqueadores y químicos de lavado' },
  { id: 4, nombre: 'Neveras & Minibar', descripcion: 'Bebidas frías, agua embotellada y snacks en pasillos' },
];

let productosMemoria: Producto[] = [
  {
    id: 1,
    categoriaId: 1,
    categoria_id: 1,
    categoria_nombre: 'Lencería & Blancos',
    codigoReferencia: 'LEN-001',
    codigo_referencia: 'LEN-001',
    nombre: 'Juego de Sábanas Matrimonial',
    descripcion: 'Algodón blanco 200 hilos',
    unidadMedida: 'juego',
    precioCompra: 45000,
    precioVenta: 0,
    stockActual: 38,
    stockMinimoAlerta: 20,
    activo: true,
  },
  {
    id: 2,
    categoriaId: 1,
    categoria_id: 1,
    categoria_nombre: 'Lencería & Blancos',
    codigoReferencia: 'LEN-002',
    codigo_referencia: 'LEN-002',
    nombre: 'Toalla de Cuerpo Premium',
    descripcion: 'Algodón absorbente 500gr blanca',
    unidadMedida: 'unidad',
    precioCompra: 18000,
    precioVenta: 0,
    stockActual: 14,
    stockMinimoAlerta: 25, // ALERTA: bajo stock!
    activo: true,
  },
  {
    id: 3,
    categoriaId: 2,
    categoria_id: 2,
    categoria_nombre: 'Insumos de Aseo',
    codigoReferencia: 'ASE-001',
    codigo_referencia: 'ASE-001',
    nombre: 'Desinfectante Multiusos Galón',
    descripcion: 'Aroma lavanda para pisos y baños',
    unidadMedida: 'galon',
    precioCompra: 22000,
    precioVenta: 0,
    stockActual: 8,
    stockMinimoAlerta: 5,
    activo: true,
  },
  {
    id: 4,
    categoriaId: 3,
    categoria_id: 3,
    categoria_nombre: 'Lavandería Piso 5',
    codigoReferencia: 'LAV-001',
    codigo_referencia: 'LAV-001',
    nombre: 'Detergente Industrial Líquido 20L',
    descripcion: 'Para lavadoras de alto flujo del 5to piso',
    unidadMedida: 'caneca',
    precioCompra: 110000,
    precioVenta: 0,
    stockActual: 3,
    stockMinimoAlerta: 2,
    activo: true,
  },
  {
    id: 5,
    categoriaId: 4,
    categoria_id: 4,
    categoria_nombre: 'Neveras & Minibar',
    codigoReferencia: 'BEB-001',
    codigo_referencia: 'BEB-001',
    nombre: 'Agua Mineral 600ml',
    descripcion: 'Agua purificada sin gas',
    unidadMedida: 'unidad',
    precioCompra: 1200,
    precioVenta: 3000,
    stockActual: 48,
    stockMinimoAlerta: 24,
    activo: true,
  },
  {
    id: 6,
    categoriaId: 4,
    categoria_id: 4,
    categoria_nombre: 'Neveras & Minibar',
    codigoReferencia: 'BEB-002',
    codigo_referencia: 'BEB-002',
    nombre: 'Gaseosa Coca-Cola 400ml',
    descripcion: 'Bebida fría en nevera de pasillo',
    unidadMedida: 'unidad',
    precioCompra: 2300,
    precioVenta: 4500,
    stockActual: 5,
    stockMinimoAlerta: 15, // ALERTA: bajo stock!
    activo: true,
  },
];

let movimientosMemoria: Movimiento[] = [
  {
    id: 1,
    producto_id: 5,
    producto_nombre: 'Agua Mineral 600ml',
    tipo_movimiento: 'entrada_compra',
    cantidad: 50,
    motivo: 'Compra de surtido para neveras de pasillo',
    created_at: '2026-09-09 10:00:00',
  },
  {
    id: 2,
    producto_id: 5,
    producto_nombre: 'Agua Mineral 600ml',
    tipo_movimiento: 'salida_consumo',
    cantidad: 2,
    motivo: 'Consumo huésped Habitación 08',
    estadia_id: 2,
    created_at: '2026-09-10 17:30:00',
  },
  {
    id: 3,
    producto_id: 2,
    producto_nombre: 'Toalla de Cuerpo Premium',
    tipo_movimiento: 'salida_merma',
    cantidad: 2,
    motivo: 'Deterioro irreparable por manchas',
    created_at: '2026-09-10 09:15:00',
  },
];

export const inventariosService = {
  async obtenerCategorias(): Promise<Categoria[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      return [...categoriasMemoria];
    }
    try {
      const res = await api.get<RespuestaApi<Categoria[]>>('/inventarios/categorias');
      return res.data.data;
    } catch {
      return [...categoriasMemoria];
    }
  },

  async crearCategoria(datos: GuardarCategoriaDTO): Promise<Categoria> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      const nueva: Categoria = {
        id: categoriasMemoria.length + 1,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
      };
      categoriasMemoria.push(nueva);
      return nueva;
    }
    const res = await api.post<RespuestaApi<Categoria>>('/inventarios/categorias', datos);
    return res.data.data;
  },

  async actualizarCategoria(id: number, datos: GuardarCategoriaDTO): Promise<Categoria> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      categoriasMemoria = categoriasMemoria.map((c) =>
        c.id === id ? { ...c, nombre: datos.nombre, descripcion: datos.descripcion } : c
      );
      return { id, ...datos };
    }
    const res = await api.put<RespuestaApi<Categoria>>(`/inventarios/categorias/${id}`, datos);
    return res.data.data;
  },

  async eliminarCategoria(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      categoriasMemoria = categoriasMemoria.filter((c) => c.id !== id);
      return;
    }
    await api.delete<RespuestaApi<null>>(`/inventarios/categorias/${id}`);
  },

  async obtenerProductos(): Promise<Producto[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      return [...productosMemoria];
    }
    try {
      const res = await api.get<RespuestaApi<Producto[]>>('/inventarios/productos');
      return res.data.data;
    } catch {
      return [...productosMemoria];
    }
  },

  async crearProducto(datos: GuardarProductoDTO): Promise<Producto> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 250));
      const cat = categoriasMemoria.find((c) => c.id === datos.categoriaId);
      const nuevo: Producto = {
        id: productosMemoria.length + 1,
        categoriaId: datos.categoriaId,
        categoria_id: datos.categoriaId,
        categoria_nombre: cat?.nombre || 'General',
        codigoReferencia: datos.codigoReferencia,
        codigo_referencia: datos.codigoReferencia,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        unidadMedida: datos.unidadMedida || 'unidad',
        unidad_medida: datos.unidadMedida || 'unidad',
        precioCompra: datos.precioCompra || 0,
        precioVenta: datos.precioVenta || 0,
        stockActual: datos.stockActual || 0,
        stockMinimoAlerta: datos.stockMinimoAlerta || 5,
        activo: datos.activo ?? true,
      };
      productosMemoria.push(nuevo);
      return nuevo;
    }
    const res = await api.post<RespuestaApi<Producto>>('/inventarios/productos', datos);
    return res.data.data;
  },

  async actualizarProducto(id: number, datos: GuardarProductoDTO): Promise<Producto> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 250));
      const cat = categoriasMemoria.find((c) => c.id === datos.categoriaId);
      productosMemoria = productosMemoria.map((p) =>
        p.id === id
          ? {
              ...p,
              categoriaId: datos.categoriaId,
              categoria_id: datos.categoriaId,
              categoria_nombre: cat?.nombre || p.categoria_nombre,
              codigoReferencia: datos.codigoReferencia,
              nombre: datos.nombre,
              descripcion: datos.descripcion,
              unidadMedida: datos.unidadMedida,
              precioCompra: datos.precioCompra,
              precioVenta: datos.precioVenta,
              stockMinimoAlerta: datos.stockMinimoAlerta,
            }
          : p
      );
      const actualizado = productosMemoria.find((p) => p.id === id);
      if (!actualizado) throw new Error('Producto no encontrado');
      return actualizado;
    }
    const res = await api.put<RespuestaApi<Producto>>(`/inventarios/productos/${id}`, datos);
    return res.data.data;
  },

  async eliminarProducto(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      productosMemoria = productosMemoria.filter((p) => p.id !== id);
      return;
    }
    await api.delete<RespuestaApi<null>>(`/inventarios/productos/${id}`);
  },

  async obtenerMovimientos(productoId?: number): Promise<Movimiento[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      if (productoId) {
        return movimientosMemoria.filter((m) => m.producto_id === productoId);
      }
      return [...movimientosMemoria];
    }
    try {
      const res = await api.get<RespuestaApi<Movimiento[]>>('/inventarios/movimientos', {
        params: productoId ? { producto_id: productoId } : undefined,
      });
      return res.data.data;
    } catch {
      return [...movimientosMemoria];
    }
  },

  async registrarMovimiento(datos: RegistrarMovimientoDTO): Promise<Movimiento> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 250));
      const prod = productosMemoria.find((p) => p.id === datos.producto_id);
      if (prod) {
        if (datos.tipo_movimiento === 'entrada_compra') {
          prod.stockActual += datos.cantidad;
        } else {
          prod.stockActual = Math.max(0, prod.stockActual - datos.cantidad);
        }
      }

      const nuevo: Movimiento = {
        id: movimientosMemoria.length + 1,
        producto_id: datos.producto_id,
        producto_nombre: prod?.nombre || `Producto #${datos.producto_id}`,
        tipo_movimiento: datos.tipo_movimiento,
        cantidad: datos.cantidad,
        motivo: datos.motivo,
        estadia_id: datos.estadia_id,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      movimientosMemoria = [nuevo, ...movimientosMemoria];
      return nuevo;
    }
    const res = await api.post<RespuestaApi<Movimiento>>('/inventarios/movimientos', datos);
    return res.data.data;
  },
};
