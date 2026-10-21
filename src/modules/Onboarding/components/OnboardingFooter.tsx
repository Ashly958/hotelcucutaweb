// ─── OnboardingFooter — Pie de página de la guía pública ─────────────────────

import logoHC from '@/assets/logotipo_hotel_cucuta.png';
import type { InformacionHotel } from '@/modules/InformacionHotel/types/informacionHotel.types';

interface OnboardingFooterProps {
  infoHotel: InformacionHotel | null;
}

export function OnboardingFooter({ infoHotel }: OnboardingFooterProps) {
  const nit = infoHotel?.nit ?? '900.123.456-7';
  const direccion = infoHotel?.direccion ?? 'Calle 10 # 4-50 Centro';
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-8 mt-12 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Marca */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
            <img src={logoHC} alt="Logo Hotel Cúcuta" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-xs text-slate-900 block">HOTEL CÚCUTA</span>
            <span className="text-[10px] text-slate-400">
              NIT: {nit} · {direccion}
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-slate-400">
          © {anioActual} Hotel Cúcuta. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
