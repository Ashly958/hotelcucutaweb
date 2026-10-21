import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, XCircle, Home, Clock, CreditCard } from 'lucide-react';
import { api } from '@/services/api';
import { Button } from '@/components';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface HistorialHuespedModalProps {
  isOpen: boolean;
  onClose: () => void;
  huespedId: number | null;
}

export function HistorialHuespedModal({ isOpen, onClose, huespedId }: HistorialHuespedModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && huespedId) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await api.get(`/huespedes/${huespedId}/historial`);
          setData(res.data.data);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Error al cargar el historial del huésped');
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setData(null);
    }
  }, [isOpen, huespedId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] z-10">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">
            Historial del Huésped {data ? `- ${data.huesped.nombres} ${data.huesped.apellidos}` : ''}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-red-700" />
              <p>Cargando información completa...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total de Estadías</p>
                    <p className="text-2xl font-bold text-slate-800">{data.estadisticas.total_estadias}</p>
                  </div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Facturado</p>
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(data.estadisticas.total_pagado)}</p>
                  </div>
                </div>
              </div>

              {/* Estadías */}
              <div>
                <h3 className="text-md font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" /> Historial de Estadías
                </h3>
                {data.estadias.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50/80 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Código</th>
                          <th className="px-4 py-3">Habitación</th>
                          <th className="px-4 py-3">Check-In</th>
                          <th className="px-4 py-3">Check-Out</th>
                          <th className="px-4 py-3">Tarifa / Noche</th>
                          <th className="px-4 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.estadias.map((estadia: any) => (
                          <tr key={estadia.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-800">{estadia.codigo_estadia}</td>
                            <td className="px-4 py-3 text-slate-600">{estadia.habitacion?.numero || '-'}</td>
                            <td className="px-4 py-3 text-slate-600">{formatDate(estadia.fecha_checkin)}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {estadia.fecha_real_checkout ? formatDate(estadia.fecha_real_checkout) : formatDate(estadia.fecha_prevista_checkout) + ' (Prev)'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{formatCurrency(estadia.tarifa_pactada_noche)}</td>
                            <td className="px-4 py-3">
                              {estadia.estado === 'activa' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Activa
                                </span>
                              ) : estadia.estado === 'finalizada' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                                  <CheckCircle2 className="w-3 h-3" /> Finalizada
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                                  <XCircle className="w-3 h-3" /> {estadia.estado}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No hay estadías registradas.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
