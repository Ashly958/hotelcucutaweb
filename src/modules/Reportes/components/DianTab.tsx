import type { ReporteDianResponse } from '../types/reporte.types';
import { reportesService } from '../services/reportesService';
import { Button } from '@/components/Button';
import { Download } from 'lucide-react';

interface DianTabProps {
  data: ReporteDianResponse | null;
}

export function DianTab({ data }: DianTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-slate-900">Libro de Ventas DIAN</h3>
        <Button variant="outline" size="sm" onClick={() => reportesService.exportarCsvDian(data.facturas)} icono={<Download className="w-4 h-4" />}>
          Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Ventas</div>
          <div className="text-2xl font-display font-bold text-slate-900">${data.total_ventas.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total IVA</div>
          <div className="text-2xl font-display font-bold text-slate-900">${data.total_iva.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Impoconsumo</div>
          <div className="text-2xl font-display font-bold text-slate-900">${data.total_impoconsumo.toLocaleString('es-CO')}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500">
            <tr>
              {['Factura', 'Fecha', 'Cliente', 'Subtotal', 'IVA', 'Impoconsumo', 'Total', 'Estado'].map(h => (
                <th key={h} className="p-3 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.facturas.map((f) => (
              <tr key={f.numero_factura} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{f.numero_factura}</td>
                <td className="p-3 text-slate-500">{f.fecha_emision}</td>
                <td className="p-3 text-slate-700">{f.cliente_nombre}<br/><span className="text-[10px] text-slate-400">{f.cliente_documento}</span></td>
                <td className="p-3 text-slate-700">${f.subtotal.toLocaleString('es-CO')}</td>
                <td className="p-3 text-slate-700">${f.valor_iva.toLocaleString('es-CO')}</td>
                <td className="p-3 text-slate-700">${(f.impuesto_consumo ?? 0).toLocaleString('es-CO')}</td>
                <td className="p-3 font-bold text-emerald-700">${f.total_factura.toLocaleString('es-CO')}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${f.estado === 'pagada' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {f.estado}
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
