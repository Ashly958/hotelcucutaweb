import { useAppSelector } from '@/store/hooks';
import { selectUsuario } from '@/store/selectors/authSelectors';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { RecepcionWorkspace } from '../components/RecepcionWorkspace';
import { AdminWorkspace } from '../components/AdminWorkspace';
import { LavanderiaWorkspace } from '../components/LavanderiaWorkspace';
import { MantenimientoWorkspace } from '../components/MantenimientoWorkspace';
import { Loading, ErrorState } from '@/components';


export function HabitacionesPage() {
  const usuario = useAppSelector(selectUsuario);

  const {
    habitaciones,
    todasLasHabitaciones,
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
    recargar,
  } = useHabitaciones();

  if (cargando) {
    return <Loading mensaje="Cargando sistema de gestión hotelera..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  // CADA ROL TIENE SU ESPACIO DE TRABAJO 100% INDEPENDIENTE (Sin posibilidad de moverse entre roles)
  if (usuario?.rol === 'ADMIN') {
    return <AdminWorkspace metricas={metricas} />;
  }

  if (usuario?.rol === 'LAVANDERIA') {
    return <LavanderiaWorkspace />;
  }

  if (usuario?.rol === 'MANTENIMIENTO') {
    return <MantenimientoWorkspace />;
  }

  // Por defecto: Recepción & Front Desk
  return (
    <RecepcionWorkspace
      habitaciones={habitaciones}
      todasLasHabitaciones={todasLasHabitaciones}
      metricas={metricas}
      filtroPiso={filtroPiso}
      setFiltroPiso={setFiltroPiso}
      filtroEstado={filtroEstado}
      setFiltroEstado={setFiltroEstado}
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      habitacionSeleccionada={habitacionSeleccionada}
      setHabitacionSeleccionada={setHabitacionSeleccionada}
      cambiarEstado={cambiarEstado}
      realizarCheckIn={realizarCheckIn}
      realizarCheckOut={realizarCheckOut}
    />
  );
}
