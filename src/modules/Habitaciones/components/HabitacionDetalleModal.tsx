import { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  LogOut,
  Clock,
  Wrench,
  Bookmark,
  Info,
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import type { Habitacion } from '../types/habitacion.types';
import { obtenerHistorialHabitacion, type EventoHistorialHabitacion } from '../services/habitacionesService';
import { reservasService } from '@/modules/Reservas/services/reservasService';
import type { DatosInicialesCheckIn } from '@/modules/Estadias/types/estadia.types';

interface HabitacionDetalleModalProps {
  habitacion: Habitacion | null;
  onClose: () => void;
  onCambiarEstado: (id: string, nuevoEstado: Habitacion['estado']) => Promise<void>;
  onAbrirCheckInAvanzado: (habitacionId: number, datosIniciales?: DatosInicialesCheckIn) => void;
  onCheckOut: (id: string) => Promise<boolean>;
}

export function HabitacionDetalleModal({
  habitacion,
  onClose,
  onCambiarEstado,
  onAbrirCheckInAvanzado,
  onCheckOut,
}: HabitacionDetalleModalProps) {
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState<'detalle' | 'historial'>('detalle');
  const [historial, setHistorial] = useState<EventoHistorialHabitacion[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [procesandoCheckInReserva, setProcesandoCheckInReserva] = useState<string | null>(null);

  useEffect(() => {
    if (habitacion && pestanaActiva === 'historial') {
      setCargandoHistorial(true);
      obtenerHistorialHabitacion(habitacion.id)
        .then((data) => setHistorial(data))
        .catch((err) => {
          console.error('Error al cargar historial de habitación:', err);
          setHistorial([]);
        })
        .finally(() => setCargandoHistorial(false));
    }
  }, [habitacion, pestanaActiva]);

  if (!habitacion) return null;

  const hoyDate = new Date();
  const fechaHoyStr = `${hoyDate.getFullYear()}-${String(hoyDate.getMonth() + 1).padStart(2, '0')}-${String(hoyDate.getDate()).padStart(2, '0')}`;

  const handleClicReserva = async (evento: EventoHistorialHabitacion) => {
    if (procesandoCheckInReserva) return;
    setProcesandoCheckInReserva(evento.titulo);

    try {
      const habitacionIdNum = parseInt(habitacion.id, 10);
      let reservaEncontrada: any = null;

      // Buscar si el evento ya contiene ID o buscar en el endpoint de reservas
      if (evento.reserva_id) {
        reservaEncontrada = evento;
      } else {
        // Consultar reservas de la habitación para emparejar por código o fecha
        const reservasHab = await reservasService.obtenerTodas({
          habitacion_id: habitacionIdNum,
        });

        // Intentar match por código de reserva en el título (ej: "Reserva RES-1234")
        const matchCodigo = evento.titulo.match(/RES-[A-Za-z0-9]+/i);
        const codigoBuscado = matchCodigo ? matchCodigo[0].toUpperCase() : null;

        reservaEncontrada = reservasHab.find((r) => {
          if (codigoBuscado && r.codigo_reserva.toUpperCase() === codigoBuscado) {
            return true;
          }
          return r.fecha_llegada === evento.fecha && (r.estado === 'confirmada' || r.estado === 'pendiente');
        });
      }

      // Cerrar modal de habitación y abrir Check-In precargado
      onClose();

      if (reservaEncontrada) {
        onAbrirCheckInAvanzado(habitacionIdNum, {
          reserva_id: reservaEncontrada.id || reservaEncontrada.reserva_id,
          reserva_codigo: reservaEncontrada.codigo_reserva || reservaEncontrada.codigoReserva,
          habitacion_id: habitacionIdNum,
          tipo_documento: reservaEncontrada.tipo_documento || reservaEncontrada.tipoDocumento || 'CC',
          numero_documento: reservaEncontrada.numero_documento || reservaEncontrada.numeroDocumento || '',
          nombres: reservaEncontrada.nombres || '',
          apellidos: reservaEncontrada.apellidos || '',
          telefono: reservaEncontrada.telefono || '',
          dias_estadia: reservaEncontrada.noches || 1,
          valor_habitacion: reservaEncontrada.valor_noche || habitacion.precioNoche,
          abono_inicial: reservaEncontrada.abono_anticipo || 0,
          anticipo_previo: reservaEncontrada.abono_anticipo || 0,
          observaciones: `Check-in de Reserva ${reservaEncontrada.codigo_reserva || reservaEncontrada.codigoReserva || ''}`,
        });
      } else {
        // Si no se encuentra el objeto completo de reserva, precargar con los datos del evento
        const matchCodigo = evento.titulo.match(/RES-[A-Za-z0-9]+/i);
        onAbrirCheckInAvanzado(habitacionIdNum, {
          reserva_codigo: matchCodigo ? matchCodigo[0] : evento.titulo,
          habitacion_id: habitacionIdNum,
          valor_habitacion: habitacion.precioNoche,
          observaciones: `Check-in de ${evento.titulo}`,
        });
      }
    } catch (err) {
      console.error('Error al preparar check-in desde reserva:', err);
      onClose();
      onAbrirCheckInAvanzado(parseInt(habitacion.id, 10));
    } finally {
      setProcesandoCheckInReserva(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay tipo Glassmorphism */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header con gradiente según estado */}
        <div className={`
          px-6 py-5 flex items-center justify-between border-b
          ${habitacion.estado === 'disponible' ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-50 border-emerald-100' : ''}
          ${habitacion.estado === 'ocupada' ? 'bg-gradient-to-r from-red-500/10 to-red-50 border-red-100' : ''}
          ${habitacion.estado === 'limpieza' ? 'bg-gradient-to-r from-amber-500/10 to-amber-50 border-amber-100' : ''}
          ${habitacion.estado === 'mantenimiento' ? 'bg-gradient-to-r from-slate-500/10 to-slate-50 border-slate-100' : ''}
        `}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                ${habitacion.estado === 'disponible' ? 'bg-emerald-100 text-emerald-700' : ''}
                ${habitacion.estado === 'ocupada' ? 'bg-red-100 text-red-700' : ''}
                ${habitacion.estado === 'limpieza' ? 'bg-amber-100 text-amber-700' : ''}
                ${habitacion.estado === 'mantenimiento' ? 'bg-slate-200 text-slate-700' : ''}
              `}>
                {habitacion.estado}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{habitacion.tipo}</span>
            </div>
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              Habitación {habitacion.numero}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/50 hover:bg-white text-slate-400 hover:text-slate-600 rounded-xl transition-colors shadow-soft-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setPestanaActiva('detalle')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              pestanaActiva === 'detalle'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> Detalle Actual
          </button>
          <button
            onClick={() => setPestanaActiva('historial')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              pestanaActiva === 'historial'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Línea de Tiempo
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="p-6">
          {pestanaActiva === 'historial' ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Historial de Ocupación y Novedades
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {historial.length} eventos
                </span>
              </div>

              {cargandoHistorial ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Cargando línea de tiempo...
                </div>
              ) : historial.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">Sin eventos registrados aún</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Esta habitación no tiene registros previos de estadías, reservas o averías.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {historial.map((evento, index) => {
                    const esEstadia = evento.tipo === 'estadia';
                    const esMantenimiento = evento.tipo === 'mantenimiento';
                    const esReserva = evento.tipo === 'reserva';

                    const esReservaHoy =
                      esReserva &&
                      (evento.fecha === fechaHoyStr ||
                        (evento.fecha && evento.fecha.substring(0, 10) === fechaHoyStr)) &&
                      (evento.estado === 'confirmada' || evento.estado === 'pendiente');

                    return (
                      <div key={index} className="relative group">
                        {/* Node icon */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                            esEstadia
                              ? 'bg-indigo-600 text-white'
                              : esMantenimiento
                              ? 'bg-amber-500 text-white'
                              : esReservaHoy
                              ? 'bg-emerald-600 text-white ring-emerald-200 animate-pulse'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {esEstadia && <User className="w-2.5 h-2.5" />}
                          {esMantenimiento && <Wrench className="w-2.5 h-2.5" />}
                          {esReserva && <Bookmark className="w-2.5 h-2.5" />}
                        </div>

                        <div
                          onClick={() => {
                            if (esReservaHoy) {
                              handleClicReserva(evento);
                            }
                          }}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            esReservaHoy
                              ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/60 hover:shadow-md cursor-pointer'
                              : 'bg-slate-50/80 hover:bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-800 line-clamp-1 flex items-center gap-1.5">
                              {evento.titulo}
                              {esReservaHoy && (
                                <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Hoy
                                </span>
                              )}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                evento.estado === 'activa' || evento.estado === 'confirmada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : evento.estado === 'resuelta' || evento.estado === 'finalizada'
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {evento.estado}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mb-2">
                            {evento.descripcion}
                          </p>

                          {esReservaHoy && (
                            <div className="mb-2">
                              <button
                                type="button"
                                disabled={procesandoCheckInReserva === evento.titulo}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClicReserva(evento);
                                }}
                                className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {procesandoCheckInReserva === evento.titulo
                                  ? 'Cargando Check-In...'
                                  : 'Hacer Check-In Ahora (Precargar Datos)'}
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(evento.fecha).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {(evento.monto !== undefined || evento.costo !== undefined) && (
                              <span className="font-semibold text-slate-700">
                                ${(evento.monto ?? evento.costo ?? 0).toLocaleString('es-CO')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Precio / Noche</span>
                  <span className="text-sm font-bold font-mono text-slate-700">
                    ${habitacion.precioNoche.toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Capacidad</span>
                  <span className="text-sm font-bold text-slate-700">
                    Hasta {habitacion.capacidadMax} personas
                  </span>
                </div>
              </div>

          {/* Información del Huésped Actual (Si está ocupada) */}
          {habitacion.estado === 'ocupada' && habitacion.huesped && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4" /> Huésped Titular
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Nombre</span>
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1" title={habitacion.huesped.nombre}>
                    {habitacion.huesped.nombre}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Documento</span>
                  <span className="text-xs font-mono font-medium text-slate-700">
                    {habitacion.huesped.documento}
                  </span>
                </div>
                {habitacion.huesped.telefono && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 block">Teléfono / Contacto</span>
                    <span className="text-xs font-mono font-medium text-slate-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {habitacion.huesped.telefono}
                    </span>
                  </div>
                )}
                <div className="col-span-2 pt-2 border-t border-red-200/50 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-red-500 font-semibold block">Salida Prevista</span>
                    <span className="text-xs font-semibold text-red-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(habitacion.huesped.fechaIngreso || '').toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-medium block">Deuda Pendiente</span>
                    <span className="text-sm font-bold font-mono text-red-600">
                      ${(habitacion.huesped.saldoPendiente || 0).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Acciones Rápidas según el Estado */}
          <div className="space-y-3 border-t border-slate-100 pt-5 mt-2">
            {habitacion.estado === 'disponible' && (
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  className="w-full flex justify-center items-center gap-2"
                  onClick={() => {
                    onClose();
                    onAbrirCheckInAvanzado(parseInt(habitacion.id, 10));
                  }}
                >
                  <User className="w-4 h-4" /> Ingresar Huésped (Check-In)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-auto px-4"
                  onClick={() => onCambiarEstado(habitacion.id, 'mantenimiento')}
                  title="Bloquear para Mantenimiento"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </Button>
              </div>
            )}

            {habitacion.estado === 'ocupada' && (
              <Button 
                variant="danger" 
                className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  setCargandoAccion(true);
                  const ok = await onCheckOut(habitacion.id);
                  setCargandoAccion(false);
                  if (ok) onClose();
                }}
                cargando={cargandoAccion}
              >
                <LogOut className="w-4 h-4" />
                Registrar Salida (Check-Out)
              </Button>
            )}

            {habitacion.estado === 'limpieza' && (
              <Button 
                variant="primary" 
                className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 border-none"
                onClick={async () => {
                  setCargandoAccion(true);
                  await onCambiarEstado(habitacion.id, 'disponible');
                  setCargandoAccion(false);
                  onClose();
                }}
                cargando={cargandoAccion}
              >
                <Sparkles className="w-4 h-4" />
                Finalizar Aseo (Marcar Disponible)
              </Button>
            )}

            {habitacion.estado === 'mantenimiento' && (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center gap-2"
                onClick={async () => {
                  setCargandoAccion(true);
                  await onCambiarEstado(habitacion.id, 'limpieza');
                  setCargandoAccion(false);
                  onClose();
                }}
                cargando={cargandoAccion}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Mantenimiento Terminado (Mover a Limpieza)
              </Button>
            )}
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
}
