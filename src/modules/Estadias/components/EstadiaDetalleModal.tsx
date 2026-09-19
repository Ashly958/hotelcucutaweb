import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { User, LogOut, CheckCircle, Clock } from 'lucide-react';
import type { Estadia } from '../types/estadia.types';

interface EstadiaDetalleModalProps {
  isOpen: boolean;
  estadia: Estadia | null;
  onClose: () => void;
  onCheckOut: (id: number) => Promise<boolean>;
}

export function EstadiaDetalleModal({
  isOpen,
  estadia,
  onClose,
  onCheckOut,
}: EstadiaDetalleModalProps) {
  const [cargandoCheckout, setCargandoCheckout] = useState(false);

  if (!estadia) return null;

  const esActiva = estadia.estado === 'activa';
  const habNumero = estadia.habitacion_numero || String(estadia.habitacion_id).padStart(2, '0');

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
              <span>Tarifa por noche:</span>
              <span className="font-mono">${(estadia.valor_habitacion || 0).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total estadía ({estadia.dias_estadia || 1} noches):</span>
              <span className="font-mono font-semibold text-slate-900">
                ${(estadia.total || 0).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700">
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

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cerrar
          </Button>

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
    </Modal>
  );
}
