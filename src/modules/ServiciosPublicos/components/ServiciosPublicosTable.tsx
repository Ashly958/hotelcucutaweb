import {
  Zap,
  Droplets,
  Flame,
  Wifi,
  Trash2,
  HelpCircle,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Trash,
} from 'lucide-react';
import type { ServicioPublico, TipoServicio } from '../types/serviciosPublicos.types';
import { EmptyState } from '@/components/EmptyState';

interface ServiciosPublicosTableProps {
  servicios: ServicioPublico[];
  onVerSoporte: (url: string, titulo: string, tipo: 'recibo' | 'pago') => void;
  onPagar: (servicio: ServicioPublico) => void;
  onEliminar: (id: number) => void;
  onNuevoServicio: () => void;
}

const SERVICIO_BADGES: Record<TipoServicio, { label: string; icon: any; color: string }> = {
  luz: { label: 'Energía / Luz', icon: Zap, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  agua: { label: 'Agua Potable', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  gas: { label: 'Gas Natural', icon: Flame, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  internet: { label: 'Internet / TV', icon: Wifi, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  aseo: { label: 'Aseo y Basuras', icon: Trash2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  otro: { label: 'Otro', icon: HelpCircle, color: 'text-slate-700 bg-slate-50 border-slate-200' },
};

const MESES_NOMBRES = [
  '', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export function ServiciosPublicosTable({
  servicios,
  onVerSoporte,
  onPagar,
  onEliminar,
  onNuevoServicio,
}: ServiciosPublicosTableProps) {
  if (servicios.length === 0) {
    return (
      <EmptyState
        titulo="No se encontraron recibos de servicios públicos"
        descripcion="No hay recibos registrados con los filtros aplicados o aún no se han subido recibos."
        textoAccion="Registrar Recibo de Servicio"
        onAccion={onNuevoServicio}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="py-3 px-4">Servicio & Proveedor</th>
              <th className="py-3 px-4">Periodo</th>
              <th className="py-3 px-4">Referencia / Factura</th>
              <th className="py-3 px-4">Vencimiento</th>
              <th className="py-3 px-4 text-right">Monto Facturado</th>
              <th className="py-3 px-4 text-right">Monto Pagado</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Soportes (Fotos)</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {servicios.map((item) => {
              const conf = SERVICIO_BADGES[item.tipo_servicio] || SERVICIO_BADGES.otro;
              const Icon = conf.icon;
              const tieneSaldo = item.saldo_pendiente > 0;
              const esPagado = item.estado === 'pagado';
              const esVencido = item.estado === 'vencido';

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Tipo de servicio & Proveedor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-soft-xs ${conf.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block capitalize">
                          {conf.label}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {item.empresa_proveedor}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Periodo */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-slate-800">
                      {MESES_NOMBRES[item.periodo_mes] || `M${item.periodo_mes}`} {item.periodo_anio}
                    </span>
                  </td>

                  {/* Factura o Referencia */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-600 block">
                      {item.numero_factura_referencia || '-'}
                    </span>
                    {item.metodo_pago && (
                      <span className="text-[10px] text-slate-400 uppercase">
                        {item.metodo_pago.replace('_', ' ')}
                      </span>
                    )}
                  </td>

                  {/* Fechas */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.fecha_vencimiento ? (
                      <div>
                        <span className={esVencido ? 'text-red-600 font-semibold' : 'text-slate-800'}>
                          {item.fecha_vencimiento}
                        </span>
                        {item.fecha_pago && (
                          <span className="block text-[10px] text-emerald-600">
                            Pagado: {item.fecha_pago}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Sin fecha</span>
                    )}
                  </td>

                  {/* Monto Facturado */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ${item.monto_facturado.toLocaleString('es-CO')}
                  </td>

                  {/* Monto Pagado */}
                  <td className="py-3.5 px-4 text-right font-mono">
                    <span className={item.monto_pagado > 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                      ${item.monto_pagado.toLocaleString('es-CO')}
                    </span>
                    {tieneSaldo && (
                      <span className="block text-[10px] text-red-500 font-medium">
                        Pend: ${item.saldo_pendiente.toLocaleString('es-CO')}
                      </span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 text-center">
                    {esPagado ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Pagado
                      </span>
                    ) : esVencido ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3 h-3" />
                        Vencido
                      </span>
                    ) : item.estado === 'parcial' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Abono Parcial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    )}
                  </td>

                  {/* Soportes de Fotos */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.soporte_recibo_url ? (
                        <button
                          onClick={() =>
                            onVerSoporte(
                              item.soporte_recibo_url!,
                              `Recibo ${item.tipo_servicio.toUpperCase()} · Mes ${item.periodo_mes}/${item.periodo_anio}`,
                              'recibo'
                            )
                          }
                          title="Ver foto del recibo subido"
                          className="px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-[10px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Recibo</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300">Sin recibo</span>
                      )}

                      {item.soporte_pago_url && (
                        <button
                          onClick={() =>
                            onVerSoporte(
                              item.soporte_pago_url!,
                              `Comprobante de Pago · ${item.tipo_servicio.toUpperCase()}`,
                              'pago'
                            )
                          }
                          title="Ver comprobante de pago"
                          className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-[10px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Pago</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {tieneSaldo && (
                        <button
                          onClick={() => onPagar(item)}
                          title="Pagar servicio y subir foto comprobante"
                          className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-[11px] flex items-center gap-1 shadow-soft-xs transition-colors"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Pagar</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar este registro de servicio público?`)) {
                            onEliminar(item.id);
                          }
                        }}
                        title="Eliminar registro"
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
