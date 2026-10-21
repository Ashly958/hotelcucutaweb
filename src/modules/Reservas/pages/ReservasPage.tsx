import React from 'react';
import {
  CalendarDays,
  Plus,
  Table as TableIcon,
  LayoutGrid,
  TrendingUp,
  Clock,
  BedDouble,
} from 'lucide-react';
import { useReservas } from '../hooks/useReservas';
import { RackCalendario } from '../components/RackCalendario';
import { ReservasTabla } from '../components/ReservasTabla';
import { ModalCrearReserva } from '../components/ModalCrearReserva';
import { ModalCheckInReserva } from '../components/ModalCheckInReserva';

export const ReservasPage: React.FC = () => {
  const {
    vista,
    setVista,
    cargando,
    error,
    fechaBase,
    mesAnterior,
    mesSiguiente,
    irAHoy,
    rackData,
    reservas,
    filtros,
    setFiltros,
    modalCrearAbierto,
    setModalCrearAbierto,
    modalCheckInAbierto,
    setModalCheckInAbierto,
    reservaParaCheckIn,
    habitacionPreseleccionada,
    abrirModalCrearConCelda,
    abrirModalCheckIn,
    crearReserva,
    cancelarReserva,
    convertirACheckIn,
  } = useReservas();

  // Métricas rápidas
  const totalActivas = rackData?.reservas.filter((r) => r.estado !== 'cancelada').length ?? reservas.length;
  const hoyStr = new Date().toISOString().slice(0, 10);
  const llegadasHoy = rackData?.reservas.filter((r) => r.fecha_llegada === hoyStr).length ?? 0;
  const totalHabitaciones = rackData?.habitaciones.length ?? 0;

  return (
    <>
      <div className="space-y-6"> 
        {/* Encabezado Principal */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CalendarDays className="w-7 h-7 text-amber-500" />
              Reservas & Rack Interactivo
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Control de reservas previas, ocupación por habitaciones y Check-In ágil.
            </p>
          </div>

        <div className="flex items-center gap-3">
          {/* Toggle de vistas */}
          <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setVista('rack')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                vista === 'rack'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Rack Calendario
            </button>
            <button
              onClick={() => setVista('tabla')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                vista === 'tabla'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Listado
            </button>
          </div>

          <button
            onClick={() => setModalCrearAbierto(true)}
            className="px-4 py-2 text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Reservas en Período</div>
            <div className="text-xl font-black text-slate-900">{totalActivas}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Llegadas Esperadas Hoy</div>
            <div className="text-xl font-black text-slate-900">{llegadasHoy}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Habitaciones en Rack</div>
            <div className="text-xl font-black text-slate-900">{totalHabitaciones}</div>
          </div>
        </div>
      </div>

      {/* Contenido Visual */}
      {cargando ? (
        <div className="p-16 text-center bg-white rounded-xl border border-slate-200 shadow-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-600">Cargando rack interactivo y reservas...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-200 text-rose-700">
          <p className="font-bold">Error al cargar datos</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      ) : vista === 'rack' ? (
        <RackCalendario
          rackData={rackData}
          fechaBase={fechaBase}
          onMesAnterior={mesAnterior}
          onMesSiguiente={mesSiguiente}
          onIrAHoy={irAHoy}
          onCrearEnCelda={abrirModalCrearConCelda}
          onCheckInReserva={(item) => {
            abrirModalCheckIn({
              id: item.id,
              codigo_reserva: item.codigo_reserva,
              habitacion_id: item.habitacion_id,
              nombres: item.huesped_nombre.split(' ')[0] || '',
              apellidos: item.huesped_nombre.split(' ').slice(1).join(' ') || '',
              nombre_completo: item.huesped_nombre,
              tipo_documento: 'CC',
              numero_documento: '',
              fecha_llegada: item.fecha_llegada,
              fecha_salida: item.fecha_salida,
              adultos: 1,
              ninos: 0,
              valor_noche: item.total_estimado / Math.max(1, item.noches),
              noches: item.noches,
              total_estimado: item.total_estimado,
              abono_anticipo: item.abono_anticipo,
              saldo_pendiente: item.saldo_pendiente,
              estado: item.estado,
              origen: item.origen,
            });
          }}
        />
      ) : (
        <ReservasTabla
          reservas={reservas}
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onCheckIn={abrirModalCheckIn}
          onCancelar={cancelarReserva}
        />
      )}
      </div>

      {/* Modales */}
      <ModalCrearReserva
        abierto={modalCrearAbierto}
        onCerrar={() => setModalCrearAbierto(false)}
        onSubmit={crearReserva}
        habitaciones={rackData?.habitaciones || []}
        preseleccion={habitacionPreseleccionada}
      />

      <ModalCheckInReserva
        abierto={modalCheckInAbierto}
        reserva={reservaParaCheckIn}
        onCerrar={() => setModalCheckInAbierto(false)}
        onConfirmar={convertirACheckIn}
      />
    </>
  );
};
