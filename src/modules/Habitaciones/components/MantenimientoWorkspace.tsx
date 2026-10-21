import { useState, useEffect } from 'react';
import {
  IconoAireAcondicionado,
  IconoVentilador,
} from '@/components';
import { Wrench, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  listarMantenimientos,
  reportarMantenimiento,
  resolverMantenimiento,
  type MantenimientoHabitacion,
  getHabitaciones,
} from '../services/habitacionesService';
import type { Habitacion } from '../types/habitacion.types';

export function MantenimientoWorkspace() {
  const [novedades, setNovedades] = useState<MantenimientoHabitacion[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formHabitacionId, setFormHabitacionId] = useState<number>(0);
  const [formCategoria, setFormCategoria] = useState('aire_acondicionado');
  const [formTitulo, setFormTitulo] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formPrioridad, setFormPrioridad] = useState<'baja' | 'media' | 'alta' | 'urgente'>('media');
  const [formCosto, setFormCosto] = useState<number>(0);
  const [formTecnico, setFormTecnico] = useState('');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [listaMantenimientos, listaHabitaciones] = await Promise.all([
        listarMantenimientos(),
        getHabitaciones(),
      ]);
      setNovedades(listaMantenimientos);
      setHabitaciones(listaHabitaciones);
      if (listaHabitaciones.length > 0 && formHabitacionId === 0) {
        setFormHabitacionId(parseInt(listaHabitaciones[0].id, 10));
      }
    } catch (error) {
      console.error('Error al cargar datos de mantenimiento:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearNovedad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formHabitacionId) return;

    try {
      setGuardando(true);
      await reportarMantenimiento({
        habitacion_id: formHabitacionId,
        titulo_averia: formTitulo,
        descripcion: formDescripcion || formTitulo,
        categoria: formCategoria,
        prioridad: formPrioridad,
        costo_repuestos: formCosto,
        tecnico_responsable: formTecnico || undefined,
      });

      setFormTitulo('');
      setFormDescripcion('');
      setFormCosto(0);
      setFormTecnico('');
      await cargarDatos();
      alert('Avería reportada exitosamente. La habitación ha pasado a estado de mantenimiento.');
    } catch (error) {
      console.error('Error al reportar mantenimiento:', error);
      alert('Error al registrar la avería.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCompletarNovedad = async (id: number) => {
    const notas = prompt('Observaciones de solución / arreglo finalizado (opcional):') || undefined;
    try {
      await resolverMantenimiento(id, { notas_solucion: notas });
      await cargarDatos();
      alert('Trabajo técnico finalizado. La habitación pasa a estar disponible automáticamente.');
    } catch (error) {
      console.error('Error al resolver mantenimiento:', error);
      alert('Error al marcar mantenimiento como resuelto.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Mantenimiento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Habitaciones Bloqueadas
            </span>
            <div className="text-2xl font-bold font-display text-rose-600 tracking-tight">
              {novedades.filter((n) => n.estado !== 'resuelta' && n.estado !== 'cancelada').length}
            </div>
            <span className="text-[10px] text-slate-400">En mantenimiento</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Aires Acondicionados
            </span>
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {habitaciones.filter((h) => h.tieneAire).length} Unidades
            </div>
            <span className="text-[10px] text-slate-400">Total en hotel</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600">
            <IconoAireAcondicionado size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Ventiladores de Techo
            </span>
            <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              {habitaciones.filter((h) => h.tieneVentilador).length} Unidades
            </div>
            <span className="text-[10px] text-slate-400">Total en hotel</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
            <IconoVentilador size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Averías Resueltas
            </span>
            <div className="text-2xl font-bold font-display text-emerald-600 tracking-tight">
              {novedades.filter((n) => n.estado === 'resuelta').length} Resueltas
            </div>
            <span className="text-[10px] text-slate-400">Historial técnico</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Grid: Formulario de Bloqueo y Lista de Novedades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Reporte Técnico */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Reportar Mantenimiento
            </h3>
            <p className="text-xs text-slate-500">
              Bloquea la habitación para que recepción no la asigne a ningún huésped.
            </p>
          </div>

          <form onSubmit={handleCrearNovedad} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Habitación
              </label>
              <select
                value={formHabitacionId}
                onChange={(e) => setFormHabitacionId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
                required
              >
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    Habitación {h.numero} ({h.estado})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Categoría / Elemento
              </label>
              <select
                value={formCategoria}
                onChange={(e) => setFormCategoria(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
              >
                <option value="aire_acondicionado">Aire Acondicionado</option>
                <option value="ventilador">Ventilador de Techo</option>
                <option value="plomeria">Grifería / Plomería</option>
                <option value="electricidad">Electricidad / Iluminación</option>
                <option value="tecnologia_tv">Televisor / Controles</option>
                <option value="carpinteria">Cerradura / Carpintería</option>
                <option value="lenceria_mobiliario">Lencería / Mobiliario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Título de la Avería
              </label>
              <input
                type="text"
                placeholder="Ej. Fuga de agua en el baño..."
                value={formTitulo}
                onChange={(e) => setFormTitulo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nivel de Prioridad
                </label>
                <select
                  value={formPrioridad}
                  onChange={(e) => setFormPrioridad(e.target.value as 'baja' | 'media' | 'alta' | 'urgente')}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Técnico / Responsable
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Pérez"
                  value={formTecnico}
                  onChange={(e) => setFormTecnico(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Descripción Detallada
              </label>
              <textarea
                rows={2}
                placeholder="Describa la falla detectada..."
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Wrench className="w-4 h-4" />
              <span>{guardando ? 'Guardando...' : 'Bloquear y Registrar Avería'}</span>
            </button>
          </form>
        </div>

        {/* Listado de Novedades y Órdenes de Mantenimiento */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Historial y Órdenes de Reparación
              </h3>
              <p className="text-xs text-slate-500">
                Monitoreo continuo de infraestructura y equipos hoteleros.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cargarDatos}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Refrescar"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-400 font-mono">
                {novedades.filter((n) => n.estado !== 'resuelta' && n.estado !== 'cancelada').length} pendientes
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {cargando ? (
              <div className="py-8 text-center text-xs text-slate-400">Cargando mantenimientos...</div>
            ) : novedades.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No hay averías registradas actualmente.</div>
            ) : (
              novedades.map((nov) => {
                const prioridadBadge = {
                  urgente: 'bg-rose-100 text-rose-800',
                  alta: 'bg-rose-50 text-rose-700',
                  media: 'bg-amber-100 text-amber-800',
                  baja: 'bg-slate-100 text-slate-700',
                }[nov.prioridad] || 'bg-slate-100 text-slate-700';

                const estaPendiente = nov.estado !== 'resuelta' && nov.estado !== 'cancelada';

                return (
                  <div
                    key={nov.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate-900">
                          Habitación {nov.habitacion?.numero || nov.habitacion_id}
                        </span>
                        <span className="text-xs text-slate-600">· {nov.categoria}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${prioridadBadge}`}>
                          {nov.prioridad}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{nov.titulo_averia}</p>
                      {nov.descripcion && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {nov.descripcion}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span>Registrado: {new Date(nov.fecha_reporte).toLocaleDateString('es-CO')}</span>
                        {nov.tecnico_responsable && <span>Técnico: {nov.tecnico_responsable}</span>}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 shrink-0">
                      {estaPendiente ? (
                        <button
                          onClick={() => handleCompletarNovedad(nov.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Habilitar Habitación</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Resuelta
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
