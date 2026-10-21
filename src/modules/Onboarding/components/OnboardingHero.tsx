// ─── OnboardingHero — Sección hero de la guía pública del hotel ───────────────

import { ArrowRight, Sparkles } from 'lucide-react';
import hotelFacade from '@/assets/hotel_facade.jpg';

interface OnboardingHeroProps {
  numWhatsapp: string;
}

const BADGES_HERO = [
  '5 Pisos de Servicio',
  'Recepción 24 Horas',
  'Wi-Fi Fibra Óptica',
  'Parqueadero Privado',
];

export function OnboardingHero({ numWhatsapp }: OnboardingHeroProps) {
  const msgReserva = encodeURIComponent(
    'Hola, quisiera reservar una habitación en Hotel Cúcuta'
  );

  return (
    <section
      id="inicio"
      className="relative min-h-[600px] sm:min-h-[700px] flex items-center justify-center text-center px-4 sm:px-8 overflow-hidden"
    >
      {/* Fondo con overlay elegante */}
      <div className="absolute inset-0 z-0">
        <img
          src={hotelFacade}
          alt="Fachada Hotel Cúcuta"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-slate-900/95" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-white py-20 mt-10">
        {/* Chip superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 text-[11px] sm:text-xs font-semibold tracking-[0.2em] shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>estrictamente familiar</span>
        </div>

        {/* Título principal */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter text-white uppercase drop-shadow-2xl leading-none">
            HOTEL CÚCUTA
          </h1>

          {/* Subtítulo */}
          <p className="text-sm sm:text-base md:text-lg font-display font-medium tracking-[0.15em] text-slate-300">
            Hospedaje familiar y en el centro de Cúcuta
          </p>
        </div>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
          Disfrute de una estancia cómoda con recepción 24 horas, Wi-Fi de alta velocidad, parqueadero privado vigilado y un ambiente diseñado para su familia.
        </p>

        {/* CTAs */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            id="cta-reservar-hero"
            href={`https://wa.me/${numWhatsapp}?text=${msgReserva}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-display font-bold text-sm uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-3 border border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <span>Reservar Ahora</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#habitaciones"
            className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-display font-medium text-sm uppercase tracking-widest rounded-none transition-all border border-white/30"
          >
            Ver Habitaciones
          </a>
        </div>

        {/* Feature badges */}
        <div className="pt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          {BADGES_HERO.map((badge) => (
            <span
              key={badge}
              className="bg-black/20 backdrop-blur-sm px-4 py-1.5 border border-white/5 uppercase tracking-wider font-light"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
