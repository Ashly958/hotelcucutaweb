import { useState, useEffect, useMemo, useCallback } from 'react';
import { inventariosService } from '../services/inventariosService';
import type {
  Categoria,
  Producto,
  Movimiento,
  GuardarProductoDTO,
  GuardarCategoriaDTO,
  RegistrarMovimientoDTO,
  FiltroUbicacionInventario,
} from '../types/inventario.types';

export function useInventarios() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pestañas y Filtros
  const [tabActiva, setTabActiva] = useState<'productos' | 'categorias' | 'movimientos'>('productos');
  const [filtroCategoria, setFiltroCategoria] = useState<number | 'todas'>('todas');
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacionInventario>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState<boolean>(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState<boolean>(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

  const [modalMovimientoAbierto, setModalMovimientoAbierto] = useState<boolean>(false);
  const [productoParaMovimiento, setProductoParaMovimiento] = useState<Producto | null>(null);

  const [modalTrasladoAbierto, setModalTrasladoAbierto] = useState<boolean>(false);
  const [productoParaTraslado, setProductoParaTraslado] = useState<Producto | null>(null);

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

      const nevera = p.stockNevera ?? p.stock_nevera ?? 0;
      const bodega = p.stockBodega ?? p.stock_bodega ?? 0;
      const habitaciones = p.stockHabitaciones ?? p.stock_habitaciones ?? 0;
      const areasOperativas = p.stockAreasOperativas ?? p.stock_areas_operativas ?? 0;

      if (filtroUbicacion === 'bodega' && bodega <= 0) {
        return false;
      }
      if (filtroUbicacion === 'nevera' && nevera <= 0) {
        return false;
      }
      if (filtroUbicacion === 'habitaciones' && habitaciones <= 0) {
        return false;
      }
      if (filtroUbicacion === 'areas_operativas' && areasOperativas <= 0) {
        return false;
      }
      if (filtroUbicacion === 'por_reponer' && !(bodega > 0 && nevera <= 0)) {
        return false;
      }
      if (filtroUbicacion === 'agotados' && (bodega > 0 || nevera > 0 || habitaciones > 0 || areasOperativas > 0)) {
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
  }, [productos, filtroCategoria, filtroUbicacion, busqueda]);

  const metricas = useMemo(() => {
    const totalProductos = productos.length;
    let enBodega = 0;
    let enNevera = 0;
    let enHabitaciones = 0;
    let enAreasOperativas = 0;
    let porReponer = 0;
    let agotados = 0;
    let bajoStock = 0;
    let unidadesBodega = 0;
    let unidadesNevera = 0;
    let unidadesHabitaciones = 0;
    let unidadesAreasOperativas = 0;

    for (const p of productos) {
      const nevera = p.stockNevera ?? p.stock_nevera ?? 0;
      const bodega = p.stockBodega ?? p.stock_bodega ?? 0;
      const habitaciones = p.stockHabitaciones ?? p.stock_habitaciones ?? 0;
      const operativas = p.stockAreasOperativas ?? p.stock_areas_operativas ?? 0;
      const minimo = p.stockMinimoAlerta ?? p.stock_minimo_alerta ?? 5;

      if (bodega > 0) enBodega++;
      if (nevera > 0) enNevera++;
      if (habitaciones > 0) enHabitaciones++;
      if (operativas > 0) enAreasOperativas++;
      if (bodega > 0 && nevera <= 0) porReponer++;
      if (bodega <= 0 && nevera <= 0 && habitaciones <= 0 && operativas <= 0) agotados++;
      if (nevera <= minimo) bajoStock++;

      unidadesBodega += bodega;
      unidadesNevera += nevera;
      unidadesHabitaciones += habitaciones;
      unidadesAreasOperativas += operativas;
    }

    const totalCategorias = categorias.length;
    const totalMovimientos = movimientos.length;

    return {
      totalProductos,
      enBodega,
      enNevera,
      enHabitaciones,
      enAreasOperativas,
      porReponer,
      agotados,
      bajoStock,
      unidadesBodega,
      unidadesNevera,
      unidadesHabitaciones,
      unidadesAreasOperativas,
      totalCategorias,
      totalMovimientos,
    };
  }, [productos, categorias, movimientos]);

  const hayFiltrosActivos = useMemo(() => {
    return filtroUbicacion !== 'todos' || filtroCategoria !== 'todas' || busqueda.trim() !== '';
  }, [filtroUbicacion, filtroCategoria, busqueda]);

  const limpiarFiltros = useCallback(() => {
    setFiltroUbicacion('todos');
    setFiltroCategoria('todas');
    setBusqueda('');
  }, []);

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
    filtroUbicacion,
    setFiltroUbicacion,
    busqueda,
    setBusqueda,
    hayFiltrosActivos,
    limpiarFiltros,
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
    modalTrasladoAbierto,
    setModalTrasladoAbierto,
    productoParaTraslado,
    setProductoParaTraslado,
    guardarProducto,
    eliminarProducto,
    guardarCategoria,
    eliminarCategoria,
    registrarMovimiento,
    recargar: cargarDatos,
  };
}
