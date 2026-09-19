import { useInventarios } from '../hooks/useInventarios';
import { ProductosTab } from '../components/ProductosTab';
import { CategoriasTab } from '../components/CategoriasTab';
import { MovimientosTab } from '../components/MovimientosTab';
import { ProductoModal } from '../components/ProductoModal';
import { MovimientoModal } from '../components/MovimientoModal';
import { CategoriaModal } from '../components/CategoriaModal';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Search, Package, AlertTriangle, FolderTree, History, ArrowUpDown } from 'lucide-react';

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
    recargar,
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
            Control de lencería, insumos de aseo, lavandería del piso 5 y neveras de pasillo (RF-014, RF-015).
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

      {/* Métricas de Inventario */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Catálogo Total
            </span>
            <div className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              {metricas.totalProductos}
            </div>
            <span className="text-[10px] text-slate-400">Artículos registrados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Alerta de Stock Bajo
            </span>
            <div className="text-2xl font-display font-bold text-red-600 tracking-tight">
              {metricas.bajoStock}
            </div>
            <span className="text-[10px] text-slate-400">Requiere reposición</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Categorías
            </span>
            <div className="text-2xl font-display font-bold text-slate-800 tracking-tight">
              {metricas.totalCategorias}
            </div>
            <span className="text-[10px] text-slate-400">Áreas operativas</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Historial de Auditoría
            </span>
            <div className="text-2xl font-display font-bold text-emerald-600 tracking-tight">
              {metricas.totalMovimientos}
            </div>
            <span className="text-[10px] text-slate-400">Movimientos trazados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pestañas Principales */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex gap-1.5 w-full sm:w-auto">
          {[
            { id: 'productos', label: `Productos (${metricas.totalProductos})` },
            { id: 'categorias', label: `Categorías (${metricas.totalCategorias})` },
            { id: 'movimientos', label: `Movimientos (${metricas.totalMovimientos})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id as 'productos' | 'categorias' | 'movimientos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                tabActiva === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabActiva === 'productos' && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Filtro por Categoría */}
            <select
              value={filtroCategoria}
              onChange={(e) =>
                setFiltroCategoria(
                  e.target.value === 'todas' ? 'todas' : parseInt(e.target.value)
                )
              }
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la pestaña activa */}
      {tabActiva === 'productos' && (
        <ProductosTab
          productos={productos}
          onEditar={(p) => {
            setProductoAEditar(p);
            setModalProductoAbierto(true);
          }}
          onEliminar={eliminarProducto}
          onRegistrarMovimiento={(p) => {
            setProductoParaMovimiento(p);
            setModalMovimientoAbierto(true);
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
    </div>
  );
}
