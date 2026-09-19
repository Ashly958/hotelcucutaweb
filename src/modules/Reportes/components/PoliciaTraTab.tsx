import { Shield, Download, Printer } from 'lucide-react';
import { Button } from '@/components/Button';
import type { ReportePoliciaTraResponse } from '../types/reporte.types';

interface PoliciaTraTabProps {
  data: ReportePoliciaTraResponse | null;
  onExportarCsv?: () => void;
}

export function PoliciaTraTab({ data, onExportarCsv }: PoliciaTraTabProps) {
  if (!data) return null;

  const { total_registros, total_personas_alojadas, estadias_activas, estadias_finalizadas, registros } = data;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO OFICIAL POLICÍA NACIONAL / TRA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-red-50 text-red-700 rounded-xl mt-0.5">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/70">
                  REQUISITO LEGAL OBLIGATORIO
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mt-1 tracking-tight">
                Libro de Registro de Huéspedes & Tarjeta de Alojamiento (TRA)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Registro histórico para inspección de la <strong>Policía Nacional de Colombia</strong> y cumplimiento del
                Decreto 2590 / Ley 300 de Turismo. Auditoría de procedencias, identidades y acompañantes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImprimir}
              icono={<Printer className="w-3.5 h-3.5" />}
            >
              Imprimir Libro Oficial
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportarCsv}
              icono={<Download className="w-3.5 h-3.5" />}
            >
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* METRICAS POLICIALES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Total Registros</span>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">{total_registros}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Personas Alojadas</span>
            <span className="text-xl font-display font-bold text-red-900 tracking-tight">{total_personas_alojadas}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Huéspedes Activos Hoy</span>
            <span className="text-xl font-display font-bold text-emerald-800 tracking-tight">{estadias_activas}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">Estadías Finalizadas</span>
            <span className="text-xl font-display font-bold text-slate-700 tracking-tight">{estadias_finalizadas}</span>
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DEL LIBRO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Registros Detallados de Entrada y Salida
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Información consolidada de titulares y acompañantes por habitación.
          </p>
        </div>

        {registros.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se registran huéspedes en el periodo indicado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 text-slate-500 bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Folio / Hab.</th>
                  <th className="py-2.5 px-3 font-semibold">Huésped Titular</th>
                  <th className="py-2.5 px-3 font-semibold">Documento</th>
                  <th className="py-2.5 px-3 font-semibold">Procedencia & Destino</th>
                  <th className="py-2.5 px-3 font-semibold">Nacionalidad</th>
                  <th className="py-2.5 px-3 font-semibold">Acompañantes</th>
                  <th className="py-2.5 px-3 font-semibold">Fechas</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Pers.</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registros.map((r) => (
                  <tr key={r.estadia_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block font-display">
                        Hab. {r.habitacion}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {r.codigo_estadia}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-900 block">
                        {r.huesped_titular.nombre_completo}
                      </span>
                      {r.huesped_titular.profesion && (
                        <span className="text-[10px] text-slate-400 block">
                          {r.huesped_titular.profesion}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      <span className="text-[10px] text-slate-400 mr-1">{r.huesped_titular.tipo_documento}</span>
                      {r.huesped_titular.numero_documento}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="block font-medium">{r.huesped_titular.ciudad_procedencia || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400">Hacia: {r.huesped_titular.ciudad_destino || 'Cúcuta'}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          r.huesped_titular.es_extranjero
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.huesped_titular.nacionalidad}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      {r.acompanantes.length === 0 ? (
                        <span className="text-slate-400 text-[11px]">Sin acompañantes</span>
                      ) : (
                        <div className="space-y-1">
                          {r.acompanantes.map((ac, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700">
                              • {ac.nombre} <span className="text-slate-400">({ac.parentesco})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      <div>In: {r.fecha_checkin.slice(0, 10)}</div>
                      <div>Out: {(r.fecha_real_checkout || r.fecha_prevista_checkout).slice(0, 10)}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {r.cantidad_personas}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                          r.estado === 'activa'
                            ? 'bg-red-50 text-red-700 border border-red-200/80'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
