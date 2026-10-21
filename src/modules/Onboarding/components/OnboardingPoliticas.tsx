// ─── OnboardingPoliticas — Políticas y normas de convivencia ──────────────────

import { CigaretteOff, VolumeX, Users, Car } from 'lucide-react';
import { POLITICAS_HOTEL } from '../utils/onboarding.data';
import type { PoliticaHotel } from '../types/onboarding.types';
import type { LucideIcon } from 'lucide-react';

// Mapeo de icono string → componente Lucide
const ICONOS_MAPA: Record<PoliticaHotel['icono'], LucideIcon> = {
  smoke: CigaretteOff,
  volume: VolumeX,
  users: Users,
  car: Car,
  shield: Users, // fallback
};

// Mapeo de color → clases Tailwind
const COLOR_CLASES: Record<PoliticaHotel['colorClase'], { bg: string; text: string }> = {
  red: { bg: 'bg-red-50', text: 'text-red-700' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700' },
};

export function OnboardingPoliticas() {
  return (
    <section id="politicas" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-6">
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
          Convivencia
        </span>
        <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
          Políticas del Hotel
        </h2>
        <p className="text-xs text-slate-500">
          Estándares que garantizan una estadía tranquila y segura para todos nuestros huéspedes.
        </p>
      </div>

      {/* Grid de políticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {POLITICAS_HOTEL.map((politica) => {
          const Icono = ICONOS_MAPA[politica.icono];
          const color = COLOR_CLASES[politica.colorClase];

          return (
            <div
              key={politica.titulo}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-2 hover:-translate-y-0.5 transition-transform duration-200"
            >
              <div
                className={`w-8 h-8 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}
              >
                <Icono className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">{politica.titulo}</h3>
              <p className="text-[11px] text-slate-500 leading-snug">{politica.descripcion}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
