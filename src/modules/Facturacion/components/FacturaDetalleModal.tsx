import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { FileText, Printer, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import type { Factura } from '../types/facturacion.types';

interface FacturaDetalleModalProps {
  isOpen: boolean;
  factura: Factura | null;
  onClose: () => void;
}

export function FacturaDetalleModal({
  isOpen,
  factura,
  onClose,
}: FacturaDetalleModalProps) {
  if (!factura) return null;

  const codigo = factura.codigo_factura || factura.numero_factura || `FAC-${factura.id}`;
  const total = factura.total || factura.total_factura || 0;
  const saldo = factura.saldo_pendiente_dinamico ?? 0;
  const totalPagado = Math.max(0, total - saldo);

  const esPagadaTotal =
    factura.estado === 'pagada' || factura.estado === 'pagada_total' || saldo === 0;
  const esPagadaParcial = factura.estado === 'pagada_parcial' && saldo > 0;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Factura ${codigo}`}
      subtitle="Comprobante de venta y liquidación oficial con resolución DIAN"
      maxWidth="lg"
      icon={<FileText className="w-5 h-5 text-red-600" />}
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Encabezado Hotel Cúcuta */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              HOTEL CÚCUTA
            </h3>
            <p className="text-[11px] text-slate-500">NIT: 900.123.456-7</p>
            <p className="text-[11px] text-slate-500">Calle 10 # 4-50 Centro · Cúcuta, Norte de Santander</p>
            <p className="text-[11px] text-slate-500">Teléfono: +57 300 1234567</p>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-sm text-slate-900 block">
              {codigo}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Fecha:{' '}
              {factura.fecha_emision
                ? factura.fecha_emision.substring(0, 10)
                : new Date().toISOString().substring(0, 10)}
            </span>
            <span className="inline-block mt-1">
              {esPagadaTotal ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3" />
                  Pagada Total
                </span>
              ) : esPagadaParcial ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                  <DollarSign className="w-3 h-3" />
                  Abono Parcial
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                  <Clock className="w-3 h-3" />
                  Pendiente de Pago
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Datos Cliente */}
        <div className="border border-slate-200/80 rounded-2xl p-3.5 space-y-1 bg-white">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
            Datos del Adquiriente / Huésped
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500">Nombre / Razón Social: </span>
              <strong className="text-slate-800 font-medium">
                {factura.cliente_nombre || 'Consumidor Final'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">NIT / C.C.: </span>
              <strong className="text-slate-800 font-mono">
                {factura.cliente_documento || '222222222222'}
              </strong>
            </div>
          </div>
        </div>

        {/* Tabla de Conceptos */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="py-2.5 px-3.5 font-medium">Concepto</th>
                <th className="py-2.5 px-3 font-medium text-center">Cant.</th>
                <th className="py-2.5 px-3.5 font-medium text-right">V. Unitario</th>
                <th className="py-2.5 px-3.5 font-medium text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factura.detalles && factura.detalles.length > 0 ? (
                factura.detalles.map((d, i) => {
                  const concepto = d.concepto || d.descripcion || 'Servicio de Hospedaje';
                  const valorUnit = d.valor_unitario || d.precio_unitario || 0;
                  return (
                    <tr key={i}>
                      <td className="py-2.5 px-3.5 text-slate-800">{concepto}</td>
                      <td className="py-2.5 px-3 text-center">{d.cantidad}</td>
                      <td className="py-2.5 px-3.5 text-right font-mono">
                        ${valorUnit.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-900">
                        ${d.subtotal.toLocaleString('es-CO')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-2.5 px-3.5" colSpan={4}>
                    Servicios de hospedaje y consumos consolidados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recibos de Pago Cruzados si existen */}
        {factura.recibos && factura.recibos.length > 0 && (
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
            <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200/80 text-slate-600 font-semibold text-[11px]">
              Recibos de Caja Cruzados ({factura.recibos.length})
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {factura.recibos.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1 px-1.5 text-[11px]">
                  <div>
                    <span className="font-mono font-semibold text-slate-800 mr-2">
                      {r.numero_recibo}
                    </span>
                    <span className="text-slate-500">
                      {r.concepto} ({r.metodo_pago})
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-emerald-600">
                    +${(r.valor || r.valor_recibido || 0).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totales */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono">${(factura.subtotal || total).toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>IVA (0% Régimen Hotelero / Exento):</span>
            <span className="font-mono">$0</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-slate-200">
            <span>TOTAL FACTURADO:</span>
            <span className="font-mono">${total.toLocaleString('es-CO')} COP</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Total Recaudado / Pagado:</span>
            <span className="font-mono">${totalPagado.toLocaleString('es-CO')} COP</span>
          </div>
          {saldo > 0 && (
            <div className="flex justify-between text-red-600 font-bold pt-1 border-t border-slate-200/60">
              <span>Saldo Pendiente por Pagar:</span>
              <span className="font-mono">${saldo.toLocaleString('es-CO')} COP</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="md" onClick={onClose}>
            Cerrar
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleImprimir}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Factura
          </Button>
        </div>
      </div>
    </Modal>
  );
}
