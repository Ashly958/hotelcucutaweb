// ─── OnboardingNavbar — Barra de navegación glass de la guía pública ──────────

import { useNavigate } from 'react-router-dom';
import { Shield, QrCode } from 'lucide-react';
import { Button } from '@/components/Button';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';

interface OnboardingNavbarProps {
  onAbrirQr: () => void;
}

/** Altura de la navbar fija en px. Debe coincidir con h-16 = 64px */
const NAVBAR_HEIGHT = 64;

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'hotel', label: 'Información' },
  { id: 'habitaciones', label: 'Habitaciones' },
  { id: 'pisos', label: 'Pisos' },
  { id: 'politicas', label: 'Políticas' },
];

export function OnboardingNavbar({ onAbrirQr }: OnboardingNavbarProps) {
  const navigate = useNavigate();

  /**
   * Scroll suave hacia la sección destino, descontando el alto
   * de la navbar fija para que el encabezado no quede tapado.
   */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Marca — scroll al inicio */}
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, 'inicio')}
          className="flex items-center gap-2.5"
        >
          <div className="h-9 w-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
            <img src={logoHC} alt="Hotel Cúcuta" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase block leading-tight">
              HOTEL CÚCUTA
            </span>
            <span className="text-[9px] text-red-400 font-semibold tracking-widest uppercase block">
              Cúcuta · Colombia
            </span>
          </div>
        </a>

        {/* Navegación central (desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-200">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleNavClick(e, id)}
              className="relative hover:text-white transition-colors group"
            >
              {label}
              {/* Underline animado con CSS */}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-red-400 group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button
            id="btn-abrir-qr"
            onClick={onAbrirQr}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-red-400" />
            <span>QR Huésped</span>
          </button>

          <Button
            id="btn-login-navbar"
            variant="primary"
            size="sm"
            onClick={() => navigate('/login')}
            icono={<Shield className="w-3.5 h-3.5" />}
            className="text-xs rounded-xl shadow-md py-1.5 px-3.5"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}

