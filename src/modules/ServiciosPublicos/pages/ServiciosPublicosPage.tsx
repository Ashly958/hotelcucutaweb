import { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Plus,
  RefreshCw,
  Search,
  BarChart3,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { serviciosPublicosService } from '../services/serviciosPublicosService';
import { ServiciosPublicosTable } from '../components/ServiciosPublicosTable';
import { EstadisticasAnualesCard } from '../components/EstadisticasAnualesCard';
import { NuevoServicioModal } from '../components/NuevoServicioModal';
import { PagarServicioModal } from '../components/PagarServicioModal';
import { VisualizadorSoporteModal } from '../components/VisualizadorSoporteModal';
import type {
  ServicioPublico,
  EstadisticasAnualesServicios,
  FiltrosServicios,
  EstadoServicio,
  RegistrarServicioDTO,
  PagarServicioDTO,
} from '../types/serviciosPublicos.types';

export function ServiciosPublicosPage() {
  const anioActual = new Date().getFullYear();
  const [tabActiva, setTabActiva] = useState<'recibos' | 'estadisticas'>('recibos');

  // Filtros de listado
  const [filtros, setFiltros] = useState<FiltrosServicios>({
    anio: anioActual,
    mes: 'todos',
    tipo_servicio: 'todos',
    estado: 'todos',
    search: '',
  });

  // Datos
  const [servicios, setServicios] = useState<ServicioPublico[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAnualesServicios | null>(null);
  const [anioEstadisticas, setAnioEstadisticas] = useState<number>(anioActual);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [servicioAPagar, setServicioAPagar] = useState<ServicioPublico | null>(null);
  const [soporteVisualizar, setSoporteVisualizar] = useState<{
    url: string | null;
    titulo: string;
    tipo: 'recibo' | 'pago';
  }>({ url: null, titulo: '', tipo: 'recibo' });

  // Cargar lista de recibos
  const cargarServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await serviciosPublicosService.obtenerServicios(filtros);
      setServicios(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async (anio: number) => {
    try {
      setLoadingStats(true);
      const data = await serviciosPublicosService.obtenerEstadisticasAnuales(anio);
      setEstadisticas(data);
    } catch (err: any) {
      console.error('Error cargando estadísticas anuales:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  useEffect(() => {
    cargarEstadisticas(anioEstadisticas);
  }, [cargarEstadisticas, anioEstadisticas]);

  // Manejo de acciones
  const handleRegistrarServicio = async (datos: RegistrarServicioDTO) => {
    await serviciosPublicosService.registrarServicio(datos);
    await cargarServicios();
    await cargarEstadisticas(anioEstadisticas);
  };

  const handlePagarServicio = async (id: number, datos: PagarServicioDTO) => {
    await serviciosPublicosService.registrarPago(id, datos);
    await cargarServicios();
    await cargarEstadisticas(anioEstadisticas);
  };

  const handleEliminarServicio = async (id: number) => {
    try {
      await serviciosPublicosService.eliminarServicio(id);
      await cargarServicios();
      await cargarEstadisticas(anioEstadisticas);
    } catch (err: any) {
      alert('Error al eliminar servicio: ' + (err?.response?.data?.message || err?.message));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-soft-xs">
              <Zap className="w-5 h-5" />
            </div>
            <span>Servicios Públicos & Gastos Operativos</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Control de recibos de energía (CENS), agua potable (Aguas Kpital), gas, internet, soporte fotográfico y balances anuales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              cargarServicios();
              cargarEstadisticas(anioEstadisticas);
            }}
            disabled={loading || loadingStats}
            icono={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Actualizar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalNuevoOpen(true)}
            icono={<Plus className="w-4 h-4" />}
          >
            Subir Recibo de Servicio
          </Button>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTabActiva('recibos')}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 flex items-center gap-2 transition-all ${
            tabActiva === 'recibos'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Recibos y Facturas ({servicios.length})</span>
        </button>

        <button
          onClick={() => setTabActiva('estadisticas')}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 flex items-center gap-2 transition-all ${
            tabActiva === 'estadisticas'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Estadísticas & Análisis Anual</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Pestaña 1: Listado de Recibos y Filtros */}
      {tabActiva === 'recibos' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Buscador */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filtros.search}
                onChange={(e) => setFiltros((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Buscar por proveedor, referencia o nota..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Selector Tipo de Servicio */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Servicio:</span>
              <select
                value={filtros.tipo_servicio}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, tipo_servicio: e.target.value as any }))
                }
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
              >
                <option value="todos">Todos los servicios</option>
                <option value="luz">Energía / Luz</option>
                <option value="agua">Agua Potable</option>
                <option value="gas">Gas Natural</option>
                <option value="internet">Internet / Red</option>
                <option value="aseo">Aseo</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Selector Mes */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Mes:</span>
              <select
                value={filtros.mes}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    mes: e.target.value === 'todos' ? 'todos' : Number(e.target.value),
                  }))
                }
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
              >
                <option value="todos">Todos los meses</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            {/* Selector Estado */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Estado:</span>
              <select
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, estado: e.target.value as EstadoServicio | 'todos' }))
                }
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="vencido">Vencido</option>
                <option value="parcial">Parcial</option>
              </select>
            </div>

            {/* Selector Año */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Año:</span>
              <select
                value={filtros.anio}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    anio: e.target.value === 'todos' ? 'todos' : Number(e.target.value),
                  }))
                }
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500 font-bold"
              >
                <option value="todos">Todos</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          {/* Tabla de Servicios */}
          {loading ? (
            <div className="bg-white p-12 text-center text-slate-500 text-xs rounded-2xl border border-slate-200">
              Cargando recibos de servicios públicos...
            </div>
          ) : (
            <ServiciosPublicosTable
              servicios={servicios}
              onVerSoporte={(url, titulo, tipo) => {
                setSoporteVisualizar({ url, titulo, tipo });
              }}
              onPagar={(servicio) => setServicioAPagar(servicio)}
              onEliminar={handleEliminarServicio}
              onNuevoServicio={() => setModalNuevoOpen(true)}
            />
          )}
        </div>
      )}

      {/* Pestaña 2: Estadísticas y Análisis Anual */}
      {tabActiva === 'estadisticas' && (
        <EstadisticasAnualesCard
          estadisticas={estadisticas}
          anioSeleccionado={anioEstadisticas}
          onCambiarAnio={(a) => setAnioEstadisticas(a)}
          loading={loadingStats}
        />
      )}

      {/* Modales */}
      <NuevoServicioModal
        isOpen={modalNuevoOpen}
        onClose={() => setModalNuevoOpen(false)}
        onSubmit={handleRegistrarServicio}
        anioActual={typeof filtros.anio === 'number' ? filtros.anio : anioActual}
      />

      <PagarServicioModal
        isOpen={Boolean(servicioAPagar)}
        onClose={() => setServicioAPagar(null)}
        servicio={servicioAPagar}
        onSubmit={handlePagarServicio}
      />

      <VisualizadorSoporteModal
        isOpen={Boolean(soporteVisualizar.url)}
        onClose={() => setSoporteVisualizar({ url: null, titulo: '', tipo: 'recibo' })}
        titulo={soporteVisualizar.titulo}
        url={soporteVisualizar.url}
        tipo={soporteVisualizar.tipo}
      />
    </div>
  );
}
