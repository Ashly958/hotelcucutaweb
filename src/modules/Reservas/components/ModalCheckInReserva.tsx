import React, { useState } from 'react';
import { X, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Reserva, ConvertirReservaDTO } from '../types/reserva.types';

interface ModalCheckInReservaProps {
  abierto: boolean;
  reserva: Reserva | null;
  onCerrar: () => void;
  onConfirmar: (id: number, datos?: ConvertirReservaDTO) => Promise<any>;
}

export const ModalCheckInReserva: React.FC<ModalCheckInReservaProps> = ({
  abierto,
  reserva,
  onCerrar,
  onConfirmar,
}) => {
  const [abonoAdicional, setAbonoAdicional] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>('efectivo');
  const [procesando, setProcesando] = useState<boolean>(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  React.useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abierto]);

  if (!abierto || !reserva) return null;

  const handleConfirmar = async () => {
    setErrorLocal(null);
    setProcesando(true);
    try {
      await onConfirmar(reserva.id, {
        abono_adicional: Number(abonoAdicional) || 0,
        metodo_pago: metodoPago,
      });
      onCerrar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al realizar el check-in';
      setErrorLocal(msg);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop oscuro con blur que cubre toda la pantalla */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCerrar}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 z-10">
        <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-white" />
            <h3 className="font-bold text-lg">Check-In desde Reserva</h3>
          </div>
          <button onClick={onCerrar} className="p-1 hover:bg-blue-700 rounded-lg transition text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorLocal && (
          <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorLocal}</span>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Ficha resumen */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Código Reserva:</span>
              <span className="font-mono font-bold text-slate-800">{reserva.codigo_reserva}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Huésped Titular:</span>
              <span className="font-semibold text-slate-900">{reserva.nombre_completo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Habitación Asignada:</span>
              <span className="font-bold text-blue-700">Habitación {reserva.habitacion_numero || reserva.habitacion_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Noches / Salida:</span>
              <span>{reserva.noches} noches (Hasta {reserva.fecha_salida})</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Anticipo Registrado:</span>
              <span className="font-bold text-emerald-600">${reserva.abono_anticipo.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Saldo Pendiente:</span>
              <span className="font-bold text-amber-600">${reserva.saldo_pendiente.toLocaleString()}</span>
            </div>
          </div>

          {/* Abono adicional al ingreso */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Abono adicional al ingreso ($ Opcional)
            </label>
            <input
              type="number"
              min="0"
              value={abonoAdicional}
              onChange={(e) => setAbonoAdicional(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Método de Pago para Abono</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta Débito / Crédito</option>
              <option value="transferencia">Transferencia (Nequi / Daviplata / Bancolombia)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={onCerrar}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={procesando}
              className="px-5 py-2 text-sm font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {procesando ? 'Procesando...' : 'Confirmar Check-In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
