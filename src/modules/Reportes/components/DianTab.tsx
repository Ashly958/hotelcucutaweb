import { Download, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/Button';
import type { ReporteDianResponse } from '../types/reporte.types';

interface DianTabProps {
  data: ReporteDianResponse | null;
  onExportarCsv?: () => void;
}

export function DianTab({ data, onExportarCsv }: DianTabProps) {
  if (!data) return null;

  const { resolucion_dian, resumen_tributario, facturas } = data;

  const formatearDinero = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* TARJETA DE RESOLUCIÓN DIAN ACTIVA */}
      {resolucion_dian ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-50 text-red-700 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Resolución de Facturación DIAN N° {resolucion_dian.numero_resolucion}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Prefijo oficial <strong>{resolucion_dian.prefijo}</strong> · Rango habilitado del {resolucion_dian.rango_desde} al {resolucion_dian.rango_hasta}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImprimir}
                icono={<Printer className="w-3.5 h-3.5" />}
              >
                Imprimir Libro DIAN
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportarCsv}
                icono={<Download className="w-3.5 h-3.5" />}
              >
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-[11px] text-slate-500">Consecutivo Actual</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {resolucion_dian.prefijo}-{String(resolucion_dian.consecutivo_actual).padStart(5, '0')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-[11px] text-slate-500">Folios Emitidos</span>
              <span className="text-lg font-bold font-mono text-red-900">
                {resolucion_dian.facturas_emitidas}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-[11px] text-slate-500">Folios Restantes</span>
              <span className="text-lg font-bold font-mono text-emerald-800">
                {resolucion_dian.facturas_restantes}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-[11px] text-slate-500">Vigencia Legal</span>
              <span className="text-xs font-semibold text-slate-700 block mt-1">
                Hasta {resolucion_dian.fecha_fin_vigencia}
              </span>
            </div>
          </div>

          {/* Barra de progreso de numeración */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Capacidad de resolución utilizada</span>
              <span className="font-semibold text-slate-700">{resolucion_dian.porcentaje_uso}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-red-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, resolucion_dian.porcentaje_uso)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          No se encontró resolución DIAN activa registrada.
        </div>
      )}

      {/* RESUMEN TRIBUTARIO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <span className="text-xs font-medium text-slate-500">Total Facturas Emitidas</span>
          <span className="block text-3xl font-display font-bold text-slate-900 mt-2 tracking-tight">
            {resumen_tributario.total_facturas_emitidas}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Documentos tributarios</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <span className="text-xs font-medium text-slate-500">Ventas Gravadas (19%)</span>
          <span className="block text-2xl font-display font-bold text-slate-900 mt-2 tracking-tight">
            {formatearDinero(resumen_tributario.ventas_gravadas)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Base con IVA</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <span className="text-xs font-medium text-slate-500">Total IVA Generado</span>
          <span className="block text-2xl font-display font-bold text-red-900 mt-2 tracking-tight">
            {formatearDinero(resumen_tributario.total_iva)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Impuesto liquidado</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <span className="text-xs font-medium text-slate-500">Total Facturación Bruta</span>
          <span className="block text-2xl font-display font-bold text-emerald-800 mt-2 tracking-tight">
            {formatearDinero(resumen_tributario.total_facturado)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Subtotal + IVA + Consumo</span>
        </div>
      </div>

      {/* TABLA DE FACTURACIÓN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Libro de Ventas y Facturas Expedidas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro fiscal auditable con CUFE para declaraciones tributarias periódicas.
          </p>
        </div>

        {facturas.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se han expedido facturas en este periodo fiscal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Factura</th>
                  <th className="py-2.5 px-3 font-semibold">Fecha Emisión</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente / Huésped</th>
                  <th className="py-2.5 px-3 font-semibold">NIT / Cédula</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                  <th className="py-2.5 px-3 font-semibold text-right">IVA</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Total</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                  <th className="py-2.5 px-3 font-semibold">CUFE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facturas.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {f.numero_factura}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {f.fecha_emision.slice(0, 10)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {f.cliente_nombre}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {f.cliente_documento}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatearDinero(f.subtotal)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-red-700">
                      {formatearDinero(f.valor_iva)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatearDinero(f.total_factura)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {f.estado}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 max-w-[120px] truncate" title={f.cufe}>
                      {f.cufe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
