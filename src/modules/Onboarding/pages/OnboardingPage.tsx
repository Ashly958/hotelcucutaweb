import { useState, useEffect } from 'react';
import {
  Wifi,
  Wind,
  Shirt,
  Coffee,
  Bike,
  Clock,
  VolumeX,
  CigaretteOff,
  Shield,
  Printer,
  Heart,
  QrCode,
  Copy,
  Check,
  Phone,
  MessageSquare,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { informacionHotelService } from '@/modules/InformacionHotel/services/informacionHotelService';
import type { InformacionHotel } from '@/modules/InformacionHotel/types/informacionHotel.types';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';

export function OnboardingPage() {
  const [pisoSeleccionado, setPisoSeleccionado] = useState<number>(1);
  const [modalQrAbierto, setModalQrAbierto] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [infoHotel, setInfoHotel] = useState<InformacionHotel | null>(null);

  useEffect(() => {
    informacionHotelService.obtener().then((res) => {
      setInfoHotel(res);
    }).catch(() => {});
  }, []);

  const handleImprimir = () => {
    window.print();
  };

  const urlGuiaPublica = typeof window !== 'undefined'
    ? `${window.location.origin}/guia`
    : 'http://localhost:5173/guia';

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(urlGuiaPublica);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const clavesPorPiso: Record<number, { red: string; clave: string }> = {
    1: { red: 'HotelCucuta_Piso1_Guest', clave: 'HC_FamiliaPiso1' },
    2: { red: 'HotelCucuta_Piso2_Guest', clave: 'HC_FamiliaPiso2' },
    3: { red: 'HotelCucuta_Piso3_Guest', clave: 'HC_FamiliaPiso3' },
    4: { red: 'HotelCucuta_Piso4_Guest', clave: 'HC_FamiliaPiso4' },
    5: { red: 'HotelCucuta_Piso5_Operativa', clave: 'HC_LavanderiaP5' },
  };

  // URL generadora de código QR público y nítido para huéspedes
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(urlGuiaPublica)}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:p-0">
      {/* Barra Superior con Botones de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Guía de Inducción & Directorio para Huéspedes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ficha interactiva de bienvenida basada en el documento oficial (5 Pisos de Servicio · Estrictamente Familiar).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleCopiarEnlace}
            icono={copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copiado ? 'Enlace Copiado' : 'Copiar Enlace'}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setModalQrAbierto(true)}
            icono={<QrCode className="w-4 h-4 text-red-700" />}
          >
            Código QR
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleImprimir}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Ficha
          </Button>
        </div>
      </div>

      {/* PORTADA / HERO DE BIENVENIDA */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8 sm:p-12 rounded-3xl shadow-soft-lg text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md rounded-2xl mb-1 shadow-soft-xs border border-white/15">
            <img src={logoHC} alt="Hotel Cúcuta" className="h-12 w-auto object-contain" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-red-600 text-white shadow-soft-xs">
            GUÍA DE BIENVENIDA · 5 PISOS DE SERVICIO
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white">
            Bienvenido a su Casa
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            Directorio de comodidades, conectividad dedicada por piso, servicios de lavandería, parqueadero vigilado y normas de convivencia familiar.
          </p>
        </div>
      </div>

      {/* EL CICLO DE SU ESTADÍA */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-soft space-y-6">
        <div className="text-center max-w-md mx-auto">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            El Ciclo de su Estadía
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            4 sencillos pasos para disfrutar de una estadía cómoda y transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {[
            {
              paso: '1',
              titulo: 'Llegada',
              desc: 'Recepción cordial 24 horas, entrega de documento y asignación de habitación.',
            },
            {
              paso: '2',
              titulo: 'Conexión',
              desc: 'Entrega de clave Wi-Fi exclusiva de su piso y control remoto de climatización.',
            },
            {
              paso: '3',
              titulo: 'Disfrute',
              desc: 'Servicio de lavandería en Piso 5, neveras surtidas en pasillo y parqueadero vigilado.',
            },
            {
              paso: '4',
              titulo: 'Salida (1:00 PM)',
              desc: 'Liquidación ágil en efectivo en recepción y entrega de habitación antes de la 1:00 PM.',
            },
          ].map((c) => (
            <div
              key={c.paso}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center relative"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">
                {c.paso}
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">{c.titulo}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONECTIVIDAD & CLIMATIZACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Wi-Fi Exclusivo por Piso
              </h3>
              <p className="text-xs text-slate-500">
                Para garantizar navegación veloz y estable en cada uno de los 5 pisos.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 pt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPisoSeleccionado(num)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pisoSeleccionado === num
                    ? 'bg-slate-900 text-white shadow-soft-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                Piso {num}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Red SSID:</span>
              <strong className="font-mono text-slate-900">
                {clavesPorPiso[pisoSeleccionado].red}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contraseña:</span>
              <strong className="font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200/60">
                {clavesPorPiso[pisoSeleccionado].clave}
              </strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-soft space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Climatización & Confort
              </h3>
              <p className="text-xs text-slate-500">
                Control individual de temperatura entregado en recepción.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Nuestras habitaciones cuentan con aire acondicionado o ventilador de alto flujo según su categoría.
            </p>
            <p>
              El control remoto se entrega durante el check-in para regular la temperatura con total privacidad. Por favor devolverlo en recepción al momento del check-out.
            </p>
          </div>
        </div>
      </div>

      {/* DIRECTORIO DE SERVICIOS Y HORARIOS */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
            Directorio de Servicios a su Disposición
          </h3>
          <p className="text-xs text-slate-500">
            Horarios de atención continua y modalidades operativas.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-3 px-5 font-semibold">Servicio / Zona</th>
                <th className="py-3 px-5 font-semibold">Ubicación</th>
                <th className="py-3 px-5 font-semibold">Horario de Atención</th>
                <th className="py-3 px-5 font-semibold">Modalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Recepción y Registro
                </td>
                <td className="py-3.5 px-5 text-slate-600">Piso 1 (Entrada Principal)</td>
                <td className="py-3.5 px-5 font-semibold text-emerald-700">Atención continua 24 Horas</td>
                <td className="py-3.5 px-5 text-slate-500">Asistencia, check-in y llaves</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-blue-600" />
                  Lavandería y Planchado
                </td>
                <td className="py-3.5 px-5 text-slate-600">Piso 5 (Área Operativa)</td>
                <td className="py-3.5 px-5 text-slate-800 font-medium">7:00 AM a 6:00 PM</td>
                <td className="py-3.5 px-5 text-slate-500">Cobro por prenda ($6.000 COP) · Cargo a cuenta</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-red-600" />
                  Parqueadero Vehicular
                </td>
                <td className="py-3.5 px-5 text-slate-600">Zona de Parqueo</td>
                <td className="py-3.5 px-5 text-slate-800 font-medium">Acceso 24 Horas</td>
                <td className="py-3.5 px-5 text-slate-500">Carros y motos custodiadas con registro de placa</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  Neveras y Minibar
                </td>
                <td className="py-3.5 px-5 text-slate-600">Pasillos y Áreas Comunes</td>
                <td className="py-3.5 px-5 text-slate-800 font-medium">Disponible 24 Horas</td>
                <td className="py-3.5 px-5 text-slate-500">Bebidas frías y refrigerios al instante</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HORARIO DE SALIDA (CHECK-OUT 1:00 PM) */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/60 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200/60 uppercase tracking-wider">
            Horario Habitual de Salida
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight">
            Salida Cómoda y Transparente
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nuestro horario de entrega de habitación es a la <strong>1:00 PM</strong>, permitiéndole disfrutar de una mañana tranquila y sin apuros antes de continuar su viaje.
          </p>
          <p className="text-[11px] text-slate-400">
            Recuerde que el pago de la estadía y consumos se liquida en efectivo en recepción para un check-out ágil.
          </p>
        </div>

        <div className="p-6 bg-red-50/90 rounded-2xl border border-red-200/70 text-center flex-shrink-0 shadow-soft-xs">
          <div className="text-4xl sm:text-5xl font-display font-black text-red-700 tracking-tight">
            1:00
          </div>
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mt-1">
            PM · Check-Out
          </span>
        </div>
      </div>

      {/* NORMAS DE CONVIVENCIA FAMILIAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-soft space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Convivencia Estrictamente Familiar
          </h3>
          <p className="text-xs text-slate-500">
            Principios obligatorios para asegurar la tranquilidad y descanso de todos nuestros huéspedes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Ambiente Exclusivamente Familiar</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Promovemos un espacio sano y seguro, priorizando el respeto y el descanso nocturno.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <VolumeX className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Horario de Silencio Nocturno</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Agradecemos moderar el volumen de televisores y música a partir de las <strong>10:00 PM</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <CigaretteOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Espacios Libres de Humo</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Por seguridad comunitaria y salud familiar, está terminantemente prohibido fumar en habitaciones y pasillos.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-xs">Control Estricto de Accesos</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Solo se permite el ingreso a las habitaciones a los huéspedes formalmente registrados en recepción.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECTORIO DE CONTACTO & ASISTENCIA 24 HORAS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Canales de Asistencia Inmediata
          </h3>
          <p className="text-xs text-slate-500">
            Comuníquese con nuestra recepción ante cualquier requerimiento o inquietud durante su estadía.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Phone className="w-5 h-5" />
            </span>
            <div>
              <span className="block font-semibold text-slate-900">Recepción 24 Horas</span>
              <span className="text-slate-600 font-mono">{infoHotel?.telefono || '+57 (607) 5712345'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <span className="block font-semibold text-slate-900">WhatsApp Front-Desk</span>
              <span className="text-slate-600 font-mono">{infoHotel?.whatsapp || '+57 300 1234567'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <span className="p-2.5 bg-red-50 text-red-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <span className="block font-semibold text-slate-900">Ubicación Central</span>
              <span className="text-slate-600">{infoHotel?.direccion || 'Calle 10 # 4-50 Centro'}, {infoHotel?.ciudad || 'Cúcuta'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NUESTRA PROMESA */}
      <div className="p-8 bg-white rounded-3xl border border-slate-200/70 shadow-soft text-center space-y-2">
        <p className="font-sans italic text-base sm:text-lg text-slate-700 max-w-xl mx-auto leading-relaxed">
          “La verdadera hospitalidad familiar consiste en brindar un refugio limpio, seguro y acogedor donde cada huésped se sienta en casa.”
        </p>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block pt-2">
          — Administración · {infoHotel?.nombre || 'Hotel Cúcuta'}
        </span>
      </div>

      {/* MODAL CÓDIGO QR PARA HUÉSPEDES */}
      <Modal
        isOpen={modalQrAbierto}
        onClose={() => setModalQrAbierto(false)}
        title="Código QR · Guía Digital para Huéspedes"
      >
        <div className="text-center space-y-4 py-2">
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Muestre este código QR al huésped durante el check-in para que acceda instantáneamente al directorio, claves Wi-Fi y normas desde su celular.
          </p>

          <div className="inline-block p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <img
              src={qrCodeUrl}
              alt="Código QR Guía Huésped Hotel Cúcuta"
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-700 truncate max-w-md mx-auto">
            {urlGuiaPublica}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopiarEnlace}
              icono={copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiado ? 'Enlace Copiado' : 'Copiar Enlace'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleImprimir}
              icono={<Printer className="w-3.5 h-3.5" />}
            >
              Imprimir Ficha
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
