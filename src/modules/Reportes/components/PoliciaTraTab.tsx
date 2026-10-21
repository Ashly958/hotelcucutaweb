import type { ReportePoliciaTraResponse } from '../types/reporte.types';
import { reportesService } from '../services/reportesService';
import { Button } from '@/components/Button';
import { Download } from 'lucide-react';

interface PoliciaTraTabProps {
  data: ReportePoliciaTraResponse | null;
}

export function PoliciaTraTab({ data }: PoliciaTraTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-slate-900">Libro de Huéspedes (Policía Nacional - TRA)</h3>
        <Button variant="outline" size="sm" onClick={() => reportesService.exportarCsvPoliciaTra(data.registros)} icono={<Download className="w-4 h-4" />}>
          Exportar CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500">
            <tr>
              {['Estadía', 'Hab.', 'Huésped Titular', 'Check-In', 'Check-Out', 'Personas'].map(h => (
                <th key={h} className="p-3 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.registros.map((r) => (
              <tr key={r.codigo_estadia} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{r.codigo_estadia}</td>
                <td className="p-3 text-slate-700">{r.habitacion}</td>
                <td className="p-3 text-slate-700">{r.huesped_titular.nombres} {r.huesped_titular.apellidos}<br/><span className="text-[10px] text-slate-400">{r.huesped_titular.tipo_documento} {r.huesped_titular.numero_documento}</span></td>
                <td className="p-3 text-slate-500">{r.fecha_checkin}</td>
                <td className="p-3 text-slate-500">{r.fecha_real_checkout || r.fecha_prevista_checkout}</td>
                <td className="p-3 text-slate-700 font-bold">{r.cantidad_personas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
