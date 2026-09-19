import { DollarSign, BedDouble, Coffee, CreditCard, Wallet } from 'lucide-react';
import type { ReporteIngresosResponse } from '../types/reporte.types';

interface IngresosTabProps {
  data: ReporteIngresosResponse | null;
  filtroPeriodo?: string;
  onCambiarFiltroPeriodo?: (periodo: 'hoy' | 'semana' | 'mes' | 'anio') => void;
}

export function IngresosTab({ data, filtroPeriodo = 'mes', onCambiarFiltroPeriodo }: IngresosTabProps) {
  if (!data) return null;

  const {
    resumen_general,
    desglose_por_concepto,
    desglose_metodos_pago,
    historico_diario,
    transacciones_recientes,
  } = data;

  const formatearDinero = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* SELECTOR RÁPIDO DE PERIODOS */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-soft">
        <span className="text-xs font-semibold text-slate-700 ml-2">
          Periodo de Liquidación:
        </span>
        <div className="flex items-center gap-1.5">
          {[
            { id: 'hoy', label: 'Hoy' },
            { id: 'semana', label: 'Esta Semana' },
            { id: 'mes', label: 'Este Mes' },
            { id: 'anio', label: 'Este Año' },
          ].map((opc) => (
            <button
              key={opc.id}
              onClick={() => onCambiarFiltroPeriodo?.(opc.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtroPeriodo === opc.id
                  ? 'bg-slate-900 text-white shadow-soft-xs font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100/80 border border-slate-200/50'
              }`}
            >
              {opc.label}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS DE INGRESOS SUAVES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recaudos Totales</span>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700 shadow-soft-xs">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-bold text-slate-900">
              {formatearDinero(resumen_general.total_ingresos)}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">Efectivamente recaudado</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hospedaje</span>
            <span className="p-2 bg-red-50 rounded-xl text-red-700 shadow-soft-xs">
              <BedDouble className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-bold text-red-800">
              {formatearDinero(desglose_por_concepto.hospedaje)}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">Venta de habitaciones</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Minibar & Neveras</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-700 shadow-soft-xs">
              <Coffee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-bold text-amber-800">
              {formatearDinero(desglose_por_concepto.minibar_inventario)}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">Bebidas e insumos</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cartera Pendiente</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-700 shadow-soft-xs">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-bold text-purple-800">
              {formatearDinero(resumen_general.saldo_cartera_pendiente)}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">Saldos por liquidar</span>
          </div>
        </div>
      </div>

      {/* DESGLOSE DE MÉTODOS DE PAGO Y CONFLICTO OPERATIVO (RN-010) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-soft space-y-4 lg:col-span-1">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Canales de Recaudo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control de efectivo según directiva operativa familiar (RN-010).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100/70 text-emerald-800 rounded-lg">
                  <Wallet className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-slate-800">Efectivo en Caja</span>
                  <span className="text-[10px] text-slate-500">Canal preferente hotel</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-emerald-800">
                  {formatearDinero(desglose_metodos_pago.efectivo)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {desglose_metodos_pago.porcentaje_efectivo}% del total
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100/70 text-blue-800 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-slate-800">Transferencias</span>
                  <span className="text-[10px] text-slate-500">Bancolombia / Nequi</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {formatearDinero(desglose_metodos_pago.transferencia)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-purple-100/70 text-purple-800 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-slate-800">Tarjetas</span>
                  <span className="text-[10px] text-slate-500">Datáfono</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {formatearDinero(desglose_metodos_pago.tarjeta)}
              </span>
            </div>
          </div>
        </div>

        {/* EVOLUCIÓN DE INGRESOS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4 lg:col-span-2">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Evolución Diaria de Recaudos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Montos diarios recibidos en caja durante el periodo seleccionado.
            </p>
          </div>

          <div className="pt-4">
            {historico_diario.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Sin movimientos financieros registrados en este rango de tiempo.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 items-end h-36">
                  {historico_diario.slice(-12).map((h) => {
                    const maxIngreso = Math.max(1, ...historico_diario.map((d) => d.total));
                    const altura = Math.max(10, Math.min(100, (h.total / maxIngreso) * 100));

                    return (
                      <div key={h.fecha} className="flex flex-col items-center h-full justify-end group relative">
                        <div
                          className="w-full bg-red-700/80 hover:bg-red-800 transition rounded-t-md flex items-end justify-center"
                          style={{ height: `${altura}%` }}
                        />
                        <span className="text-[9px] text-slate-500 mt-1 truncate w-full text-center">
                          {h.etiqueta}
                        </span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                          <span>{h.fecha}</span>
                          <span className="font-bold text-emerald-400">{formatearDinero(h.total)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TRANSACCIONES Y RECIBOS RECIENTES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Últimos Recaudos de Caja Registrados
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro secuencial de ingresos con soporte de comprobante de caja.
          </p>
        </div>

        {transacciones_recientes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se han registrado ingresos en el periodo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Comprobante</th>
                  <th className="py-2.5 px-3 font-semibold">Fecha</th>
                  <th className="py-2.5 px-3 font-semibold">Huésped / Habitación</th>
                  <th className="py-2.5 px-3 font-semibold">Concepto</th>
                  <th className="py-2.5 px-3 font-semibold">Método</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Valor Recibido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transacciones_recientes.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {tx.numero_recibo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {tx.fecha_pago.slice(0, 16)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{tx.huesped}</span>
                      <span className="text-slate-400 ml-1.5 font-display">(Hab. {tx.habitacion})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {tx.concepto}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {tx.metodo_pago}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatearDinero(tx.valor_recibido)}
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
