import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import {
  DollarSign,
  CreditCard,
  Sparkles,
  AlertCircle,
  Wine,
  BedDouble,
  Receipt,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  ExternalLink,
  ShoppingCart,
  X,
  RefreshCw,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { facturacionService } from '../services/facturacionService';
import { abrirWhatsApp, formatearMensajeReciboCaja } from '@/utils/whatsappUtils';
import type { RegistrarRecaudoDTO, CuentaCentralizadaEstadia } from '../types/facturacion.types';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';

interface RegistrarAbonoModalProps {
  isOpen: boolean;
  estadias?: Estadia[];
  estadiaInicialId?: number | null;
  onClose: () => void;
  onSubmit: (datos: RegistrarRecaudoDTO) => Promise<boolean>;
}

export function RegistrarAbonoModal({
  isOpen,
  estadias = [],
  estadiaInicialId = null,
  onClose,
  onSubmit,
}: RegistrarAbonoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [valorInput, setValorInput] = useState<string>('50000');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [concepto, setConcepto] = useState<string>('Abono a cuenta de hospedaje');
  const [estadiaId, setEstadiaId] = useState<string>('');
  const [errorApi, setErrorApi] = useState<string | null>(null);

  // Estados para el desglose detallado de la cuenta
  const [cuentaEstadia, setCuentaEstadia] = useState<CuentaCentralizadaEstadia | null>(null);
  const [cargandoCuenta, setCargandoCuenta] = useState(false);
  const [errorCuenta, setErrorCuenta] = useState<string | null>(null);
  const [mostrarDesglose, setMostrarDesglose] = useState(false);
  const [modalMiniDesglose, setModalMiniDesglose] = useState(false);

  // Estado para compartir recibo por WhatsApp al registrar
  const [comprobanteExitoso, setComprobanteExitoso] = useState<{
    numeroRecibo?: string;
    valor: number;
    metodoPago: string;
    concepto: string;
    clienteNombre: string;
    clienteTelefono?: string;
    saldoRestante: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setComprobanteExitoso(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (estadiaInicialId) {
      setEstadiaId(String(estadiaInicialId));
    } else if (estadias.length > 0 && !estadiaId) {
      setEstadiaId(String(estadias[0].id));
    }
  }, [estadiaInicialId, estadias, isOpen]);

  const estadiaSeleccionada = estadias.find((e) => String(e.id) === estadiaId);

  // Saldo vigente (prioriza el saldo actualizado de la cuenta si está cargada)
  const saldoVigente = cuentaEstadia
    ? cuentaEstadia.saldo_pendiente
    : estadiaSeleccionada?.saldo_pendiente || 0;

  // Ajustar valor por defecto si el saldo pendiente es menor al valor base o al cambiar estadía
  useEffect(() => {
    if (estadiaSeleccionada) {
      const saldo = estadiaSeleccionada.saldo_pendiente || 0;
      if (saldo > 0 && saldo < 50000) {
        setValorInput(saldo.toString());
      }
    }
  }, [estadiaSeleccionada?.id]);

  // Si la cuenta cargó con un saldo específico menor, ajustar también
  useEffect(() => {
    if (cuentaEstadia && cuentaEstadia.saldo_pendiente > 0) {
      if (cuentaEstadia.saldo_pendiente < 50000 || valorInput === '50000') {
        setValorInput(cuentaEstadia.saldo_pendiente.toString());
      }
    }
  }, [cuentaEstadia?.saldo_pendiente]);

  // Cargar cuenta centralizada cuando se selecciona una estadía
  useEffect(() => {
    if (!isOpen) {
      setMostrarDesglose(false);
      setModalMiniDesglose(false);
      setCuentaEstadia(null);
      setErrorCuenta(null);
      return;
    }

    if (!estadiaId) {
      setCuentaEstadia(null);
      setCargandoCuenta(false);
      setErrorCuenta(null);
      return;
    }

    let activo = true;
    const fetchCuenta = async () => {
      setCargandoCuenta(true);
      setErrorCuenta(null);
      try {
        const cuenta = await facturacionService.obtenerCuentaEstadia(Number(estadiaId));
        if (activo) {
          setCuentaEstadia(cuenta);
        }
      } catch {
        if (activo) {
          setErrorCuenta('No fue posible consultar el desglose detallado de la cuenta.');
        }
      } finally {
        if (activo) {
          setCargandoCuenta(false);
        }
      }
    };

    fetchCuenta();

    return () => {
      activo = false;
    };
  }, [isOpen, estadiaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorApi(null);
    const valParsed = parseFloat(valorInput) || 0;
    if (valParsed <= 0) {
      setErrorApi('El monto del abono debe ser mayor a 0.');
      return;
    }
    const maxVal = estadiaSeleccionada ? saldoVigente : undefined;
    if (maxVal !== undefined && valParsed > maxVal) {
      setErrorApi(`El monto no puede ser mayor al saldo pendiente ($${maxVal}).`);
      return;
    }

    setCargando(true);
    try {
      const exito = await onSubmit({
        valor: valParsed,
        metodo_pago: metodoPago,
        concepto,
        estadia_id: estadiaId ? parseInt(estadiaId) : undefined,
        factura_id: null as any,
      });
      
      if (exito) {
        const saldoRestante = Math.max(0, (estadiaSeleccionada ? saldoVigente : 0) - valParsed);
        const clienteNombre = estadiaSeleccionada?.huesped
          ? `${estadiaSeleccionada.huesped.nombres} ${estadiaSeleccionada.huesped.apellidos}`
          : 'Estimado Huésped';
        const clienteTelefono = estadiaSeleccionada?.huesped?.telefono;

        setComprobanteExitoso({
          numeroRecibo: `REC-${Date.now().toString().slice(-6)}`,
          valor: valParsed,
          metodoPago,
          concepto,
          clienteNombre,
          clienteTelefono,
          saldoRestante,
        });
        setValorInput('50000');
        setConcepto('Abono a cuenta de hospedaje');
        setMostrarDesglose(false);
        setModalMiniDesglose(false);
      }
    } catch (error: any) {
      setErrorApi(error.message);
    } finally {
      setCargando(false);
    }
  };

  const aplicarValorItem = (valor: number, conceptoSugerido: string) => {
    setValorInput(valor.toString());
    setConcepto(conceptoSugerido);
  };

  const aplicarSaldoPendiente = () => {
    if (saldoVigente > 0) {
      setValorInput(saldoVigente.toString());
      if (
        cuentaEstadia &&
        cuentaEstadia.consumos.length > 0 &&
        cuentaEstadia.total_hospedaje <= cuentaEstadia.total_abonos
      ) {
        const nombres = cuentaEstadia.consumos.map((c) => c.nombre).join(', ');
        setConcepto(
          `Pago consumos inventario (${nombres}) - Estadía ${estadiaSeleccionada?.codigo_estadia || estadiaId}`
        );
      } else {
        setConcepto(
          `Liquidación total de estadía ${estadiaSeleccionada?.codigo_estadia || ''}`
        );
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setComprobanteExitoso(null);
          onClose();
        }}
        title={comprobanteExitoso ? "Comprobante de Caja Registrado" : "Registrar Recibo de Caja / Abono"}
        subtitle={comprobanteExitoso ? "Transacción exitosa y cruzada en el turno activo" : "Ingreso de dinero para estadías o consumos"}
        maxWidth="lg"
        icon={comprobanteExitoso ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <DollarSign className="w-5 h-5 text-emerald-600" />}
      >
        {comprobanteExitoso ? (
          <div className="py-6 px-2 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                ¡Abono Registrado con Éxito!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Se abonaron <strong>${comprobanteExitoso.valor.toLocaleString('es-CO')} COP</strong> ({comprobanteExitoso.metodoPago}) a la cuenta de <strong>{comprobanteExitoso.clienteNombre}</strong>.
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Saldo restante:{' '}
                <span className={`font-mono font-bold ${comprobanteExitoso.saldoRestante === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  ${comprobanteExitoso.saldoRestante.toLocaleString('es-CO')} COP {comprobanteExitoso.saldoRestante === 0 ? '(Al día)' : ''}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400"
                onClick={() => {
                  const msg = formatearMensajeReciboCaja({
                    numeroRecibo: comprobanteExitoso.numeroRecibo || 'REC-CAJA',
                    clienteNombre: comprobanteExitoso.clienteNombre,
                    valor: comprobanteExitoso.valor,
                    metodoPago: comprobanteExitoso.metodoPago,
                    concepto: comprobanteExitoso.concepto,
                    saldoRestante: comprobanteExitoso.saldoRestante,
                  });
                  abrirWhatsApp(comprobanteExitoso.clienteTelefono, msg);
                }}
                icono={<MessageCircle className="w-4 h-4 text-emerald-600" />}
              >
                Enviar Recibo por WhatsApp
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => {
                  setComprobanteExitoso(null);
                  onClose();
                }}
              >
                Finalizar y Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {/* Selector de Estadía */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Estadía o Folio Asociado
          </label>
          <select
            value={estadiaId}
            onChange={(e) => setEstadiaId(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 font-medium text-slate-800"
          >
            <option value="">Venta mostrador / Sin estadía asociada</option>
            {estadias.map((est) => {
              const habNum =
                est.habitacion_numero || String(est.habitacion_id).padStart(2, '0');
              const titular = est.huesped
                ? `${est.huesped.nombres} ${est.huesped.apellidos}`
                : 'Huésped';
              const saldo = (est.saldo_pendiente || 0).toLocaleString('es-CO');

              return (
                <option key={est.id} value={est.id}>
                  Hab. {habNum} · {titular} (Saldo pendiente: ${saldo})
                </option>
              );
            })}
          </select>
        </div>

        {/* Info card de la estadía seleccionada */}
        {estadiaSeleccionada && (
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 overflow-hidden transition-all">
            {/* Cabecera del saldo */}
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Saldo pendiente estadía {estadiaSeleccionada.codigo_estadia}
                  </span>
                  {cargandoCuenta && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                      Consultando origen...
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-mono font-bold text-slate-900">
                    ${saldoVigente.toLocaleString('es-CO')} COP
                  </span>
                  {cuentaEstadia && cuentaEstadia.consumos.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100/70 text-amber-800 border border-amber-200/60">
                      <Wine className="w-3 h-3 text-amber-600" />
                      {cuentaEstadia.consumos.length} {cuentaEstadia.consumos.length === 1 ? 'bebida/consumo' : 'consumos'}
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de acción rápida sobre el saldo */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                {saldoVigente > 0 && (
                  <button
                    type="button"
                    onClick={aplicarSaldoPendiente}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 px-2.5 py-1.5 rounded-xl transition-colors shadow-2xs"
                    title="Copiar saldo total al valor a pagar"
                  >
                    <Sparkles className="w-3 h-3" />
                    Copiar Saldo
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setMostrarDesglose(!mostrarDesglose)}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-xl border transition-colors ${
                    mostrarDesglose
                      ? 'bg-slate-200/80 text-slate-800 border-slate-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200/80'
                  }`}
                  title="Ver de dónde proviene este saldo a pagar"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mostrarDesglose ? 'Ocultar' : '¿De dónde es?'}</span>
                  {mostrarDesglose ? (
                    <ChevronUp className="w-3 h-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  )}
                </button>

                {cuentaEstadia && (
                  <button
                    type="button"
                    onClick={() => setModalMiniDesglose(true)}
                    className="p-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100 transition-colors"
                    title="Abrir desglose en ventana emergente (mini-modal)"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Pequeño dato destacado sobre el origen del saldo cuando el acordeón está cerrado */}
            {!mostrarDesglose && cuentaEstadia && (
              <div className="px-3.5 pb-3">
                {cuentaEstadia.consumos.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start justify-between gap-2 text-[11px] text-amber-900">
                    <div className="flex items-start gap-2">
                      <Wine className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-950">
                          {cuentaEstadia.total_hospedaje <= cuentaEstadia.total_abonos
                            ? 'Este saldo proviene de bebidas/consumos de inventario:'
                            : 'Saldo incluye bebidas/consumos de inventario cargados:'}
                        </p>
                        <p className="text-amber-800 text-[10px] mt-0.5">
                          {cuentaEstadia.consumos.length === 1 ? (
                            <>
                              <strong>{cuentaEstadia.consumos[0].nombre}</strong> (
                              {cuentaEstadia.consumos[0].cantidad}x $
                              {cuentaEstadia.consumos[0].precio_venta.toLocaleString('es-CO')}) · Subtotal: $
                              {cuentaEstadia.consumos[0].subtotal.toLocaleString('es-CO')} COP
                            </>
                          ) : (
                            <>
                              {cuentaEstadia.consumos.map((c) => `${c.cantidad}x ${c.nombre}`).join(', ')} · Total consumos: $
                              {cuentaEstadia.total_consumos.toLocaleString('es-CO')} COP
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setMostrarDesglose(true)}
                        className="text-[10px] font-bold text-amber-900 hover:text-amber-950 underline"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                ) : cuentaEstadia.total_hospedaje > 0 ? (
                  <div className="p-2 rounded-xl bg-slate-100/70 border border-slate-200/60 text-[11px] text-slate-600 flex items-center gap-2">
                    <BedDouble className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      Saldo proveniente de <strong>{cuentaEstadia.hospedaje.dias_estadia} noche(s)</strong> de alojamiento pactadas (sin consumos de inventario).
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Error al cargar cuenta con opción de reintentar */}
            {errorCuenta && !mostrarDesglose && (
              <div className="px-3.5 pb-3 flex items-center justify-between text-[11px] text-red-600 bg-red-50/50 p-2 border-t border-red-100">
                <span>{errorCuenta}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (estadiaId) {
                      setCargandoCuenta(true);
                      facturacionService
                        .obtenerCuentaEstadia(Number(estadiaId))
                        .then((c) => setCuentaEstadia(c))
                        .catch(() => setErrorCuenta('Error al reintentar'))
                        .finally(() => setCargandoCuenta(false));
                    }
                  }}
                  className="inline-flex items-center gap-1 font-semibold underline text-[10px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reintentar
                </button>
              </div>
            )}

            {/* Desglose Desplegable Inline */}
            {mostrarDesglose && cuentaEstadia && (
              <div className="p-3 sm:p-3.5 pt-0 border-t border-slate-200/80 bg-white">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Desglose de Cargos y Origen del Saldo
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalMiniDesglose(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 hover:text-red-700 underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Abrir en ventana completa
                  </button>
                </div>

                <DesgloseCuentaView
                  cuenta={cuentaEstadia}
                  onCopiarValor={(val, conc) => aplicarValorItem(val, conc)}
                />
              </div>
            )}
          </div>
        )}

        {/* Valor del Abono */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Valor del Abono (COP) *
          </label>
          <input
            type="number"
            required
            min="0"
            max={estadiaSeleccionada ? saldoVigente : undefined}
            value={valorInput}
            onChange={(e) => {
              let val = parseFloat(e.target.value) || 0;
              const maxVal = estadiaSeleccionada ? saldoVigente : undefined;
              if (maxVal !== undefined && val > maxVal) {
                val = maxVal;
              }
              setValorInput(e.target.value === '' ? '' : val.toString());
            }}
            onBlur={() => {
              let val = parseFloat(valorInput) || 0;
              const maxVal = estadiaSeleccionada ? saldoVigente : undefined;
              if (maxVal !== undefined && val > maxVal) {
                setValorInput(maxVal.toString());
              }
            }}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-base font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Método de Pago *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'efectivo', label: 'Efectivo' },
              { id: 'transferencia', label: 'Transferencia' },
              { id: 'tarjeta', label: 'Tarjeta' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetodoPago(m.id as 'efectivo' | 'transferencia' | 'tarjeta')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  metodoPago === m.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Concepto */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Concepto del Pago *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Abono inicial hospedaje / Consumo cafetería"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Error API */}
        {errorApi && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{errorApi}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<CreditCard className="w-4 h-4" />}
          >
            Registrar Pago
          </Button>
        </div>
      </form>
    )}
  </Modal>

      {/* Mini-Modal Popup de Desglose de Cuenta */}
      {modalMiniDesglose && cuentaEstadia && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="fixed inset-0"
            onClick={() => setModalMiniDesglose(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-fadeIn">
            {/* Encabezado */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Origen del Saldo · Estadía {cuentaEstadia.codigo_estadia}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Hab. {cuentaEstadia.habitacion?.numero || estadiaSeleccionada?.habitacion_numero || 'S/N'} · {cuentaEstadia.huesped?.nombre_completo || 'Huésped'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalMiniDesglose(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="px-5 py-4 max-h-[calc(80vh-120px)] overflow-y-auto">
              <DesgloseCuentaView
                cuenta={cuentaEstadia}
                onCopiarValor={(val, conc) => {
                  aplicarValorItem(val, conc);
                  setModalMiniDesglose(false);
                }}
              />
            </div>

            {/* Pie del modal */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setModalMiniDesglose(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white transition-colors"
              >
                Cerrar
              </button>
              {saldoVigente > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    aplicarSaldoPendiente();
                    setModalMiniDesglose(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Copiar Saldo Total (${saldoVigente.toLocaleString('es-CO')})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente reusable para el desglose detallado de la cuenta (usado inline y en mini-modal)
function DesgloseCuentaView({
  cuenta,
  onCopiarValor,
}: {
  cuenta: CuentaCentralizadaEstadia;
  onCopiarValor?: (valor: number, concepto: string) => void;
}) {
  const tieneConsumos = (cuenta.consumos?.length || 0) > 0;
  const tieneAbonos = (cuenta.abonos?.length || 0) > 0;
  const saldoPendiente = cuenta.saldo_pendiente;
  const soloConsumosPendientes = tieneConsumos && cuenta.total_hospedaje <= cuenta.total_abonos;

  return (
    <div className="space-y-3 text-xs text-slate-700">
      {/* Explicación / Diagnóstico del Saldo */}
      <div
        className={`p-3 rounded-xl border flex items-start gap-2.5 ${
          soloConsumosPendientes
            ? 'bg-amber-50/80 border-amber-200/80 text-amber-900'
            : tieneConsumos
            ? 'bg-orange-50/80 border-orange-200/80 text-orange-900'
            : 'bg-blue-50/80 border-blue-200/80 text-blue-900'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {soloConsumosPendientes ? (
            <Wine className="w-4 h-4 text-amber-600" />
          ) : tieneConsumos ? (
            <ShoppingCart className="w-4 h-4 text-orange-600" />
          ) : (
            <BedDouble className="w-4 h-4 text-blue-600" />
          )}
        </div>
        <div className="space-y-0.5">
          <p className="font-semibold text-xs">
            {soloConsumosPendientes
              ? 'Saldo exclusivo por bebidas / consumos de inventario'
              : tieneConsumos
              ? 'Saldo mixto: Hospedaje y consumos de inventario'
              : 'Saldo por servicio de hospedaje'}
          </p>
          <p className="text-[11px] leading-relaxed opacity-90">
            {soloConsumosPendientes
              ? `El valor del alojamiento ya está cubierto por los abonos. El saldo pendiente de $${saldoPendiente.toLocaleString(
                  'es-CO'
                )} COP corresponde únicamente a ${
                  cuenta.consumos.length === 1
                    ? 'la bebida o producto cargado a la habitación'
                    : 'los consumos de inventario cargados a la habitación'
                }.`
              : tieneConsumos
              ? `El huésped tiene pendiente el pago de hospedaje más ${cuenta.consumos.length} consumo(s) de inventario/bebidas registrados a su cuenta.`
              : `El saldo de $${saldoPendiente.toLocaleString(
                  'es-CO'
                )} COP corresponde al alojamiento pactado (${cuenta.hospedaje?.dias_estadia || 1} noche(s)). No registra consumos de inventario.`}
          </p>
        </div>
      </div>

      {/* 1. Hospedaje */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
        <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
            <BedDouble className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Servicio de Hospedaje ({cuenta.hospedaje?.dias_estadia || 1} noches)</span>
          </div>
          <span className="font-mono font-bold text-slate-900 text-xs">
            ${cuenta.total_hospedaje.toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="p-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600 bg-white">
          <span>
            Tarifa: <strong>${(cuenta.hospedaje?.tarifa_noche || 0).toLocaleString('es-CO')} COP / noche</strong>
          </span>
          <span className="text-slate-400 text-[10px]">
            Check-In: {cuenta.hospedaje?.fecha_checkin ? String(cuenta.hospedaje.fecha_checkin).substring(0, 10) : 'N/A'} · Previsto Out: {cuenta.hospedaje?.fecha_prevista_checkout ? String(cuenta.hospedaje.fecha_prevista_checkout).substring(0, 10) : 'N/A'}
          </span>
        </div>
      </div>

      {/* 2. Consumos de Inventario / Bebidas (Destacado para el caso del cliente) */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
        <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
            <Wine className="w-3.5 h-3.5 text-amber-600" />
            <span>
              2. Consumos de Inventario / Bebidas ({cuenta.consumos?.length || 0})
            </span>
          </div>
          <span className="font-mono font-bold text-amber-900 text-xs">
            ${cuenta.total_consumos.toLocaleString('es-CO')} COP
          </span>
        </div>

        {tieneConsumos ? (
          <div className="divide-y divide-slate-100">
            {cuenta.consumos.map((c, i) => (
              <div
                key={i}
                className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {c.cantidad}x
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-xs truncate">
                      {c.nombre}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Precio unitario: ${c.precio_venta.toLocaleString('es-CO')} COP
                      {c.created_at && !isNaN(new Date(c.created_at).getTime()) && (
                        <span>
                          {' '}·{' '}
                          {new Date(c.created_at).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-mono font-bold text-slate-900 text-xs block">
                    ${c.subtotal.toLocaleString('es-CO')}
                  </span>
                  {onCopiarValor && (
                    <button
                      type="button"
                      onClick={() =>
                        onCopiarValor(
                          c.subtotal,
                          `Pago consumo ${c.nombre} (x${c.cantidad})`
                        )
                      }
                      className="text-[10px] font-medium text-red-600 hover:text-red-700 underline mt-0.5"
                    >
                      Abonar este ítem
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2.5 px-3 text-slate-400 text-[11px] italic bg-white">
            Sin bebidas ni consumos de inventario registrados a la habitación.
          </div>
        )}
      </div>

      {/* 3. Abonos y Recibos Previos */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
        <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Pagos y Abonos Previos ({cuenta.abonos?.length || 0})</span>
          </div>
          <span className="font-mono font-bold text-emerald-600 text-xs">
            -${cuenta.total_abonos.toLocaleString('es-CO')} COP
          </span>
        </div>

        {tieneAbonos ? (
          <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
            {cuenta.abonos.map((a, i) => {
              const valorRecibido = a.valor || a.valor_recibido || 0;
              return (
                <div
                  key={i}
                  className="p-2 px-3 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {a.numero_recibo}
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                        {a.metodo_pago}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {a.concepto || 'Abono a cuenta'}
                      {a.fecha_pago && (
                        <span className="text-slate-400">
                          {' '}· {typeof a.fecha_pago === 'string' ? a.fecha_pago.substring(0, 10) : ''}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 text-xs shrink-0 pl-2">
                    +${valorRecibido.toLocaleString('es-CO')}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2.5 px-3 text-slate-400 text-[11px] italic bg-white">
            Sin abonos previos registrados para esta estadía.
          </div>
        )}
      </div>

      {/* 4. Resumen Matemático Consolidado */}
      <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600 text-[11px]">
          <span>(+) Subtotal Hospedaje:</span>
          <span className="font-mono font-semibold text-slate-800">
            ${cuenta.total_hospedaje.toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="flex justify-between text-slate-600 text-[11px]">
          <span>(+) Consumos Inventario / Minibar:</span>
          <span className="font-mono font-semibold text-slate-800">
            ${cuenta.total_consumos.toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="flex justify-between text-slate-600 text-[11px] font-medium border-t border-slate-200/60 pt-1">
          <span>(=) Total Cargos Acumulados:</span>
          <span className="font-mono font-bold text-slate-900">
            ${cuenta.total_cargos.toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="flex justify-between text-emerald-700 text-[11px]">
          <span>(-) Total Pagos y Abonos Recibidos:</span>
          <span className="font-mono font-bold">
            -${cuenta.total_abonos.toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-slate-900">
          <span className="text-xs">SALDO PENDIENTE A COBRAR:</span>
          <span
            className={`font-mono text-sm ${
              saldoPendiente > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            ${saldoPendiente.toLocaleString('es-CO')} COP
          </span>
        </div>
      </div>
    </div>
  );
}
