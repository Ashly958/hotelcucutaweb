import { HabitacionCard } from './HabitacionCard';
import type { TipoHabitacion } from '../types/onboarding.types';

interface OnboardingHabitacionesProps {
  numWhatsapp: string;
  precios?: any[];
}

export function OnboardingHabitaciones({ numWhatsapp, precios = [] }: OnboardingHabitacionesProps) {
  const habitacionesMostradas: TipoHabitacion[] = precios
    .filter((p) => p.activo !== false && p.activo !== 0 && p.activo !== '0')
    .map((p) => {
      let amenidades = [];
      if (typeof p.amenidades === 'string') {
        try {
          amenidades = JSON.parse(p.amenidades);
        } catch (e) {
          amenidades = p.amenidades ? p.amenidades.split(',').map((s: string) => s.trim()) : [];
        }
      } else if (Array.isArray(p.amenidades)) {
        amenidades = p.amenidades;
      }

      return {
        nombre: p.tipo_habitacion || p.tipoHabitacion || 'Habitación',
        descripcion: p.descripcion || '',
        precio: p.precio ? `$${Number(p.precio).toLocaleString('es-CO')}` : '$0',
        camas: p.camas || 'Camas no especificadas',
        maxPersonas: `Hasta ${p.max_personas || p.maxPersonas || 2} personas`,
        amenidades: amenidades,
        destacado: !!p.destacado,
        badge: p.badge || undefined,
        imagenUrl: p.imagen_url || p.imagenUrl || undefined,
      } as TipoHabitacion;
    });

  return (
    <section id="habitaciones" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
            Acomodación
          </span>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
            Nuestras Habitaciones
          </h2>
        </div>
        <span className="text-xs text-slate-500">45 Habitaciones · Pisos 1 al 4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {habitacionesMostradas.map((habitacion, idx) => (
          <HabitacionCard
            key={habitacion.nombre + idx}
            habitacion={habitacion}
            numWhatsapp={numWhatsapp}
          />
        ))}
      </div>
      
      {habitacionesMostradas.length === 0 && (
        <p className="text-center text-slate-500 py-8">No hay habitaciones configuradas por el momento.</p>
      )}
    </section>
  );
}
