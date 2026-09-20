import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Categoria,
  Producto,
  Movimiento,
  GuardarCategoriaDTO,
  GuardarProductoDTO,
  RegistrarMovimientoDTO,
} from '../types/inventario.types';

export const inventariosService = {
  async obtenerCategorias(): Promise<Categoria[]> {
    try {
      const res = await api.get<RespuestaApi<Categoria[]>>('/inventarios/categorias');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async crearCategoria(datos: GuardarCategoriaDTO): Promise<Categoria> {
    const res = await api.post<RespuestaApi<Categoria>>('/inventarios/categorias', datos);
    return res.data.data;
  },

  async actualizarCategoria(id: number, datos: GuardarCategoriaDTO): Promise<Categoria> {
    const res = await api.put<RespuestaApi<Categoria>>(`/inventarios/categorias/${id}`, datos);
    return res.data.data;
  },

  async eliminarCategoria(id: number): Promise<void> {
    await api.delete<RespuestaApi<null>>(`/inventarios/categorias/${id}`);
  },

  async obtenerProductos(): Promise<Producto[]> {
    try {
      const res = await api.get<RespuestaApi<Producto[]>>('/inventarios/productos');
      return res.data.data;
    } catch {
      return [];
    }
  },

  async crearProducto(datos: GuardarProductoDTO): Promise<Producto> {
    const res = await api.post<RespuestaApi<Producto>>('/inventarios/productos', datos);
    return res.data.data;
  },

  async actualizarProducto(id: number, datos: GuardarProductoDTO): Promise<Producto> {
    const res = await api.put<RespuestaApi<Producto>>(`/inventarios/productos/${id}`, datos);
    return res.data.data;
  },

  async eliminarProducto(id: number): Promise<void> {
    await api.delete<RespuestaApi<null>>(`/inventarios/productos/${id}`);
  },

  async obtenerMovimientos(productoId?: number): Promise<Movimiento[]> {
    try {
      const res = await api.get<RespuestaApi<Movimiento[]>>('/inventarios/movimientos', {
        params: productoId ? { producto_id: productoId } : undefined,
      });
      return res.data.data;
    } catch {
      return [];
    }
  },

  async registrarMovimiento(datos: RegistrarMovimientoDTO): Promise<Movimiento> {
    const res = await api.post<RespuestaApi<Movimiento>>('/inventarios/movimientos', datos);
    return res.data.data;
  },
};
