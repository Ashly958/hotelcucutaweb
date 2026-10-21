import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  LogIn,
  Plus,
} from 'lucide-react';
import type { RackData, RackHabitacion, RackReservaItem } from '../types/reserva.types';

interface RackCalendarioProps {
  rackData: RackData | null;
  fechaBase: Date;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onIrAHoy: () => void;
  onCrearEnCelda: (habitacionId: number, fecha: string) => void;
  onCheckInReserva: (reserva: RackReservaItem) => void;
}

export const RackCalendario: React.FC<RackCalendarioProps> = ({
  rackData,
  fechaBase,
  onMesAnterior,
  onMesSiguiente,
  onIrAHoy,
  onCrearEnCelda,
  onCheckInReserva,
}) => {
  if (!rackData) return null;

  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const totalDias = new Date(año, mes + 1, 0).getDate();
  const nombreMes = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(fechaBase);

  const hoyStr = new Date().toISOString().slice(0, 10);

  // Lista de días del mes
  const dias = Array.from({ length: totalDias }, (_, i) => {
    const diaNum = i + 1;
    const fechaObj = new Date(año, mes, diaNum);
    const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
    const diaSemana = new Intl.DateTimeFormat('es-CO', { weekday: 'narrow' }).format(fechaObj);
    const esFinDeSemana = fechaObj.getDay() === 0 || fechaObj.getDay() === 6;
    const esHoy = fechaStr === hoyStr;
    const esPasado = fechaStr < hoyStr;

    return { diaNum, fechaStr, diaSemana, esFinDeSemana, esHoy, esPasado };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Barra de control superior */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
            <button
              onClick={onMesAnterior}
              className="p-2 hover:bg-slate-100 text-slate-600 transition"
              title="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-1.5 font-bold text-slate-800 capitalize select-none text-sm">
              {nombreMes}
            </span>
            <button
              onClick={onMesSiguiente}
              className="p-2 hover:bg-slate-100 text-slate-600 transition"
              title="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onIrAHoy}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Hoy
          </button>
        </div>

        {/* Leyenda de colores */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Confirmada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-slate-600">Estadía Activa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="text-slate-600">Disponible</span>
          </div>
        </div>
      </div>

      {/* Grid del Rack con Scroll horizontal fluido */}
      <div className="overflow-x-auto max-h-[75vh]">
        <table className="w-full border-collapse select-none text-xs">
          <thead>
            <tr className="bg-slate-100 sticky top-0 z-20 shadow-xs border-b border-slate-300">
              <th className="p-2.5 text-left font-bold text-slate-700 bg-slate-100 sticky left-0 z-30 min-w-[130px] border-r border-slate-300">
                Habitación
              </th>
              {dias.map((d) => (
                <th
                  key={d.fechaStr}
                  className={`p-1.5 text-center min-w-[38px] border-r border-slate-200 ${
                    d.esHoy
                      ? 'bg-amber-100 text-amber-900 font-extrabold'
                      : d.esFinDeSemana
                      ? 'bg-slate-200/60 text-slate-700'
                      : 'text-slate-600'
                  }`}
                >
                  <div className="text-[10px] uppercase">{d.diaSemana}</div>
                  <div className="text-xs">{d.diaNum}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rackData.pisos.map((piso) => {
              const habsDelPiso = rackData.habitaciones.filter((h) => h.piso_id === piso.id);
              if (habsDelPiso.length === 0) return null;

              return (
                <React.Fragment key={piso.id}>
                  {/* Fila separadora de Piso */}
                  <tr className="bg-slate-200/80">
                    <td
                      colSpan={totalDias + 1}
                      className="px-3 py-1 font-bold text-[11px] text-slate-700 tracking-wider uppercase sticky left-0 z-10"
                    >
                      {piso.nombre || `Piso ${piso.numero_piso}`}
                    </td>
                  </tr>

                  {habsDelPiso.map((hab: RackHabitacion) => (
                    <tr key={hab.id} className="hover:bg-slate-50/70 border-b border-slate-200">
                      {/* Columna fija: Habitación */}
                      <td className="p-2 bg-white sticky left-0 z-10 border-r border-slate-300 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Hab {hab.numero}</span>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Cap: {hab.capacidad_maxima}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            ${(hab.precio_noche_base / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </td>

                      {/* Celdas de días */}
                      {dias.map((d) => {
                        // Buscar si hay reserva que cubra este día
                        const reservaEnDia = rackData.reservas.find(
                          (r) =>
                            r.habitacion_id === hab.id &&
                            d.fechaStr >= r.fecha_llegada &&
                            d.fechaStr < r.fecha_salida
                        );

                        // Buscar si hay estadía activa en este día
                        const estadiaEnDia = rackData.estadias.find(
                          (e) =>
                            e.habitacion_id === hab.id &&
                            d.fechaStr >= e.fecha_checkin &&
                            (!e.fecha_prevista_checkout || d.fechaStr < e.fecha_prevista_checkout)
                        );

                        return (
                          <td
                            key={d.fechaStr}
                            className={`p-0.5 text-center border-r border-slate-200 relative group transition-colors ${
                              d.esHoy ? 'bg-amber-50/30' : d.esFinDeSemana ? 'bg-slate-50/40' : ''
                            }`}
                          >
                            {estadiaEnDia ? (
                              <div
                                title={`Estadía Activa: ${estadiaEnDia.huesped_nombre} (${estadiaEnDia.codigo_estadia})`}
                                className="w-full h-8 bg-blue-600 text-white rounded text-[10px] font-semibold flex items-center justify-center px-1 shadow-xs truncate cursor-pointer hover:bg-blue-700"
                              >
                                {d.fechaStr === estadiaEnDia.fecha_checkin ? (
                                  <span className="truncate flex items-center gap-0.5">
                                    <LogIn className="w-2.5 h-2.5 shrink-0" />
                                    {estadiaEnDia.huesped_nombre.split(' ')[0]}
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></span>
                                )}
                              </div>
                            ) : reservaEnDia ? (
                              <div
                                onClick={() => onCheckInReserva(reservaEnDia)}
                                title={`Reserva ${reservaEnDia.codigo_reserva}: ${reservaEnDia.huesped_nombre} | Clic para Check-In`}
                                className={`w-full h-8 rounded text-[10px] font-semibold flex items-center justify-center px-1 shadow-xs truncate cursor-pointer transition ${
                                  reservaEnDia.estado === 'confirmada'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                }`}
                              >
                                {d.fechaStr === reservaEnDia.fecha_llegada ? (
                                  <span className="truncate flex items-center gap-0.5">
                                    {reservaEnDia.estado === 'confirmada' ? (
                                      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                                    ) : (
                                      <Clock className="w-2.5 h-2.5 shrink-0" />
                                    )}
                                    {reservaEnDia.huesped_nombre.split(' ')[0]}
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60"></span>
                                )}
                              </div>
                            ) : (
                              // Celda vacía: permitir crear solo si es hoy o fecha futura
                              d.esPasado ? (
                                <div
                                  className="w-full h-8 rounded bg-slate-100/60 cursor-not-allowed"
                                  title="Fecha pasada (no disponible para reservas)"
                                />
                              ) : (
                                <button
                                  onClick={() => onCrearEnCelda(hab.id, d.fechaStr)}
                                  className="w-full h-8 rounded opacity-0 group-hover:opacity-100 hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition border border-dashed border-emerald-300"
                                  title={`Reservar Hab ${hab.numero} para ${d.fechaStr}`}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
