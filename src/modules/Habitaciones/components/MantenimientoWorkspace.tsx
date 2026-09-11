import { useState } from 'react';
import {
  IconoAireAcondicionado,
  IconoVentilador,
} from '@/components';
import { Wrench, CheckCircle, AlertTriangle } from 'lucide-react';

interface NovedadMantenimiento {
  id: string;
  habitacion: string;
  equipo: string;
  problema: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  estado: 'PENDIENTE' | 'EN_REPARACION' | 'RESUELTO';
  fecha: string;
}

export function MantenimientoWorkspace() {
  const [novedades, setNovedades] = useState<NovedadMantenimiento[]>([
    {
      id: 'MAN-01',
      habitacion: '18',
      equipo: 'Aire Acondicionado Split',
      problema: 'Revisión periódica de gas refrigerante y filtros',
      prioridad: 'MEDIA',
      estado: 'EN_REPARACION',
      fecha: '2026-09-10',
    },
    {
      id: 'MAN-02',
      habitacion: '34',
      equipo: 'Grifería Sanitaria',
      problema: 'Goteo en llave de lavamanos',
      prioridad: 'ALTA',
      estado: 'PENDIENTE',
      fecha: '2026-09-10',
    },
  ]);

  const [formHabitacion, setFormHabitacion] = useState('25');
  const [formEquipo, setFormEquipo] = useState('Aire Acondicionado');
  const [formProblema, setFormProblema] = useState('');
  const [formPrioridad, setFormPrioridad] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('MEDIA');

  const handleCrearNovedad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProblema.trim()) return;

    const nueva: NovedadMantenimiento = {
      id: `MAN-0${novedades.length + 1}`,
      habitacion: formHabitacion,
      equipo: formEquipo,
      problema: formProblema,
      prioridad: formPrioridad,
      estado: 'PENDIENTE',
      fecha: 'Hoy',
    };

    setNovedades([nueva, ...novedades]);
    setFormProblema('');
    alert(`Habitación ${formHabitacion} bloqueada en el sistema por mantenimiento preventivo.`);
  };

  const handleCompletarNovedad = (id: string) => {
    setNovedades(
      novedades.map((n) => (n.id === id ? { ...n, estado: 'RESUELTO' } : n))
    );
    alert('Trabajo técnico finalizado. La habitación pasa a estado de limpieza para su habilitación.');
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Mantenimiento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Habitaciones Bloqueadas
            </span>
            <div className="text-2xl font-bold font-serif text-rose-600">
              {novedades.filter((n) => n.estado !== 'RESUELTO').length}
            </div>
            <span className="text-[10px] text-slate-400">Fuera de venta (RF-002)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Aires Acondicionados
            </span>
            <div className="text-2xl font-bold font-serif text-slate-900">
              25 Unidades
            </div>
            <span className="text-[10px] text-slate-400">24 operativos · 1 en taller</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600">
            <IconoAireAcondicionado size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Ventiladores de Techo
            </span>
            <div className="text-2xl font-bold font-serif text-slate-900">
              20 Unidades
            </div>
            <span className="text-[10px] text-slate-400">100% operativos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
            <IconoVentilador size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Revisiones del Mes
            </span>
            <div className="text-2xl font-bold font-serif text-emerald-600">
              14 Resueltas
            </div>
            <span className="text-[10px] text-slate-400">Historial técnico (RF-018)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Grid: Formulario de Bloqueo y Lista de Novedades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Reporte Técnico */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-base text-slate-900">
              Reportar Mantenimiento
            </h3>
            <p className="text-xs text-slate-500">
              Bloquea la habitación para que recepción no la asigne a ningún huésped.
            </p>
          </div>

          <form onSubmit={handleCrearNovedad} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Número de Habitación
              </label>
              <select
                value={formHabitacion}
                onChange={(e) => setFormHabitacion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                {Array.from({ length: 45 }, (_, i) => String(i + 1).padStart(2, '0')).map((n) => (
                  <option key={n} value={n}>
                    Habitación {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Elemento Afectado
              </label>
              <select
                value={formEquipo}
                onChange={(e) => setFormEquipo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="Aire Acondicionado">Aire Acondicionado</option>
                <option value="Ventilador de Techo">Ventilador de Techo</option>
                <option value="Grifería / Ducha">Grifería / Ducha</option>
                <option value="Televisor / Control">Televisor / Control</option>
                <option value="Cerradura / Puerta">Cerradura / Puerta</option>
                <option value="Pintura / Pared">Pintura / Pared</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nivel de Prioridad
              </label>
              <select
                value={formPrioridad}
                onChange={(e) => setFormPrioridad(e.target.value as 'ALTA' | 'MEDIA' | 'BAJA')}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="ALTA">Alta (Bloqueo urgente)</option>
                <option value="MEDIA">Media (Revisión del día)</option>
                <option value="BAJA">Baja (Mantenimiento preventivo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Descripción del Daño
              </label>
              <textarea
                rows={2}
                placeholder="Describa la falla detectada..."
                value={formProblema}
                onChange={(e) => setFormProblema(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Wrench className="w-4 h-4" />
              <span>Bloquear y Registrar Novedad</span>
            </button>
          </form>
        </div>

        {/* Listado de Novedades y Órdenes de Mantenimiento */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Historial y Órdenes de Reparación
              </h3>
              <p className="text-xs text-slate-500">
                Monitoreo continuo de infraestructura y equipos hoteleros.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {novedades.filter((n) => n.estado !== 'RESUELTO').length} pendientes
            </span>
          </div>

          <div className="space-y-3">
            {novedades.map((nov) => {
              const prioridadBadge = {
                ALTA: 'bg-rose-100 text-rose-800',
                MEDIA: 'bg-amber-100 text-amber-800',
                BAJA: 'bg-slate-100 text-slate-700',
              }[nov.prioridad];

              return (
                <div
                  key={nov.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-slate-900">
                        Habitación {nov.habitacion}
                      </span>
                      <span className="text-xs text-slate-600">· {nov.equipo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${prioridadBadge}`}>
                        Prioridad {nov.prioridad}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {nov.problema}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Registrado: {nov.fecha}
                    </span>
                  </div>

                  <div>
                    {nov.estado !== 'RESUELTO' ? (
                      <button
                        onClick={() => handleCompletarNovedad(nov.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Habilitar Habitación</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Finalizado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
