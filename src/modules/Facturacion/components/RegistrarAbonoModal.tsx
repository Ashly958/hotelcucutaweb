import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { DollarSign, CreditCard, Sparkles } from 'lucide-react';
import type { RegistrarRecaudoDTO } from '../types/facturacion.types';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';

interface RegistrarAbonoModalProps {
  isOpen: boolean;
  estadias?: Estadia[];
  estadiaInicialId?: number | null;
  onClose: () => void;
  onSubmit: (datos: RegistrarRecaudoDTO) => Promise<boolean>;
}

export function RegistrarAbonoModal({
  isOpen,
  estadias = [],
  estadiaInicialId = null,
  onClose,
  onSubmit,
}: RegistrarAbonoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [valor, setValor] = useState<number>(50000);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [concepto, setConcepto] = useState<string>('Abono a cuenta de hospedaje');
  const [estadiaId, setEstadiaId] = useState<string>('');

  useEffect(() => {
    if (estadiaInicialId) {
      setEstadiaId(String(estadiaInicialId));
    } else if (estadias.length > 0 && !estadiaId) {
      setEstadiaId(String(estadias[0].id));
    }
  }, [estadiaInicialId, estadias, isOpen]);

  const estadiaSeleccionada = estadias.find((e) => String(e.id) === estadiaId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valor <= 0) {
      alert('El monto del abono debe ser mayor a 0.');
      return;
    }

    setCargando(true);
    const exito = await onSubmit({
      valor,
      metodo_pago: metodoPago,
      concepto,
      estadia_id: estadiaId ? parseInt(estadiaId) : undefined,
    });
    setCargando(false);

    if (exito) {
      setValor(50000);
      setConcepto('Abono a cuenta de hospedaje');
      onClose();
    }
  };

  const aplicarSaldoPendiente = () => {
    if (estadiaSeleccionada && (estadiaSeleccionada.saldo_pendiente || 0) > 0) {
      setValor(estadiaSeleccionada.saldo_pendiente || 0);
      setConcepto(`Liquidación total de estadía ${estadiaSeleccionada.codigo_estadia}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Recibo de Caja / Abono"
      subtitle="Ingreso de dinero para estadías o consumos (RF-019, RN-010)"
      maxWidth="md"
      icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {/* Selector de Estadía */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Estadía o Folio Asociado
          </label>
          <select
            value={estadiaId}
            onChange={(e) => setEstadiaId(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 font-medium text-slate-800"
          >
            <option value="">Venta mostrador / Sin estadía asociada</option>
            {estadias.map((est) => {
              const habNum =
                est.habitacion_numero || String(est.habitacion_id).padStart(2, '0');
              const titular = est.huesped
                ? `${est.huesped.nombres} ${est.huesped.apellidos}`
                : 'Huésped';
              const saldo = (est.saldo_pendiente || 0).toLocaleString('es-CO');

              return (
                <option key={est.id} value={est.id}>
                  Hab. {habNum} · {titular} (Saldo pendiente: ${saldo})
                </option>
              );
            })}
          </select>
        </div>

        {/* Info card de la estadía seleccionada */}
        {estadiaSeleccionada && (
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                Saldo pendiente estadía {estadiaSeleccionada.codigo_estadia}
              </span>
              <span className="text-sm font-mono font-bold text-slate-900">
                ${(estadiaSeleccionada.saldo_pendiente || 0).toLocaleString('es-CO')} COP
              </span>
            </div>
            {(estadiaSeleccionada.saldo_pendiente || 0) > 0 && (
              <button
                type="button"
                onClick={aplicarSaldoPendiente}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Copiar Saldo Total
              </button>
            )}
          </div>
        )}

        {/* Valor del Abono */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Valor del Abono (COP) *
          </label>
          <input
            type="number"
            required
            min="1000"
            step="1000"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Método de Pago *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'efectivo', label: 'Efectivo' },
              { id: 'transferencia', label: 'Transferencia' },
              { id: 'tarjeta', label: 'Tarjeta' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetodoPago(m.id as 'efectivo' | 'transferencia' | 'tarjeta')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  metodoPago === m.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Concepto */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Concepto del Pago *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Abono inicial hospedaje / Consumo cafetería"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<CreditCard className="w-4 h-4" />}
          >
            Registrar Pago
          </Button>
        </div>
      </form>
    </Modal>
  );
}
