import type { ReporteSireResponse } from '../types/reporte.types';
import { reportesService } from '../services/reportesService';
import { Button } from '@/components/Button';
import { Download } from 'lucide-react';

interface SireTabProps {
  data: ReporteSireResponse | null;
  onActualizarEstado: (id: number, datos: any) => Promise<void>;
}

export function SireTab({ data, onActualizarEstado }: SireTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-slate-900">Migración Colombia (SIRE)</h3>
        <Button variant="outline" size="sm" onClick={() => reportesService.exportarCsvSire(data.registros)} icono={<Download className="w-4 h-4" />}>
          Exportar CSV SIRE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Extranjeros</div>
          <div className="text-2xl font-display font-bold text-slate-900">{data.total_registros}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pendientes Exportar</div>
          <div className="text-2xl font-display font-bold text-red-600">{data.pendientes_exportar}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500">
            <tr>
              {['Documento', 'Huésped', 'Nacionalidad', 'Check-In', 'Estado SIRE', 'Acciones'].map(h => (
                <th key={h} className="p-3 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.registros.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 text-slate-700">{r.tipo_documento_sire} {r.numero_documento_sire}</td>
                <td className="p-3 font-semibold text-slate-900">{r.huesped_nombre}</td>
                <td className="p-3 text-slate-500">{r.nacionalidad}</td>
                <td className="p-3 text-slate-500">{r.fecha_checkin}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.estado_reporte === 'pendiente' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {r.estado_reporte}
                  </span>
                </td>
                <td className="p-3">
                  {r.estado_reporte === 'pendiente' && (
                    <Button variant="outline" size="sm" onClick={() => {
                      const code = prompt('Ingrese código de confirmación SIRE:');
                      if (code) onActualizarEstado(r.id, { estado_reporte: 'exportado_sire', codigo_confirmacion_sire: code });
                    }}>
                      Confirmar Subida
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
