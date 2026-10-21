import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { ArrowDownCircle } from 'lucide-react';
import type { RegistrarEgresoDTO, CategoriaEgreso } from '../types/facturacion.types';

interface RegistrarEgresoModalProps {
  isOpen: boolean;
  saldoDisponible?: number;
  onClose: () => void;
  onSubmit: (datos: RegistrarEgresoDTO) => Promise<boolean>;
}

const CATEGORIAS: { id: CategoriaEgreso; label: string }[] = [
  { id: 'suministros', label: 'Suministros y Papelería' },
  { id: 'aseo', label: 'Insumos de Aseo' },
  { id: 'transporte', label: 'Transporte y Mensajería' },
  { id: 'mantenimiento_menor', label: 'Mantenimiento Menor / Reparaciones' },
  { id: 'alimentos_bebidas', label: 'Alimentos y Bebidas Recepción' },
  { id: 'otros', label: 'Otros Gastos Menores' },
];

export function RegistrarEgresoModal({
  isOpen,
  saldoDisponible = 0,
  onClose,
  onSubmit,
}: RegistrarEgresoModalProps) {
  const [monto, setMonto] = useState<number | ''>('');
  const [concepto, setConcepto] = useState('');
  const [categoria, setCategoria] = useState<CategoriaEgreso>('suministros');
  const [beneficiario, setBeneficiario] = useState('');
  const [comprobante, setComprobante] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    const valorMonto = Number(monto);
    if (!valorMonto || valorMonto <= 0) {
      setErrorLocal('El monto del egreso debe ser mayor a 0 COP.');
      return;
    }

    if (valorMonto > saldoDisponible) {
      setErrorLocal(
        `El monto excede el efectivo disponible en caja ($${saldoDisponible.toLocaleString('es-CO')} COP).`
      );
      return;
    }

    if (!concepto.trim()) {
      setErrorLocal('El concepto o motivo del gasto es obligatorio.');
      return;
    }

    if (!beneficiario.trim()) {
      setErrorLocal('El nombre o comercio beneficiario es obligatorio.');
      return;
    }

    try {
      setCargando(true);
      const exito = await onSubmit({
        monto: valorMonto,
        concepto: concepto.trim(),
        categoria,
        beneficiario: beneficiario.trim(),
        comprobante: comprobante.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
      });

      if (exito) {
        setMonto('');
        setConcepto('');
        setBeneficiario('');
        setComprobante('');
        setObservaciones('');
        onClose();
      }
    } catch (err: any) {
      setErrorLocal(err?.message || 'Error al registrar el egreso de caja.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Egreso de Caja Menor"
      subtitle="Registre compras menores y gastos imprevistos cubiertos con efectivo del turno."
      maxWidth="md"
      icon={<ArrowDownCircle className="w-5 h-5 text-rose-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
          <span className="text-rose-700 font-medium">Efectivo disponible en caja:</span>
          <span className="font-mono font-bold text-rose-900 text-sm">
            ${saldoDisponible.toLocaleString('es-CO')} COP
          </span>
        </div>

        {errorLocal && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {errorLocal}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Monto del Gasto (COP) *
            </label>
            <input
              type="number"
              required
              min="100"
              max={saldoDisponible > 0 ? saldoDisponible : undefined}
              step="500"
              placeholder="Ej: 25000"
              value={monto}
              onChange={(e) => setMonto(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Categoría de Gasto *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaEgreso)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-rose-600"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Concepto / Motivo del Gasto *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Compra de bombillos LED y cinta aislante"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Beneficiario / Proveedor *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Ferretería El Centro / D1"
              value={beneficiario}
              onChange={(e) => setBeneficiario(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              N° Comprobante o Factura (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: TICKET-4482 / REC-102"
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Observaciones Adicionales (Opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Detalles adicionales sobre la urgencia o persona que autorizó..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<ArrowDownCircle className="w-4 h-4 text-white" />}
          >
            Registrar Egreso
          </Button>
        </div>
      </form>
    </Modal>
  );
}
