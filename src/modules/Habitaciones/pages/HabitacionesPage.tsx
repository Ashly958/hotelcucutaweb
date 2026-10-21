import { useAppSelector } from '@/store/hooks';
import { selectUsuario } from '@/store/selectors/authSelectors';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { RecepcionWorkspace } from '../components/RecepcionWorkspace';
import { LimpiezaWorkspace } from '../components/LimpiezaWorkspace';
import { MantenimientoWorkspace } from '../components/MantenimientoWorkspace';
import { CrearHabitacionModal } from '../components/CrearHabitacionModal';
import { CheckInModal } from '@/modules/Estadias/components/CheckInModal';
import { estadiasService } from '@/modules/Estadias/services/estadiasService';
import type { DatosInicialesCheckIn } from '@/modules/Estadias/types/estadia.types';
import { useState } from 'react';
import { Loading, ErrorState } from '@/components';
import { Sparkles, LayoutGrid } from 'lucide-react';

export function HabitacionesPage() {
  const usuario = useAppSelector(selectUsuario);

  const [modalCheckInAbierto, setModalCheckInAbierto] = useState(false);
  const [habitacionIdParaCheckIn, setHabitacionIdParaCheckIn] = useState<number | undefined>();
  const [datosCheckInReserva, setDatosCheckInReserva] = useState<DatosInicialesCheckIn | null>(null);
  const [habitacionAEditar, setHabitacionAEditar] = useState<any>(null);
  const [vistaOperativa, setVistaOperativa] = useState<'recepcion' | 'limpieza'>('recepcion');

  const handleAbrirCheckInAvanzado = (habitacionId: number, datosIniciales?: DatosInicialesCheckIn) => {
    setHabitacionIdParaCheckIn(habitacionId);
    setDatosCheckInReserva(datosIniciales || null);
    setModalCheckInAbierto(true);
  };

  const handleSubmitCheckInAvanzado = async (datos: any) => {
    try {
      await estadiasService.registrarCheckIn(datos);
      setDatosCheckInReserva(null);
      recargar(); // Recarga el rack de habitaciones
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

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
    filtroClima,
    setFiltroClima,
    busqueda,
    setBusqueda,
    habitacionSeleccionada,
    setHabitacionSeleccionada,
    modalCrearHabitacionAbierto,
    setModalCrearHabitacionAbierto,
    cambiarEstado,
    crearHabitacion,
    editarHabitacion,
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
    return <LimpiezaWorkspace />;
  }

  if (usuario?.rol === 'MANTENIMIENTO') {
    return <MantenimientoWorkspace />;
  }

  // Recepción & Administrador General (Permite conmutar con Dashboard Móvil de Limpieza)
  return (
    <>
      <div className="flex items-center justify-between mb-4 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVistaOperativa('recepcion')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              vistaOperativa === 'recepcion'
                ? 'bg-slate-900 text-white shadow-soft-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Rack de Recepción</span>
          </button>
          <button
            type="button"
            onClick={() => setVistaOperativa('limpieza')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              vistaOperativa === 'limpieza'
                ? 'bg-amber-600 text-white shadow-soft-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Servicios Generales & Aseo</span>
            {metricas.limpieza > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
                {metricas.limpieza}
              </span>
            )}
          </button>
        </div>
      </div>

      {vistaOperativa === 'limpieza' ? (
        <LimpiezaWorkspace />
      ) : (
      <RecepcionWorkspace
        habitaciones={habitaciones}
        todasLasHabitaciones={todasLasHabitaciones}
        metricas={metricas}
        filtroPiso={filtroPiso}
        setFiltroPiso={setFiltroPiso}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroClima={filtroClima}
        setFiltroClima={setFiltroClima}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        habitacionSeleccionada={habitacionSeleccionada}
        setHabitacionSeleccionada={setHabitacionSeleccionada}
        cambiarEstado={cambiarEstado}
        onAbrirCheckInAvanzado={handleAbrirCheckInAvanzado}
        realizarCheckOut={realizarCheckOut}
        onCrearHabitacion={() => {
          setHabitacionAEditar(null);
          setModalCrearHabitacionAbierto(true);
        }}
        onEditarHabitacion={(hab) => {
          setHabitacionAEditar(hab);
          setModalCrearHabitacionAbierto(true);
        }}
      />
      )}

      <CrearHabitacionModal
        isOpen={modalCrearHabitacionAbierto}
        onClose={() => setModalCrearHabitacionAbierto(false)}
        habitacion={habitacionAEditar}
        onSubmit={async (datos) => {
          if (habitacionAEditar) {
            return await editarHabitacion(habitacionAEditar.id, datos);
          }
          return await crearHabitacion(datos);
        }}
      />

      <CheckInModal
        isOpen={modalCheckInAbierto}
        onClose={() => {
          setModalCheckInAbierto(false);
          setDatosCheckInReserva(null);
        }}
        onSubmit={handleSubmitCheckInAvanzado}
        initialHabitacionId={habitacionIdParaCheckIn}
        initialData={datosCheckInReserva}
      />
    </>
  );
}

