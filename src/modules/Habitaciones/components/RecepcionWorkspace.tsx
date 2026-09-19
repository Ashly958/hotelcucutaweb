import type { Habitacion, EstadoHabitacion, CheckInDTO } from '../types/habitacion.types';
import { HabitacionCard } from './HabitacionCard';
import { HabitacionDetalleModal } from './HabitacionDetalleModal';
import {
  IconoRecepcion,
  IconoEfectivo,
  IconoCamaHotel,
} from '@/components';
import { Search, RotateCcw } from 'lucide-react';

interface RecepcionWorkspaceProps {
  habitaciones: Habitacion[];
  todasLasHabitaciones: Habitacion[];
  metricas: {
    total: number;
    disponibles: number;
    ocupadas: number;
    limpieza: number;
    mantenimiento: number;
    porcentaje: number;
  };
  filtroPiso: number | 'todos';
  setFiltroPiso: (piso: number | 'todos') => void;
  filtroEstado: EstadoHabitacion | 'todos';
  setFiltroEstado: (estado: EstadoHabitacion | 'todos') => void;
  busqueda: string;
  setBusqueda: (q: string) => void;
  habitacionSeleccionada: Habitacion | null;
  setHabitacionSeleccionada: (h: Habitacion | null) => void;
  cambiarEstado: (id: string, nuevoEstado: EstadoHabitacion) => Promise<void>;
  realizarCheckIn: (datos: CheckInDTO) => Promise<boolean>;
  realizarCheckOut: (id: string) => Promise<boolean>;
  onCrearHabitacion?: () => void;
}

export function RecepcionWorkspace({
  habitaciones,
  todasLasHabitaciones,
  metricas,
  filtroPiso,
  setFiltroPiso,
  filtroEstado,
  setFiltroEstado,
  busqueda,
  setBusqueda,
  habitacionSeleccionada,
  setHabitacionSeleccionada,
  cambiarEstado,
  realizarCheckIn,
  realizarCheckOut,
  onCrearHabitacion,
}: RecepcionWorkspaceProps) {
  const pisos = [
    { label: 'Todos los pisos', valor: 'todos' as const, conteo: metricas.total },
    { label: 'Piso 1', valor: 1, conteo: todasLasHabitaciones.filter((h) => h.piso === 1).length },
    { label: 'Piso 2', valor: 2, conteo: todasLasHabitaciones.filter((h) => h.piso === 2).length },
    { label: 'Piso 3', valor: 3, conteo: todasLasHabitaciones.filter((h) => h.piso === 3).length },
    { label: 'Piso 4', valor: 4, conteo: todasLasHabitaciones.filter((h) => h.piso === 4).length },
  ];

  const estados = [
    { label: 'Todas', valor: 'todos' as const, conteo: metricas.total },
    { label: 'Disponibles', valor: 'disponible' as const, conteo: metricas.disponibles },
    { label: 'Ocupadas', valor: 'ocupada' as const, conteo: metricas.ocupadas },
    { label: 'En Limpieza', valor: 'limpieza' as const, conteo: metricas.limpieza },
    { label: 'Mantenimiento', valor: 'mantenimiento' as const, conteo: metricas.mantenimiento },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principales Relajadas y Modernas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ocupación */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-soft-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Ocupación General
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-slate-900">
                {metricas.porcentaje}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {metricas.ocupadas} / {metricas.total} habs
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-soft-xs">
            <IconoCamaHotel size={20} />
          </div>
        </div>

        {/* Disponibles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-soft-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Disponibles
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-emerald-700">
                {metricas.disponibles}
              </span>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Listas
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-soft-xs">
            <IconoRecepcion size={20} />
          </div>
        </div>

        {/* Limpieza / Mantenimiento */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-soft-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Aseo & Servicio
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-amber-700">
                {metricas.limpieza + metricas.mantenimiento}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {metricas.limpieza} aseo · {metricas.mantenimiento} mant
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-soft-xs">
            <RotateCcw size={20} />
          </div>
        </div>

        {/* Efectivo en Caja RN-010 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-soft hover:shadow-soft-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Caja Efectivo (RN-010)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-slate-900">
                ${(1420000).toLocaleString('es-CO')}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/60 flex items-center justify-center text-red-700 shadow-soft-xs">
            <IconoEfectivo size={20} />
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Pisos y Búsqueda */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-soft space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Pestañas de Pisos (Segmented Control Suave) */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {pisos.map((p) => {
              const estaActivo = filtroPiso === p.valor;
              return (
                <button
                  key={p.label}
                  onClick={() => setFiltroPiso(p.valor)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    estaActivo
                      ? 'bg-white text-slate-900 font-semibold shadow-soft-xs border border-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {p.label} <span className="text-slate-400 text-[10px] ml-1">({p.conteo})</span>
                </button>
              );
            })}
          </div>

          {/* Campo de Búsqueda y Botón Nueva Habitación */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por hab. o huésped..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/15 focus:border-red-500 transition-all"
              />
            </div>

            {onCrearHabitacion && (
              <button
                type="button"
                onClick={onCrearHabitacion}
                className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-soft-xs hover:shadow-soft"
              >
                + Habitación
              </button>
            )}
          </div>
        </div>

        {/* Píldoras de Estados Relajadas */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium mr-1.5 hidden sm:inline">
            Filtrar estado:
          </span>
          {estados.map((e) => {
            const activo = filtroEstado === e.valor;
            return (
              <button
                key={e.label}
                onClick={() => setFiltroEstado(e.valor)}
                className={`px-3 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                  activo
                    ? 'bg-slate-900 text-white font-semibold shadow-soft-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50'
                }`}
              >
                {e.label} <span className="text-[10px] opacity-70 ml-0.5">({e.conteo})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de 45 Habitaciones */}
      {habitaciones.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/70 space-y-2">
          <p className="text-sm font-medium text-slate-700">
            No se encontraron habitaciones con los criterios aplicados.
          </p>
          <p className="text-xs text-slate-400">
            Pruebe seleccionando "Todos los pisos" o limpie el término de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {habitaciones.map((habitacion) => (
            <HabitacionCard
              key={habitacion.id}
              habitacion={habitacion}
              onSeleccionar={setHabitacionSeleccionada}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalle / Check-In / Check-Out */}
      {habitacionSeleccionada && (
        <HabitacionDetalleModal
          habitacion={habitacionSeleccionada}
          onClose={() => setHabitacionSeleccionada(null)}
          onCambiarEstado={cambiarEstado}
          onCheckIn={realizarCheckIn}
          onCheckOut={realizarCheckOut}
        />
      )}
    </div>
  );
}
