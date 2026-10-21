import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { inventariosService } from '../../Inventarios/services/inventariosService';
import type { Producto } from '../../Inventarios/types/inventario.types';

interface RegistrarConsumoModalProps {
  isOpen: boolean;
  estadiaId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrarConsumoModal({
  isOpen,
  estadiaId,
  onClose,
  onSuccess,
}: RegistrarConsumoModalProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productoSeleccionado, setProductoSeleccionado] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      cargarProductos();
      setProductoSeleccionado('');
      setCantidad(1);
      setError(null);
    }
  }, [isOpen]);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await inventariosService.obtenerProductos();
      setProductos(data.filter((p) => p.activo && (p.stock_nevera || 0) > 0));
    } catch (err) {
      setError('Error al cargar los productos del inventario.');
    } finally {
      setCargando(false);
    }
  };

  const productoActual = productos.find((p) => p.id === Number(productoSeleccionado));
  const subtotal = productoActual ? (productoActual.precio_venta || 0) * cantidad : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estadiaId) return;
    if (!productoSeleccionado || cantidad <= 0) {
      setError('Seleccione un producto y una cantidad válida.');
      return;
    }
    if (productoActual && cantidad > (productoActual.stock_nevera || 0)) {
      setError(`Stock insuficiente. Máximo disponible: ${(productoActual.stock_nevera || 0)}`);
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await inventariosService.registrarMovimiento({
        producto_id: Number(productoSeleccionado),
        tipo_movimiento: 'salida_consumo_huesped',
        cantidad,
        estadia_id: estadiaId,
        motivo: 'Consumo cargado a habitación',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error al registrar el consumo.');
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Consumo"
      subtitle="Cargar producto del inventario a la cuenta del huésped"
      maxWidth="sm"
      icon={<ShoppingCart className="w-5 h-5 text-emerald-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-start gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Producto</label>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all disabled:opacity-50"
              disabled={cargando || guardando}
              required
            >
              <option value="">Seleccione un producto...</option>
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} - ${Number(prod.precio_venta).toLocaleString('es-CO')} (Stock: {prod.stock_nevera})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cantidad</label>
            <input
              type="number"
              min="1"
              max={productoActual?.stock_nevera || 1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all disabled:opacity-50"
              disabled={!productoSeleccionado || cargando || guardando}
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Subtotal a cargar:</span>
            <span className="text-sm font-bold text-slate-900">
              ${subtotal.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" className="flex-1" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="flex-1"
            disabled={cargando || guardando || !productoSeleccionado}
            icono={<Check className="w-4 h-4" />}
          >
            {guardando ? 'Guardando...' : 'Cargar a Cuenta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
