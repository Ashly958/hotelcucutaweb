import { useInventarios } from '../hooks/useInventarios';
import { ProductosTab } from '../components/ProductosTab';
import { CategoriasTab } from '../components/CategoriasTab';
import { MovimientosTab } from '../components/MovimientosTab';
import { ProductoModal } from '../components/ProductoModal';
import { MovimientoModal } from '../components/MovimientoModal';
import { CategoriaModal } from '../components/CategoriaModal';
import { TrasladoNeveraModal } from '../components/TrasladoNeveraModal';
import { Loading, ErrorState, Button } from '@/components';
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  History,
  ArrowUpDown,
  Warehouse,
  Refrigerator,
  RotateCcw,
} from 'lucide-react';
import type { FiltroUbicacionInventario } from '../types/inventario.types';

export function InventariosPage() {
  const {
    categorias,
    productos,
    todosLosProductos,
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
    guardarProducto,
    eliminarProducto,
    guardarCategoria,
    eliminarCategoria,
    registrarMovimiento,
    recargar,
    modalTrasladoAbierto,
    setModalTrasladoAbierto,
    productoParaTraslado,
    setProductoParaTraslado,
  } = useInventarios();

  if (cargando) {
    return <Loading mensaje="Cargando inventarios y almacén..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Inventarios, Bodega y Suministros
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de lencería, insumos de aseo, lavandería del piso 5 y neveras de pasillo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tabActiva === 'categorias' ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setCategoriaAEditar(null);
                setModalCategoriaAbierto(true);
              }}
              icono={<Plus className="w-4 h-4" />}
            >
              Nueva Categoría
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (todosLosProductos.length > 0) {
                    setProductoParaMovimiento(todosLosProductos[0]);
                    setModalMovimientoAbierto(true);
                  } else {
                    alert('Debe crear productos primero para registrar movimientos.');
                  }
                }}
                icono={<ArrowUpDown className="w-4 h-4" />}
              >
                Movimiento de Stock
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setProductoAEditar(null);
                  setModalProductoAbierto(true);
                }}
                icono={<Plus className="w-4 h-4" />}
              >
                Nuevo Producto
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Métricas de Inventario con Accesos Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Catálogo Total */}
        <button
          type="button"
          onClick={() => {
            setTabActiva('productos');
            setFiltroUbicacion('todos');
          }}
          className={`p-4 bg-white rounded-2xl border text-left transition-all ${
            tabActiva === 'productos' && filtroUbicacion === 'todos'
              ? 'border-slate-900 shadow-soft ring-1 ring-slate-900'
              : 'border-slate-200/70 shadow-soft hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Catálogo Total</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            {metricas.totalProductos}
          </div>
          <span className="text-[10px] text-slate-400">
            {metricas.unidadesBodega + metricas.unidadesNevera} unidades totales
          </span>
        </button>

        {/* En Bodega */}
        <button
          type="button"
          onClick={() => {
            setTabActiva('productos');
            setFiltroUbicacion('bodega');
          }}
          className={`p-4 bg-white rounded-2xl border text-left transition-all ${
            tabActiva === 'productos' && filtroUbicacion === 'bodega'
              ? 'border-amber-600 shadow-soft ring-1 ring-amber-600'
              : 'border-slate-200/70 shadow-soft hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">En Bodega</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-amber-900 tracking-tight">
            {metricas.enBodega}
          </div>
          <span className="text-[10px] text-slate-400">
            {metricas.unidadesBodega} uds. en almacén
          </span>
        </button>

        {/* En Nevera */}
        <button
          type="button"
          onClick={() => {
            setTabActiva('productos');
            setFiltroUbicacion('nevera');
          }}
          className={`p-4 bg-white rounded-2xl border text-left transition-all ${
            tabActiva === 'productos' && filtroUbicacion === 'nevera'
              ? 'border-blue-600 shadow-soft ring-1 ring-blue-600'
              : 'border-slate-200/70 shadow-soft hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">En Nevera</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Refrigerator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-blue-900 tracking-tight">
            {metricas.enNevera}
          </div>
          <span className="text-[10px] text-slate-400">
            {metricas.unidadesNevera} uds. refrigeradas
          </span>
        </button>

        {/* Por Reponer a Nevera */}
        <button
          type="button"
          onClick={() => {
            setTabActiva('productos');
            setFiltroUbicacion('por_reponer');
          }}
          className={`p-4 bg-white rounded-2xl border text-left transition-all ${
            tabActiva === 'productos' && filtroUbicacion === 'por_reponer'
              ? 'border-red-600 shadow-soft ring-1 ring-red-600'
              : 'border-slate-200/70 shadow-soft hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-600">Por Reponer</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-red-600 tracking-tight">
            {metricas.porReponer}
          </div>
          <span className="text-[10px] text-slate-400">
            {metricas.bajoStock} bajo stock mínimo
          </span>
        </button>

        {/* Auditoría / Movimientos */}
        <button
          type="button"
          onClick={() => setTabActiva('movimientos')}
          className={`p-4 bg-white rounded-2xl border text-left transition-all ${
            tabActiva === 'movimientos'
              ? 'border-emerald-600 shadow-soft ring-1 ring-emerald-600'
              : 'border-slate-200/70 shadow-soft hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Auditoría</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-emerald-600 tracking-tight">
            {metricas.totalMovimientos}
          </div>
          <span className="text-[10px] text-slate-400">Movimientos trazados</span>
        </button>
      </div>

      {/* Pestañas Principales y Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Selector de Pestaña Principal */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'productos', label: `Productos (${todosLosProductos.length})` },
              { id: 'categorias', label: `Categorías (${metricas.totalCategorias})` },
              { id: 'movimientos', label: `Movimientos (${metricas.totalMovimientos})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id as 'productos' | 'categorias' | 'movimientos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  tabActiva === tab.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Buscador y Categorías */}
          {tabActiva === 'productos' && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              {/* Filtro por Categoría */}
              <select
                value={filtroCategoria}
                onChange={(e) =>
                  setFiltroCategoria(
                    e.target.value === 'todas' ? 'todas' : parseInt(e.target.value)
                  )
                }
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              {/* Buscador */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ref..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                />
              </div>

              {hayFiltrosActivos && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  title="Restablecer filtros"
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-xl transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filtro de Ubicación (Inventario Bodega vs Nevera) */}
        {tabActiva === 'productos' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Ubicación:
              </span>
              {[
                { id: 'todos', label: 'Toda ubicación', conteo: todosLosProductos.length, icono: Package },
                { id: 'bodega', label: 'En Bodega / Almacén', conteo: metricas.enBodega, icono: Warehouse },
                { id: 'nevera', label: 'En Nevera / Minibar', conteo: metricas.enNevera, icono: Refrigerator },
                { id: 'habitaciones', label: 'Habitaciones (Amenities/Lencería)', conteo: metricas.enHabitaciones, icono: Package },
                { id: 'areas_operativas', label: 'Áreas Operativas (Limpieza)', conteo: metricas.enAreasOperativas, icono: Warehouse },
                { id: 'por_reponer', label: 'Por reponer a nevera', conteo: metricas.porReponer, icono: AlertTriangle },
                { id: 'agotados', label: 'Sin existencias', conteo: metricas.agotados, icono: null },
              ].map((item) => {
                const activo = filtroUbicacion === item.id;
                const Icono = item.icono;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFiltroUbicacion(item.id as FiltroUbicacionInventario)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
                      activo
                        ? 'bg-slate-900 text-white font-semibold shadow-soft-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {Icono && <Icono className="w-3.5 h-3.5 opacity-80" />}
                    <span>{item.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activo ? 'bg-slate-800 text-slate-100' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {item.conteo}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Mostrando <span className="font-bold text-slate-900">{productos.length}</span> de{' '}
              <span className="font-bold text-slate-900">{todosLosProductos.length}</span> productos
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la pestaña activa */}
      {tabActiva === 'productos' && (
        <ProductosTab
          productos={productos}
          filtroUbicacion={filtroUbicacion}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
          onEditar={(p) => {
            setProductoAEditar(p);
            setModalProductoAbierto(true);
          }}
          onEliminar={eliminarProducto}
          onRegistrarMovimiento={(p) => {
            setProductoParaMovimiento(p);
            setModalMovimientoAbierto(true);
          }}
          onTrasladarANevera={(p) => {
            setProductoParaTraslado(p);
            setModalTrasladoAbierto(true);
          }}
          onCrearProducto={() => {
            setProductoAEditar(null);
            setModalProductoAbierto(true);
          }}
        />
      )}

      {tabActiva === 'categorias' && (
        <CategoriasTab
          categorias={categorias}
          onEditar={(c) => {
            setCategoriaAEditar(c);
            setModalCategoriaAbierto(true);
          }}
          onEliminar={eliminarCategoria}
          onCrearCategoria={() => {
            setCategoriaAEditar(null);
            setModalCategoriaAbierto(true);
          }}
        />
      )}

      {tabActiva === 'movimientos' && (
        <MovimientosTab
          movimientos={movimientos}
          onRegistrarMovimiento={() => {
            if (todosLosProductos.length > 0) {
              setProductoParaMovimiento(todosLosProductos[0]);
              setModalMovimientoAbierto(true);
            }
          }}
        />
      )}

      {/* Modales */}
      <ProductoModal
        isOpen={modalProductoAbierto}
        producto={productoAEditar}
        categorias={categorias}
        onClose={() => {
          setModalProductoAbierto(false);
          setProductoAEditar(null);
        }}
        onSubmit={guardarProducto}
      />

      <MovimientoModal
        isOpen={modalMovimientoAbierto}
        producto={productoParaMovimiento}
        productos={todosLosProductos}
        onSeleccionarProducto={(p) => setProductoParaMovimiento(p)}
        onClose={() => {
          setModalMovimientoAbierto(false);
          setProductoParaMovimiento(null);
        }}
        onSubmit={registrarMovimiento}
      />

      <CategoriaModal
        isOpen={modalCategoriaAbierto}
        categoria={categoriaAEditar}
        onClose={() => {
          setModalCategoriaAbierto(false);
          setCategoriaAEditar(null);
        }}
        onSubmit={guardarCategoria}
      />
      <TrasladoNeveraModal
        isOpen={modalTrasladoAbierto}
        producto={productoParaTraslado}
        onClose={() => {
          setModalTrasladoAbierto(false);
          setProductoParaTraslado(null);
        }}
        onSubmit={registrarMovimiento}
      />
    </div>
  );
}
