import { useState, useEffect, useCallback } from 'react';
import {
  limpiezaService,
  type TareaLimpieza,
  type DashboardLimpiezaResponse,
} from '../services/limpiezaService';
import { api } from '@/services/api';
import { useAppSelector } from '@/store/hooks';
import { selectUsuario } from '@/store/selectors/authSelectors';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Camera,
  Play,
  RotateCcw,
  Plus,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

export function LimpiezaWorkspace() {
  const usuarioActual = useAppSelector(selectUsuario);
  const [cargando, setCargando] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardLimpiezaResponse | null>(null);
  const [misTareas, setMisTareas] = useState<TareaLimpieza[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'disponible' | 'limpieza' | 'en_proceso' | 'mantenimiento'>('limpieza');
  const [usuariosSistema, setUsuariosSistema] = useState<any[]>([]);

  // Modales
  const [modalColaboradorAbierto, setModalColaboradorAbierto] = useState(false);
  const [tareaParaColaborador, setTareaParaColaborador] = useState<TareaLimpieza | null>(null);
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState('');

  const [modalFinalizarAbierto, setModalFinalizarAbierto] = useState(false);
  const [tareaParaFinalizar, setTareaParaFinalizar] = useState<TareaLimpieza | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [evidenciaUrl, setEvidenciaUrl] = useState('');
  const [liberarHabitacion, setLiberarHabitacion] = useState(true);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [guardandoFin, setGuardandoFin] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [dash, tareas] = await Promise.all([
        limpiezaService.obtenerDashboard(),
        limpiezaService.obtenerMisTareas(),
      ]);
      setDashboard(dash);
      setMisTareas(tareas);

      // Cargar lista de usuarios para colaboradores
      try {
        const resUsers = await api.get('/usuarios');
        setUsuariosSistema(resUsers.data?.data || []);
      } catch {
        setUsuariosSistema([]);
      }
    } catch (e) {
      console.error('Error cargando dashboard de limpieza:', e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleIniciarLimpieza = async (habitacionId: number) => {
    try {
      await limpiezaService.iniciarLimpieza(habitacionId);
      await cargarDatos();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al iniciar la limpieza');
    }
  };

  const handleSubirFotoEvidencia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      setSubiendoFoto(true);
      const res = await api.post('/habitaciones/upload-imagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data?.url) {
        setEvidenciaUrl(res.data.data.url);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al subir la fotografía de evidencia');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleConfirmarColaborador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaParaColaborador || !colaboradorSeleccionado) return;

    try {
      await limpiezaService.agregarColaborador(tareaParaColaborador.id, parseInt(colaboradorSeleccionado));
      setModalColaboradorAbierto(false);
      setTareaParaColaborador(null);
      setColaboradorSeleccionado('');
      await cargarDatos();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al vincular colaborador');
    }
  };

  const handleConfirmarFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaParaFinalizar) return;

    try {
      setGuardandoFin(true);
      await limpiezaService.finalizarLimpieza(tareaParaFinalizar.id, {
        observaciones: observaciones.trim() || undefined,
        evidencia_foto_url: evidenciaUrl.trim() || undefined,
        liberar_habitacion: liberarHabitacion,
      });

      setModalFinalizarAbierto(false);
      setTareaParaFinalizar(null);
      setObservaciones('');
      setEvidenciaUrl('');
      await cargarDatos();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al finalizar la tarea');
    } finally {
      setGuardandoFin(false);
    }
  };

  if (cargando && !dashboard) {
    return <Loading mensaje="Cargando panel de Servicios Generales..." />;
  }

  const metricas = dashboard?.metricas || {
    total: 0,
    disponibles: 0,
    pendientes_limpieza: 0,
    en_proceso: 0,
    mantenimiento: 0,
    ocupadas: 0,
  };

  // Filtrado de habitaciones para el rack de aseo
  const habitacionesFiltradas = (dashboard?.habitaciones || []).filter((h) => {
    if (filtroEstado === 'todos') return true;
    if (filtroEstado === 'en_proceso') {
      return (dashboard?.tareas_activas || []).some((t) => t.habitacion_id === h.id);
    }
    return h.estado === filtroEstado;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Servicios Generales & Housekeeping
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Operativo Móvil
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión y auditoría de limpieza en habitaciones, asignación colaborativa y cierre con novedades.
          </p>
        </div>

        <button
          onClick={cargarDatos}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 shadow-soft-xs transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Actualizar Estado</span>
        </button>
      </div>

      {/* Métricas Principales (Grid Móvil Adaptado) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 block mb-1">
              Pendientes Aseo
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-amber-900 tracking-tight">
              {metricas.pendientes_limpieza}
            </div>
            <span className="text-[10px] text-slate-400">Bloqueadas tras check-out</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-soft-xs">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-700 block mb-1">
              En Proceso
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-blue-900 tracking-tight">
              {metricas.en_proceso}
            </div>
            <span className="text-[10px] text-slate-400">Personal trabajando</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-soft-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 block mb-1">
              Disponibles
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-emerald-900 tracking-tight">
              {metricas.disponibles}
            </div>
            <span className="text-[10px] text-slate-400">Listas para check-in</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-soft-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-700 block mb-1">
              Mantenimiento
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-red-900 tracking-tight">
              {metricas.mantenimiento}
            </div>
            <span className="text-[10px] text-slate-400">Averías reportadas</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 border border-red-200/60 flex items-center justify-center text-red-700 shadow-soft-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sección 1: Panel Móvil "Mis Tareas de Limpieza" (RN-ASE-03) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Mis Asignaciones Activas</span>
            </h2>
            <p className="text-xs text-slate-500">
              Tareas donde eres líder o colaborador asignado actualmente.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70 self-start sm:self-auto">
            {misTareas.length} activas
          </span>
        </div>

        {misTareas.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">
              No tienes habitaciones en proceso de aseo actualmente.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Selecciona una habitación en estado "Pendiente" abajo para iniciar su aseo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {misTareas.map((tarea) => {
              const esLider = String(tarea.responsable_id) === String(usuarioActual?.id);
              return (
                <div
                  key={tarea.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs flex flex-col justify-between gap-3 transition-all hover:bg-amber-50/70"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-display text-slate-900">
                        Habitación {tarea.habitacion?.numero || tarea.habitacion_id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900">
                        En Aseo
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px]">
                          Inicio: {new Date(tarea.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Líder: <strong>{tarea.responsable?.nombre_completo || 'Operario'}</strong>{' '}
                          {esLider && <span className="text-amber-700 font-bold">(Tú)</span>}
                        </span>
                      </div>
                    </div>

                    {/* Colaboradores Vinculados (RN-ASE-01) */}
                    {tarea.colaboradores && tarea.colaboradores.length > 0 && (
                      <div className="pt-2 border-t border-amber-200/60">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                          Equipo Colaborador:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tarea.colaboradores.map((colab) => (
                            <span
                              key={colab.id}
                              className="text-[10px] bg-white border border-amber-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {colab.nombre_completo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones de la Tarea */}
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        setTareaParaColaborador(tarea);
                        setModalColaboradorAbierto(true);
                      }}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                      <span>+ Colaborador</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTareaParaFinalizar(tarea);
                        setModalFinalizarAbierto(true);
                      }}
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finalizar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección 2: Dashboard Operativo de Habitaciones (Filtros y Rack de Aseo) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold font-display text-slate-900">
              Rack Operativo de Servicios Generales
            </h2>
            <p className="text-xs text-slate-500">
              Filtra por estado para iniciar o monitorear las habitaciones del hotel.
            </p>
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'limpieza', label: 'Pendientes', conteo: metricas.pendientes_limpieza },
              { id: 'en_proceso', label: 'En Proceso', conteo: metricas.en_proceso },
              { id: 'disponible', label: 'Disponibles', conteo: metricas.disponibles },
              { id: 'mantenimiento', label: 'Mantenimiento', conteo: metricas.mantenimiento },
              { id: 'todos', label: 'Todas', conteo: metricas.total },
            ].map((f) => {
              const activo = filtroEstado === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFiltroEstado(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    activo
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label} <span className="opacity-70 text-[10px]">({f.conteo})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Habitaciones Responsivo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {habitacionesFiltradas.map((hab) => {
            const tareaActiva = (dashboard?.tareas_activas || []).find((t) => t.habitacion_id === hab.id);
            const esPendiente = hab.estado === 'limpieza' && !tareaActiva;
            const estaEnAseo = !!tareaActiva;

            return (
              <div
                key={hab.id}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all shadow-2xs ${
                  estaEnAseo
                    ? 'border-blue-300 bg-blue-50/50'
                    : esPendiente
                    ? 'border-amber-300 bg-amber-50/60'
                    : hab.estado === 'disponible'
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-slate-900">
                      Hab. {hab.numero}
                    </span>
                    <span className="text-[10px] text-slate-400">Piso {hab.piso?.numero_piso || 1}</span>
                  </div>

                  <div className="mt-1">
                    {estaEnAseo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                        <Clock className="w-2.5 h-2.5" />
                        En Aseo
                      </span>
                    ) : esPendiente ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Sparkles className="w-2.5 h-2.5" />
                        Pendiente
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 capitalize">
                        {hab.estado}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón de Inicio si está Pendiente */}
                {esPendiente ? (
                  <button
                    type="button"
                    onClick={() => handleIniciarLimpieza(hab.id)}
                    className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Iniciar Aseo</span>
                  </button>
                ) : estaEnAseo ? (
                  <span className="text-[10px] text-blue-700 font-medium truncate">
                    {tareaActiva?.responsable?.nombre_completo || 'En limpieza'}
                  </span>
                ) : (
                  <div className="text-[10px] text-slate-400">
                    {hab.tipo || 'Habitación'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Vincular Colaborador (RN-ASE-01) */}
      <Modal
        isOpen={modalColaboradorAbierto}
        onClose={() => {
          setModalColaboradorAbierto(false);
          setTareaParaColaborador(null);
        }}
        title="Sumar Colaborador al Equipo de Aseo"
        subtitle={`Habitación ${tareaParaColaborador?.habitacion?.numero || ''} (Sin bloqueo exclusivo - RN-ASE-01)`}
        maxWidth="sm"
        icon={<UserPlus className="w-5 h-5 text-amber-600" />}
      >
        <form onSubmit={handleConfirmarColaborador} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Seleccionar Colaborador *
            </label>
            <select
              required
              value={colaboradorSeleccionado}
              onChange={(e) => setColaboradorSeleccionado(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="">-- Elige un compañero de trabajo --</option>
              {usuariosSistema
                .filter((u) => u.id !== tareaParaColaborador?.responsable_id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre_completo || u.nombre} ({u.rol})
                  </option>
                ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Permite que varios operarios limpien y coordinen la misma habitación simultáneamente.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setModalColaboradorAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icono={<Plus className="w-4 h-4" />}
            >
              Vincular a Tarea
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Finalizar Tarea con Novedades y Foto (RN-ASE-02 / RN-ASE-03 / RN-ASE-04) */}
      <Modal
        isOpen={modalFinalizarAbierto}
        onClose={() => {
          setModalFinalizarAbierto(false);
          setTareaParaFinalizar(null);
        }}
        title="Protocolo de Cierre de Limpieza"
        subtitle={`Habitación ${tareaParaFinalizar?.habitacion?.numero || ''} (Cierre flexible con timestamps inmutables)`}
        maxWidth="md"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
      >
        <form onSubmit={handleConfirmarFinalizar} className="space-y-4 text-xs text-slate-700">
          {/* Novedades u Observaciones Opcionales (RN-ASE-02) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Observaciones o Novedades (Opcional - RN-ASE-02)
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Se cambiaron toallas y lencería completa. Minibar verificado sin consumos..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Evidencia Fotográfica Opcional (RN-ASE-02) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Foto de Evidencia (Opcional)</span>
              </span>
              {evidenciaUrl && (
                <span className="text-[10px] text-emerald-600 font-bold">✓ Foto adjuntada</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSubirFotoEvidencia}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
            />

            {subiendoFoto && <p className="text-[10px] text-blue-600">Subiendo imagen...</p>}

            {evidenciaUrl && (
              <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img src={evidenciaUrl} alt="Evidencia" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Liberación Condicionada de Habitación (RN-ASE-04) */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-950 block text-xs">
                Habilitar Habitación como Disponible
              </span>
              <span className="text-[10px] text-emerald-700">
                (RN-ASE-04) Se libera automáticamente para el rack de reservas.
              </span>
            </div>
            <input
              type="checkbox"
              checked={liberarHabitacion}
              onChange={(e) => setLiberarHabitacion(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setModalFinalizarAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              cargando={guardandoFin}
              icono={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirmar Cierre de Limpieza
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
