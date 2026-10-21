import { Edit, Trash2, ArrowUpDown, AlertTriangle, PackageCheck } from 'lucide-react';
import type { Producto, FiltroUbicacionInventario } from '../types/inventario.types';
import { EmptyState } from '@/components/EmptyState';

interface ProductosTabProps {
  productos: Producto[];
  filtroUbicacion?: FiltroUbicacionInventario;
  hayFiltrosActivos?: boolean;
  onLimpiarFiltros?: () => void;
  onEditar: (p: Producto) => void;
  onEliminar: (id: number) => void;
  onRegistrarMovimiento: (p: Producto) => void;
  onTrasladarANevera: (p: Producto) => void;
  onCrearProducto: () => void;
}

export function ProductosTab({
  productos,
  filtroUbicacion = 'todos',
  hayFiltrosActivos = false,
  onLimpiarFiltros,
  onEditar,
  onEliminar,
  onRegistrarMovimiento,
  onTrasladarANevera,
  onCrearProducto,
}: ProductosTabProps) {
  if (productos.length === 0) {
    return (
      <EmptyState
        titulo={hayFiltrosActivos ? "No se encontraron productos coincidentes" : "No se encontraron productos"}
        descripcion={
          hayFiltrosActivos
            ? "No hay productos que coincidan con la ubicación, categoría o término de búsqueda seleccionado."
            : "No hay artículos en esta categoría o catálogo de inventario."
        }
        textoAccion={hayFiltrosActivos && onLimpiarFiltros ? "Restablecer Filtros" : "Registrar Primer Producto"}
        onAccion={hayFiltrosActivos && onLimpiarFiltros ? onLimpiarFiltros : onCrearProducto}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="py-3 px-4">Ref. / Código</th>
              <th className="py-3 px-4">Nombre del Producto</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Unidad</th>
              <th className="py-3 px-4 text-right">Precio Venta</th>
              <th className={`py-3 px-4 text-center transition-colors ${
                filtroUbicacion === 'nevera' ? 'bg-blue-50/80 text-blue-900 font-bold' : ''
              }`}>
                Stock Nevera
              </th>
              <th className={`py-3 px-4 text-center transition-colors ${
                filtroUbicacion === 'bodega' ? 'bg-amber-50/80 text-amber-900 font-bold' : ''
              }`}>
                Stock Bodega
              </th>
              <th className={`py-3 px-4 text-center transition-colors ${
                filtroUbicacion === 'habitaciones' ? 'bg-purple-50/80 text-purple-900 font-bold' : ''
              }`}>
                Habitaciones
              </th>
              <th className={`py-3 px-4 text-center transition-colors ${
                filtroUbicacion === 'areas_operativas' ? 'bg-teal-50/80 text-teal-900 font-bold' : ''
              }`}>
                Áreas Operativas
              </th>
              <th className="py-3 px-4 text-center">Mínimo Alerta</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((p) => {
              const nevera = p.stockNevera ?? p.stock_nevera ?? 0;
              const bodega = p.stockBodega ?? p.stock_bodega ?? 0;
              const minimo = p.stockMinimoAlerta ?? p.stock_minimo_alerta ?? 5;
              const esBajo = nevera <= minimo;
              const cod = p.codigoReferencia || p.codigo_referencia || `PRD-${p.id}`;

              // Badge contextual de ubicación
              let ubicacionBadge = null;
              if (bodega > 0 && nevera > 0) {
                ubicacionBadge = (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-100">
                    Bodega & Nevera
                  </span>
                );
              } else if (nevera > 0 && bodega <= 0) {
                ubicacionBadge = (
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                    Solo Nevera
                  </span>
                );
              } else if (bodega > 0 && nevera <= 0) {
                ubicacionBadge = (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-100">
                    Por surtir a Nevera
                  </span>
                );
              } else {
                ubicacionBadge = (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                    Agotado
                  </span>
                );
              }

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {cod}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-slate-900">{p.nombre}</span>
                      {ubicacionBadge}
                    </div>
                    {p.descripcion && (
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs mt-0.5">
                        {p.descripcion}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {p.categoria_nombre || 'General'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {p.unidadMedida || p.unidad_medida || 'unidad'}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                    {(p.precioVenta || p.precio_venta || 0) > 0
                      ? `$${(p.precioVenta || p.precio_venta || 0).toLocaleString('es-CO')}`
                      : 'Uso Interno'}
                  </td>

                  {/* Stock Nevera con Badge de Alerta */}
                  <td className={`py-3.5 px-4 text-center ${
                    filtroUbicacion === 'nevera' ? 'bg-blue-50/30' : ''
                  }`}>
                    <div className="inline-flex items-center gap-1">
                      {nevera === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          0
                        </span>
                      ) : esBajo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          {nevera} (Bajo)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <PackageCheck className="w-3 h-3 text-emerald-600" />
                          {nevera}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock Bodega */}
                  <td className={`py-3.5 px-4 text-center font-mono ${
                    filtroUbicacion === 'bodega' ? 'bg-amber-50/30' : ''
                  }`}>
                    {bodega > 0 ? (
                      <span className="font-semibold text-slate-800">{bodega}</span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>

                  {/* Stock Habitaciones */}
                  <td className={`py-3.5 px-4 text-center font-mono ${
                    filtroUbicacion === 'habitaciones' ? 'bg-purple-50/30' : ''
                  }`}>
                    {(p.stockHabitaciones ?? p.stock_habitaciones ?? 0) > 0 ? (
                      <span className="font-semibold text-purple-800">
                        {p.stockHabitaciones ?? p.stock_habitaciones}
                      </span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>

                  {/* Stock Áreas Operativas */}
                  <td className={`py-3.5 px-4 text-center font-mono ${
                    filtroUbicacion === 'areas_operativas' ? 'bg-teal-50/30' : ''
                  }`}>
                    {(p.stockAreasOperativas ?? p.stock_areas_operativas ?? 0) > 0 ? (
                      <span className="font-semibold text-teal-800">
                        {p.stockAreasOperativas ?? p.stock_areas_operativas}
                      </span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    {minimo}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onTrasladarANevera(p)}
                        title={nevera === 0 ? "Reponer producto en nevera" : "Trasladar a Nevera"}
                        disabled={bodega <= 0}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors border ${
                          bodega <= 0
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : nevera === 0
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                        }`}
                      >
                        {nevera === 0 ? 'Reponer' : 'A Nevera'}
                      </button>

                      <button
                        onClick={() => onRegistrarMovimiento(p)}
                        title="Registrar entrada o salida de stock"
                        className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditar(p)}
                        title="Editar información del producto"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar producto ${p.nombre}?`)) {
                            onEliminar(p.id);
                          }
                        }}
                        title="Eliminar producto"
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
