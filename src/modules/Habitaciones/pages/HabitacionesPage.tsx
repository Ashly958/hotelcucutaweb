import { useAppSelector } from '@/store/hooks';
import { selectUsuario } from '@/store/selectors/authSelectors';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { RecepcionWorkspace } from '../components/RecepcionWorkspace';
import { LavanderiaWorkspace } from '../components/LavanderiaWorkspace';
import { MantenimientoWorkspace } from '../components/MantenimientoWorkspace';
import { CrearHabitacionModal } from '../components/CrearHabitacionModal';
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
    modalCrearHabitacionAbierto,
    setModalCrearHabitacionAbierto,
    cambiarEstado,
    crearHabitacion,
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

  if (usuario?.rol === 'LAVANDERIA') {
    return <LavanderiaWorkspace />;
  }

  if (usuario?.rol === 'MANTENIMIENTO') {
    return <MantenimientoWorkspace />;
  }

  // Recepción & Administrador General (Control completo del Rack de Habitaciones)
  return (
    <>
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
        onCrearHabitacion={() => setModalCrearHabitacionAbierto(true)}
      />

      <CrearHabitacionModal
        isOpen={modalCrearHabitacionAbierto}
        onClose={() => setModalCrearHabitacionAbierto(false)}
        onSubmit={crearHabitacion}
      />
    </>
  );
}

