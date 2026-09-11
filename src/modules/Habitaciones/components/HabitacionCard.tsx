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
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      actionText: 'Check-In',
      actionBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    ocupada: {
      label: 'Ocupada',
      dot: 'bg-slate-400',
      badge: 'bg-slate-50 text-slate-700 border-slate-200',
      actionText: 'Ver Detalle',
      actionBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    limpieza: {
      label: 'En Limpieza',
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      actionText: 'Habilitar',
      actionBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    mantenimiento: {
      label: 'Mantenimiento',
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      actionText: 'Revisión',
      actionBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
  }[estado];

  return (
    <div
      onClick={() => onSeleccionar(habitacion)}
      className="group relative bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-serif text-slate-900 group-hover:text-red-600 transition-colors">
              {numero}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Piso {piso}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${estadoConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${estadoConfig.dot}`} />
            <span>{estadoConfig.label}</span>
          </div>
        </div>

        {/* Tipo y Climatización */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-600">
            <IconoCamaHotel size={13} className="text-slate-400" />
            {tipo}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1">
            {tieneAire ? (
              <>
                <IconoAireAcondicionado size={13} className="text-sky-500" />
                <span>A/C</span>
              </>
            ) : (
              <>
                <IconoVentilador size={13} className="text-amber-500" />
                <span>Ventilador</span>
              </>
            )}
          </span>
        </div>

        {/* Información de Ocupación o Tarifa */}
        {estado === 'ocupada' && huesped ? (
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs mb-3 space-y-0.5">
            <p className="font-medium text-slate-800 truncate">{huesped.nombre}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{huesped.noches} noche(s)</span>
              <span className={huesped.saldoPendiente > 0 ? 'text-amber-600 font-medium' : 'text-emerald-600'}>
                {huesped.saldoPendiente > 0 ? 'Saldo pendiente' : 'Al día'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xs font-semibold text-slate-800">
              ${precioNoche.toLocaleString('es-CO')}
            </span>
            <span className="text-[10px] text-slate-400"> / noche</span>
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      <button
        type="button"
        className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all ${estadoConfig.actionBtn}`}
      >
        {estadoConfig.actionText}
      </button>
    </div>
  );
}
