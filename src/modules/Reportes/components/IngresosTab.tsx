import { DollarSign, FileText } from 'lucide-react';
import type { ReporteIngresosResponse } from '../types/reporte.types';

interface IngresosTabProps {
  data: ReporteIngresosResponse | null;
}

export function IngresosTab({ data }: IngresosTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Total Facturado</div>
          <div className="text-3xl font-display font-bold text-slate-900">${data.total_facturado.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Total Recaudado</div>
          <div className="text-3xl font-display font-bold text-emerald-700">${data.total_recaudado.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cant. Facturas</div>
          <div className="text-3xl font-display font-bold text-slate-700">{data.cantidad_facturas}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cant. Recibos</div>
          <div className="text-3xl font-display font-bold text-slate-700">{data.cantidad_recibos}</div>
        </div>
      </div>
    </div>
  );
}
