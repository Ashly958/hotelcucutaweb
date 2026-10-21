import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components';
import type { Producto } from '../types/inventario.types';

interface TrasladoNeveraModalProps {
  isOpen: boolean;
  producto: Producto | null;
  onClose: () => void;
  onSubmit: (datos: {
    producto_id: number;
    tipo_movimiento: 'traslado_nevera';
    cantidad: number;
    motivo: string;
  }) => Promise<boolean>;
}

export function TrasladoNeveraModal({
  isOpen,
  producto,
  onClose,
  onSubmit,
}: TrasladoNeveraModalProps) {
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCantidad('');
    }
  }, [isOpen]);

  if (!isOpen || !producto) return null;

  const stockBodega = producto.stockBodega ?? producto.stock_bodega ?? 0;
  const stockNevera = producto.stockNevera ?? producto.stock_nevera ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantidad || Number(cantidad) <= 0) {
      alert('Por favor ingrese una cantidad válida mayor a 0.');
      return;
    }
    
    if (Number(cantidad) > stockBodega) {
      alert('No puede trasladar una cantidad mayor a la disponible en bodega.');
      return;
    }

    setGuardando(true);
    const exito = await onSubmit({
      producto_id: producto.id,
      tipo_movimiento: 'traslado_nevera',
      cantidad: Number(cantidad),
      motivo: 'Traslado desde bodega a nevera',
    });

    if (exito) {
      onClose();
    }
    setGuardando(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Trasladar a Nevera
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mover stock desde bodega para la venta
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <form id="form-traslado-nevera" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-900">{producto.nombre}</p>
                <p className="text-xs text-blue-700">
                  Bodega: <span className="font-mono font-bold">{stockBodega}</span> | Nevera: <span className="font-mono font-bold">{stockNevera}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Cantidad a trasladar
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  max={stockBodega}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-slate-500">
                Esta cantidad se descontará de bodega y se sumará a nevera.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="form-traslado-nevera"
            variant="primary"
            cargando={guardando}
            icono={<ArrowRight className="w-4 h-4" />}
          >
            Agregar a nevera
          </Button>
        </div>
      </div>
    </div>
  );
}
