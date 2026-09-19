import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wifi,
  Clock,
  VolumeX,
  CigaretteOff,
  Shield,
  QrCode,
  Copy,
  Check,
  Phone,
  ArrowRight,
  Sparkles,
  Car,
  Users,
  CheckCircle2,
  BedDouble,
  Layers,
} from 'lucide-react';

import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal/Modal';
import { informacionHotelService } from '@/modules/InformacionHotel/services/informacionHotelService';
import type { InformacionHotel } from '@/modules/InformacionHotel/types/informacionHotel.types';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';
import hotelFacade from '@/assets/hotel_facade.jpg';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [pisoSeleccionado, setPisoSeleccionado] = useState<number>(1);
  const [modalQrAbierto, setModalQrAbierto] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [infoHotel, setInfoHotel] = useState<InformacionHotel | null>(null);

  useEffect(() => {
    informacionHotelService
      .obtener()
      .then((res) => setInfoHotel(res))
      .catch(() => {});
  }, []);

  const handleImprimir = () => {
    window.print();
  };

  const urlGuiaPublica =
    typeof window !== 'undefined'
      ? `${window.location.origin}/onboarding`
      : 'http://localhost:3001/onboarding';

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(urlGuiaPublica);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const pisosInfo: Record<
    number,
    {
      red: string;
      nombre: string;
      habitaciones: string;
      caracteristicas: string[];
      areas: string;
    }
  > = {
    1: {
      red: 'HotelCucuta_Piso1',
      nombre: 'Piso 1 - Recepción & Habitaciones 01 al 21',
      habitaciones: '21 Habitaciones (01 al 21)',
      caracteristicas: [
        'Recepción Central Front Desk 24 Horas',
        'Acceso peatonal principal y parqueadero vigilado',
        'Habitaciones con ventilador y aire acondicionado',
        'Áreas de Servicio A1 (Aseo) y B1 (Depósito de residuos)',
      ],
      areas: 'Recepción Central, Sala de Espera, Parqueadero de autos y motos',
    },
    2: {
      red: 'HotelCucuta_Piso2',
      nombre: 'Piso 2 - Habitaciones Ejecutivas 22 al 29',
      habitaciones: '8 Habitaciones (22 al 29)',
      caracteristicas: [
        'Habitaciones ejecutivas climatizadas con Aire Acondicionado',
        'Balcones con vista exterior y ventilación natural',
        'Área de aseo y lencería dedicada (Punto A2)',
        'Depósito técnico de residuos clasificados (Punto B2)',
      ],
      areas: 'Pasillo residencial climatizado, Puntos A2 y B2',
    },
    3: {
      red: 'HotelCucuta_Piso3',
      nombre: 'Piso 3 - Habitaciones Matrimoniales & Familiares 30 al 37',
      habitaciones: '8 Habitaciones (30 al 37)',
      caracteristicas: [
        'Habitaciones matrimoniales con cama doble',
        'Habitaciones familiares para hasta 5 personas',
        'Aire acondicionado y televisión por cable',
        'Puntos de servicio A3 y B3 en pasillo central',
      ],
      areas: 'Zona residencial familiar, Puntos A3 y B3',
    },
    4: {
      red: 'HotelCucuta_Piso4',
      nombre: 'Piso 4 - Habitaciones Climatizadas 38 al 45',
      habitaciones: '8 Habitaciones (38 al 45)',
      caracteristicas: [
        'Habitaciones con aire acondicionado y ventilador de respaldo',
        'Zona silenciosa ideal para descanso profundo o trabajo',
        'Baño privado con acabados cerámicos y agua caliente',
        'Puntos de servicio A4 y B4',
      ],
      areas: 'Piso residencial superior, Puntos A4 y B4',
    },
    5: {
      red: 'HotelCucuta_Piso5',
      nombre: 'Piso 5 - Centro de Lavandería Industrial',
      habitaciones: 'Planta de Operaciones (0 habitaciones)',
      caracteristicas: [
        'Lavadoras y secadoras industriales de alto flujo',
        'Mesa de planchado profesional por prendas textiles',
        'Almacenamiento y rotación central de sábanas y toallas',
        'Servicio de lavado de prendas personales para huéspedes',
      ],
      areas: 'Planta textil exclusiva del personal y servicio de lavandería',
    },
  };

  const tiposHabitacion = [
    {
      nombre: 'Individual',
      desc: 'Confort y descanso para 1 o 2 personas',
      precio: '$45.000',
      camas: '1 Cama Doble',
      pax: 'Hasta 2 personas',
      amenidades: ['Ventilador / A/C', 'Baño Privado', 'Wi-Fi Dedicado', 'TV Cable'],
      destacado: false,
    },
    {
      nombre: 'Estándar',
      desc: 'Comodidad ejecutiva con 1 o 2 camas',
      precio: '$50.000',
      camas: '1 o 2 Camas',
      pax: 'Hasta 3 personas',
      amenidades: ['Aire Acondicionado', 'Baño Privado', 'Wi-Fi Alta Velocidad', 'TV Cable'],
      destacado: true,
      badge: 'Más Popular',
    },
    {
      nombre: 'Matrimonial',
      desc: 'Espacio cálido y acogedor para parejas',
      precio: '$70.000',
      camas: '1 Cama Matrimonial',
      pax: '2 personas',
      amenidades: ['Aire Acondicionado', 'Baño Privado', 'Smart TV', 'Lencería 200 hilos'],
      destacado: false,
    },
    {
      nombre: 'Suite Familiar',
      desc: 'Amplitud para familias o grupos de viaje',
      precio: '$90.000',
      camas: '1 Matrimonial + Camarote',
      pax: 'Hasta 5 personas',
      amenidades: ['Aire Acondicionado', 'Baño Amplio', 'Wi-Fi Dedicado', 'Nevera en pasillo'],
      destacado: false,
    },
  ];

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    urlGuiaPublica
  )}`;

  const numWhatsappLimpio = (infoHotel?.whatsapp || '+573001234567').replace(/[^\d]/g, '');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-700 selection:text-white">
      {/* 1. NAVBAR TRANSPARENTE / GLASS SOBRE EL HERO (Estilo Landing Page como la imagen de referencia) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo & Marca */}
          <a href="#inicio" className="flex items-center gap-2.5">
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

          {/* Enlaces de la Landing Page */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-200">
            <a href="#inicio" className="hover:text-white transition-colors">
              Inicio
            </a>
            <a href="#hotel" className="hover:text-white transition-colors">
              Información
            </a>
            <a href="#habitaciones" className="hover:text-white transition-colors">
              Habitaciones
            </a>
            <a href="#pisos" className="hover:text-white transition-colors">
              Pisos
            </a>
            <a href="#politicas" className="hover:text-white transition-colors">
              Políticas
            </a>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalQrAbierto(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-red-400" />
              <span>QR Huésped</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
              icono={<Shield className="w-3.5 h-3.5" />}
              className="text-xs bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md py-1.5 px-3.5"
            >
              Acceso PMS
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO PRINCIPAL FULL-WIDTH (Idéntico a la estética de la imagen: fachada de hotel + PANAMÁ CITY en mayúsculas + botón blanco con texto rojo) */}
      <section
        id="inicio"
        className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center text-center px-4 sm:px-8 overflow-hidden pt-16"
      >
        {/* Imagen de Fondo de Fachada */}
        <div className="absolute inset-0 z-0">
          <img
            src={hotelFacade}
            alt="Hotel Cúcuta"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay oscuro para legibilidad del texto blanco */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/90" />
        </div>

        {/* Contenido Hero Landing */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 text-white py-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-300 text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>Hospedaje de Calidad · 45 Habitaciones Climatizadas</span>
          </div>

          {/* Título en grande estilo Panamá City de la foto */}
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase drop-shadow-xl">
            HOTEL CÚCUTA
          </h1>

          {/* Subtítulo estilo Nómada Container Hotel */}
          <p className="text-xs sm:text-sm font-display font-medium tracking-widest text-slate-200 uppercase">
            HOSPEDAJE FAMILIAR Y EJECUTIVO EN EL CENTRO
          </p>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Recepción 24 horas, Wi-Fi de alta velocidad dedicado por piso, parqueadero privado vigilado y servicio de lavandería en Piso 5.
          </p>

          {/* Botón blanco con texto rojo (exacto al "RESERVAR AHORA →" de la imagen del usuario) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${numWhatsappLimpio}?text=Hola,%20quisiera%20reservar%20una%20habitación%20en%20Hotel%20Cúcuta`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-red-700 font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-red-100"
            >
              <span>RESERVAR AHORA</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-700" />
            </a>

            <a
              href="#habitaciones"
              className="px-5 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Ver Habitaciones
            </a>
          </div>

          {/* Badges horizontales de ventajas */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300">
            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              5 Pisos de Servicio
            </span>
            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Recepción 24 Horas
            </span>
            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Wi-Fi Fibra Óptica
            </span>
            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Parqueadero Privado
            </span>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN SOBRE EL HOTEL (Fondo Claro del Sistema PMS) */}
      <section id="hotel" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
            INFORMACIÓN OFICIAL
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Bienvenido al Hotel Cúcuta
          </h2>
          <p className="text-xs text-slate-500">
            {infoHotel?.direccion || 'Calle 10 # 4-50 Centro'}, {infoHotel?.ciudad || 'Cúcuta, Norte de Santander'}
          </p>
        </div>

        {/* 4 Tarjetas Claras y Organizadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Horarios */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-red-50 text-red-700">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">24 Horas</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900">Horarios de Estadía</h3>
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-500">Check-in:</span>
                <span className="font-mono font-bold text-emerald-700">{infoHotel?.horarioCheckin || '15:00'} (3:00 PM)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Check-out:</span>
                <span className="font-mono font-bold text-amber-800">{infoHotel?.horarioCheckout || '13:00'} (1:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Card Wi-Fi */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Wifi className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Fibra Óptica</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900">Wi-Fi de Alta Velocidad</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Red inalámbrica dedicada por piso para todos los huéspedes. Las credenciales de acceso se entregan en recepción al registrarse.
            </p>
          </div>

          {/* Card Contacto */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Front Desk</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900">Líneas de Atención</h3>
            <div className="text-xs space-y-1 text-slate-600 pt-1">
              <p>Tel: <span className="font-semibold text-slate-800">{infoHotel?.telefono || '+57 (607) 5712345'}</span></p>
              <p>WhatsApp: <span className="font-semibold text-slate-800">{infoHotel?.whatsapp || '+57 300 1234567'}</span></p>
            </div>
          </div>

          {/* Card Convivencia */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">Familiar</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900">Políticas</h3>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              {infoHotel?.politicasGenerales || 'Ambiente 100% familiar. Espacios libres de humo. Silencio desde 10:00 PM.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN HABITACIONES & TARIFAS (Clara, limpia y organizada) */}
      <section id="habitaciones" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">ACOMODACIÓN</span>
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
              Nuestras Habitaciones
            </h2>
          </div>
          <span className="text-xs text-slate-500">45 Habitaciones en Pisos 1 al 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiposHabitacion.map((hab, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-soft-xs relative ${
                hab.destacado ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200/80'
              }`}
            >
              {hab.badge && (
                <span className="absolute top-3 right-3 text-[9px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  {hab.badge}
                </span>
              )}

              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-slate-900">{hab.nombre}</h3>
                <p className="text-[11px] text-slate-500 leading-tight">{hab.desc}</p>

                <div className="pt-1">
                  <span className="font-display text-lg font-extrabold text-slate-900">{hab.precio}</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ noche</span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Users className="w-3 h-3 text-red-700 shrink-0" />
                    <span>{hab.pax}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <BedDouble className="w-3 h-3 text-red-700 shrink-0" />
                    <span>{hab.camas}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  {hab.amenidades.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100">
                <a
                  href={`https://wa.me/${numWhatsappLimpio}?text=Hola,%20deseo%20consultar%20por%20la%20Habitación%20${encodeURIComponent(
                    hab.nombre
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors ${
                    hab.destacado
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>Consultar</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DIRECTORIO INTERACTIVO DE PISOS (Organizado en pestañas) */}
      <section id="pisos" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">DISTRIBUCIÓN</span>
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-700" />
              <span>Directorio de los 5 Pisos</span>
            </h2>
          </div>

          {/* Pestañas de piso */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setPisoSeleccionado(num)}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
                  pisoSeleccionado === num
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Piso {num}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjeta del Piso Seleccionado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                Nivel {pisoSeleccionado}
              </span>
              <h3 className="font-display font-bold text-base text-slate-900">
                {pisosInfo[pisoSeleccionado].nombre}
              </h3>
              <p className="text-xs text-slate-500">
                {pisosInfo[pisoSeleccionado].habitaciones}
              </p>
            </div>

            {/* Wi-Fi exclusivo */}
            <div className="bg-slate-50 p-2.5 px-3 rounded-xl border border-slate-200/70 text-xs space-y-0.5 shrink-0">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <Wifi className="w-3.5 h-3.5 text-blue-600" />
                <span>Red Piso {pisoSeleccionado}:</span>
                <span className="font-mono font-bold text-slate-800">
                  {pisosInfo[pisoSeleccionado].red}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Acceso exclusivo para huéspedes · Clave en recepción
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                Características
              </span>
              <ul className="space-y-1 text-slate-600 text-xs">
                {pisosInfo[pisoSeleccionado].caracteristicas.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                Áreas de Servicio
              </span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                {pisosInfo[pisoSeleccionado].areas}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POLÍTICAS & NORMAS */}
      <section id="politicas" className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">CONVIVENCIA</span>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
            Políticas del Hotel
          </h2>
          <p className="text-xs text-slate-500">
            Estándares para garantizar una estadía tranquila y segura para todos nuestros huéspedes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <CigaretteOff className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">Libre de Humo</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Prohibido fumar en todas las habitaciones y pasillos cerrados.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <VolumeX className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">Silencio Nocturno</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Desde las 10:00 PM volumen moderado para el descanso de los huéspedes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">Ambiente Familiar</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Acceso a habitaciones exclusivo para huéspedes registrados.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900">Parqueadero</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Parqueadero privado para vehículos y motos vigilado.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center">
              <img src={logoHC} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-xs text-slate-900 block">HOTEL CÚCUTA</span>
              <span className="text-[10px] text-slate-400">
                NIT: {infoHotel?.nit || '900.123.456-7'} · {infoHotel?.direccion || 'Calle 10 # 4-50 Centro'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setModalQrAbierto(true)} className="hover:text-slate-900 transition-colors">
              Código QR
            </button>
            <button onClick={handleImprimir} className="hover:text-slate-900 transition-colors">
              Imprimir
            </button>
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-red-700 hover:text-red-800 transition-colors"
            >
              Acceso PMS
            </button>
          </div>

          <div className="text-[10px] text-slate-400">
            © 2026 Hotel Cúcuta. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODAL CÓDIGO QR */}
      <Modal
        isOpen={modalQrAbierto}
        onClose={() => setModalQrAbierto(false)}
        title="Guía Digital del Hotel para Huéspedes"
        maxWidth="sm"
      >
        <div className="p-4 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Escanee este código QR para abrir la guía digital de servicios del hotel en su teléfono.
          </p>

          <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mx-auto shadow-sm">
            <img src={qrCodeUrl} alt="Código QR Hotel Cúcuta" className="w-44 h-44 object-contain" />
          </div>

          <div className="space-y-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopiarEnlace}
              icono={copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              className="w-full justify-center text-xs"
            >
              {copiado ? 'Enlace Copiado' : 'Copiar Enlace'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
