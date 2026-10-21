// ─── OnboardingInfoHotel — Tarjetas de información del hotel (vista pública) ──
// ⚠️  No exponer credenciales WiFi aquí. Solo info de cara al huésped.

import { Clock, Wifi, Phone, Shield } from 'lucide-react';
import type { InformacionHotel } from '@/modules/InformacionHotel/types/informacionHotel.types';

interface OnboardingInfoHotelProps {
  infoHotel: InformacionHotel | null;
}

export function OnboardingInfoHotel({ infoHotel }: OnboardingInfoHotelProps) {
  const direccion = infoHotel?.direccion ?? 'Calle 10 # 4-50 Centro';
  const ciudad = infoHotel?.ciudad ?? 'Cúcuta, Norte de Santander';
  const checkin = infoHotel?.horarioCheckin ?? '15:00';
  const checkout = infoHotel?.horarioCheckout ?? '13:00';
  const telefono = infoHotel?.telefono ?? '+57 (607) 5712345';
  const whatsapp = infoHotel?.whatsapp ?? '+57 300 1234567';
  const politicas = infoHotel?.politicasGenerales ?? 'Ambiente 100% familiar. Espacios libres de humo. Silencio desde 10:00 PM.';

  return (
    <section id="hotel" className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-8">
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
          Información Oficial
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          Bienvenido al Hotel Cúcuta
        </h2>
        <p className="text-xs text-slate-500">
          {direccion}, {ciudad}
        </p>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horarios */}
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
              <span className="font-mono font-bold text-emerald-700">{checkin} (3:00 PM)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Check-out:</span>
              <span className="font-mono font-bold text-amber-800">{checkout} (1:00 PM)</span>
            </div>
          </div>
        </div>

        {/* Wi-Fi — Solo menciona que existe, SIN mostrar red ni contraseña */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Fibra Óptica
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Wi-Fi de Alta Velocidad</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            Red inalámbrica dedicada por piso para todos los huéspedes.
            Las credenciales de acceso se entregan en recepción al registrarse.
          </p>
        </div>

        {/* Contacto */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Front Desk
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Líneas de Atención</h3>
          <div className="text-xs space-y-1 text-slate-600 pt-1">
            <p>
              Tel:{' '}
              <a href={`tel:${telefono}`} className="font-semibold text-slate-800 hover:text-red-700 transition-colors">
                {telefono}
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
              >
                {whatsapp}
              </a>
            </p>
          </div>
        </div>

        {/* Políticas */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              Familiar
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Políticas Generales</h3>
          <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
            {politicas}
          </p>
        </div>
      </div>
    </section>
  );
}
