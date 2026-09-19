import { Edit, Trash2, ArrowUpDown, AlertTriangle, PackageCheck } from 'lucide-react';
import type { Producto } from '../types/inventario.types';
import { EmptyState } from '@/components/EmptyState';

interface ProductosTabProps {
  productos: Producto[];
  onEditar: (p: Producto) => void;
  onEliminar: (id: number) => void;
  onRegistrarMovimiento: (p: Producto) => void;
  onCrearProducto: () => void;
}

export function ProductosTab({
  productos,
  onEditar,
  onEliminar,
  onRegistrarMovimiento,
  onCrearProducto,
}: ProductosTabProps) {
  if (productos.length === 0) {
    return (
      <EmptyState
        titulo="No se encontraron productos"
        descripcion="No hay artículos en esta categoría o catálogo de inventario."
        textoAccion="Registrar Primer Producto"
        onAccion={onCrearProducto}
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
              <th className="py-3 px-4 text-center">Stock Actual</th>
              <th className="py-3 px-4 text-center">Mínimo Alerta</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((p) => {
              const actual = p.stockActual ?? p.stock_actual ?? 0;
              const minimo = p.stockMinimoAlerta ?? p.stock_minimo_alerta ?? 5;
              const esBajo = actual <= minimo;
              const cod = p.codigoReferencia || p.codigo_referencia || `PRD-${p.id}`;

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {cod}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{p.nombre}</div>
                    {p.descripcion && (
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">
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

                  {/* Stock Actual con Badge de Alerta */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      {esBajo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          {actual} (Bajo)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <PackageCheck className="w-3 h-3 text-emerald-600" />
                          {actual}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    {minimo}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
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
