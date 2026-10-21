import { useState, useEffect } from 'react';
import { Search, Loader2, Users, FileText, Phone, Mail, Globe, Navigation, ChevronLeft, ChevronRight, Edit, History } from 'lucide-react';
import { api } from '@/services/api';
import { Input, Button } from '@/components';
import { EditarHuespedModal } from './EditarHuespedModal';
import { HistorialHuespedModal } from './HistorialHuespedModal';

interface Huesped {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  email: string | null;
  nacionalidad: string | null;
  ciudad_procedencia: string | null;
  ciudad_destino: string | null;
  es_extranjero: boolean;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  data: Huesped[];
  last_page: number;
  total: number;
}

export function DirectorioHuespedesTab({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  
  const [editingHuesped, setEditingHuesped] = useState<Huesped | null>(null);
  const [historyHuespedId, setHistoryHuespedId] = useState<number | null>(null);

  const fetchHuespedes = async (currentPage: number, searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/huespedes', {
        params: { search: searchTerm, page: currentPage }
      });
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el directorio de huéspedes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  useEffect(() => {
    fetchHuespedes(page, search);
  }, [page, search, refreshTrigger]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-700" />
              Directorio de Huéspedes
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Registro histórico completo de todas las personas alojadas en el hotel.
            </p>
          </div>
          
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o doc..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-9 bg-slate-50/50 border-slate-200"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-soft-xs">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-600 font-medium border-b border-slate-200/60">
                <tr>
                  <th className="px-4 py-3">Huésped</th>
                  <th className="px-4 py-3">Documento</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Nacionalidad</th>
                  <th className="px-4 py-3">Procedencia / Destino</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading && !data ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-red-700" />
                        <span>Cargando huéspedes...</span>
                      </div>
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron huéspedes con los criterios de búsqueda.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((huesped) => (
                    <tr key={huesped.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{huesped.nombres} {huesped.apellidos}</div>
                        {huesped.es_extranjero ? (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                            <Globe className="w-3 h-3" /> Extranjero
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{huesped.tipo_documento} {huesped.numero_documento}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex flex-col gap-1">
                          {huesped.telefono && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {huesped.telefono}
                            </div>
                          )}
                          {huesped.email && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {huesped.email}
                            </div>
                          )}
                          {!huesped.telefono && !huesped.email && (
                            <span className="text-slate-400 text-xs italic">Sin contacto</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {huesped.nacionalidad || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex flex-col gap-1 text-xs">
                          {huesped.ciudad_procedencia && (
                            <div className="flex items-center gap-1.5">
                              <Navigation className="w-3 h-3 text-slate-400" />
                              De: {huesped.ciudad_procedencia}
                            </div>
                          )}
                          {huesped.ciudad_destino && (
                            <div className="flex items-center gap-1.5">
                              <Navigation className="w-3 h-3 text-slate-400 rotate-90" />
                              A: {huesped.ciudad_destino}
                            </div>
                          )}
                          {!huesped.ciudad_procedencia && !huesped.ciudad_destino && (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingHuesped(huesped)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar Huésped"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setHistoryHuespedId(huesped.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Ver Historial"
                          >
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {data && data.last_page > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                Mostrando {(data.current_page - 1) * 15 + 1} a {Math.min(data.current_page * 15, data.total)} de {data.total}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={data.current_page === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.last_page) }, (_, i) => {
                    let pageNum = i + 1;
                    if (data.last_page > 5) {
                      if (data.current_page > 3) {
                        pageNum = data.current_page - 2 + i;
                      }
                      if (data.current_page > data.last_page - 2) {
                        pageNum = data.last_page - 4 + i;
                      }
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === data.current_page ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                  disabled={data.current_page === data.last_page || loading}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingHuesped && (
        <EditarHuespedModal
          isOpen={!!editingHuesped}
          onClose={() => setEditingHuesped(null)}
          huesped={editingHuesped}
          onSuccess={() => {
            setEditingHuesped(null);
            fetchHuespedes(page, search);
          }}
        />
      )}

      <HistorialHuespedModal
        isOpen={!!historyHuespedId}
        onClose={() => setHistoryHuespedId(null)}
        huespedId={historyHuespedId}
      />
    </div>
  );
}
