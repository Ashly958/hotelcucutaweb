import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Package, Save } from 'lucide-react';
import type { Producto, Categoria, GuardarProductoDTO } from '../types/inventario.types';

interface ProductoModalProps {
  isOpen: boolean;
  producto: Producto | null;
  categorias: Categoria[];
  onClose: () => void;
  onSubmit: (datos: GuardarProductoDTO) => Promise<boolean>;
}

export function ProductoModal({
  isOpen,
  producto,
  categorias,
  onClose,
  onSubmit,
}: ProductoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number>(categorias[0]?.id || 1);
  const [codigoReferencia, setCodigoReferencia] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('unidad');
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [precioVenta, setPrecioVenta] = useState<number>(0);
  const [stockActual, setStockActual] = useState<number>(10);
  const [stockMinimoAlerta, setStockMinimoAlerta] = useState<number>(5);

  useEffect(() => {
    if (producto) {
      setCategoriaId(producto.categoriaId || producto.categoria_id || categorias[0]?.id || 1);
      setCodigoReferencia(producto.codigoReferencia || producto.codigo_referencia || '');
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || '');
      setUnidadMedida(producto.unidadMedida || producto.unidad_medida || 'unidad');
      setPrecioCompra(producto.precioCompra || producto.precio_compra || 0);
      setPrecioVenta(producto.precioVenta || producto.precio_venta || 0);
      setStockActual(producto.stockActual ?? producto.stock_actual ?? 0);
      setStockMinimoAlerta(producto.stockMinimoAlerta ?? producto.stock_minimo_alerta ?? 5);
    } else {
      setCategoriaId(categorias[0]?.id || 1);
      setCodigoReferencia('');
      setNombre('');
      setDescripcion('');
      setUnidadMedida('unidad');
      setPrecioCompra(0);
      setPrecioVenta(0);
      setStockActual(10);
      setStockMinimoAlerta(5);
    }
  }, [producto, categorias, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setCargando(true);
    await onSubmit({
      categoriaId,
      codigoReferencia: codigoReferencia.trim() || `REF-${Date.now().toString().slice(-4)}`,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      unidadMedida,
      precioCompra,
      precioVenta,
      stockActual,
      stockMinimoAlerta,
    });
    setCargando(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={producto ? 'Editar Producto de Inventario' : 'Crear Nuevo Producto'}
      subtitle="Catálogo de existencias de operación, lencería e insumos"
      maxWidth="lg"
      icon={<Package className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Categoría *
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(parseInt(e.target.value) || 1)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Código de Referencia
            </label>
            <input
              type="text"
              placeholder="Ej. LEN-003 / BEB-010"
              value={codigoReferencia}
              onChange={(e) => setCodigoReferencia(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Sábana Ajustable 1.40m"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Descripción
            </label>
            <textarea
              rows={2}
              placeholder="Detalles adicionales, dimensiones, empaque..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Unidad de Medida
            </label>
            <select
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="unidad">Unidad</option>
              <option value="juego">Juego</option>
              <option value="galon">Galón</option>
              <option value="caneca">Caneca</option>
              <option value="paquete">Paquete</option>
              <option value="botella">Botella</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Precio Compra (COP)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Precio Venta al Público (COP)
            </label>
            <input
              type="number"
              min="0"
              step="500"
              placeholder="0 si es de uso interno"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Stock Inicial
            </label>
            <input
              type="number"
              min="0"
              value={stockActual}
              disabled={!!producto}
              onChange={(e) => setStockActual(parseInt(e.target.value) || 0)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Stock Mínimo de Alerta *
            </label>
            <input
              type="number"
              required
              min="1"
              value={stockMinimoAlerta}
              onChange={(e) => setStockMinimoAlerta(parseInt(e.target.value) || 5)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Avisará cuando las existencias caigan a este nivel.
            </p>
          </div>
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
            icono={<Save className="w-4 h-4" />}
          >
            {producto ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
