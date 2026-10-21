import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { ArrowUpDown, BedDouble, ShieldAlert, Package } from 'lucide-react';
import type { Producto, RegistrarMovimientoDTO, TipoMovimientoInventario } from '../types/inventario.types';
import { estadiasService } from '@/modules/Estadias/services/estadiasService';
import { facturacionService } from '@/modules/Facturacion/services/facturacionService';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';

interface MovimientoModalProps {
  isOpen: boolean;
  producto: Producto | null;
  productos?: Producto[];
  onSeleccionarProducto?: (p: Producto) => void;
  onClose: () => void;
  onSubmit: (datos: RegistrarMovimientoDTO) => Promise<boolean>;
}

export function MovimientoModal({
  isOpen,
  producto,
  productos = [],
  onSeleccionarProducto,
  onClose,
  onSubmit,
}: MovimientoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [tipo, setTipo] = useState<TipoMovimientoInventario>('traslado_nevera');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('');
  const [estadiaId, setEstadiaId] = useState<string>('');
  const [estadiasActivas, setEstadiasActivas] = useState<Estadia[]>([]);
  const [pagoInmediato, setPagoInmediato] = useState(false);
  const [presentacionId, setPresentacionId] = useState<string>('');
  const [centroConsumo, setCentroConsumo] = useState<'bodega' | 'nevera' | 'habitaciones' | 'areas_operativas'>('bodega');

  useEffect(() => {
    if (isOpen) {
      estadiasService.obtenerTodas()
        .then((items: Estadia[]) => {
          const activas = items.filter((e: Estadia) => e.estado === 'activa');
          setEstadiasActivas(activas);
        })
        .catch(() => {
          setEstadiasActivas([]);
        });
    }
  }, [isOpen]);

  if (!producto) return null;

  const presentaciones = producto.presentaciones || [];
  const presentacionSeleccionada = presentaciones.find(p => p.id === parseInt(presentacionId));
  const factorConversion = presentacionSeleccionada ? presentacionSeleccionada.factor_conversion : 1;
  const unidadesTotalesAMover = cantidad * factorConversion;

  const stockNevera = producto.stockNevera ?? producto.stock_nevera ?? 0;
  const stockBodega = producto.stockBodega ?? producto.stock_bodega ?? 0;
  const esMermaOAjuste = tipo === 'salida_merma' || tipo === 'ajuste_merma' || tipo === 'ajuste_inventario';
  const esConsumo = tipo === 'salida_consumo' || tipo === 'salida_consumo_huesped';

  const stockDisponibleParaMovimiento = () => {
    if (tipo === 'traslado_nevera' || tipo === 'salida_dotacion' || tipo === 'traslado_habitaciones' || tipo === 'traslado_operativas') return stockBodega;
    if (tipo === 'salida_consumo' || tipo === 'salida_consumo_huesped' || tipo === 'salida_merma' || tipo === 'ajuste_merma') return stockNevera;
    return 999999; // entrada_compra u otros no restan
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (tipo !== 'entrada_compra' && unidadesTotalesAMover > stockDisponibleParaMovimiento()) {
      alert(`No hay suficiente stock disponible para esta operación. Disponible en origen: ${stockDisponibleParaMovimiento()} ${producto.unidadMedida || producto.unidad_medida || 'und'}`);
      return;
    }

    if (esMermaOAjuste && !motivo.trim()) {
      alert('Según la regla de negocio RN-013, toda merma o ajuste manual requiere motivo justificado obligatorio.');
      return;
    }

    setCargando(true);
    const tipoFinal = (esConsumo && estadiaId) ? 'salida_consumo_huesped' : tipo;

    const exito = await onSubmit({
      producto_id: producto.id,
      presentacion_id: presentacionId ? parseInt(presentacionId) : undefined,
      centro_consumo: tipo === 'entrada_compra' ? centroConsumo : undefined,
      tipo_movimiento: tipoFinal as TipoMovimientoInventario,
      cantidad,
      motivo: motivo.trim() || (pagoInmediato ? 'Consumo pagado de inmediato' : undefined),
      estadia_id: esConsumo && estadiaId ? parseInt(estadiaId) : undefined,
    });
    
    if (exito && esConsumo && estadiaId && pagoInmediato) {
      const precioUnitario = producto.precioVenta || producto.precio_venta || 0;
      const valorTotal = precioUnitario * unidadesTotalesAMover;
      if (valorTotal > 0) {
        try {
          await facturacionService.registrarRecaudo({
            valor: valorTotal,
            metodo_pago: 'efectivo',
            concepto: 'Pago inmediato de consumos',
            estadia_id: parseInt(estadiaId)
          });
        } catch (e: any) {
          const errMsg = e.response?.data?.message || 'Error al registrar el cobro en caja (el consumo sí fue descontado del stock).';
          alert(errMsg);
        }
      }
    }

    setCargando(false);
    if (exito) {
      setMotivo('');
      setEstadiaId('');
      setCantidad(1);
      setPresentacionId('');
      setPagoInmediato(false);
    }
  };

  const opcionesTipo: { id: TipoMovimientoInventario; label: string; desc: string }[] = [
    { id: 'entrada_compra', label: 'Entrada / Compra', desc: 'Ingreso de mercancía por presentación o unidad' },
    { id: 'traslado_nevera', label: 'Traslado a Nevera', desc: 'Reponer nevera desde la bodega' },
    { id: 'salida_dotacion', label: 'Dotación Habitaciones', desc: 'Amenities/lencería a habitaciones' },
    { id: 'salida_consumo', label: 'Consumo Huésped / Minibar', desc: 'Sale de nevera para habitación' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Movimiento de Inventario"
      subtitle="Kardex de entradas, consumos de huéspedes, dotación y control de mermas"
      maxWidth="md"
      icon={<ArrowUpDown className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {/* Selector de Producto */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Producto Seleccionado *
          </label>
          {productos.length > 1 && onSeleccionarProducto ? (
            <div className="relative">
              <select
                value={producto.id}
                onChange={(e) => {
                  const selId = parseInt(e.target.value);
                  const selProd = productos.find((p) => p.id === selId);
                  if (selProd) onSeleccionarProducto(selProd);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-red-600"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigoReferencia || p.codigo_referencia ? `[${p.codigoReferencia || p.codigo_referencia}] ` : ''}
                    {p.nombre} — B: {p.stockBodega ?? p.stock_bodega ?? 0} | N: {p.stockNevera ?? p.stock_nevera ?? 0} {p.unidadMedida || p.unidad_medida || 'und'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-900">{producto.nombre}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 text-right">
                Bodega: {stockBodega}<br/>Nevera: {stockNevera} {producto.unidadMedida || producto.unidad_medida || 'und'}
              </span>
            </div>
          )}
        </div>

        {/* Tipo de Operación */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
            Tipo de Operación *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {opcionesTipo.map((t) => {
              const seleccionado = tipo === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    seleccionado
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs">{t.label}</div>
                  <div className={`text-[10px] mt-0.5 ${seleccionado ? 'text-slate-300' : 'text-slate-400'}`}>
                    {t.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Presentación de Compra (RN-INV-01) si es entrada */}
        {tipo === 'entrada_compra' && (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-xs">Presentación de Compra (RN-INV-01)</span>
              <span className="text-[10px] text-emerald-700 font-medium">Conversión automática</span>
            </div>
            <select
              value={presentacionId}
              onChange={(e) => setPresentacionId(e.target.value)}
              className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="">Unidad suelta / Mínima ({producto.unidadMedida || 'unidad'})</option>
              {presentaciones.map((pres) => (
                <option key={pres.id} value={pres.id}>
                  {pres.nombre_presentacion} (x{pres.factor_conversion} {producto.unidadMedida || 'und'})
                </option>
              ))}
            </select>

            {/* Centro de Consumo Destino (RN-INV-03) */}
            <div className="pt-2">
              <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                Centro de Consumo / Destino (RN-INV-03)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'bodega', label: 'Bodega Central' },
                  { id: 'nevera', label: 'Neveras' },
                  { id: 'habitaciones', label: 'Habitaciones' },
                  { id: 'areas_operativas', label: 'Áreas Operativas' },
                ].map((centro) => (
                  <button
                    key={centro.id}
                    type="button"
                    onClick={() => setCentroConsumo(centro.id as any)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border transition-all ${
                      centroConsumo === centro.id
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    {centro.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cantidad y Conversión Calculada */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-slate-600">
              {presentacionSeleccionada ? `Cantidad de [${presentacionSeleccionada.nombre_presentacion}]` : 'Cantidad a mover *'}
            </label>
            <span className="text-[10px] text-slate-400">
              Disponible origen: {tipo === 'entrada_compra' ? '∞' : stockDisponibleParaMovimiento()} {producto.unidadMedida || producto.unidad_medida || 'und'}
            </span>
          </div>
          <input
            type="number"
            required
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
          />

          {presentacionSeleccionada && (
            <div className="mt-1.5 p-2 bg-slate-100 rounded-lg flex items-center justify-between text-[11px]">
              <span className="text-slate-600">Conversión a unidad mínima:</span>
              <span className="font-bold font-mono text-emerald-700">
                {cantidad} × {presentacionSeleccionada.factor_conversion} = {unidadesTotalesAMover} {producto.unidadMedida || 'unidades'}
              </span>
            </div>
          )}
        </div>

        {/* Cargo a Estadía para Consumos */}
        {esConsumo && (
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-medium">
              <BedDouble className="w-4 h-4 text-blue-600" />
              <span>Cargar a Folio de Estadía Activa</span>
            </div>
            <p className="text-[10px] text-blue-700">
              Al seleccionar una habitación, el consumo se sumará automáticamente a la cuenta centralizada del huésped.
            </p>
            <select
              value={estadiaId}
              onChange={(e) => setEstadiaId(e.target.value)}
              className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin cargo a habitación (Venta directa / Contado)</option>
              {estadiasActivas.map((est) => (
                <option key={est.id} value={est.id}>
                  Habitación {est.habitacion_numero} — {est.huesped?.nombres} {est.huesped?.apellidos} (Estadía #{est.id})
                </option>
              ))}
            </select>

            {estadiaId && (
              <div className="pt-2 mt-2 border-t border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-blue-900">
                  <input
                    type="radio"
                    name="metodoPago"
                    checked={!pagoInmediato}
                    onChange={() => setPagoInmediato(false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  Cargar a la Habitación
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-emerald-700">
                  <input
                    type="radio"
                    name="metodoPago"
                    checked={pagoInmediato}
                    onChange={() => setPagoInmediato(true)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  Cobrar Ahora (Pago Inmediato)
                </label>
              </div>
            )}
          </div>
        )}

        {/* Advertencia de Merma o Ajuste RN-013 */}
        {esMermaOAjuste && (
          <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800">
              <strong>Regla RN-013:</strong> Los ajustes manuales y mermas quedan registrados en la auditoría con el usuario que los realiza. El motivo es obligatorio.
            </p>
          </div>
        )}

        {/* Motivo */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Motivo / Justificación {esMermaOAjuste ? '*' : '(Opcional)'}
          </label>
          <textarea
            rows={2}
            required={esMermaOAjuste}
            placeholder={
              esMermaOAjuste
                ? 'Ej. Baja por manchas de cloro en lavandería / Deterioro irreparable (RN-013)...'
                : 'Ej. Compra proveedor factura #8821 / Reposición neveras piso 2...'
            }
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
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
            icono={<ArrowUpDown className="w-4 h-4" />}
          >
            Confirmar Movimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
