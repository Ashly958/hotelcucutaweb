import hotelAestheticImg from '@/assets/hotel_aesthetic.jpg';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';

export function LoginBanner() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] h-full overflow-hidden bg-[#121316] select-none p-10 xl:p-12">
      {/* Fotografía de Alta Estética Arquitectónica Hotelera */}
      <img
        src={hotelAestheticImg}
        alt="Hotel Cúcuta"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradiente sutil y cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Logotipo Oficial Transparente - Sin cajas blancas ni textos adicionales */}
      <div className="relative z-10">
        <img
          src={logoHC}
          alt="Hotel Cúcuta"
          className="h-14 xl:h-16 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
        />
      </div>
    </div>
  );
}
