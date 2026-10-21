import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Trash2,
  HelpCircle,
  Award,
  CreditCard,
} from 'lucide-react';
import type { EstadisticasAnualesServicios, TipoServicio } from '../types/serviciosPublicos.types';
import { GraficaLineasServicios } from './GraficaLineasServicios';

interface EstadisticasAnualesCardProps {
  estadisticas: EstadisticasAnualesServicios | null;
  anioSeleccionado: number;
  onCambiarAnio: (anio: number) => void;
  loading?: boolean;
}

const TIPO_ICONOS: Record<TipoServicio, { label: string; icon: any; color: string; barColor: string; hex: string }> = {
  luz: { label: 'Luz / Energía', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200', barColor: 'bg-amber-500', hex: '#d97706' },
  agua: { label: 'Agua Potable', icon: Droplets, color: 'text-blue-600 bg-blue-50 border-blue-200', barColor: 'bg-blue-500', hex: '#2563eb' },
  gas: { label: 'Gas Natural', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200', barColor: 'bg-orange-500', hex: '#ea580c' },
  internet: { label: 'Internet', icon: Wifi, color: 'text-purple-600 bg-purple-50 border-purple-200', barColor: 'bg-purple-500', hex: '#9333ea' },
  aseo: { label: 'Aseo', icon: Trash2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500', hex: '#059669' },
  otro: { label: 'Otros', icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-200', barColor: 'bg-slate-500', hex: '#64748b' },
};

export function EstadisticasAnualesCard({
  estadisticas,
  anioSeleccionado,
  onCambiarAnio,
  loading,
}: EstadisticasAnualesCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 text-xs">
        Cargando estadísticas anuales de servicios públicos...
      </div>
    );
  }

  if (!estadisticas) return null;

  const { kpis, totales_por_tipo, matriz_mensual, anios_disponibles } = estadisticas;
  const porcentajePagado = kpis.total_facturado_anio > 0
    ? Math.round((kpis.total_pagado_anio / kpis.total_facturado_anio) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Selector de Año y Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-600" />
            Consolidado Anual de Servicios Públicos · Año {anioSeleccionado}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Histórico completo de facturación, valores pagados y desglose por mes de energía, agua, gas y telecomunicaciones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Año de Consulta:</span>
          <select
            value={anioSeleccionado}
            onChange={(e) => onCambiarAnio(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500"
          >
            {anios_disponibles.map((a) => (
              <option key={a} value={a}>
                Año {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturado */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[11px] font-medium block">Total Facturado Anual</span>
              <span className="font-mono font-bold text-lg text-slate-900 mt-1 block">
                ${kpis.total_facturado_anio.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>{kpis.total_recibos} recibos en total</span>
            <span>Prom: ${(kpis.promedio_mensual || 0).toLocaleString('es-CO')}/mes</span>
          </div>
        </div>

        {/* Total Pagado */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[11px] font-medium block">Total Pagado en el Año</span>
              <span className="font-mono font-bold text-lg text-emerald-600 mt-1 block">
                ${kpis.total_pagado_anio.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span>Pagado: {porcentajePagado}%</span>
              <span>{kpis.recibos_pagados} pagados</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, porcentajePagado)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pendiente por Pagar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[11px] font-medium block">Saldo Pendiente de Pago</span>
              <span className={`font-mono font-bold text-lg mt-1 block ${kpis.total_pendiente_anio > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                ${kpis.total_pendiente_anio.toLocaleString('es-CO')}
              </span>
            </div>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              kpis.total_pendiente_anio > 0
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>{kpis.recibos_pendientes} recibos por pagar</span>
            {kpis.recibos_vencidos > 0 && (
              <span className="text-red-600 font-semibold">{kpis.recibos_vencidos} vencidos</span>
            )}
          </div>
        </div>

        {/* Mes con Mayor Gasto */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-[11px] font-medium block">Pico de Mayor Gasto</span>
              <span className="font-display font-bold text-base text-slate-900 mt-1 block">
                {kpis.mes_mayor_gasto ? `${kpis.mes_mayor_gasto.nombre_mes}` : 'Sin datos'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
            <span>Monto del mes:</span>
            <span className="font-mono font-bold text-slate-900">
              ${(kpis.mes_mayor_gasto?.monto || 0).toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>

      {/* Desglose por Tipo de Servicio (Luz, Agua, Gas, Internet, Aseo) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="font-semibold text-slate-900 text-xs">
          Distribución Anual por Tipo de Servicio Público
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {(['luz', 'agua', 'gas', 'internet', 'aseo'] as TipoServicio[]).map((tipo) => {
            const data = totales_por_tipo[tipo];
            const conf = TIPO_ICONOS[tipo];
            const Icon = conf.icon;
            const facturado = data?.total_facturado || 0;
            const pagado = data?.total_pagado || 0;
            const porcentaje = data?.porcentaje || 0;

            return (
              <div
                key={tipo}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${conf.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 text-xs">{conf.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    {porcentaje}%
                  </span>
                </div>

                <div>
                  <span className="font-mono font-bold text-sm text-slate-900 block">
                    ${facturado.toLocaleString('es-CO')}
                  </span>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Pagado: ${pagado.toLocaleString('es-CO')}</span>
                    <span>{data?.cantidad_recibos || 0} rec.</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${conf.barColor} h-1.5 rounded-full`}
                    style={{ width: `${Math.min(100, porcentaje)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfica Interactiva de Líneas de Tendencia & Comparación Mensual */}
      <GraficaLineasServicios
        matrizMensual={matriz_mensual}
        totalesPorTipo={totales_por_tipo}
        anioSeleccionado={anioSeleccionado}
        tipoConfig={TIPO_ICONOS}
      />

      {/* Matriz Completa Mes a Mes (Enero a Diciembre) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-900 text-xs">
              Matriz Comparativa Mes a Mes · Detalle de Consumos (Enero a Diciembre)
            </h4>
            <p className="text-[11px] text-slate-500">
              Compara directamente el costo de la energía eléctrica vs agua vs gas mes a mes (ej. Junio Luz $15M vs Agua $1M)
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Moneda: Pesos Colombianos (COP)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right text-amber-700">Luz (CENS)</th>
                <th className="py-2.5 px-3 text-right text-blue-700">Agua (Kpital)</th>
                <th className="py-2.5 px-3 text-right text-orange-700">Gas</th>
                <th className="py-2.5 px-3 text-right text-purple-700">Internet</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">Total Facturado</th>
                <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">Total Pagado</th>
                <th className="py-2.5 px-3 text-center">Estado Mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matriz_mensual.map((item) => {
                const luz = item.servicios.luz?.facturado || 0;
                const agua = item.servicios.agua?.facturado || 0;
                const gas = item.servicios.gas?.facturado || 0;
                const internet = item.servicios.internet?.facturado || 0;
                const tieneRecibos = item.cantidad_recibos > 0;
                const esAlDia = item.total_pendiente <= 0 && tieneRecibos;
                const esPico = kpis.mes_mayor_gasto?.mes === item.mes;

                return (
                  <tr
                    key={item.mes}
                    className={`hover:bg-slate-50 transition-colors ${
                      esPico ? 'bg-amber-50/40 font-medium' : ''
                    }`}
                  >
                    {/* Nombre del Mes */}
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{item.nombre_mes}</span>
                        {esPico && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-700 font-bold uppercase tracking-wider">
                            Pico
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Luz */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {luz > 0 ? (
                        <span className={luz >= 10000000 ? 'font-bold text-amber-700' : ''}>
                          ${luz.toLocaleString('es-CO')}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Agua */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {agua > 0 ? (
                        <span className={agua >= 1000000 ? 'font-semibold text-blue-700' : ''}>
                          ${agua.toLocaleString('es-CO')}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Gas */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {gas > 0 ? `$${gas.toLocaleString('es-CO')}` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* Internet */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {internet > 0 ? `$${internet.toLocaleString('es-CO')}` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* Total Mes */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {item.total_facturado > 0 ? (
                        `$${item.total_facturado.toLocaleString('es-CO')}`
                      ) : (
                        <span className="text-slate-300">$0</span>
                      )}
                    </td>

                    {/* Total Pagado */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {item.total_pagado > 0 ? (
                        `$${item.total_pagado.toLocaleString('es-CO')}`
                      ) : (
                        <span className="text-slate-300">$0</span>
                      )}
                    </td>

                    {/* Estado del Mes */}
                    <td className="py-2.5 px-3 text-center">
                      {!tieneRecibos ? (
                        <span className="text-[10px] text-slate-400">Sin facturas</span>
                      ) : esAlDia ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Al Día
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pendiente (${item.total_pendiente.toLocaleString('es-CO')})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Fila de Totales Anuales */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
              <tr>
                <td className="py-3 px-3 uppercase text-[11px]">Totales Anuales</td>
                <td className="py-3 px-3 text-right font-mono text-amber-800">
                  ${(totales_por_tipo.luz?.total_facturado || 0).toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-800">
                  ${(totales_por_tipo.agua?.total_facturado || 0).toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-right font-mono text-orange-800">
                  ${(totales_por_tipo.gas?.total_facturado || 0).toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-right font-mono text-purple-800">
                  ${(totales_por_tipo.internet?.total_facturado || 0).toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-slate-900">
                  ${kpis.total_facturado_anio.toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-emerald-700">
                  ${kpis.total_pagado_anio.toLocaleString('es-CO')}
                </td>
                <td className="py-3 px-3 text-center text-xs">
                  {kpis.total_pendiente_anio === 0 ? (
                    <span className="text-emerald-700">100% Pagado</span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Pendiente: ${kpis.total_pendiente_anio.toLocaleString('es-CO')}
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
