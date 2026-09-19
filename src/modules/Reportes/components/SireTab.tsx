import { useState } from 'react';
import { Globe, Download, Edit3 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import type { ReporteSireResponse, RegistroSireItem } from '../types/reporte.types';

interface SireTabProps {
  data: ReporteSireResponse | null;
  onExportarCsv?: () => void;
  onActualizarSire?: (
    id: number,
    datos: { estado_reporte: string; codigo_confirmacion_sire?: string; observaciones?: string }
  ) => Promise<void>;
}

export function SireTab({ data, onExportarCsv, onActualizarSire }: SireTabProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroSireItem | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('exportado_sire');
  const [codigoConfirmacion, setCodigoConfirmacion] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState(false);

  if (!data) return null;

  const { total_extranjeros, pendientes_reporte, exportados_sire, completados, registros } = data;

  const handleAbrirEditar = (item: RegistroSireItem) => {
    setRegistroSeleccionado(item);
    setNuevoEstado(item.estado_reporte);
    setCodigoConfirmacion(item.codigo_confirmacion_sire || '');
    setObservaciones(item.observaciones || '');
    setModalAbierto(true);
  };

  const handleGuardarEstado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registroSeleccionado || !onActualizarSire) return;

    try {
      setGuardando(true);
      await onActualizarSire(registroSeleccionado.id, {
        estado_reporte: nuevoEstado,
        codigo_confirmacion_sire: codigoConfirmacion || undefined,
        observaciones: observaciones || undefined,
      });
      setModalAbierto(false);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SIRE MIGRACIÓN COLOMBIA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-red-50 text-red-700 rounded-xl mt-0.5">
              <Globe className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/70">
                  MIGRACIÓN COLOMBIA · NORMATIVA SIRE
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-1 tracking-tight">
                Sistema de Información para el Reporte de Extranjeros (SIRE)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Cumplimiento obligatorio para establecimientos de hospedaje (Decreto 1067 de 2015).
                Todo huésped de nacionalidad extranjera debe ser reportado dentro de las <strong>24 horas</strong> siguientes a su llegada.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportarCsv}
              icono={<Download className="w-3.5 h-3.5" />}
            >
              Descargar Plano SIRE (.csv)
            </Button>
          </div>
        </div>

        {/* MÉTRICAS SIRE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Total Extranjeros</span>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">{total_extranjeros}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Pendientes de Reporte</span>
            <span className="text-xl font-display font-bold text-amber-800 tracking-tight">{pendientes_reporte}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Exportados a SIRE</span>
            <span className="text-xl font-display font-bold text-blue-800 tracking-tight">{exportados_sire}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Completados / Confirmados</span>
            <span className="text-xl font-display font-bold text-emerald-800 tracking-tight">{completados}</span>
          </div>
        </div>
      </div>

      {/* TABLA DE EXTRANJEROS SIRE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Huéspedes Extranjeros Registrados
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identificación internacional, visado/pasaporte y control de códigos de confirmación gubernamentales.
          </p>
        </div>

        {registros.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se encuentran huéspedes extranjeros registrados en el sistema.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Huésped Extranjero</th>
                  <th className="py-2.5 px-3 font-semibold">Documento SIRE</th>
                  <th className="py-2.5 px-3 font-semibold">Nacionalidad / Emisión</th>
                  <th className="py-2.5 px-3 font-semibold">Habitación / Folio</th>
                  <th className="py-2.5 px-3 font-semibold">Motivo Viaje</th>
                  <th className="py-2.5 px-3 font-semibold">Estado SIRE</th>
                  <th className="py-2.5 px-3 font-semibold">Confirmación</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registros.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{r.huesped_nombre}</span>
                      <span className="text-[10px] text-slate-400">
                        Ingreso: {r.fecha_ingreso_colombia || 'No registrada'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      <span className="text-[10px] text-slate-400 mr-1 font-sans">{r.tipo_documento_sire}:</span>
                      {r.numero_documento_sire}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800 block">{r.nacionalidad}</span>
                      <span className="text-[10px] text-slate-400">Expedido: {r.pais_emision_doc}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800 font-display block">Hab. {r.habitacion}</span>
                      <span className="font-mono text-[10px] text-slate-400">{r.codigo_estadia}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {r.motivo_viaje}
                    </td>
                    <td className="py-2.5 px-3">
                      {r.estado_reporte === 'completado' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completado
                        </span>
                      ) : r.estado_reporte === 'exportado_sire' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Exportado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {r.codigo_confirmacion_sire || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAbrirEditar(r)}
                        icono={<Edit3 className="w-3 h-3" />}
                      >
                        Actualizar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA ACTUALIZAR ESTADO SIRE */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Actualizar Reporte SIRE (Migración Colombia)"
      >
        <form onSubmit={handleGuardarEstado} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500">Huésped: </span>
            <strong className="text-slate-900">{registroSeleccionado?.huesped_nombre}</strong>
            <span className="text-slate-500 ml-2">Documento: </span>
            <strong className="text-slate-900 font-mono">{registroSeleccionado?.numero_documento_sire}</strong>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Estado del Reporte</label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            >
              <option value="pendiente">Pendiente (No exportado aún)</option>
              <option value="exportado_sire">Exportado / Cargado a SIRE</option>
              <option value="completado">Completado & Aprobado con Radicado</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Código de Confirmación / Radicado SIRE
            </label>
            <Input
              value={codigoConfirmacion}
              onChange={(e) => setCodigoConfirmacion(e.target.value)}
              placeholder="Ej: SIRE-2026-987654"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Anotaciones sobre el reporte migratorio..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar Estado'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
