import { Receipt, Calendar, User, Tag } from 'lucide-react';
import type { EgresoCaja } from '../types/facturacion.types';

interface EgresosTableProps {
  egresos: EgresoCaja[];
  onRegistrarEgreso?: () => void;
  cajaAbierta: boolean;
}

const CATEGORIA_LABELS: Record<string, { label: string; color: string }> = {
  suministros: { label: 'Suministros', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  aseo: { label: 'Insumos Aseo', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  transporte: { label: 'Transporte', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  mantenimiento_menor: { label: 'Mantenimiento', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  alimentos_bebidas: { label: 'Alimentos Recepción', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  otros: { label: 'Otros Gastos', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export function EgresosTable({ egresos, onRegistrarEgreso, cajaAbierta }: EgresosTableProps) {
  const totalMonto = egresos.reduce((sum, e) => sum + (e.monto || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-4">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Gastos y Egresos de Caja Menor (Turno Activo)
            </h3>
            <p className="text-xs text-slate-500">
              Compras menores y gastos imprevistos descontados de la gaveta de recepción.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Egresos</span>
            <span className="font-display font-bold text-rose-700 text-base">
              ${totalMonto.toLocaleString('es-CO')} COP
            </span>
          </div>
          {cajaAbierta && onRegistrarEgreso && (
            <button
              onClick={onRegistrarEgreso}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors"
            >
              + Nuevo Egreso
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-medium">
            <tr>
              <th className="py-3 px-4">Fecha & Hora</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Concepto</th>
              <th className="py-3 px-4">Beneficiario / Proveedor</th>
              <th className="py-3 px-4">Comprobante</th>
              <th className="py-3 px-4 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {egresos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No hay egresos registrados en este turno de caja.
                </td>
              </tr>
            ) : (
              egresos.map((egreso) => {
                const catInfo = CATEGORIA_LABELS[egreso.categoria] || {
                  label: egreso.categoria,
                  color: 'bg-slate-100 text-slate-700 border-slate-200',
                };

                return (
                  <tr key={egreso.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {egreso.created_at
                          ? new Date(egreso.created_at).toLocaleString('es-CO', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })
                          : 'Hoy'}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catInfo.color}`}
                      >
                        <Tag className="w-3 h-3" />
                        {catInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">{egreso.concepto}</span>
                      {egreso.observaciones && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {egreso.observaciones}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {egreso.beneficiario}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {egreso.comprobante ? (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                          {egreso.comprobante}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin comprobante</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-bold text-rose-700 text-sm">
                      -${(egreso.monto || 0).toLocaleString('es-CO')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
