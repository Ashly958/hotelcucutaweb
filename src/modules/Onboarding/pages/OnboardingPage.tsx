// ─── OnboardingPage — Guía pública del Hotel Cúcuta ───────────────────────────
// Responsabilidad: Orquestar las secciones de la landing pública.
// Toda la lógica reside en useOnboarding(); los componentes solo reciben props.

import { useOnboarding } from '../hooks/useOnboarding';
import { OnboardingNavbar } from '../components/OnboardingNavbar';
import { OnboardingHero } from '../components/OnboardingHero';
import { OnboardingInfoHotel } from '../components/OnboardingInfoHotel';
import { OnboardingHabitaciones } from '../components/OnboardingHabitaciones';
import { PisoDirectorio } from '../components/PisoDirectorio';
import { OnboardingPoliticas } from '../components/OnboardingPoliticas';
import { OnboardingFooter } from '../components/OnboardingFooter';
import { ModalQr } from '../components/ModalQr';

export function OnboardingPage() {
  const {
    infoHotel,
    pisoSeleccionado,
    setPisoSeleccionado,
    modalQrAbierto,
    abrirModalQr,
    cerrarModalQr,
    copiado,
    copiarEnlace,
    numWhatsapp,
    qrCodeUrl,
    precios,
  } = useOnboarding();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-700 selection:text-white">
      <OnboardingNavbar onAbrirQr={abrirModalQr} />

      <OnboardingHero numWhatsapp={numWhatsapp} />

      <OnboardingInfoHotel infoHotel={infoHotel} />

      <OnboardingHabitaciones numWhatsapp={numWhatsapp} precios={precios} />

      <PisoDirectorio
        pisoSeleccionado={pisoSeleccionado}
        onSeleccionarPiso={setPisoSeleccionado}
      />

      <OnboardingPoliticas />

      <OnboardingFooter infoHotel={infoHotel} />

      <ModalQr
        isOpen={modalQrAbierto}
        onClose={cerrarModalQr}
        qrCodeUrl={qrCodeUrl}
        copiado={copiado}
        onCopiarEnlace={copiarEnlace}
      />
    </div>
  );
}
