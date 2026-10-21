import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Zap, Droplets, Flame, Wifi, Trash2, HelpCircle, Upload, Camera } from 'lucide-react';
import type { TipoServicio, RegistrarServicioDTO, MetodoPagoServicio } from '../types/serviciosPublicos.types';

interface NuevoServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: RegistrarServicioDTO) => Promise<void>;
  anioActual?: number;
  mesActual?: number;
}

const SERVICIOS_INFO: Record<TipoServicio, { label: string; icon: any; defaultProveedor: string; color: string }> = {
  luz: { label: 'Energía / Luz', icon: Zap, defaultProveedor: 'CENS EPM (Centrales Eléctricas de Nte. de Santander)', color: 'text-amber-500 bg-amber-50 border-amber-200' },
  agua: { label: 'Agua Potable', icon: Droplets, defaultProveedor: 'Aguas Kpital Cúcuta', color: 'text-blue-500 bg-blue-50 border-blue-200' },
  gas: { label: 'Gas Natural', icon: Flame, defaultProveedor: 'Gases del Oriente', color: 'text-orange-500 bg-orange-50 border-orange-200' },
  internet: { label: 'Internet / Red', icon: Wifi, defaultProveedor: 'Claro Colombia', color: 'text-purple-500 bg-purple-50 border-purple-200' },
  aseo: { label: 'Aseo y Basuras', icon: Trash2, defaultProveedor: 'Veolia Aseo Cúcuta', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  otro: { label: 'Otro Servicio', icon: HelpCircle, defaultProveedor: '', color: 'text-slate-500 bg-slate-50 border-slate-200' },
};

const MESES = [
  { val: 1, label: 'Enero' },
  { val: 2, label: 'Febrero' },
  { val: 3, label: 'Marzo' },
  { val: 4, label: 'Abril' },
  { val: 5, label: 'Mayo' },
  { val: 6, label: 'Junio' },
  { val: 7, label: 'Julio' },
  { val: 8, label: 'Agosto' },
  { val: 9, label: 'Septiembre' },
  { val: 10, label: 'Octubre' },
  { val: 11, label: 'Noviembre' },
  { val: 12, label: 'Diciembre' },
];

export function NuevoServicioModal({
  isOpen,
  onClose,
  onSubmit,
  anioActual = new Date().getFullYear(),
  mesActual = new Date().getMonth() + 1,
}: NuevoServicioModalProps) {
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('luz');
  const [empresaProveedor, setEmpresaProveedor] = useState(SERVICIOS_INFO['luz'].defaultProveedor);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [periodoMes, setPeriodoMes] = useState<number>(mesActual);
  const [periodoAnio, setPeriodoAnio] = useState<number>(anioActual);
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [montoFacturado, setMontoFacturado] = useState<string>('');
  const [observaciones, setObservaciones] = useState('');

  // Soportes
  const [archivoRecibo, setArchivoRecibo] = useState<File | null>(null);
  const [previewRecibo, setPreviewRecibo] = useState<string | null>(null);

  // Pago inmediato opcional
  const [yaFuePagado, setYaFuePagado] = useState(false);
  const [montoPagado, setMontoPagado] = useState<string>('');
  const [fechaPago, setFechaPago] = useState<string>(new Date().toISOString().substring(0, 10));
  const [metodoPago, setMetodoPago] = useState<MetodoPagoServicio>('transferencia');
  const [archivoPago, setArchivoPago] = useState<File | null>(null);
  const [previewPago, setPreviewPago] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTipoChange = (tipo: TipoServicio) => {
    setTipoServicio(tipo);
    setEmpresaProveedor(SERVICIOS_INFO[tipo].defaultProveedor);
  };

  const handleReciboFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoRecibo(file);
      setPreviewRecibo(URL.createObjectURL(file));
    }
  };

  const handlePagoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoPago(file);
      setPreviewPago(URL.createObjectURL(file));
    }
  };

  const handleMontoPagadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setMontoPagado('');
      return;
    }
    const valNum = parseFloat(rawVal);
    const facturado = parseFloat(montoFacturado || '0');
    if (!isNaN(valNum) && facturado > 0 && valNum > facturado) {
      setMontoPagado(String(facturado));
      return;
    }
    setMontoPagado(rawVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const facturado = parseFloat(montoFacturado);
    if (isNaN(facturado) || facturado <= 0) {
      setError('Por favor ingresa un monto facturado válido mayor a cero.');
      return;
    }

    if (yaFuePagado) {
      const pagado = parseFloat(montoPagado || String(facturado));
      if (isNaN(pagado) || pagado < 0) {
        setError('Por favor ingresa un monto pagado válido.');
        return;
      }
      if (pagado > facturado) {
        setError(`El monto pagado ($${pagado.toLocaleString('es-CO')}) no puede superar el monto facturado ($${facturado.toLocaleString('es-CO')} COP).`);
        return;
      }
    }

    try {
      setLoading(true);
      await onSubmit({
        tipo_servicio: tipoServicio,
        empresa_proveedor: empresaProveedor,
        numero_factura_referencia: numeroFactura || undefined,
        periodo_mes: periodoMes,
        periodo_anio: periodoAnio,
        fecha_emision: fechaEmision || undefined,
        fecha_vencimiento: fechaVencimiento || undefined,
        monto_facturado: facturado,
        observaciones: observaciones || undefined,
        soporte_recibo: archivoRecibo,
        monto_pagado: yaFuePagado ? parseFloat(montoPagado || String(facturado)) : 0,
        fecha_pago: yaFuePagado ? fechaPago : undefined,
        metodo_pago: yaFuePagado ? metodoPago : undefined,
        soporte_pago: yaFuePagado ? archivoPago : null,
      });

      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al guardar el servicio público');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Recibo de Servicio Público"
      subtitle="Sube el recibo de energía, agua, gas o internet con su soporte"
      maxWidth="lg"
      icon={<Zap className="w-5 h-5 text-amber-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Selector de Tipo de Servicio */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">
            Tipo de Servicio Público <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(SERVICIOS_INFO) as TipoServicio[]).map((tipo) => {
              const info = SERVICIOS_INFO[tipo];
              const Icon = info.icon;
              const activo = tipoServicio === tipo;
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => handleTipoChange(tipo)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    activo
                      ? 'border-red-600 bg-red-50/70 text-red-800 shadow-soft-xs font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${activo ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="text-[11px] leading-tight">{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Periodo Facturado (Mes y Año) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Mes del Periodo <span className="text-red-500">*</span>
            </label>
            <select
              value={periodoMes}
              onChange={(e) => setPeriodoMes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
            >
              {MESES.map((m) => (
                <option key={m.val} value={m.val}>
                  {m.label} ({m.val})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Año del Periodo <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="2020"
              max="2035"
              value={periodoAnio}
              onChange={(e) => setPeriodoAnio(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Proveedor y Referencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Empresa Prestadora / Proveedor
            </label>
            <Input
              value={empresaProveedor}
              onChange={(e) => setEmpresaProveedor(e.target.value)}
              placeholder="Ej: CENS EPM, Aguas Kpital..."
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nº Factura o Referencia de Pago
            </label>
            <Input
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              placeholder="Ej: 129034821 / Ref: 442"
            />
          </div>
        </div>

        {/* Fechas y Monto Facturado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Fecha de Emisión
            </label>
            <input
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Monto Facturado (COP) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={montoFacturado}
              onChange={(e) => setMontoFacturado(e.target.value)}
              placeholder="Ej: 15000000"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        {/* Subir Soporte / Foto del Recibo */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
            <span>Soporte / Foto del Recibo Físico</span>
            <span className="text-[11px] text-slate-400 font-normal">Foto o escaneo del recibo</span>
          </label>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-medium text-slate-700 cursor-pointer shadow-soft-xs transition-colors">
              <Camera className="w-4 h-4 text-red-600" />
              <span>{archivoRecibo ? 'Cambiar Foto / Recibo' : 'Tomar Foto o Subir Recibo'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleReciboFile}
              />
            </label>

            {archivoRecibo && (
              <span className="text-[11px] text-slate-600 truncate max-w-[200px] font-mono">
                {archivoRecibo.name}
              </span>
            )}
          </div>

          {previewRecibo && (
            <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img src={previewRecibo} alt="Vista previa recibo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Opción de Pago Inmediato */}
        <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={yaFuePagado}
              onChange={(e) => {
                setYaFuePagado(e.target.checked);
                if (e.target.checked && !montoPagado) {
                  setMontoPagado(montoFacturado);
                }
              }}
              className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span className="text-slate-800 font-semibold">
              Este recibo ya fue pagado (Registrar comprobante de pago ahora)
            </span>
          </label>

          {yaFuePagado && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Monto Pagado (COP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    max={montoFacturado || undefined}
                    value={montoPagado}
                    onChange={handleMontoPagadoChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Fecha de Pago
                  </label>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value as MetodoPagoServicio)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo en Caja</option>
                    <option value="debito_automatico">Débito Automático</option>
                    <option value="tarjeta">Tarjeta Débito/Crédito</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Soporte de pago */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Foto o Comprobante de Pago (Transferencia / Recibo con sello)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>{archivoPago ? 'Cambiar Comprobante' : 'Subir Comprobante de Pago'}</span>
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
                    <img src={previewPago} alt="Vista previa pago" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Observaciones o Notas
          </label>
          <textarea
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ej: Variación de tarifa, consumo de aires acondicionados, etc."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 resize-none"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Recibo de Servicio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
