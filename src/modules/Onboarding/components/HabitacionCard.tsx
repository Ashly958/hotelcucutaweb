// ─── HabitacionCard — Card de tipo de habitación en la guía pública ───────────

import { ArrowRight, Users, BedDouble, CheckCircle2 } from 'lucide-react';
import type { TipoHabitacion } from '../types/onboarding.types';

interface HabitacionCardProps {
  habitacion: TipoHabitacion;
  numWhatsapp: string;
}

export function HabitacionCard({ habitacion, numWhatsapp }: HabitacionCardProps) {
  const msgWhatsApp = encodeURIComponent(
    `Hola, deseo consultar por la Habitación ${habitacion.nombre}`
  );

  return (
    <article
      className={`bg-white rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-soft-xs relative ${
        habitacion.destacado
          ? 'border-red-300 ring-1 ring-red-200'
          : 'border-slate-200/80'
      }`}
    >
      {/* Badge opcional */}
      {habitacion.badge && (
        <span className="absolute top-3 right-3 text-[9px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
          {habitacion.badge}
        </span>
      )}

      {habitacion.imagenUrl && (
        <div className="w-full h-32 -mt-4 -mx-4 mb-4 overflow-hidden rounded-t-2xl relative">
          <img src={habitacion.imagenUrl} alt={habitacion.nombre} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-display font-bold text-sm text-slate-900">{habitacion.nombre}</h3>
        <p className="text-[11px] text-slate-500 leading-tight">{habitacion.descripcion}</p>

        {/* Precio */}
        <div className="pt-1">
          <span className="font-display text-lg font-extrabold text-slate-900">
            {habitacion.precio}
          </span>
          <span className="text-[10px] text-slate-400 ml-1">/ noche</span>
        </div>

        {/* Capacidad */}
        <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Users className="w-3 h-3 text-red-700 shrink-0" />
            <span>{habitacion.maxPersonas}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <BedDouble className="w-3 h-3 text-red-700 shrink-0" />
            <span>{habitacion.camas}</span>
          </div>
        </div>

        {/* Amenidades */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          {habitacion.amenidades.map((amenidad) => (
            <div key={amenidad} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{amenidad}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA WhatsApp */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <a
          href={`https://wa.me/${numWhatsapp}?text=${msgWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors ${
            habitacion.destacado
              ? 'bg-red-700 hover:bg-red-800 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span>Consultar</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
