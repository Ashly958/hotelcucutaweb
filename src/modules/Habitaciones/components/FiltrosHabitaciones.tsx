import { Search } from 'lucide-react';
import type { EstadoHabitacion } from '../types/habitacion.types';

interface FiltrosHabitacionesProps {
  filtroPiso: number | 'todos';
  onSeleccionarPiso: (piso: number | 'todos') => void;
  filtroEstado: EstadoHabitacion | 'todos';
  onSeleccionarEstado: (estado: EstadoHabitacion | 'todos') => void;
  busqueda: string;
  onCambiarBusqueda: (query: string) => void;
  metricas: {
    total: number;
    disponibles: number;
    ocupadas: number;
    limpieza: number;
    mantenimiento: number;
  };
}

export function FiltrosHabitaciones({
  filtroPiso,
  onSeleccionarPiso,
  filtroEstado,
  onSeleccionarEstado,
  busqueda,
  onCambiarBusqueda,
  metricas,
}: FiltrosHabitacionesProps) {
  const pisos = [
    { id: 'todos', label: 'Todos los Pisos', count: 45 },
    { id: 1, label: 'Piso 1', count: 21 },
    { id: 2, label: 'Piso 2', count: 8 },
    { id: 3, label: 'Piso 3', count: 8 },
    { id: 4, label: 'Piso 4', count: 8 },
  ];

  const estados: Array<{ id: EstadoHabitacion | 'todos'; label: string; count: number; color: string }> = [
    { id: 'todos', label: 'Todas', count: metricas.total, color: 'border-neutral-300' },
    { id: 'disponible', label: 'Disponibles', count: metricas.disponibles, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'ocupada', label: 'Ocupadas', count: metricas.ocupadas, color: 'text-brand-red bg-red-50 border-red-200' },
    { id: 'limpieza', label: 'En Limpieza', count: metricas.limpieza, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { id: 'mantenimiento', label: 'Mantenimiento', count: metricas.mantenimiento, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="space-y-4">
      {/* Selector de Pisos */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {pisos.map((piso) => {
            const activo = filtroPiso === piso.id;
            return (
              <button
                key={piso.id}
                onClick={() => onSeleccionarPiso(piso.id as number | 'todos')}
                className={`
                  px-3 py-1.5 rounded-xl font-medium transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap
                  ${
                    activo
                      ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }
                `}
              >
                <span>{piso.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activo ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-500'}`}>
                  {piso.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Búsqueda Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar hab. (ej. 14) o huésped..."
            value={busqueda}
            onChange={(e) => onCambiarBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-red text-neutral-800"
          />
        </div>
      </div>

      {/* Selector de Estados */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {estados.map((item) => {
          const activo = filtroEstado === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSeleccionarEstado(item.id)}
              className={`
                px-3 py-1 rounded-lg transition-all duration-150 flex items-center gap-1.5 font-medium border
                ${
                  activo
                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }
              `}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activo ? 'bg-red-800 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
