import { Building2, Printer } from 'lucide-react';
import { Button } from '@/components/Button';
import type { ReporteMincitResponse } from '../types/reporte.types';

interface MincitTabProps {
  data: ReporteMincitResponse | null;
  mesSeleccionado?: number;
  anioSeleccionado?: number;
  onCambiarPeriodo?: (mes: number, anio: number) => void;
}

export function MincitTab({
  data,
  mesSeleccionado = new Date().getMonth() + 1,
  anioSeleccionado = new Date().getFullYear(),
  onCambiarPeriodo,
}: MincitTabProps) {
  if (!data) return null;

  const { periodo, capacidad, flujo_huespedes, indicadores_financieros, motivos_viaje } = data;

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

  const meses = [
    { num: 1, nombre: 'Enero' },
    { num: 2, nombre: 'Febrero' },
    { num: 3, nombre: 'Marzo' },
    { num: 4, nombre: 'Abril' },
    { num: 5, nombre: 'Mayo' },
    { num: 6, nombre: 'Junio' },
    { num: 7, nombre: 'Julio' },
    { num: 8, nombre: 'Agosto' },
    { num: 9, nombre: 'Septiembre' },
    { num: 10, nombre: 'Octubre' },
    { num: 11, nombre: 'Noviembre' },
    { num: 12, nombre: 'Diciembre' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER MINCIT / DANE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-red-50 text-red-700 rounded-xl mt-0.5">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/70">
                  MINISTERIO DE COMERCIO, INDUSTRIA Y TURISMO & DANE
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-1 tracking-tight">
                Muestra Mensual de Hoteles & Estadísticas Turísticas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Variables estandarizadas de la industria de alojamiento: Tasa de ocupación mensual, ADR, RevPAR, pernoctaciones y distribución de motivos de viaje.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <select
                value={mesSeleccionado}
                onChange={(e) => onCambiarPeriodo?.(Number(e.target.value), anioSeleccionado)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
              >
                {meses.map((m) => (
                  <option key={m.num} value={m.num}>
                    {m.nombre}
                  </option>
                ))}
              </select>

              <select
                value={anioSeleccionado}
                onChange={(e) => onCambiarPeriodo?.(mesSeleccionado, Number(e.target.value))}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImprimir}
              icono={<Printer className="w-3.5 h-3.5" />}
            >
              Imprimir Ficha DANE
            </Button>
          </div>
        </div>

        {/* INDICADORES FINANCIEROS Y METRICAS CLAVE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-xs text-slate-500">Tasa de Ocupación Mes</span>
            <span className="text-2xl font-display font-bold text-red-900 mt-1 block tracking-tight">
              {capacidad.tasa_ocupacion_mensual}%
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {capacidad.habitaciones_noche_ocupadas} cuartos-noche
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-xs text-slate-500">ADR (Tarifa Promedio)</span>
            <span className="text-2xl font-display font-bold text-slate-900 mt-1 block tracking-tight">
              {formatearDinero(indicadores_financieros.adr_tarifa_promedio_diaria)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Por cuarto vendido</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-xs text-slate-500">RevPAR (Ingreso x Cuarto)</span>
            <span className="text-2xl font-display font-bold text-emerald-800 mt-1 block tracking-tight">
              {formatearDinero(indicadores_financieros.revpar)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Sobre oferta total</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-xs text-slate-500">Pernoctaciones Totales</span>
            <span className="text-2xl font-display font-bold text-slate-800 mt-1 block tracking-tight">
              {flujo_huespedes.pernoctaciones_totales}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Personas × noches</span>
          </div>
        </div>
      </div>

      {/* CAPACIDAD Y FLUJO DE HUÉSPEDES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Capacidad Hotelera y Demanda ({periodo.nombre_mes})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cálculo estandarizado DANE basado en la matriz física de 45 habitaciones.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600">Habitaciones Físicas del Hotel</span>
              <span className="font-bold text-slate-900 font-mono">{capacidad.total_habitaciones_fisicas}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600">Días del Mes Evaluado</span>
              <span className="font-bold text-slate-900 font-mono">{periodo.dias_mes} días</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-600">Habitaciones Disponibles Mes (Capacidad Teórica)</span>
              <span className="font-bold text-slate-900 font-mono">{capacidad.habitaciones_disponibles_mes} cuartos-noche</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs">
              <span className="text-red-900 font-medium">Habitaciones-Noche Efectivamente Ocupadas</span>
              <span className="font-bold text-red-900 font-mono">{capacidad.habitaciones_noche_ocupadas}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
              <span className="text-emerald-900 font-medium">Ingresos Totales por Alojamiento</span>
              <span className="font-bold text-emerald-900 font-mono">
                {formatearDinero(indicadores_financieros.ingresos_alojamiento_total)}
              </span>
            </div>
          </div>
        </div>

        {/* COMPOSICIÓN DEMOGRÁFICA Y MOTIVOS DE VIAJE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Composición Demográfica y Motivo de Viaje
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Origen de visitantes y principales propósitos de viaje en la región de Cúcuta.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[11px] text-slate-500">Total Huéspedes</span>
              <span className="text-lg font-bold text-slate-900">{flujo_huespedes.total_huespedes}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[11px] text-slate-500">Nacionales</span>
              <span className="text-lg font-bold text-emerald-800">{flujo_huespedes.nacionales}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-[11px] text-slate-500">Extranjeros</span>
              <span className="text-lg font-bold text-amber-800">{flujo_huespedes.extranjeros}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-slate-700 block">Distribución por Motivo de Viaje</span>
            {motivos_viaje.map((m) => (
              <div key={m.motivo} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>{m.motivo}</span>
                  <span className="font-bold text-slate-900">{m.porcentaje}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-700 h-full rounded-full"
                    style={{ width: `${m.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
