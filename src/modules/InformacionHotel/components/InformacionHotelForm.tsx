import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Building, Wifi, Clock, ShieldAlert, Save, Banknote, Trash2, UploadCloud } from 'lucide-react';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';
import { informacionHotelService } from '../services/informacionHotelService';

interface InformacionHotelFormProps {
  info: InformacionHotel | null;
  preciosOnboarding?: any[];
  guardando: boolean;
  onGuardar: (datos: GuardarInformacionHotelDTO, precios?: any[]) => Promise<boolean>;
}

export function InformacionHotelForm({
  info,
  preciosOnboarding = [],
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
  const [preciosLocales, setPreciosLocales] = useState<any[]>([]);
  const [subiendoImagen, setSubiendoImagen] = useState<{ [key: number]: boolean }>({});

  const handleSubirImagen = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 40 * 1024 * 1024) {
      alert('La imagen no debe superar los 40MB');
      return;
    }

    try {
      setSubiendoImagen(prev => ({ ...prev, [index]: true }));
      const url = await informacionHotelService.subirImagenHabitacion(file);
      const nuevos = [...preciosLocales];
      nuevos[index].imagen_url = url;
      setPreciosLocales(nuevos);
    } catch (error) {
      alert('Error al subir la imagen. Inténtelo nuevamente.');
    } finally {
      setSubiendoImagen(prev => ({ ...prev, [index]: false }));
    }
  };

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

  useEffect(() => {
    if (preciosOnboarding && preciosOnboarding.length > 0) {
      setPreciosLocales(JSON.parse(JSON.stringify(preciosOnboarding)));
    }
  }, [preciosOnboarding]);

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
    }, preciosLocales);
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

      {/* Gestión de Tipos de Habitación */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">
                Gestión de Tipos de Habitación (Onboarding)
              </h3>
              <p className="text-[11px] text-slate-500">
                Ajuste las cartas de habitaciones que se muestran al público.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setPreciosLocales([
                ...preciosLocales,
                { tipo_habitacion: '', descripcion: '', precio: 0, max_personas: 2, activo: true }
              ]);
            }}
          >
            + Añadir Habitación
          </Button>
        </div>

        <div className="space-y-4">
          {preciosLocales.map((precio, index) => (
            <div key={precio.id || index} className="p-5 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-4 relative transition-all hover:border-slate-300">
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  onClick={() => {
                    const nuevos = [...preciosLocales];
                    nuevos.splice(index, 1);
                    setPreciosLocales(nuevos);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar habitación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Banknote className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">Configuración de Habitación {index + 1}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Columna de imagen (4/12) */}
                <div className="md:col-span-4 flex flex-col gap-2">
                  <label className="block text-[11px] font-medium text-slate-700">Imagen Principal (Opcional)</label>
                  <div className="relative group rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex-1 min-h-[160px] flex flex-col items-center justify-center transition-colors hover:border-indigo-300 hover:bg-indigo-50/50">
                    {precio.imagen_url || precio.imagenUrl ? (
                      <div className="absolute inset-0">
                        <img 
                          src={precio.imagen_url || precio.imagenUrl} 
                          alt="Habitación" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[11px] font-medium bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                            Cambiar imagen
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-[11px] text-slate-500 font-medium block">Click para subir imagen</span>
                        <span className="text-[10px] text-slate-400 block mt-1">Máx 40MB (JPG, PNG)</span>
                      </div>
                    )}
                    
                    {subiendoImagen[index] && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col gap-2 z-10">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-semibold text-indigo-600">Subiendo...</span>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleSubirImagen(index, e)}
                      disabled={subiendoImagen[index]}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                    />
                  </div>
                </div>

                {/* Columna de datos (8/12) */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Tipo / Título *</label>
                      <input
                        type="text"
                        required
                        value={precio.tipo_habitacion || precio.tipoHabitacion || ''}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].tipo_habitacion = e.target.value;
                          setPreciosLocales(nuevos);
                        }}
                        placeholder="Ej: Suite Presidencial"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Precio (COP) *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={precio.precio}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].precio = Number(e.target.value);
                          setPreciosLocales(nuevos);
                        }}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs font-semibold text-indigo-700 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Camas</label>
                      <input
                        type="text"
                        value={precio.camas || ''}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].camas = e.target.value;
                          setPreciosLocales(nuevos);
                        }}
                        placeholder="Ej: 1 King, 2 Sencillas"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Max Personas *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={precio.max_personas || precio.maxPersonas || 2}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].max_personas = Number(e.target.value);
                          setPreciosLocales(nuevos);
                        }}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Badge</label>
                      <input
                        type="text"
                        value={precio.badge || ''}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].badge = e.target.value;
                          setPreciosLocales(nuevos);
                        }}
                        placeholder="Ej: + Popular"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Descripción corta</label>
                      <textarea
                        rows={2}
                        value={precio.descripcion || ''}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].descripcion = e.target.value;
                          setPreciosLocales(nuevos);
                        }}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Amenidades (por coma)</label>
                      <textarea
                        rows={2}
                        value={Array.isArray(precio.amenidades) ? precio.amenidades.join(', ') : (precio.amenidades || '')}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          const val = e.target.value;
                          nuevos[index].amenidades = val.split(',').map(s => s.trim()).filter(Boolean);
                          setPreciosLocales(nuevos);
                        }}
                        placeholder="Wi-Fi, Aire, Minibar"
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!precio.destacado}
                        onChange={(e) => {
                          const nuevos = [...preciosLocales];
                          nuevos[index].destacado = e.target.checked;
                          setPreciosLocales(nuevos);
                        }}
                      />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-500"></div>
                      <span className="ml-2 text-[11px] font-medium text-slate-700">Tarjeta Destacada (Resaltar visualmente)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {preciosLocales.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-500">
              No hay habitaciones configuradas. Añade una nueva.
            </div>
          )}
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
