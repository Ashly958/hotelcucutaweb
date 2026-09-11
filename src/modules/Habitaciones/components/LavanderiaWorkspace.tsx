import { useState } from 'react';
import { IconoLavanderia } from '@/components';
import { Plus, Check, Clock } from 'lucide-react';

interface OrdenLavanderia {
  id: string;
  habitacion: string;
  huesped: string;
  prendas: number;
  tipoPrenda: string;
  total: number;
  estado: 'RECIBIDO' | 'LAVANDO' | 'LISTO' | 'ENTREGADO';
  hora: string;
}

export function LavanderiaWorkspace() {
  const [ordenes, setOrdenes] = useState<OrdenLavanderia[]>([
    {
      id: 'LAV-101',
      habitacion: '08',
      huesped: 'María Ruiz',
      prendas: 4,
      tipoPrenda: 'Camisas y prendas delicadas',
      total: 24000,
      estado: 'LAVANDO',
      hora: '09:30 AM',
    },
    {
      id: 'LAV-102',
      habitacion: '15',
      huesped: 'Juan Pérez',
      prendas: 2,
      tipoPrenda: 'Pantalones de dril',
      total: 12000,
      estado: 'LISTO',
      hora: '08:15 AM',
    },
    {
      id: 'LAV-103',
      habitacion: '04',
      huesped: 'Carlos Durán',
      prendas: 3,
      tipoPrenda: 'Camisetas y ropa casual',
      total: 18000,
      estado: 'RECIBIDO',
      hora: '10:45 AM',
    },
  ]);

  const [formHabitacion, setFormHabitacion] = useState('04');
  const [formPrendas, setFormPrendas] = useState(2);
  const [formDescripcion, setFormDescripcion] = useState('');

  const TARIFA_PRENDA = 6000;

  const handleCrearOrden = (e: React.FormEvent) => {
    e.preventDefault();
    const nueva: OrdenLavanderia = {
      id: `LAV-${Math.floor(100 + Math.random() * 900)}`,
      habitacion: formHabitacion,
      huesped: `Huésped Hab. ${formHabitacion}`,
      prendas: formPrendas,
      tipoPrenda: formDescripcion || 'Ropa variada',
      total: formPrendas * TARIFA_PRENDA,
      estado: 'RECIBIDO',
      hora: 'Ahora',
    };
    setOrdenes([nueva, ...ordenes]);
    setFormDescripcion('');
    alert(`Orden registrada: $${(formPrendas * TARIFA_PRENDA).toLocaleString('es-CO')} cargados a la cuenta de la Habitación ${formHabitacion}.`);
  };

  const handleAvanzarEstado = (id: string) => {
    setOrdenes(
      ordenes.map((o) => {
        if (o.id !== id) return o;
        if (o.estado === 'RECIBIDO') return { ...o, estado: 'LAVANDO' };
        if (o.estado === 'LAVANDO') return { ...o, estado: 'LISTO' };
        if (o.estado === 'LISTO') return { ...o, estado: 'ENTREGADO' };
        return o;
      })
    );
  };

  const totalPrendasHoy = ordenes.reduce((acc, o) => acc + o.prendas, 0);
  const totalFacturadoHoy = ordenes.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas de Lavandería */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Centro Operativo
            </span>
            <div className="text-lg font-bold font-serif text-slate-900">
              Piso 5 Exclusivo
            </div>
            <span className="text-[10px] text-slate-400">Regla RN-005</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <IconoLavanderia size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Tarifa por Prenda
            </span>
            <div className="text-2xl font-bold font-serif text-slate-900">
              $6.000 COP
            </div>
            <span className="text-[10px] text-slate-400">Cargo a folio (RF-010)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700">
            <span className="font-mono text-xs font-bold">RF-10</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Prendas Gestionadas
            </span>
            <div className="text-2xl font-bold font-serif text-blue-600">
              {totalPrendasHoy}
            </div>
            <span className="text-[10px] text-slate-400">En la jornada de hoy</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Total Facturado
            </span>
            <div className="text-2xl font-bold font-serif text-emerald-600">
              ${totalFacturadoHoy.toLocaleString('es-CO')}
            </div>
            <span className="text-[10px] text-slate-400">Sumado a cuentas de huésped</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <Check size={18} />
          </div>
        </div>
      </div>

      {/* Cuerpo Operativo: Formulario de Nueva Carga y Lista de Órdenes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Nueva Carga */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-base text-slate-900">
              Registrar Nueva Ropa
            </h3>
            <p className="text-xs text-slate-500">
              Ingreso de prendas entregadas por el huésped o camareras.
            </p>
          </div>

          <form onSubmit={handleCrearOrden} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Habitación
              </label>
              <select
                value={formHabitacion}
                onChange={(e) => setFormHabitacion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {['01', '04', '08', '12', '15', '22', '28', '33', '41'].map((num) => (
                  <option key={num} value={num}>
                    Habitación {num} (Piso {parseInt(num) <= 11 ? 1 : parseInt(num) <= 23 ? 2 : 3})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cantidad de Prendas
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formPrendas}
                onChange={(e) => setFormPrendas(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Detalle de Prendas
              </label>
              <input
                type="text"
                placeholder="Ej. 2 camisas, 1 pantalón"
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Total a Cargar:</span>
              <span className="font-bold text-blue-700 font-serif text-sm">
                ${(formPrendas * TARIFA_PRENDA).toLocaleString('es-CO')} COP
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ingresar a Lavandería</span>
            </button>
          </form>
        </div>

        {/* Órdenes Activas en Piso 5 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Órdenes en Planta de Lavado
              </h3>
              <p className="text-xs text-slate-500">
                Control de ciclo y entrega de prendas a habitaciones.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {ordenes.length} órdenes activas
            </span>
          </div>

          <div className="space-y-3">
            {ordenes.map((orden) => {
              const estadoBadge = {
                RECIBIDO: 'bg-slate-100 text-slate-700',
                LAVANDO: 'bg-amber-100 text-amber-800',
                LISTO: 'bg-blue-100 text-blue-800',
                ENTREGADO: 'bg-emerald-100 text-emerald-800',
              }[orden.estado];

              return (
                <div
                  key={orden.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-slate-900">
                        Habitación {orden.habitacion}
                      </span>
                      <span className="text-xs text-slate-500">· {orden.huesped}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${estadoBadge}`}>
                        {orden.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {orden.prendas} prenda(s): {orden.tipoPrenda} · {orden.hora}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-bold text-xs text-slate-800 font-serif">
                      ${orden.total.toLocaleString('es-CO')}
                    </span>
                    {orden.estado !== 'ENTREGADO' && (
                      <button
                        onClick={() => handleAvanzarEstado(orden.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                      >
                        {orden.estado === 'RECIBIDO'
                          ? 'Iniciar Lavado'
                          : orden.estado === 'LAVANDO'
                          ? 'Marcar Listo'
                          : 'Entregar a Huésped'}
                      </button>
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
