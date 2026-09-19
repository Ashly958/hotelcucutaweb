import { FileText, Eye, CheckCircle2, Clock, DollarSign, FileSpreadsheet } from 'lucide-react';
import type { Factura } from '../types/facturacion.types';
import { EmptyState } from '@/components/EmptyState';

interface FacturasTableProps {
  facturas: Factura[];
  onVerDetalle: (factura: Factura) => void;
  onVerFolio?: (estadiaId: number) => void;
  onEmitirFactura: () => void;
}

export function FacturasTable({
  facturas,
  onVerDetalle,
  onVerFolio,
  onEmitirFactura,
}: FacturasTableProps) {
  if (facturas.length === 0) {
    return (
      <EmptyState
        titulo="No hay facturas emitidas"
        descripcion="Aún no se han generado facturas o no coinciden con los filtros de búsqueda."
        textoAccion="Emitir Factura por Estadía"
        onAccion={onEmitirFactura}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-medium">
            <tr>
              <th className="py-3 px-4">N° Factura DIAN</th>
              <th className="py-3 px-4">Cliente / Huésped</th>
              <th className="py-3 px-4">Identificación</th>
              <th className="py-3 px-4">Fecha de Emisión</th>
              <th className="py-3 px-4 text-right">Total Factura</th>
              <th className="py-3 px-4 text-right">Saldo Pendiente</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {facturas.map((f) => {
              const total = f.total || f.total_factura || 0;
              const saldo = f.saldo_pendiente_dinamico ?? 0;
              const codigo = f.codigo_factura || f.numero_factura || `FAC-${f.id}`;

              const esPagadaTotal = f.estado === 'pagada' || f.estado === 'pagada_total' || saldo === 0;
              const esPagadaParcial = f.estado === 'pagada_parcial' && saldo > 0;

              return (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Código */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 border border-red-200/60 flex items-center justify-center font-mono font-bold text-[11px]">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono font-semibold text-slate-900">
                        {codigo}
                      </span>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {f.cliente_nombre || 'Consumidor Final'}
                  </td>

                  {/* Documento */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {f.cliente_documento || '222222222222'}
                  </td>

                  {/* Fecha */}
                  <td className="py-3.5 px-4 text-slate-500">
                    {f.fecha_emision ? f.fecha_emision.substring(0, 16).replace('T', ' ') : '-'}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                    ${total.toLocaleString('es-CO')}
                  </td>

                  {/* Saldo Pendiente */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {saldo > 0 ? (
                      <span className="text-amber-600 font-mono">
                        ${saldo.toLocaleString('es-CO')}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-mono">$0</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 text-center">
                    {esPagadaTotal ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Pagada Total
                      </span>
                    ) : esPagadaParcial ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/60">
                        <DollarSign className="w-3 h-3" />
                        Abono Parcial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onVerDetalle(f)}
                        title="Ver factura completa y comprobante"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {f.estadia_id && onVerFolio && (
                        <button
                          onClick={() => onVerFolio(f.estadia_id as number)}
                          title="Ver cuenta centralizada (Folio)"
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                      )}
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
