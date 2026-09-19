import { Edit, Trash2, BedDouble, WashingMachine, Shield } from 'lucide-react';
import type { Piso } from '../types/piso.types';


interface PisosGridProps {
  pisos: Piso[];
  onEditar: (p: Piso) => void;
  onEliminar: (id: number) => void;
}

export function PisosGrid({ pisos, onEditar, onEliminar }: PisosGridProps) {
  const getIconoPiso = (num: number) => {
    if (num === 1) return <Shield className="w-4 h-4 text-red-600" />;
    if (num === 5) return <WashingMachine className="w-4 h-4 text-slate-600" />;
    return <BedDouble className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-3">
      {pisos.map((piso) => (
        <div
          key={piso.id}
          className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300/80 transition-colors"
        >
          {/* Columna Izquierda: Nivel & Nombre */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-center font-display font-bold text-lg text-slate-800 flex-shrink-0 shadow-soft-xs">
              {piso.numero_piso}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                  {piso.nombre}
                </h3>
                {piso.numero_piso === 5 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                    Área Operativa Textil
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50/70 text-red-700 border border-red-200/60">
                    {piso.total_habitaciones || 0} Habitaciones
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {piso.descripcion || 'Sin descripción adicional.'}
              </p>

              {piso.areas_servicio && (
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-medium text-slate-600">Servicio:</span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 font-mono text-[10px] text-slate-600">
                    {piso.areas_servicio}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Icono de Tipo y Acciones */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center">
              {getIconoPiso(piso.numero_piso)}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEditar(piso)}
                title="Editar información del piso"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70 transition-colors shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>

              {piso.numero_piso > 5 && (
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar nivel ${piso.nombre}?`)) {
                      onEliminar(piso.id);
                    }
                  }}
                  title="Eliminar piso"
                  className="p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200/70 transition-colors shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
