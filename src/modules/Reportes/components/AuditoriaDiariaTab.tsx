import { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Wallet,
  BedDouble,
  Package,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import type { ReporteAuditoriaDiariaResponse } from '../types/reporte.types';

interface AuditoriaDiariaTabProps {
  data: ReporteAuditoriaDiariaResponse | null;
  onEjecutarCierre?: (datos: {
    fecha_auditoria: string;
    observaciones?: string;
    saldo_real_entregado?: number;
  }) => Promise<void>;
}

export function AuditoriaDiariaTab({ data, onEjecutarCierre }: AuditoriaDiariaTabProps) {
  const [modalCierreAbierto, setModalCierreAbierto] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  if (!data) return null;

  const {
    fecha_auditoria,
    estado_auditoria,
    auditoria_oficial,
    metricas_habitaciones,
    metricas_financieras,
    checkouts_pendientes,
    recibos_dia,
    alertas_stock,
    checklist,
    turno_caja_abierto,
  } = data;

  const formatearDinero = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmarCierre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEjecutarCierre) return;

    try {
      setGuardando(true);
      await onEjecutarCierre({
        fecha_auditoria,
        observaciones: observaciones || undefined,
      });
      setModalCierreAbierto(false);
      setObservaciones('');
    } finally {
      setGuardando(false);
    }
  };

  const handleImprimirActa = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AUDITORÍA NOCTURNA / CIERRE OPERATIVO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-red-50 text-red-700 rounded-xl mt-0.5">
              <FileCheck2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/70">
                  AUDITORÍA NOCTURNA & CIERRE DIARIO
                </span>
                {estado_auditoria === 'cerrada' ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Cerrada con Acta Oficial
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pendiente de Cierre
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-1 tracking-tight">
                Auditoría Operativa del Día ({fecha_auditoria})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Validación de arqueo de caja en efectivo (RN-010), revisión de estatus de habitaciones, folios con saldos pendientes e inventario antes del cambio de fecha hotelera.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {estado_auditoria === 'cerrada' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleImprimirActa}
                icono={<Printer className="w-3.5 h-3.5" />}
              >
                Imprimir Acta de Cierre
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalCierreAbierto(true)}
                icono={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Ejecutar Cierre Diario
              </Button>
            )}
          </div>
        </div>

        {/* SI YA SE CERRÓ LA AUDITORÍA */}
        {auditoria_oficial && (
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 flex items-start justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold block">Acta de Cierre Registrada:</span>
              <span>Cerrado el {auditoria_oficial.cerrado_el} por <strong>{auditoria_oficial.usuario_auditor}</strong>.</span>
              {auditoria_oficial.observaciones && (
                <p className="italic text-emerald-800 mt-1">"{auditoria_oficial.observaciones}"</p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Total Validado:</span>
              <span className="block font-mono font-bold text-base">{formatearDinero(auditoria_oficial.total_efectivo)}</span>
            </div>
          </div>
        )}
      </div>

      {/* METRICAS DEL DÍA AUDITADO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Recaudos en Efectivo</span>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-display font-bold text-emerald-800 mt-2 block tracking-tight">
            {formatearDinero(metricas_financieras.total_efectivo)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Total entradas de caja hoy
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ocupación Cuartos</span>
            <span className="p-2 bg-red-50 rounded-xl text-red-700">
              <BedDouble className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-display font-bold text-slate-900 mt-2 block tracking-tight">
            {metricas_habitaciones.tasa_ocupacion}%
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {metricas_habitaciones.ocupadas} ocupadas / {metricas_habitaciones.disponibles} disponibles
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Folios con Saldo</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-700">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-display font-bold text-purple-900 mt-2 block tracking-tight">
            {metricas_financieras.folios_con_saldo}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {formatearDinero(metricas_financieras.saldo_cartera_pendiente)} por recaudar
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Check-Outs Vencidos</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <span className="text-2xl font-display font-bold text-amber-800 mt-2 block tracking-tight">
            {checkouts_pendientes.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Requieren regularización
          </span>
        </div>
      </div>

      {/* CHECKLIST DE AUDITORÍA Y COMPROBACIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Checklist de Control Operativo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocolos que deben verificarse antes de realizar el cierre de la jornada.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {checklist.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3"
              >
                {c.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="block text-xs font-semibold text-slate-800">{c.item}</span>
                  <span className="text-[11px] text-slate-500">{c.detalle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE DE CAJA Y MOVIMIENTOS HOY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Recaudos y Caja del Día ({recibos_dia.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {turno_caja_abierto ? (
                <>Turno activo de <strong>{turno_caja_abierto.cajero}</strong> (Base: {formatearDinero(turno_caja_abierto.base_inicial)})</>
              ) : (
                'Sin turno de caja abierto actualmente'
              )}
            </p>
          </div>

          {recibos_dia.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay recibos de caja emitidos en esta jornada.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {recibos_dia.map((r) => (
                <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{r.numero_recibo}</span>
                    <span className="text-slate-600">{r.concepto}</span>
                    <span className="text-[10px] text-slate-400 block">{r.hora} · Por {r.cajero}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800">
                    {formatearDinero(r.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {alertas_stock.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1 mb-1">
                <Package className="w-3.5 h-3.5" />
                Alertas de Stock Mínimo ({alertas_stock.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {alertas_stock.map((al) => (
                  <span key={al.id} className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {al.nombre} ({al.stock_actual} uds)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PARA CONFIRMAR CIERRE DIARIO */}
      <Modal
        isOpen={modalCierreAbierto}
        onClose={() => setModalCierreAbierto(false)}
        title="Ejecutar Cierre Diario & Auditoría Nocturna"
      >
        <form onSubmit={handleConfirmarCierre} className="space-y-4">
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/70 text-xs space-y-1">
            <span className="font-bold text-red-900 block">Confirmación de Cierre de Fecha Hotelera</span>
            <p className="text-slate-600">
              Se generará el acta oficial con el balance de <strong>{formatearDinero(metricas_financieras.total_efectivo)}</strong> en efectivo,
              tasa de ocupación de <strong>{metricas_habitaciones.tasa_ocupacion}%</strong> y estado de folios.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Observaciones y Novedades del Turno
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Indique novedades de mantenimiento, arqueo de caja o estadías prolongadas..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalCierreAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={guardando}
            >
              {guardando ? 'Registrando Cierre...' : 'Confirmar y Guardar Acta'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
