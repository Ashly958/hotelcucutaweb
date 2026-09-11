import { useState, useEffect, useMemo } from 'react';
import { habitacionesService } from '../services/habitacionesService';
import type { Habitacion, EstadoHabitacion, CheckInDTO } from '../types/habitacion.types';

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros interactivos
  const [filtroPiso, setFiltroPiso] = useState<number | 'todos'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<EstadoHabitacion | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modal de habitación seleccionada
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null);

  const cargarHabitaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await habitacionesService.obtenerTodas();
      setHabitaciones(data);
    } catch {
      setError('No fue posible cargar el mapa de habitaciones del hotel.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  // Métricas en tiempo real
  const metricas = useMemo(() => {
    const total = habitaciones.length;
    const disponibles = habitaciones.filter((h) => h.estado === 'disponible').length;
    const ocupadas = habitaciones.filter((h) => h.estado === 'ocupada').length;
    const limpieza = habitaciones.filter((h) => h.estado === 'limpieza').length;
    const mantenimiento = habitaciones.filter((h) => h.estado === 'mantenimiento').length;
    const porcentaje = total > 0 ? Math.round((ocupadas / total) * 100) : 0;

    return {
      total,
      disponibles,
      ocupadas,
      limpieza,
      mantenimiento,
      porcentaje,
    };
  }, [habitaciones]);

  // Habitaciones filtradas
  const habitacionesFiltradas = useMemo(() => {
    return habitaciones.filter((hab) => {
      if (filtroPiso !== 'todos' && hab.piso !== filtroPiso) return false;
      if (filtroEstado !== 'todos' && hab.estado !== filtroEstado) return false;

      if (busqueda.trim()) {
        const query = busqueda.trim().toLowerCase();
        const coincideNumero = hab.numero.toLowerCase().includes(query);
        const coincideHuesped = hab.huesped?.nombre.toLowerCase().includes(query) ?? false;
        const coincideDoc = hab.huesped?.documento.toLowerCase().includes(query) ?? false;
        return coincideNumero || coincideHuesped || coincideDoc;
      }

      return true;
    });
  }, [habitaciones, filtroPiso, filtroEstado, busqueda]);

  const cambiarEstado = async (habitacionId: string, nuevoEstado: EstadoHabitacion) => {
    try {
      const habActualizada = await habitacionesService.cambiarEstado(habitacionId, nuevoEstado);
      setHabitaciones((prev) => prev.map((h) => (h.id === habitacionId ? habActualizada : h)));
      if (habitacionSeleccionada?.id === habitacionId) {
        setHabitacionSeleccionada(habActualizada);
      }
    } catch {
      alert('Error al actualizar el estado de la habitación.');
    }
  };

  const realizarCheckIn = async (datos: CheckInDTO) => {
    try {
      const habActualizada = await habitacionesService.registrarCheckIn(datos);
      setHabitaciones((prev) => prev.map((h) => (h.id === datos.habitacionId ? habActualizada : h)));
      setHabitacionSeleccionada(null);
      return true;
    } catch {
      alert('Error al procesar el check-in.');
      return false;
    }
  };

  const realizarCheckOut = async (habitacionId: string) => {
    try {
      const habActualizada = await habitacionesService.registrarCheckOut(habitacionId);
      setHabitaciones((prev) => prev.map((h) => (h.id === habitacionId ? habActualizada : h)));
      setHabitacionSeleccionada(null);
      return true;
    } catch {
      alert('Error al procesar el check-out.');
      return false;
    }
  };

  return {
    habitaciones: habitacionesFiltradas,
    todasLasHabitaciones: habitaciones,
    cargando,
    error,
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
    recargar: cargarHabitaciones,
  };
}
