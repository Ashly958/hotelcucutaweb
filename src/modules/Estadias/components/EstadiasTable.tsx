import { Eye, LogOut, CheckCircle, Clock } from 'lucide-react';
import type { Estadia } from '../types/estadia.types';
import { EmptyState } from '@/components/EmptyState';

interface EstadiasTableProps {
  estadias: Estadia[];
  onVerDetalle: (estadia: Estadia) => void;
  onCheckOut: (id: number) => void;
  onNuevoCheckIn: () => void;
}

export function EstadiasTable({
  estadias,
  onVerDetalle,
  onCheckOut,
  onNuevoCheckIn,
}: EstadiasTableProps) {
  if (estadias.length === 0) {
    return (
      <EmptyState
        titulo="No se encontraron estadías"
        descripcion="No hay registros que coincidan con los filtros seleccionados o aún no se han registrado check-ins."
        textoAccion="Registrar Nuevo Check-In"
        onAccion={onNuevoCheckIn}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="py-3 px-4">Código / Hab.</th>
              <th className="py-3 px-4">Huésped Titular</th>
              <th className="py-3 px-4">Documento</th>
              <th className="py-3 px-4">Fechas (In / Prevista)</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right">Saldo Pendiente</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {estadias.map((est) => {
              const habNumero = est.habitacion_numero || String(est.habitacion_id).padStart(2, '0');
              const esActiva = est.estado === 'activa';
              const tieneSaldo = est.saldo_pendiente > 0;

              return (
                <tr key={est.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Código y Habitación */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-50 text-red-700 border border-red-200/60 font-display font-bold text-xs flex items-center justify-center shadow-soft-xs">
                        {habNumero}
                      </span>
                      <div>
                        <span className="font-mono font-semibold text-slate-900 block">
                          {est.codigo_estadia}
                        </span>
                        <span className="text-[10px] text-slate-400">Hab. {habNumero}</span>
                      </div>
                    </div>
                  </td>

                  {/* Huésped */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">
                      {est.huesped ? `${est.huesped.nombres} ${est.huesped.apellidos}` : 'Sin datos'}
                    </div>
                    {est.huesped?.ciudad_procedencia && (
                      <span className="text-[10px] text-slate-400">
                        De: {est.huesped.ciudad_procedencia}
                      </span>
                    )}
                  </td>

                  {/* Documento */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {est.huesped ? `${est.huesped.tipo_documento} ${est.huesped.numero_documento}` : '-'}
                  </td>

                  {/* Fechas */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{est.fecha_checkin ? est.fecha_checkin.substring(0, 10) : '-'}</div>
                    <div className="text-[10px] text-slate-400">
                      Hasta: {est.fecha_prevista_checkout ? est.fecha_prevista_checkout.substring(0, 10) : 'Salida estándar'} ({est.dias_estadia || 1} noches)
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                    ${(est.total || 0).toLocaleString('es-CO')}
                  </td>

                  {/* Saldo Pendiente */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {tieneSaldo ? (
                      <span className="text-red-600">
                        ${(est.saldo_pendiente || 0).toLocaleString('es-CO')}
                      </span>
                    ) : (
                      <span className="text-emerald-600">$0 (Al día)</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 text-center">
                    {esActiva ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Clock className="w-3 h-3" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <CheckCircle className="w-3 h-3" />
                        Finalizada
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onVerDetalle(est)}
                        title="Ver detalle completo"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {esActiva && (
                        <button
                          onClick={() => onCheckOut(est.id)}
                          title="Realizar Check-Out"
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
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
