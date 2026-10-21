import { BedDouble, CheckCircle2 } from 'lucide-react';
import type { ReporteOcupacionResponse } from '../types/reporte.types';

interface OcupacionTabProps {
  data: ReporteOcupacionResponse | null;
}

export function OcupacionTab({ data }: OcupacionTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tasa Ocupación</div>
          <div className="text-3xl font-display font-bold text-slate-900">{data.porcentaje_ocupacion}%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><BedDouble className="w-4 h-4" /> Ocupadas</div>
          <div className="text-3xl font-display font-bold text-slate-900">{data.habitaciones_ocupadas}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Disponibles</div>
          <div className="text-3xl font-display font-bold text-emerald-700">{data.habitaciones_disponibles}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Habitaciones</div>
          <div className="text-3xl font-display font-bold text-slate-700">{data.total_habitaciones}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-soft">
        <h3 className="font-display font-bold text-base text-slate-900 mb-4">Detalle de Habitaciones</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.detalle_habitaciones.map(hab => {
            let colors = '';
            switch (hab.estado_actual) {
              case 'ocupada':
                colors = 'bg-red-50 border-red-200 text-red-700';
                break;
              case 'disponible':
                colors = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                break;
              case 'limpieza':
                colors = 'bg-blue-50 border-blue-200 text-blue-700';
                break;
              case 'mantenimiento':
                colors = 'bg-amber-50 border-amber-200 text-amber-700';
                break;
              default:
                colors = 'bg-slate-50 border-slate-200 text-slate-700';
            }
            return (
              <div key={hab.habitacion_id} className={`p-3 rounded-xl border text-center ${colors}`}>
                <div className="font-bold text-lg">{hab.numero}</div>
                <div className="text-[10px] uppercase font-semibold">{hab.estado_actual.replace('_', ' ')}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
