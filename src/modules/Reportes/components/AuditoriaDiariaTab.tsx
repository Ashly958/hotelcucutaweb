import type { ReporteAuditoriaDiariaResponse } from '../types/reporte.types';
import { Button } from '@/components/Button';
import { Lock } from 'lucide-react';

interface AuditoriaDiariaTabProps {
  data: ReporteAuditoriaDiariaResponse | null;
  onCerrarAuditoria: (datos: any) => Promise<void>;
}

export function AuditoriaDiariaTab({ data, onCerrarAuditoria }: AuditoriaDiariaTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-slate-900">Auditoría Diaria ({data.fecha})</h3>
        {data.estado_auditoria === 'pendiente' && (
          <Button variant="danger" size="sm" onClick={() => onCerrarAuditoria({ fecha_auditoria: data.fecha })} icono={<Lock className="w-4 h-4" />}>
            Cerrar Auditoría (Cuadre de Cajas)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cajas Abiertas</div>
          <div className="text-3xl font-display font-bold text-slate-900">{data.cajas_abiertas}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ingresos Día</div>
          <div className="text-3xl font-display font-bold text-slate-900">${data.total_ingresos_dia.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Efectivo Caja</div>
          <div className="text-3xl font-display font-bold text-emerald-700">${data.total_efectivo_caja.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estado</div>
          <div className="text-3xl font-display font-bold text-slate-700 capitalize">{data.estado_auditoria}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-soft overflow-x-auto">
        <h4 className="font-display font-bold text-sm text-slate-900 p-4 border-b border-slate-100">Detalles de Cajas del Día</h4>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500">
            <tr>
              {['ID Usuario', 'Base Inicial', 'Ingresos Registrados', 'Estado'].map(h => (
                <th key={h} className="p-3 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.detalles_caja.map((c) => (
              <tr key={c.usuario_id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">Usuario #{c.usuario_id}</td>
                <td className="p-3 text-slate-700">${c.base.toLocaleString('es-CO')}</td>
                <td className="p-3 text-slate-700">${c.ingresos.toLocaleString('es-CO')}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.estado === 'abierta' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
