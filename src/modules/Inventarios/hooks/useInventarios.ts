import { useState, useEffect, useMemo, useCallback } from 'react';
import { inventariosService } from '../services/inventariosService';
import type {
  Categoria,
  Producto,
  Movimiento,
  GuardarProductoDTO,
  GuardarCategoriaDTO,
  RegistrarMovimientoDTO,
} from '../types/inventario.types';

export function useInventarios() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pestañas
  const [tabActiva, setTabActiva] = useState<'productos' | 'categorias' | 'movimientos'>('productos');
  const [filtroCategoria, setFiltroCategoria] = useState<number | 'todas'>('todas');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState<boolean>(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState<boolean>(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

  const [modalMovimientoAbierto, setModalMovimientoAbierto] = useState<boolean>(false);
  const [productoParaMovimiento, setProductoParaMovimiento] = useState<Producto | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const [cats, prods, movs] = await Promise.all([
        inventariosService.obtenerCategorias(),
        inventariosService.obtenerProductos(),
        inventariosService.obtenerMovimientos(),
      ]);
      setCategorias(cats);
      setProductos(prods);
      setMovimientos(movs);
    } catch {
      setError('No fue posible cargar la información de inventarios y bodega.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const catId = p.categoriaId || p.categoria_id;
      if (filtroCategoria !== 'todas' && catId !== filtroCategoria) {
        return false;
      }
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const cod = (p.codigoReferencia || p.codigo_referencia || '').toLowerCase();
        const nom = p.nombre.toLowerCase();
        return cod.includes(q) || nom.includes(q);
      }
      return true;
    });
  }, [productos, filtroCategoria, busqueda]);

  const metricas = useMemo(() => {
    const totalProductos = productos.length;
    const productosAlertaBajoStock = productos.filter((p) => {
      const actual = p.stockActual ?? p.stock_actual ?? 0;
      const minimo = p.stockMinimoAlerta ?? p.stock_minimo_alerta ?? 5;
      return actual <= minimo;
    });
    const totalCategorias = categorias.length;
    const totalMovimientos = movimientos.length;

    return {
      totalProductos,
      bajoStock: productosAlertaBajoStock.length,
      totalCategorias,
      totalMovimientos,
    };
  }, [productos, categorias, movimientos]);

  const guardarProducto = async (datos: GuardarProductoDTO): Promise<boolean> => {
    try {
      if (productoAEditar) {
        await inventariosService.actualizarProducto(productoAEditar.id, datos);
      } else {
        await inventariosService.crearProducto(datos);
      }
      await cargarDatos();
      setModalProductoAbierto(false);
      setProductoAEditar(null);
      return true;
    } catch {
      setError('Error al guardar producto.');
      return false;
    }
  };

  const eliminarProducto = async (id: number): Promise<boolean> => {
    try {
      await inventariosService.eliminarProducto(id);
      await cargarDatos();
      return true;
    } catch {
      setError('Error al eliminar producto.');
      return false;
    }
  };

  const guardarCategoria = async (datos: GuardarCategoriaDTO): Promise<boolean> => {
    try {
      if (categoriaAEditar) {
        await inventariosService.actualizarCategoria(categoriaAEditar.id, datos);
      } else {
        await inventariosService.crearCategoria(datos);
      }
      await cargarDatos();
      setModalCategoriaAbierto(false);
      setCategoriaAEditar(null);
      return true;
    } catch {
      setError('Error al guardar categoría.');
      return false;
    }
  };

  const eliminarCategoria = async (id: number): Promise<boolean> => {
    try {
      await inventariosService.eliminarCategoria(id);
      await cargarDatos();
      return true;
    } catch {
      setError('Error al eliminar categoría.');
      return false;
    }
  };

  const registrarMovimiento = async (datos: RegistrarMovimientoDTO): Promise<boolean> => {
    try {
      await inventariosService.registrarMovimiento(datos);
      await cargarDatos();
      setModalMovimientoAbierto(false);
      setProductoParaMovimiento(null);
      return true;
    } catch {
      setError('Error al registrar movimiento de stock.');
      return false;
    }
  };

  return {
    categorias,
    productos: productosFiltrados,
    todosLosProductos: productos,
    movimientos,
    cargando,
    error,
    metricas,
    tabActiva,
    setTabActiva,
    filtroCategoria,
    setFiltroCategoria,
    busqueda,
    setBusqueda,
    modalProductoAbierto,
    setModalProductoAbierto,
    productoAEditar,
    setProductoAEditar,
    modalCategoriaAbierto,
    setModalCategoriaAbierto,
    categoriaAEditar,
    setCategoriaAEditar,
    modalMovimientoAbierto,
    setModalMovimientoAbierto,
    productoParaMovimiento,
    setProductoParaMovimiento,
    guardarProducto,
    eliminarProducto,
    guardarCategoria,
    eliminarCategoria,
    registrarMovimiento,
    recargar: cargarDatos,
  };
}
