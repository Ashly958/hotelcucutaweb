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
      {/* Métricas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Ocupación Actual
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-slate-900">
                {metricas.porcentaje}%
              </span>
              <span className="text-xs text-slate-400">
                ({metricas.ocupadas} de {metricas.total})
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <IconoCamaHotel size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Habitaciones Libres
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-emerald-600">
                {metricas.disponibles}
              </span>
              <span className="text-xs text-slate-400">Listas para check-in</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <IconoRecepcion size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              En Limpieza / Bloqueo
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-amber-600">
                {metricas.limpieza + metricas.mantenimiento}
              </span>
              <span className="text-xs text-slate-400">Aseo: {metricas.limpieza} · Mant: {metricas.mantenimiento}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
            <RotateCcw size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Caja Efectivo de Turno
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-slate-900">
                ${(1420000).toLocaleString('es-CO')}
              </span>
              <span className="text-xs text-slate-400">RN-010</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700">
            <IconoEfectivo size={18} />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Pestañas de Pisos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {pisos.map((p) => {
              const estaActivo = filtroPiso === p.valor;
              return (
                <button
                  key={p.label}
                  onClick={() => setFiltroPiso(p.valor)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    estaActivo
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.label} ({p.conteo})
                </button>
              );
            })}
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar hab. o huésped..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        {/* Píldoras de Estados */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
            Estado:
          </span>
          {estados.map((e) => {
            const activo = filtroEstado === e.valor;
            return (
              <button
                key={e.label}
                onClick={() => setFiltroEstado(e.valor)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap ${
                  activo
                    ? 'bg-red-600 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {e.label} ({e.conteo})
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
