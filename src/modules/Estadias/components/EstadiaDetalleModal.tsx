import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { User, LogOut, CheckCircle, Clock, FileText, Printer, CalendarPlus, AlertTriangle } from 'lucide-react';
import type { Estadia } from '../types/estadia.types';
import { estadiasService } from '../services/estadiasService';

interface EstadiaDetalleModalProps {
  isOpen: boolean;
  estadia: Estadia | null;
  onClose: () => void;
  onCheckOut: (id: number) => Promise<boolean>;
  onVerFolio?: (id: number) => void;
  onImprimirInforme?: (id: number) => void;
  onEstadiaActualizada?: () => void;
}

export function EstadiaDetalleModal({
  isOpen,
  estadia,
  onClose,
  onCheckOut,
  onVerFolio,
  onImprimirInforme,
  onEstadiaActualizada,
}: EstadiaDetalleModalProps) {
  const [cargandoCheckout, setCargandoCheckout] = useState(false);
  const [mostrarFormExtension, setMostrarFormExtension] = useState(false);
  const [diasAdicionales, setDiasAdicionales] = useState(1);
  const [cargandoExtension, setCargandoExtension] = useState(false);
  const [errorExtension, setErrorExtension] = useState<string | null>(null);

  if (!estadia) return null;

  const esActiva = estadia.estado === 'activa';
  const habNumero = estadia.habitacion_numero || String(estadia.habitacion_id).padStart(2, '0');
  const tarifaNoche = estadia.valor_habitacion || (estadia.total / Math.max(1, estadia.dias_estadia));

  const fechaActualSalida = new Date(estadia.fecha_prevista_checkout || Date.now());
  const nuevaFechaSalida = new Date(fechaActualSalida);
  nuevaFechaSalida.setDate(nuevaFechaSalida.getDate() + Number(diasAdicionales || 1));
  nuevaFechaSalida.setHours(13, 0, 0, 0);

  const costoAdicional = Number(diasAdicionales || 1) * tarifaNoche;
  const nuevoTotalEstimado = (estadia.total || 0) + costoAdicional;

  const handleExtender = async () => {
    setErrorExtension(null);
    setCargandoExtension(true);
    try {
      await estadiasService.extenderEstadia(estadia.id, {
        dias_adicionales: Number(diasAdicionales),
      });
      alert(`¡Estadía extendida exitosamente! Se agregaron ${diasAdicionales} noche(s).`);
      setMostrarFormExtension(false);
      if (onEstadiaActualizada) onEstadiaActualizada();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al extender la estadía';
      setErrorExtension(msg);
    } finally {
      setCargandoExtension(false);
    }
  };

  const handleCheckout = async () => {
    if (
      window.confirm(
        `¿Confirmar salida y Check-Out de la estadía ${estadia.codigo_estadia} (Habitación ${habNumero})? La habitación quedará en estado de Limpieza.`
      )
    ) {
      setCargandoCheckout(true);
      await onCheckOut(estadia.id);
      setCargandoCheckout(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Estadía ${estadia.codigo_estadia}`}
      subtitle={`Habitación ${habNumero} · Hotel Cúcuta`}
      maxWidth="lg"
      icon={
        esActiva ? (
          <Clock className="w-5 h-5 text-emerald-600" />
        ) : (
          <CheckCircle className="w-5 h-5 text-slate-600" />
        )
      }
    >
      <div className="space-y-5 text-xs text-slate-700">
        {/* Banner de Estado y Habitación */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 border border-red-200/60 font-display font-bold text-base flex items-center justify-center shadow-soft-xs">
              {habNumero}
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">
                Habitación {habNumero}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {estadia.codigo_estadia}
              </span>
            </div>
          </div>

          <div>
            {esActiva ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Activa / Hospedado
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                Finalizada
              </span>
            )}
          </div>
        </div>

        {/* Datos del Huésped */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-red-600" />
            <span>Información del Huésped Titular</span>
          </h4>

          {estadia.huesped ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Nombre:</span>
                <span className="font-medium text-slate-800">
                  {estadia.huesped.nombres} {estadia.huesped.apellidos}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Documento:</span>
                <span className="font-mono text-slate-800">
                  {estadia.huesped.tipo_documento} {estadia.huesped.numero_documento}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Teléfono:</span>
                <span>{estadia.huesped.telefono || 'No registrado'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Procedencia:</span>
                <span>{estadia.huesped.ciudad_procedencia || 'No registrada'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Profesión:</span>
                <span>{estadia.huesped.profesion || 'No especificada'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dirección:</span>
                <span>{estadia.huesped.direccion || 'No especificada'}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Sin datos de huésped titular</p>
          )}
        </div>

        {/* Acompañantes */}
        {estadia.acompanantes && estadia.acompanantes.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs">
              Acompañantes Registrados ({estadia.acompanantes.length})
            </h4>
            <div className="space-y-1.5">
              {estadia.acompanantes.map((ac, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                >
                  <span className="font-medium text-slate-800">{ac.nombres}</span>
                  <span className="font-mono text-slate-500">
                    {ac.tipo_documento} {ac.numero_documento}
                  </span>
                  <span className="text-slate-500 text-[11px]">{ac.parentesco}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fechas y Desglose Financiero */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200/80 pb-2.5">
            <div>
              <span className="text-slate-400 block text-[10px]">Fecha Check-In:</span>
              <span className="font-medium text-slate-800">{estadia.fecha_checkin}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Check-Out Previsto:</span>
              <span className="font-medium text-slate-800">
                {estadia.fecha_prevista_checkout || '13:00 PM'} ({estadia.dias_estadia} noches)
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tarifa pactada por noche:</span>
              <span className="font-mono">${(estadia.valor_habitacion || 0).toLocaleString('es-CO')}</span>
            </div>
            {(() => {
              const totalEstadia = estadia.total || 0;
              const iva = estadia.iva || 0;
              const impoConsumo = estadia.impuesto_consumo || 0;
              const subtotal = estadia.subtotal !== undefined
                ? estadia.subtotal
                : Math.max(0, totalEstadia - iva - impoConsumo);

              return (
                <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Hospedaje (Base gravable):</span>
                    <span className="font-mono font-medium text-slate-800">
                      ${subtotal.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IVA Hospedaje (19% o exento):</span>
                    <span className="font-mono text-slate-700">
                      ${iva.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Impuesto Nacional al Consumo:</span>
                    <span className="font-mono text-slate-700">
                      ${impoConsumo.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-200/80">
                    <span>Total liquidado ({estadia.dias_estadia || 1} noches):</span>
                    <span className="font-mono font-bold">
                      ${totalEstadia.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-between text-emerald-700 pt-1">
              <span>Abonos / Pagos realizados:</span>
              <span className="font-mono font-semibold">
                ${(estadia.abonos_totales || 0).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
              <span className="text-slate-900">Saldo pendiente por liquidar:</span>
              <span className={(estadia.saldo_pendiente || 0) > 0 ? 'text-red-600 font-mono' : 'text-emerald-600 font-mono'}>
                ${(estadia.saldo_pendiente || 0).toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Extensión de Estadía (+ Días) */}
        {esActiva && (
          <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-slate-900 text-xs">
                  {mostrarFormExtension ? 'Prolongar Días de Estadía' : '¿El huésped desea quedarse más días?'}
                </span>
              </div>
              <Button
                variant={mostrarFormExtension ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setMostrarFormExtension(!mostrarFormExtension)}
              >
                {mostrarFormExtension ? 'Cancelar' : '+ Extender Estadía'}
              </Button>
            </div>

            {mostrarFormExtension && (
              <div className="pt-2 border-t border-amber-200/70 space-y-3">
                {errorExtension && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorExtension}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Noches adicionales a sumar:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={diasAdicionales}
                      onChange={(e) => setDiasAdicionales(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tarifa por noche pactada:
                    </label>
                    <div className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono font-semibold text-slate-700">
                      ${tarifaNoche.toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-200/80 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nueva salida estimada:</span>
                    <span className="font-semibold text-slate-900">
                      {nuevaFechaSalida.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })} (1:00 PM)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Costo adicional a cargar al folio:</span>
                    <span className="font-mono font-bold text-amber-800">
                      +${costoAdicional.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                    <span className="text-slate-700">Nuevo total de la estadía:</span>
                    <span className="font-mono text-emerald-700">
                      ${nuevoTotalEstimado.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    cargando={cargandoExtension}
                    onClick={handleExtender}
                    icono={<CalendarPlus className="w-3.5 h-3.5" />}
                  >
                    Confirmar Extensión (+{diasAdicionales} noche{diasAdicionales > 1 ? 's' : ''})
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cerrar
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {onVerFolio && (
              <Button
                variant="outline"
                size="md"
                onClick={() => onVerFolio(estadia.id)}
                icono={<FileText className="w-4 h-4" />}
              >
                Ver Folio (Cuenta)
              </Button>
            )}

            {onImprimirInforme && (
              <Button
                variant="outline"
                size="md"
                onClick={() => onImprimirInforme(estadia.id)}
                icono={<Printer className="w-4 h-4" />}
              >
                Informe Huésped
              </Button>
            )}

            {esActiva && (
              <Button
                variant="danger"
                size="md"
                cargando={cargandoCheckout}
                onClick={handleCheckout}
                icono={<LogOut className="w-4 h-4" />}
              >
                Realizar Check-Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
