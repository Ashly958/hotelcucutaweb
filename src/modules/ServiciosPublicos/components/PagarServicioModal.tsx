import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { DollarSign, Camera, CheckCircle2 } from 'lucide-react';
import type { ServicioPublico, PagarServicioDTO, MetodoPagoServicio } from '../types/serviciosPublicos.types';

interface PagarServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioPublico | null;
  onSubmit: (id: number, datos: PagarServicioDTO) => Promise<void>;
}

export function PagarServicioModal({
  isOpen,
  onClose,
  servicio,
  onSubmit,
}: PagarServicioModalProps) {
  const [montoPagado, setMontoPagado] = useState<string>('');
  const [fechaPago, setFechaPago] = useState<string>(new Date().toISOString().substring(0, 10));
  const [metodoPago, setMetodoPago] = useState<MetodoPagoServicio>('transferencia');
  const [archivoPago, setArchivoPago] = useState<File | null>(null);
  const [previewPago, setPreviewPago] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (servicio) {
      // Default al saldo pendiente o al monto facturado
      const saldo = servicio.saldo_pendiente > 0 ? servicio.saldo_pendiente : servicio.monto_facturado;
      setMontoPagado(String(saldo));
      setFechaPago(new Date().toISOString().substring(0, 10));
      setMetodoPago('transferencia');
      setArchivoPago(null);
      setPreviewPago(null);
      setObservaciones('');
      setError(null);
    }
  }, [servicio]);

  if (!isOpen || !servicio) return null;

  const saldoMaximo = servicio.saldo_pendiente > 0 ? servicio.saldo_pendiente : servicio.monto_facturado;

  const handlePagoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoPago(file);
      setPreviewPago(URL.createObjectURL(file));
    }
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setMontoPagado('');
      setError(null);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num > saldoMaximo) {
        // No permitir números mayores al saldo pendiente
        setMontoPagado(String(saldoMaximo));
        setError(`El monto máximo no puede superar el saldo pendiente: $${saldoMaximo.toLocaleString('es-CO')} COP`);
        return;
      }
    }
    setError(null);
    setMontoPagado(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pagado = parseFloat(montoPagado);
    if (isNaN(pagado) || pagado <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    if (pagado > saldoMaximo) {
      setError(`El monto a pagar ($${pagado.toLocaleString('es-CO')}) no puede ser mayor al saldo pendiente ($${saldoMaximo.toLocaleString('es-CO')} COP)`);
      return;
    }

    try {
      setLoading(true);
      await onSubmit(servicio.id, {
        monto_pagado: pagado,
        fecha_pago: fechaPago,
        metodo_pago: metodoPago,
        soporte_pago: archivoPago,
        observaciones: observaciones || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Pago de Servicio Público"
      subtitle={`Liquidación de recibo de ${servicio.tipo_servicio.toUpperCase()} · ${servicio.empresa_proveedor}`}
      maxWidth="md"
      icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Resumen del Recibo */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Periodo:</span>
            <span className="font-semibold text-slate-800">
              Mes {servicio.periodo_mes} / {servicio.periodo_anio}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Monto Facturado:</span>
            <span className="font-mono font-bold text-slate-900">
              ${servicio.monto_facturado.toLocaleString('es-CO')} COP
            </span>
          </div>
          <div className="flex justify-between items-center text-red-600 pt-1 border-t border-slate-200">
            <span className="font-semibold">Saldo Pendiente:</span>
            <span className="font-mono font-bold text-sm">
              ${servicio.saldo_pendiente.toLocaleString('es-CO')} COP
            </span>
          </div>
        </div>

        {/* Campos de Pago */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Monto a Pagar (COP) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              max={saldoMaximo}
              value={montoPagado}
              onChange={handleMontoChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-500"
              required
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Máximo: <strong className="font-mono text-slate-700">${saldoMaximo.toLocaleString('es-CO')} COP</strong></span>
              {parseFloat(montoPagado || '0') !== saldoMaximo && (
                <button
                  type="button"
                  onClick={() => {
                    setMontoPagado(String(saldoMaximo));
                    setError(null);
                  }}
                  className="text-red-700 hover:text-red-800 font-semibold transition-colors"
                >
                  Pagar total pendiente
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Fecha de Pago <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Método de Pago <span className="text-red-500">*</span>
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as MetodoPagoServicio)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
          >
            <option value="transferencia">Transferencia Bancaria (Bancolombia, Daviplata, etc.)</option>
            <option value="efectivo">Efectivo en Caja</option>
            <option value="debito_automatico">Débito Automático</option>
            <option value="tarjeta">Tarjeta de Crédito / Débito</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Foto Comprobante de Pago */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
            <span>Foto / Comprobante de Pago</span>
            <span className="text-[11px] text-slate-400 font-normal">Captura o PDF bancario</span>
          </label>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 cursor-pointer shadow-soft-xs transition-colors">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{archivoPago ? 'Cambiar Foto / Archivo' : 'Tomar Foto o Subir Comprobante'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handlePagoFile}
              />
            </label>

            {archivoPago && (
              <span className="text-[11px] text-slate-600 truncate max-w-[200px] font-mono">
                {archivoPago.name}
              </span>
            )}
          </div>

          {previewPago && (
            <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img src={previewPago} alt="Vista previa soporte pago" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Notas de la transacción
          </label>
          <textarea
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ej: Aprobación #883921 vía Bancolombia App..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading} icono={<CheckCircle2 className="w-4 h-4" />}>
            {loading ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
