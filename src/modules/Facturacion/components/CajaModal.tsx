import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Unlock, Lock, AlertTriangle } from 'lucide-react';
import type { TurnoCaja } from '../types/facturacion.types';

interface CajaModalProps {
  isOpen: boolean;
  modo: 'abrir' | 'cerrar';
  caja: TurnoCaja | null;
  onClose: () => void;
  onAbrir: (baseInicial: number) => Promise<boolean>;
  onCerrar: (saldoReal: number, observaciones?: string) => Promise<boolean>;
}

export function CajaModal({
  isOpen,
  modo,
  caja,
  onClose,
  onAbrir,
  onCerrar,
}: CajaModalProps) {
  const [cargando, setCargando] = useState(false);
  const [baseInicial, setBaseInicial] = useState<number>(100000);
  const [saldoReal, setSaldoReal] = useState<number>(caja?.saldo_esperado || 0);
  const [observaciones, setObservaciones] = useState<string>('');

  const saldoEsperado = caja?.saldo_esperado || 0;
  const diferencia = saldoReal - saldoEsperado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    if (modo === 'abrir') {
      await onAbrir(baseInicial);
    } else {
      await onCerrar(saldoReal, observaciones);
    }

    setCargando(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modo === 'abrir' ? 'Apertura de Turno de Caja' : 'Cierre y Cuadre de Caja'}
      subtitle={
        modo === 'abrir'
          ? 'Ingrese el efectivo inicial entregado en la base de recepción.'
          : 'Realice el arqueo de efectivo físico presente en la gaveta.'
      }
      maxWidth="md"
      icon={
        modo === 'abrir' ? (
          <Unlock className="w-5 h-5 text-emerald-600" />
        ) : (
          <Lock className="w-5 h-5 text-amber-600" />
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {modo === 'abrir' ? (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Base Inicial en Efectivo (COP) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="5000"
              value={baseInicial}
              onChange={(e) => setBaseInicial(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Efectivo para dar vueltas y cambio al inicio de turno.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Base inicial:</span>
                <span className="font-mono">${(caja?.base_inicial || 0).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recaudos en efectivo del turno:</span>
                <span className="font-mono">${(caja?.total_recaudado || 0).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Saldo esperado en gaveta:</span>
                <span className="font-mono">${saldoEsperado.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Efectivo Real Contado en Gaveta (COP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={saldoReal}
                onChange={(e) => setSaldoReal(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {diferencia !== 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  {diferencia > 0
                    ? `Sobrante de caja: +$${diferencia.toLocaleString('es-CO')} COP`
                    : `Faltante de caja: -$${Math.abs(diferencia).toLocaleString('es-CO')} COP`}
                </span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Observaciones del Cierre / Arqueo
              </label>
              <textarea
                rows={2}
                placeholder="Indique justificación de diferencias o comentarios de entrega de turno..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={modo === 'abrir' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          >
            {modo === 'abrir' ? 'Confirmar Apertura' : 'Confirmar Cierre de Turno'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
