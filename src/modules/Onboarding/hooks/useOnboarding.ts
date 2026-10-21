// ─── useOnboarding — Orquesta el estado de la página pública del hotel ────────

import { useState, useEffect } from 'react';
import { informacionHotelService } from '@/modules/InformacionHotel/services/informacionHotelService';
import type { InformacionHotel } from '@/modules/InformacionHotel/types/informacionHotel.types';

const URL_GUIA_PUBLICA =
  typeof window !== 'undefined'
    ? `${window.location.origin}/onboarding`
    : 'http://localhost:3001/onboarding';

export function useOnboarding() {
  const [infoHotel, setInfoHotel] = useState<InformacionHotel | null>(null);
  const [precios, setPrecios] = useState<any[]>([]);
  const [pisoSeleccionado, setPisoSeleccionado] = useState<number>(1);
  const [modalQrAbierto, setModalQrAbierto] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      informacionHotelService.obtener(),
      informacionHotelService.obtenerPreciosOnboarding()
    ])
      .then(([info, preciosData]) => {
        setInfoHotel(info);
        setPrecios(preciosData);
      })
      .catch(() => {});
  }, []);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(URL_GUIA_PUBLICA);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const abrirModalQr = () => setModalQrAbierto(true);
  const cerrarModalQr = () => setModalQrAbierto(false);

  const numWhatsapp = (infoHotel?.whatsapp || '+573001234567').replace(/[^\d]/g, '');

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    URL_GUIA_PUBLICA
  )}`;

  return {
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
    urlGuiaPublica: URL_GUIA_PUBLICA,
    precios,
  };
}
