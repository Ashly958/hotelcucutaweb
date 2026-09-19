import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Building, Wifi, Clock, ShieldAlert, Save } from 'lucide-react';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';

interface InformacionHotelFormProps {
  info: InformacionHotel | null;
  guardando: boolean;
  onGuardar: (datos: GuardarInformacionHotelDTO) => Promise<boolean>;
}

export function InformacionHotelForm({
  info,
  guardando,
  onGuardar,
}: InformacionHotelFormProps) {
  const [nombre, setNombre] = useState('Hotel Cúcuta');
  const [nit, setNit] = useState('900.123.456-7');
  const [telefono, setTelefono] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [direccion, setDireccion] = useState('Calle 10 # 4-50 Centro');
  const [ciudad, setCiudad] = useState('Cúcuta');
  const [emailContacto, setEmailContacto] = useState('contacto@hotelcucuta.com');
  const [horarioCheckin, setHorarioCheckin] = useState('15:00');
  const [horarioCheckout, setHorarioCheckout] = useState('13:00');
  const [redWifi, setRedWifi] = useState('HotelCucuta_Piso_1_a_5');
  const [claveWifi, setClaveWifi] = useState('HC_Familiar2026');
  const [politicasGenerales, setPoliticasGenerales] = useState('');

  useEffect(() => {
    if (info) {
      setNombre(info.nombre);
      setNit(info.nit);
      setTelefono(info.telefono || '');
      setWhatsapp(info.whatsapp || '');
      setDireccion(info.direccion || '');
      setCiudad(info.ciudad);
      setEmailContacto(info.emailContacto || info.email_contacto || '');
      setHorarioCheckin(info.horarioCheckin || info.horario_checkin || '15:00');
      setHorarioCheckout(info.horarioCheckout || info.horario_checkout || '13:00');
      setRedWifi(info.redWifi || info.red_wifi || '');
      setClaveWifi(info.claveWifi || info.clave_wifi || '');
      setPoliticasGenerales(info.politicasGenerales || info.politicas_generales || '');
    }
  }, [info]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGuardar({
      nombre,
      nit,
      telefono,
      whatsapp,
      direccion,
      ciudad,
      email_contacto: emailContacto,
      horario_checkin: horarioCheckin,
      horario_checkout: horarioCheckout,
      red_wifi: redWifi,
      clave_wifi: claveWifi,
      politicas_generales: politicasGenerales,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
      {/* Datos Institucionales */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-red-50/80 text-red-600 border border-red-200/50 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
              Identidad Corporativa y Contacto
            </h3>
            <p className="text-[11px] text-slate-500">
              Información impresa en comprobantes, facturas y guías de inducción.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Nombre Comercial *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              NIT / RUT *
            </label>
            <input
              type="text"
              required
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Ciudad y Departamento *
            </label>
            <input
              type="text"
              required
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Dirección Física Principal *
            </label>
            <input
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Teléfono PBX / Fijo
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Línea WhatsApp Atención Huéspedes
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Correo Electrónico Oficial
            </label>
            <input
              type="email"
              value={emailContacto}
              onChange={(e) => setEmailContacto(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Horarios Oficiales y Conectividad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Horarios */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
                Horarios de Operación
              </h3>
              <p className="text-[11px] text-slate-500">
                Llegada y límite de entrega de habitación (Check-Out).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Hora de Check-In
              </label>
              <input
                type="text"
                value={horarioCheckin}
                onChange={(e) => setHorarioCheckin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Habitual: 3:00 PM (15:00)
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Hora de Check-Out *
              </label>
              <input
                type="text"
                required
                value={horarioCheckout}
                onChange={(e) => setHorarioCheckout(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono font-bold text-red-600 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Norma oficial: 1:00 PM (13:00)
              </span>
            </div>
          </div>
        </div>

        {/* Conectividad Wi-Fi */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
                Red Wi-Fi Dedicada por Piso
              </h3>
              <p className="text-[11px] text-slate-500">
                Credenciales para la inducción del huésped.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Nombre SSID
              </label>
              <input
                type="text"
                value={redWifi}
                onChange={(e) => setRedWifi(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Contraseña Wi-Fi
              </label>
              <input
                type="text"
                value={claveWifi}
                onChange={(e) => setClaveWifi(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Convivencia y Políticas Familiares */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
              Normas de Convivencia Estrictamente Familiar
            </h3>
            <p className="text-[11px] text-slate-500">
              Políticas institucionales comunicadas a cada huésped al registrarse.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Políticas Generales del Hotel
          </label>
          <textarea
            rows={4}
            value={politicasGenerales}
            onChange={(e) => setPoliticasGenerales(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 leading-relaxed outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="md"
          type="submit"
          cargando={guardando}
          icono={<Save className="w-4 h-4" />}
        >
          Guardar Configuración Institucional
        </Button>
      </div>
    </form>
  );
}
