import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import type { Habitacion, CheckInDTO } from '../types/habitacion.types';

interface HabitacionDetalleModalProps {
  habitacion: Habitacion | null;
  onClose: () => void;
  onCambiarEstado: (id: string, nuevoEstado: Habitacion['estado']) => Promise<void>;
  onCheckIn: (datos: CheckInDTO) => Promise<boolean>;
  onCheckOut: (id: string) => Promise<boolean>;
}

export function HabitacionDetalleModal({
  habitacion,
  onClose,
  onCambiarEstado,
  onCheckIn,
  onCheckOut,
}: HabitacionDetalleModalProps) {
  const [modoCheckIn, setModoCheckIn] = useState(false);
  const [cargandoAccion, setCargandoAccion] = useState(false);

  // Formulario Check-in
  const [nombre, setNombre] = useState('');
  const [docTipo, setDocTipo] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nacionalidad, setNacionalidad] = useState('Colombiana');
  const [telefono, setTelefono] = useState('');
  const [procedencia, setProcedencia] = useState('');
  const [destino, setDestino] = useState('Cúcuta');
  const [pax, setPax] = useState(1);
  const [noches, setNoches] = useState(1);
  const [abono, setAbono] = useState<number>(habitacion?.precioNoche ?? 70000);

  if (!habitacion) return null;

  const totalCobro = habitacion.precioNoche * noches;

  const handleEjecutarCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !docNum.trim()) {
      alert('Por favor complete el nombre y documento del huésped para el registro policial y SIRE.');
      return;
    }

    setCargandoAccion(true);
    await onCheckIn({
      habitacionId: habitacion.id,
      nombre,
      documentoTipo: docTipo,
      documentoNumero: docNum,
      nacionalidad,
      telefono,
      procedencia,
      destino,
      pax,
      noches,
      abonoEfectivo: abono,
    });
    setCargandoAccion(false);
  };

  const handleEjecutarCheckOut = async () => {
    if (confirm(`¿Confirmar check-out de la Habitación ${habitacion.numero}? La habitación pasará a estado de Limpieza.`)) {
      setCargandoAccion(true);
      await onCheckOut(habitacion.id);
      setCargandoAccion(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-fadeIn">
        {/* Header Modal */}
        <div className="bg-[#121316] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-red rounded-xl flex items-center justify-center font-serif font-black text-xl text-white">
              {habitacion.numero}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Habitación {habitacion.numero} · Piso {habitacion.piso}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {habitacion.tipo} · {habitacion.camas}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-neutral-700">
          {/* Fila de Especificaciones y Tarifa */}
          <div className="grid grid-cols-3 gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 text-center">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Climatización</span>
              <strong className="text-neutral-900 font-semibold">
                {habitacion.tieneAire ? 'Aire Acondicionado' : 'Ventilador'}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Capacidad Máx</span>
              <strong className="text-neutral-900 font-semibold">{habitacion.capacidadMax} personas</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Tarifa Inmutable</span>
              <strong className="text-brand-red font-mono font-bold">
                ${habitacion.precioNoche.toLocaleString('es-CO')}
              </strong>
            </div>
          </div>

          {/* CASO 1: Habitación Ocupada -> Ver Huésped & Check-out */}
          {habitacion.estado === 'ocupada' && habitacion.huesped && (
            <div className="space-y-4">
              <div className="bg-red-50/50 border border-red-200/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                    <User className="w-4 h-4 text-brand-red" />
                    <span>{habitacion.huesped.nombre}</span>
                  </div>
                  <span className="text-[10px] bg-red-100 text-brand-red px-2 py-0.5 rounded-full font-mono font-bold">
                    Ocupada
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-700">Doc:</span>
                    <span className="font-mono">{habitacion.huesped.documento}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{habitacion.huesped.telefono}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>De {habitacion.huesped.procedencia}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{habitacion.huesped.noches} noche(s)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">Saldo a liquidar en recepción:</span>
                  <span className="font-mono font-bold text-brand-red text-sm">
                    ${habitacion.huesped.saldoPendiente.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-neutral-400 italic">
                  * Hora habitual de salida: 1:00 PM (RN-008).
                </span>
                <Button
                  variant="danger"
                  size="md"
                  cargando={cargandoAccion}
                  onClick={handleEjecutarCheckOut}
                  icono={<LogOut className="w-4 h-4" />}
                >
                  Realizar Check-Out
                </Button>
              </div>
            </div>
          )}

          {/* CASO 2: Habitación en Limpieza o Mantenimiento */}
          {habitacion.estado === 'limpieza' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 text-center">
              <p className="text-blue-900 font-medium">
                Esta habitación se encuentra actualmente en proceso de aseo y lencería higienizada.
              </p>
              <Button
                variant="primary"
                size="md"
                cargando={cargandoAccion}
                onClick={() => onCambiarEstado(habitacion.id, 'disponible')}
                icono={<CheckCircle className="w-4 h-4" />}
              >
                Marcar como Lista y Disponible
              </Button>
            </div>
          )}

          {habitacion.estado === 'mantenimiento' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>En Mantenimiento</span>
              </div>
              <p className="text-amber-800 text-[11px]">
                {habitacion.observaciones || 'Revisión técnica de equipos en curso.'}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCambiarEstado(habitacion.id, 'disponible')}
                >
                  Liberar a Disponible
                </Button>
              </div>
            </div>
          )}

          {/* CASO 3: Habitación Disponible -> Formulario de Check-in Rápido */}
          {habitacion.estado === 'disponible' && !modoCheckIn && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <p className="text-emerald-900 font-medium">
                Habitación lista para recibir huéspedes de inmediato.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setModoCheckIn(true)}
                  icono={<Sparkles className="w-4 h-4" />}
                >
                  Registrar Check-In Ahora
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => onCambiarEstado(habitacion.id, 'mantenimiento')}
                >
                  A Mantenimiento
                </Button>
              </div>
            </div>
          )}

          {/* FORMULARIO DE CHECK-IN RÁPIDO */}
          {habitacion.estado === 'disponible' && modoCheckIn && (
            <form onSubmit={handleEjecutarCheckIn} className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-red" />
                  Registro de Huésped (SIRE / Policía)
                </span>
                <button
                  type="button"
                  onClick={() => setModoCheckIn(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Nombre Completo del Huésped *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Alberto Mendoza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Documento de Identidad *
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={docTipo}
                      onChange={(e) => setDocTipo(e.target.value)}
                      className="w-16 p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                    >
                      <option value="CC">CC</option>
                      <option value="PA">PA</option>
                      <option value="CE">CE</option>
                      <option value="PPT">PPT</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Número"
                      value={docNum}
                      onChange={(e) => setDocNum(e.target.value)}
                      className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 3..."
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Nacionalidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                    className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Lugar de Procedencia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bucaramanga"
                    value={procedencia}
                    onChange={(e) => setProcedencia(e.target.value)}
                    className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Lugar de Destino *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cúcuta"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Personas (Pax)
                    </label>
                    <select
                      value={pax}
                      onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                      className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                    >
                      <option value="1">1 persona</option>
                      <option value="2">2 personas</option>
                      <option value="3">3 personas</option>
                      <option value="4">4 personas</option>
                      <option value="5">5 personas</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Noches
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={noches}
                      onChange={(e) => {
                        const n = parseInt(e.target.value) || 1;
                        setNoches(n);
                        setAbono(habitacion.precioNoche * n);
                      }}
                      className="w-full p-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Total y Abono en Efectivo (RN-010) */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-900 block">
                    Total en Efectivo (RN-010)
                  </span>
                  <span className="font-mono font-extrabold text-brand-red text-sm">
                    ${totalCobro.toLocaleString('es-CO')} COP
                  </span>
                </div>

                <Button
                  type="submit"
                  size="md"
                  cargando={cargandoAccion}
                  iconoDerecha={<ArrowRight className="w-4 h-4" />}
                >
                  Confirmar e Ingresar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
