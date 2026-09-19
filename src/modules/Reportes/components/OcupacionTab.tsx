import { BedDouble, CheckCircle2, Clock, Wrench, AlertCircle, ArrowUpRight } from 'lucide-react';
import type { ReporteOcupacionResponse } from '../types/reporte.types';

interface OcupacionTabProps {
  data: ReporteOcupacionResponse | null;
  onSeleccionarPiso?: (pisoId: number) => void;
}

export function OcupacionTab({ data }: OcupacionTabProps) {
  if (!data) return null;

  const {
    total_habitaciones,
    metricas_globales,
    ocupacion_por_piso,
    historico_diario,
    checkouts_pendientes_hoy,
    checkins_hoy,
  } = data;

  return (
    <div className="space-y-6">
      {/* TARJETAS DE MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasa Ocupación</span>
            <span className="p-2 bg-red-50 rounded-xl text-red-700 shadow-soft-xs">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900">
              {metricas_globales.tasa_ocupacion}%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-red-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metricas_globales.tasa_ocupacion)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ocupadas</span>
            <span className="p-2 bg-red-50 rounded-xl text-red-700 shadow-soft-xs">
              <BedDouble className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-bold text-slate-900">
              {metricas_globales.ocupadas}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">/ {total_habitaciones} habs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponibles</span>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700 shadow-soft-xs">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-bold text-emerald-700">
              {metricas_globales.disponibles}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">listas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En Limpieza</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-700 shadow-soft-xs">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-bold text-amber-700">
              {metricas_globales.limpieza}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">rotación</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mantenimiento</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-700 shadow-soft-xs">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-display font-bold text-purple-700">
              {metricas_globales.mantenimiento}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">bloqueo</span>
          </div>
        </div>
      </div>

      {/* SEGMENTACIÓN POR PISOS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Ocupación Segmentada por Piso (1 a 5)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribución física y porcentaje de utilización de las 45 habitaciones del hotel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {ocupacion_por_piso.map((piso) => (
            <div
              key={piso.piso_id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-red-200/70 hover:shadow-soft-xs transition-all duration-150 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-800">
                  {piso.nombre_piso}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                  {piso.tasa_ocupacion}%
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, piso.tasa_ocupacion)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 text-center text-xs pt-1 border-t border-slate-200/50">
                <div>
                  <span className="block font-bold text-slate-800">{piso.ocupadas}</span>
                  <span className="text-[10px] text-slate-500">Ocupadas</span>
                </div>
                <div>
                  <span className="block font-bold text-emerald-700">{piso.disponibles}</span>
                  <span className="text-[10px] text-slate-500">Libres</span>
                </div>
                <div>
                  <span className="block font-bold text-amber-700">{piso.limpieza}</span>
                  <span className="text-[10px] text-slate-500">Aseo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTÓRICO ÚLTIMAS 2 SEMANAS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Tendencia de Ocupación Diaria (Últimos 14 Días)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evolución porcentual de cuartos ocupados para dimensionar picos de afluencia turística y comercial.
          </p>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 items-end h-40">
            {historico_diario.map((dia) => {
              const altura = Math.max(8, Math.min(100, dia.tasa_ocupacion));
              return (
                <div key={dia.fecha} className="flex flex-col items-center h-full justify-end group relative">
                  <div
                    className="w-full max-w-[28px] bg-red-100 hover:bg-red-700 transition rounded-t-md relative flex items-end justify-center"
                    style={{ height: `${altura}%` }}
                  >
                    <span className="text-[9px] font-bold text-red-900 group-hover:text-white mb-1">
                      {dia.ocupadas}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                    {dia.dia_semana.split(' ')[0]}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                    <span>{dia.fecha}</span>
                    <span className="font-bold text-red-300">{dia.tasa_ocupacion}% ({dia.ocupadas} habs)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROYECCIONES OPERATIVAS: CHECK-OUTS Y CHECK-INS HOY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-outs pendientes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 tracking-tight">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Check-Outs Programados para Hoy ({checkouts_pendientes_hoy.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Habitaciones que deben liberarse o pasar a auditoría de estancia prolongada.
              </p>
            </div>
          </div>

          {checkouts_pendientes_hoy.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No hay salidas pendientes para la fecha de consulta.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {checkouts_pendientes_hoy.map((co) => (
                <div key={co.estadia_id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-display font-bold text-slate-900 mr-2">
                      Hab. {co.habitacion}
                    </span>
                    <span className="text-slate-600">{co.huesped}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({co.codigo_estadia})</span>
                  </div>
                  {co.vencido ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200/80">
                      Horario Vencido
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                      Pendiente
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-ins de hoy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ingresos Registrados Hoy ({checkins_hoy.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nuevas asignaciones y huéspedes recibidos en el front-desk hoy.
              </p>
            </div>
          </div>

          {checkins_hoy.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              Aún no se registran nuevos check-ins hoy.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {checkins_hoy.map((ci) => (
                <div key={ci.estadia_id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-display font-bold text-slate-900 mr-2">
                      Hab. {ci.habitacion}
                    </span>
                    <span className="text-slate-600">{ci.huesped}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{ci.hora}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
