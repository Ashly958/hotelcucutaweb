import { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import {
  Printer,
  FileText,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  DollarSign,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { facturacionService } from '@/modules/Facturacion/services/facturacionService';
import { abrirWhatsApp, formatearMensajeInformeEstadia } from '@/utils/whatsappUtils';
import type { InformeHuespedData } from '@/modules/Facturacion/types/facturacion.types';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';

interface InformeHuespedModalProps {
  isOpen: boolean;
  onClose: () => void;
  estadiaId: number | null;
}

export function InformeHuespedModal({
  isOpen,
  onClose,
  estadiaId,
}: InformeHuespedModalProps) {
  const [data, setData] = useState<InformeHuespedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && estadiaId) {
      cargarInforme(estadiaId);
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, estadiaId]);

  const cargarInforme = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await facturacionService.obtenerInformeHuesped(id);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar el informe del huésped');
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Informe de Estadía & Estado de Cuenta"
      subtitle={data ? `Folio ${data.estadia.codigo_estadia} · ${data.huesped_titular.nombre_completo}` : 'Generando estado de cuenta...'}
      maxWidth="xl"
      icon={<FileText className="w-5 h-5 text-red-600" />}
    >
      <div className="space-y-4">
        {/* Barra superior de controles (Oculta al imprimir) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Formato Oficial Imprimible:</span>
            <span>Optimizado para papel Carta / A4</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImprimir}
              icono={<Printer className="w-4 h-4" />}
            >
              Imprimir Informe
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleImprimir}
              icono={<Download className="w-4 h-4" />}
            >
              Exportar / Guardar PDF
            </Button>
          </div>
        </div>

        {loading && (
          <div className="p-16 text-center text-slate-500 text-xs">
            Cargando informe y conciliando cargos de hospedaje y consumos...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* ÁREA IMPRIMIBLE DEL FOLIO */}
        {data && !loading && (
          <div className="print-folio-area bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-soft text-slate-800 text-xs font-sans space-y-6">
            {/* 1. ENCABEZADO INSTITUCIONAL DEL HOTEL */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-900">
              <div className="flex items-center gap-4">
                <img
                  src={data.hotel.logo_url || logoHC}
                  alt={data.hotel.nombre}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = logoHC;
                  }}
                />
                <div>
                  <h1 className="font-display font-black text-xl text-slate-900 tracking-tight uppercase">
                    {data.hotel.nombre}
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium">
                    NIT: {data.hotel.nit}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {data.hotel.direccion} · {data.hotel.ciudad}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tel: {data.hotel.telefono} · {data.hotel.email}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 min-w-[200px]">
                <span className="text-[10px] font-bold tracking-wider uppercase text-red-700 block">
                  ESTADO DE CUENTA / FOLIO
                </span>
                <span className="font-mono font-black text-lg text-slate-900 block mt-0.5">
                  {data.estadia.codigo_estadia}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Expedición: {data.metadatos.fecha_impresion}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Atendido por: {data.metadatos.atendido_por}
                </span>
              </div>
            </div>

            {/* 2. DATOS DEL HUÉSPED Y DE LA HABITACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
              {/* Columna Huésped */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold pb-1 border-b border-slate-200 text-xs">
                  <User className="w-3.5 h-3.5 text-red-600" />
                  <span>INFORMACIÓN DEL HUÉSPED TITULAR</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Nombre Completo:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {data.huesped_titular.nombre_completo}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Documento:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {data.huesped_titular.tipo_documento} {data.huesped_titular.numero_documento}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Teléfono:</span>
                    <span className="text-slate-800">{data.huesped_titular.telefono || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Procedencia:</span>
                    <span className="text-slate-800">{data.huesped_titular.ciudad_procedencia || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nacionalidad:</span>
                    <span className="text-slate-800">{data.huesped_titular.nacionalidad}</span>
                  </div>
                </div>

                {data.acompanantes.length > 0 && (
                  <div className="pt-2 mt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 text-[11px] font-semibold block">
                      Acompañantes ({data.acompanantes.length}):
                    </span>
                    <div className="text-[10px] text-slate-600 space-y-0.5 mt-0.5">
                      {data.acompanantes.map((ac, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {ac.nombre_completo} ({ac.parentesco})</span>
                          <span className="font-mono text-slate-400">{ac.documento}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Estadía y Habitación */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold pb-1 border-b border-slate-200 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <span>DETALLES DEL ALOJAMIENTO</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Habitación Asignada:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      Habitación {data.habitacion.numero} ({data.habitacion.tipo})
                    </span>
                  </div>
                  <div className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg text-xs font-mono">
                    Hab. {data.habitacion.numero}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Fecha Check-In:</span>
                    <span className="font-medium text-slate-800">
                      {data.estadia.fecha_checkin ? data.estadia.fecha_checkin.substring(0, 16) : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-Out:</span>
                    <span className="font-medium text-slate-800">
                      {data.estadia.fecha_real_checkout || data.estadia.fecha_prevista_checkout.substring(0, 16)}
                    </span>
                  </div>
                </div>

                {/* DESTACADO TOTAL DÍAS HOSPEDADOS */}
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide block">
                      Total Días / Noches Hospedados
                    </span>
                    <span className="font-display font-extrabold text-sm text-slate-900">
                      {data.estadia.dias_estadia} {data.estadia.dias_estadia === 1 ? 'Noche' : 'Noches'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Tarifa convenida:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ${data.estadia.tarifa_noche.toLocaleString('es-CO')} / noche
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DESGLOSE SERVICIO DE HOSPEDAJE */}
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                <span>1. SERVICIO DE ALOJAMIENTO Y HOSPEDAJE</span>
              </h3>
              <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Concepto</th>
                    <th className="py-2 px-3 text-center">Noches</th>
                    <th className="py-2 px-3 text-right">Tarifa por Noche</th>
                    <th className="py-2 px-3 text-right">Subtotal Base</th>
                    <th className="py-2 px-3 text-right">IVA</th>
                    <th className="py-2 px-3 text-right">Impoconsumo</th>
                    <th className="py-2 px-3 text-right">Total Hospedaje</th>
                    <th className="py-2 px-3 text-center">Pagado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {(() => {
                    const totalHosp = data.totales.total_hospedaje;
                    const ivaHosp = data.totales.iva_hospedaje ?? data.estadia.iva ?? 0;
                    const impoHosp = data.totales.impuesto_consumo_hospedaje ?? data.estadia.impuesto_consumo ?? 0;
                    const subtotalHosp = data.totales.subtotal_hospedaje ?? data.estadia.subtotal ?? Math.max(0, totalHosp - ivaHosp - impoHosp);

                    return (
                      <tr>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-900 block">
                            Alojamiento en Habitación {data.habitacion.numero}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Check-In: {data.estadia.fecha_checkin?.substring(0, 10)} · Checkout: {data.estadia.fecha_prevista_checkout?.substring(0, 10)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold">
                          {data.estadia.dias_estadia}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          ${data.estadia.tarifa_noche.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          ${subtotalHosp.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          ${ivaHosp.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          ${impoHosp.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ${totalHosp.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {data.totales.total_abonos >= data.totales.total_hospedaje ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Sí
                            </span>
                          ) : data.totales.total_abonos > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              <DollarSign className="w-3 h-3 text-sky-600" />
                              Parcial
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <Clock className="w-3 h-3 text-red-600" />
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            {/* 4. DESGLOSE DE CONSUMOS Y MINIBAR */}
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-2 flex items-center justify-between uppercase tracking-wide">
                <span>2. CONSUMOS Y SERVICIOS ADICIONALES ({data.consumos.length})</span>
                <span className="font-mono text-slate-600 font-bold">
                  Subtotal: ${data.totales.total_consumos.toLocaleString('es-CO')}
                </span>
              </h3>
              {data.consumos.length > 0 ? (
                (() => {
                  let abonoDisponibleParaConsumos = Math.max(
                    0,
                    data.totales.total_abonos - data.totales.total_hospedaje
                  );

                  return (
                    <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2 px-3">Ítem / Producto</th>
                          <th className="py-2 px-3 text-center">Cantidad</th>
                          <th className="py-2 px-3 text-right">Precio Unitario</th>
                          <th className="py-2 px-3 text-right">Subtotal</th>
                          <th className="py-2 px-3 text-center">Pagado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {data.consumos.map((item, idx) => {
                          let estaPagado = false;
                          if (data.totales.saldo_pendiente <= 0) {
                            estaPagado = true;
                          } else if (abonoDisponibleParaConsumos >= item.subtotal) {
                            estaPagado = true;
                            abonoDisponibleParaConsumos -= item.subtotal;
                          }

                          return (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-medium text-slate-900">
                                {item.nombre}
                                {item.fecha && (
                                  <span className="text-[10px] text-slate-400 ml-2">({item.fecha})</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center font-mono font-semibold">
                                {item.cantidad}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-slate-600">
                                ${item.precio_unitario.toLocaleString('es-CO')}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                ${item.subtotal.toLocaleString('es-CO')}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {estaPagado ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Sí
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                    <Clock className="w-3 h-3 text-red-600" />
                                    No
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 italic text-[11px]">
                  No se registraron consumos adicionales ni minibar durante esta estadía.
                </div>
              )}
            </div>

            {/* 5. ABONOS Y RECAUDOS EFECTUADOS */}
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-2 flex items-center justify-between uppercase tracking-wide">
                <span>3. ABONOS Y PAGOS RECIBIDOS EN CAJA ({data.abonos.length})</span>
                <span className="font-mono text-emerald-700 font-bold">
                  Total Pagado: -${data.totales.total_abonos.toLocaleString('es-CO')}
                </span>
              </h3>
              {data.abonos.length > 0 ? (
                <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Nº Recibo</th>
                      <th className="py-2 px-3">Fecha</th>
                      <th className="py-2 px-3">Concepto</th>
                      <th className="py-2 px-3 text-center">Método de Pago</th>
                      <th className="py-2 px-3 text-right">Valor Abonado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {data.abonos.map((ab, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {ab.numero_recibo}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {ab.fecha_pago ? ab.fecha_pago.substring(0, 10) : '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {ab.concepto}
                        </td>
                        <td className="py-2 px-3 text-center uppercase text-[10px] font-medium text-slate-500">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100">
                            {ab.metodo_pago.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                          +${ab.valor.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 italic text-[11px]">
                  No se registran pagos ni abonos en caja para esta estadía aún.
                </div>
              )}
            </div>

            {/* 6. LIQUIDACIÓN GENERAL Y BALANCE FINANCIERO */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-slate-500 text-[11px] block">ESTADO FINANCIERO:</span>
                {data.totales.saldo_pendiente <= 0 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 font-display font-black text-sm rounded-xl uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    PAZ Y SALVO
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 font-display font-black text-sm rounded-xl uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    PENDIENTE DE PAGO
                  </div>
                )}
                {data.factura && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Factura Electrónica: <strong className="font-mono">{data.factura.numero_factura}</strong>
                    {data.factura.cufe && ` · CUFE: ${data.factura.cufe.substring(0, 16)}...`}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-72 space-y-1.5 text-xs">
                {(() => {
                  const totalHosp = data.totales.total_hospedaje;
                  const ivaHosp = data.totales.iva_hospedaje ?? data.estadia.iva ?? 0;
                  const impoHosp = data.totales.impuesto_consumo_hospedaje ?? data.estadia.impuesto_consumo ?? 0;
                  const subtotalHosp = data.totales.subtotal_hospedaje ?? data.estadia.subtotal ?? Math.max(0, totalHosp - ivaHosp - impoHosp);
                  const subtotalCons = data.totales.subtotal_consumos ?? data.totales.total_consumos;
                  const subtotalGen = data.totales.subtotal_general ?? (subtotalHosp + subtotalCons);
                  const ivaGen = data.totales.iva_general ?? ivaHosp;
                  const impoGen = data.totales.impuesto_consumo_general ?? impoHosp;

                  return (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal Base Gravable:</span>
                        <span className="font-mono font-semibold">${subtotalGen.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>IVA (19% o exento):</span>
                        <span className="font-mono font-semibold">${ivaGen.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Impuesto Nacional al Consumo:</span>
                        <span className="font-mono font-semibold">${impoGen.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                        <span>TOTAL CARGOS (Total a Pagar):</span>
                        <span className="font-mono">${data.totales.total_cargos.toLocaleString('es-CO')}</span>
                      </div>
                    </>
                  );
                })()}
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>TOTAL ABONOS / PAGOS:</span>
                  <span className="font-mono">-${data.totales.total_abonos.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1.5 border-t-2 border-slate-900 text-slate-900">
                  <span>SALDO PENDIENTE:</span>
                  <span className={`font-mono ${data.totales.saldo_pendiente > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    ${data.totales.saldo_pendiente.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
            </div>

            {/* 7. SECCIÓN DE FIRMAS PARA LEGALIZACIÓN */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 pt-2 w-48 mx-auto">
                  <p className="font-bold text-slate-800">{data.huesped_titular.nombre_completo}</p>
                  <p className="text-[11px] text-slate-500">
                    C.C. / Doc: {data.huesped_titular.numero_documento}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Firma del Huésped</p>
                </div>
              </div>

              <div>
                <div className="border-t border-slate-400 pt-2 w-48 mx-auto">
                  <p className="font-bold text-slate-800">{data.hotel.nombre}</p>
                  <p className="text-[11px] text-slate-500">Recepción / Administración</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Firma y Sello Autorizado</p>
                </div>
              </div>
            </div>

            {/* Pie institucional */}
            <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
              Documento informativo de estado de cuenta y folio hotelero · {data.hotel.nombre} · {data.hotel.ciudad}
            </div>
          </div>
        )}

        {/* Botón de cierre en pantalla */}
        <div className="no-print flex flex-wrap justify-end items-center gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          {data && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const msg = formatearMensajeInformeEstadia({
                  codigoEstadia: data.estadia.codigo_estadia,
                  huespedNombre: data.huesped_titular.nombre_completo,
                  habitacionNumero: data.habitacion.numero,
                  totalCargos: data.totales.total_cargos,
                  totalAbonos: data.totales.total_abonos,
                  saldoPendiente: data.totales.saldo_pendiente,
                });
                abrirWhatsApp(data.huesped_titular.telefono, msg);
              }}
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
              icono={<MessageCircle className="w-4 h-4 text-emerald-600" />}
            >
              Compartir WhatsApp
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleImprimir}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Informe
          </Button>
        </div>
      </div>
    </Modal>
  );
}
