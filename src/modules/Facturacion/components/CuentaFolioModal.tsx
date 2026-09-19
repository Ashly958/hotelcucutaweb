import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { FileSpreadsheet, Printer, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CuentaCentralizadaEstadia } from '../types/facturacion.types';

interface CuentaFolioModalProps {
  isOpen: boolean;
  folio: CuentaCentralizadaEstadia | null;
  onClose: () => void;
  onRegistrarAbono?: (estadiaId: number) => void;
  onEmitirFactura?: (estadiaId: number) => void;
}

export function CuentaFolioModal({
  isOpen,
  folio,
  onClose,
  onRegistrarAbono,
  onEmitirFactura,
}: CuentaFolioModalProps) {
  if (!folio) return null;

  const tieneSaldo = folio.saldo_pendiente > 0;
  const habNum = folio.habitacion?.numero || 'S/N';

  const handleImprimir = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Folio de Cuenta · Estadía ${folio.codigo_estadia}`}
      subtitle="Centralización de cargos de hospedaje, consumos y recaudos (RF-019)"
      maxWidth="lg"
      icon={<FileSpreadsheet className="w-5 h-5 text-red-600" />}
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Encabezado Huésped y Habitación */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-red-700 font-display font-bold text-base flex items-center justify-center shadow-soft-xs">
              {habNum}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">
                  {folio.huesped.nombre_completo}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  ({folio.huesped.documento})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Habitación {habNum} ({folio.habitacion.tipo || 'Estándar'}) · Check-In:{' '}
                {folio.hospedaje.fecha_checkin.substring(0, 10)}
              </p>
            </div>
          </div>

          <div className="text-right">
            {tieneSaldo ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                <AlertCircle className="w-3.5 h-3.5" />
                Saldo: ${folio.saldo_pendiente.toLocaleString('es-CO')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cuenta al Día
              </span>
            )}
          </div>
        </div>

        {/* 1. Cargos de Hospedaje */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200/80 flex justify-between items-center">
            <span className="font-semibold text-slate-900 text-xs">
              1. Servicio de Hospedaje ({folio.hospedaje.dias_estadia} noches)
            </span>
            <span className="font-mono font-bold text-slate-900">
              ${folio.total_hospedaje.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="p-3 text-slate-600 flex justify-between text-xs">
            <span>
              Tarifa convenida por noche: ${folio.hospedaje.tarifa_noche.toLocaleString('es-CO')} COP
            </span>
            <span className="text-slate-400">
              Previsto Check-Out: {folio.hospedaje.fecha_prevista_checkout.substring(0, 16)}
            </span>
          </div>
        </div>

        {/* 2. Consumos de Inventario */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200/80 flex justify-between items-center">
            <span className="font-semibold text-slate-900 text-xs">
              2. Consumos y Servicios Adicionales ({folio.consumos.length})
            </span>
            <span className="font-mono font-bold text-slate-900">
              ${folio.total_consumos.toLocaleString('es-CO')}
            </span>
          </div>
          {folio.consumos.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {folio.consumos.map((c, i) => (
                <div key={i} className="p-2.5 px-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-slate-800">{c.nombre}</span>
                    <span className="text-slate-400 text-[11px] ml-2">
                      (Cant: {c.cantidad} x ${c.precio_venta.toLocaleString('es-CO')})
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-slate-800">
                    ${c.subtotal.toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-slate-400 text-[11px] italic">
              Sin consumos ni cargos extras registrados para esta estadía.
            </div>
          )}
        </div>

        {/* 3. Recibos de Caja y Abonos */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200/80 flex justify-between items-center">
            <span className="font-semibold text-slate-900 text-xs">
              3. Abonos y Pagos Recibidos ({folio.abonos.length})
            </span>
            <span className="font-mono font-bold text-emerald-600">
              -${folio.total_abonos.toLocaleString('es-CO')}
            </span>
          </div>
          {folio.abonos.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {folio.abonos.map((a, i) => (
                <div key={i} className="p-2.5 px-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-semibold text-slate-800 mr-2">
                      {a.numero_recibo}
                    </span>
                    <span className="text-slate-600">{a.concepto}</span>
                    <span className="text-[10px] text-slate-400 uppercase ml-2 px-1.5 py-0.5 rounded bg-slate-100">
                      {a.metodo_pago}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">
                    +${(a.valor || a.valor_recibido || 0).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-slate-400 text-[11px] italic">
              Sin abonos ni pagos registrados aún en el turno de caja.
            </div>
          )}
        </div>

        {/* Resumen Financiero Consolidado */}
        <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Total Cargos (Hospedaje + Consumos):</span>
            <span className="font-mono font-semibold text-slate-900">
              ${folio.total_cargos.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>Total Recibos de Caja / Pagos:</span>
            <span className="font-mono font-semibold">
              -${folio.total_abonos.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
            <span>SALDO PENDIENTE:</span>
            <span
              className={`font-mono ${
                tieneSaldo ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              ${folio.saldo_pendiente.toLocaleString('es-CO')} COP
            </span>
          </div>

          {folio.factura && (
            <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
              <span className="text-slate-600">
                Factura emitida:{' '}
                <strong className="font-mono text-slate-900">
                  {folio.factura.numero_factura}
                </strong>
              </span>
              <span className="text-emerald-700 font-medium capitalize">
                Estado: {folio.factura.estado.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImprimir}
              icono={<Printer className="w-3.5 h-3.5" />}
            >
              Imprimir Folio
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {tieneSaldo && onRegistrarAbono && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onRegistrarAbono(folio.estadia_id);
                }}
                icono={<DollarSign className="w-3.5 h-3.5" />}
              >
                Abonar Saldo
              </Button>
            )}

            {!folio.factura && onEmitirFactura && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEmitirFactura(folio.estadia_id);
                }}
              >
                Emitir Factura DIAN
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
