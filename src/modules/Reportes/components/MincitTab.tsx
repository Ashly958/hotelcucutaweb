import { Users, BedDouble, DollarSign } from 'lucide-react';
import type { ReporteMincitResponse } from '../types/reporte.types';

interface MincitTabProps {
  data: ReporteMincitResponse | null;
}

export function MincitTab({ data }: MincitTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Nacionales</div>
          <div className="text-3xl font-display font-bold text-slate-900">{data.total_huespedes_nacionales}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> Extranjeros</div>
          <div className="text-3xl font-display font-bold text-emerald-700">{data.total_huespedes_extranjeros}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><BedDouble className="w-4 h-4" /> Habs. Ocupadas</div>
          <div className="text-3xl font-display font-bold text-slate-700">{data.total_habitaciones_ocupadas_mes}</div>
          <div className="text-[10px] text-slate-400">{data.porcentaje_ocupacion_mes}% ocupación</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Ingresos Aloj.</div>
          <div className="text-3xl font-display font-bold text-slate-700">${data.ingresos_totales_alojamiento.toLocaleString('es-CO')}</div>
        </div>
      </div>
    </div>
  );
}
