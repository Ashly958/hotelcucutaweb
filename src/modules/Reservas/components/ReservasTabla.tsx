import React from 'react';
import { Search, LogIn, XCircle, CheckCircle2, Clock } from 'lucide-react';
import type { Reserva, FiltrosReserva } from '../types/reserva.types';

interface ReservasTablaProps {
  reservas: Reserva[];
  filtros: FiltrosReserva;
  onFiltrosChange: (filtros: FiltrosReserva) => void;
  onCheckIn: (reserva: Reserva) => void;
  onCancelar: (id: number, motivo: string) => void;
}

export const ReservasTabla: React.FC<ReservasTablaProps> = ({
  reservas,
  filtros,
  onFiltrosChange,
  onCheckIn,
  onCancelar,
}) => {
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, huésped o documento..."
            value={filtros.termino || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, termino: e.target.value })}
            className="w-full text-sm border-0 focus:ring-0 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filtros.estado || ''}
            onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value || undefined })}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada (Check-In)</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Huésped</th>
                <th className="p-3.5">Habitación</th>
                <th className="p-3.5">Llegada / Salida</th>
                <th className="p-3.5">Noches</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Anticipo</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No se encontraron reservas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                reservas.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{r.codigo_reserva}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{r.nombre_completo}</div>
                      <div className="text-[10px] text-slate-500">{r.tipo_documento} {r.numero_documento}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">Hab {r.habitacion_numero || r.habitacion_id}</td>
                    <td className="p-3.5">
                      <div>{r.fecha_llegada}</div>
                      <div className="text-slate-400 text-[10px]">hasta {r.fecha_salida}</div>
                    </td>
                    <td className="p-3.5 font-medium">{r.noches}</td>
                    <td className="p-3.5 font-semibold text-slate-900">${r.total_estimado.toLocaleString()}</td>
                    <td className="p-3.5 font-semibold text-emerald-600">${r.abono_anticipo.toLocaleString()}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.estado === 'confirmada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.estado === 'pendiente'
                            ? 'bg-amber-100 text-amber-800'
                            : r.estado === 'completada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.estado === 'confirmada' && <CheckCircle2 className="w-3 h-3" />}
                        {r.estado === 'pendiente' && <Clock className="w-3 h-3" />}
                        {r.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {['pendiente', 'confirmada'].includes(r.estado) && (
                        <>
                          <button
                            onClick={() => onCheckIn(r)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition inline-flex items-center gap-1 shadow-xs"
                            title="Hacer Check-In inmediato"
                          >
                            <LogIn className="w-3 h-3" />
                            Check-In
                          </button>
                          <button
                            onClick={() => {
                              const motivo = prompt('Motivo de cancelación de la reserva:');
                              if (motivo) onCancelar(r.id, motivo);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition inline-flex items-center gap-1"
                            title="Cancelar reserva"
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
