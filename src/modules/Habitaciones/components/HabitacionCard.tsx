import type { Habitacion } from '../types/habitacion.types';
import {
  IconoCamaHotel,
  IconoAireAcondicionado,
  IconoVentilador,
} from '@/components';

interface HabitacionCardProps {
  habitacion: Habitacion;
  onSeleccionar: (habitacion: Habitacion) => void;
}

export function HabitacionCard({ habitacion, onSeleccionar }: HabitacionCardProps) {
  const { numero, piso, tipo, estado, tieneAire, precioNoche, huesped } = habitacion;

  const estadoConfig = {
    disponible: {
      label: 'Disponible',
      dot: 'bg-emerald-500 ring-2 ring-emerald-200',
      badge: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/70',
      actionText: 'Check-In',
      actionBtn: 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 shadow-soft-xs',
    },
    ocupada: {
      label: 'Ocupada',
      dot: 'bg-slate-500 ring-2 ring-slate-200',
      badge: 'bg-slate-100/90 text-slate-700 border-slate-200/70',
      actionText: 'Ver Folio & Cargos',
      actionBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70 shadow-soft-xs',
    },
    limpieza: {
      label: 'En Limpieza',
      dot: 'bg-amber-500 ring-2 ring-amber-200',
      badge: 'bg-amber-50/90 text-amber-700 border-amber-200/70',
      actionText: 'Habilitar Habitación',
      actionBtn: 'bg-amber-50/80 hover:bg-amber-100 text-amber-700 border border-amber-200/70 shadow-soft-xs',
    },
    mantenimiento: {
      label: 'Mantenimiento',
      dot: 'bg-rose-500 ring-2 ring-rose-200',
      badge: 'bg-rose-50/90 text-rose-700 border-rose-200/70',
      actionText: 'Reporte Técnico',
      actionBtn: 'bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200/70 shadow-soft-xs',
    },
  }[estado];

  return (
    <div
      onClick={() => onSeleccionar(habitacion)}
      className="group relative bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/60 shadow-soft hover:shadow-soft-md hover:border-slate-300/80 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-display tracking-tight text-slate-900 group-hover:text-red-700 transition-colors">
              {numero}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Piso {piso}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${estadoConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${estadoConfig.dot}`} />
            <span>{estadoConfig.label}</span>
          </div>
        </div>

        {/* Tipo y Climatización */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3.5">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <IconoCamaHotel size={13} className="text-slate-400" />
            {tipo}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1">
            {tieneAire ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/50 text-[10px] font-medium">
                <IconoAireAcondicionado size={11} />
                A/C
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-medium">
                <IconoVentilador size={11} />
                Ventilador
              </span>
            )}
          </span>
        </div>

        {/* Información de Ocupación o Tarifa */}
        {estado === 'ocupada' && huesped ? (
          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-100 text-xs mb-3.5 space-y-1">
            <p className="font-semibold text-slate-800 truncate">{huesped.nombre}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{huesped.noches} noche(s)</span>
              <span className={huesped.saldoPendiente > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                {huesped.saldoPendiente > 0 ? 'Saldo pendiente' : 'Al día'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3.5">
            <span className="text-base font-bold font-display text-slate-900">
              ${precioNoche.toLocaleString('es-CO')}
            </span>
            <span className="text-[11px] text-slate-400"> / noche</span>
          </div>
        )}
      </div>

      {/* Botón de Acción Suave */}
      <button
        type="button"
        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${estadoConfig.actionBtn}`}
      >
        {estadoConfig.actionText}
      </button>
    </div>
  );
}
