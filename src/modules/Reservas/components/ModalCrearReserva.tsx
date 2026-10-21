import React, { useState, useEffect } from 'react';
import { X, Calendar, User, DollarSign, AlertCircle, Loader2, Check } from 'lucide-react';
import type { CrearReservaDTO, OrigenReserva, RackHabitacion } from '../types/reserva.types';
import { reservasService } from '../services/reservasService';

interface ModalCrearReservaProps {
  abierto: boolean;
  onCerrar: () => void;
  onSubmit: (datos: CrearReservaDTO) => Promise<void>;
  habitaciones: RackHabitacion[];
  preseleccion?: { id: number; fecha: string } | null;
}

export const ModalCrearReserva: React.FC<ModalCrearReservaProps> = ({
  abierto,
  onCerrar,
  onSubmit,
  habitaciones,
  preseleccion,
}) => {
  const [habitacionId, setHabitacionId] = useState<number>(0);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [valorNoche, setValorNoche] = useState(0);
  const [abonoAnticipo, setAbonoAnticipo] = useState(0);
  const [origen, setOrigen] = useState<OrigenReserva>('directa');
  const [notas, setNotas] = useState('');

  const [buscandoHuesped, setBuscandoHuesped] = useState(false);
  const [huespedEncontrado, setHuespedEncontrado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Búsqueda automática con debounce de 2 segundos al ingresar el número de documento
  useEffect(() => {
    const docLimpio = numeroDocumento.trim();
    setHuespedEncontrado(false);

    if (docLimpio.length < 5) {
      setBuscandoHuesped(false);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscandoHuesped(true);
      try {
        const huesped = await reservasService.buscarHuespedPorDocumento(docLimpio);
        if (huesped) {
          if (huesped.nombres) setNombres(huesped.nombres);
          if (huesped.apellidos) setApellidos(huesped.apellidos);
          if (huesped.tipo_documento) setTipoDocumento(huesped.tipo_documento);
          if (huesped.telefono) setTelefono(huesped.telefono);
          if (huesped.email) setEmail(huesped.email);
          setHuespedEncontrado(true);
        }
      } catch (err) {
        console.error('Error al buscar huésped por documento:', err);
      } finally {
        setBuscandoHuesped(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [numeroDocumento]);

  // Bloqueo de scroll en body al abrir el modal
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abierto]);

  useEffect(() => {
    if (preseleccion) {
      setHabitacionId(preseleccion.id);
      setFechaLlegada(preseleccion.fecha);
      const fechaSiguiente = new Date(preseleccion.fecha);
      fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);
      setFechaSalida(fechaSiguiente.toISOString().slice(0, 10));

      const hab = habitaciones.find((h) => h.id === preseleccion.id);
      if (hab) {
        setValorNoche(hab.precio_noche_base);
      }
    } else if (habitaciones.length > 0 && !habitacionId) {
      setHabitacionId(habitaciones[0].id);
      setValorNoche(habitaciones[0].precio_noche_base);
      const hoy = new Date().toISOString().slice(0, 10);
      setFechaLlegada(hoy);
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      setFechaSalida(manana.toISOString().slice(0, 10));
    }
  }, [preseleccion, habitaciones]);

  if (!abierto) return null;

  // Cálculo dinámico de noches y total
  const noches = (() => {
    if (!fechaLlegada || !fechaSalida) return 1;
    const diff = new Date(fechaSalida).getTime() - new Date(fechaLlegada).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();

  const totalEstimado = noches * valorNoche;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!habitacionId) {
      setErrorLocal('Debe seleccionar una habitación.');
      return;
    }
    if (!nombres.trim() || !apellidos.trim() || !numeroDocumento.trim()) {
      setErrorLocal('Los campos de identificación del huésped son obligatorios.');
      return;
    }
    const hoyStr = new Date().toISOString().slice(0, 10);
    if (fechaLlegada < hoyStr) {
      setErrorLocal('La fecha de llegada no puede ser una fecha pasada.');
      return;
    }
    if (new Date(fechaSalida) <= new Date(fechaLlegada)) {
      setErrorLocal('La fecha de salida debe ser posterior a la fecha de llegada.');
      return;
    }

    setEnviando(true);
    try {
      await onSubmit({
        habitacion_id: habitacionId,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento.trim(),
        telefono: telefono.trim() || undefined,
        email: email.trim() || undefined,
        fecha_llegada: fechaLlegada,
        fecha_salida: fechaSalida,
        adultos: Number(adultos),
        ninos: Number(ninos),
        valor_noche: Number(valorNoche),
        abono_anticipo: Number(abonoAnticipo),
        origen,
        notas: notas.trim() || undefined,
      });
      onCerrar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la reserva';
      setErrorLocal(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop oscuro con blur que cubre toda la pantalla */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCerrar}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8 z-10">
        {/* Cabecera */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">Nueva Reserva</h3>
          </div>
          <button onClick={onCerrar} className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorLocal && (
          <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorLocal}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selección de habitación y fechas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Habitación</label>
              <select
                value={habitacionId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setHabitacionId(id);
                  const hab = habitaciones.find((h) => h.id === id);
                  if (hab) setValorNoche(hab.precio_noche_base);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-semibold"
                required
              >
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    Hab {h.numero} (Cap: {h.capacidad_maxima} - ${h.precio_noche_base.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Llegada</label>
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={fechaLlegada}
                onChange={(e) => {
                  const nuevaLlegada = e.target.value;
                  setFechaLlegada(nuevaLlegada);
                  if (fechaSalida && nuevaLlegada >= fechaSalida) {
                    const d = new Date(nuevaLlegada);
                    d.setDate(d.getDate() + 1);
                    setFechaSalida(d.toISOString().slice(0, 10));
                  }
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Salida</label>
              <input
                type="date"
                min={fechaLlegada ? (() => {
                  const d = new Date(fechaLlegada);
                  d.setDate(d.getDate() + 1);
                  return d.toISOString().slice(0, 10);
                })() : new Date().toISOString().slice(0, 10)}
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Datos del Huésped */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Datos del Huésped Titular
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombres *</label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="Ej. Carlos Alberto"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Apellidos *</label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="Ej. Mendoza Rojas"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipo Doc</label>
                  <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full px-2 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="TI">TI</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">Nº Documento *</label>
                    {buscandoHuesped && (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Buscando...
                      </span>
                    )}
                    {!buscandoHuesped && huespedEncontrado && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Datos cargados
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      placeholder="1090123456"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 pr-8"
                      required
                    />
                    {buscandoHuesped && (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin absolute right-2.5 top-2.5 pointer-events-none" />
                    )}
                    {!buscandoHuesped && huespedEncontrado && (
                      <Check className="w-4 h-4 text-emerald-500 absolute right-2.5 top-2.5 pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="310 123 4567"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Adultos</label>
                  <input
                    type="number"
                    min="1"
                    value={adultos}
                    onChange={(e) => setAdultos(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Niños</label>
                  <input
                    type="number"
                    min="0"
                    value={ninos}
                    onChange={(e) => setNinos(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Canal / Origen</label>
                <select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value as OrigenReserva)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="directa">Recepción Directa</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telefono">Llamada Telefónica</option>
                  <option value="web">Web</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tarifas y Anticipos */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Cálculo y Anticipo ({noches} {noches === 1 ? 'Noche' : 'Noches'})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tarifa por Noche ($)</label>
                <input
                  type="number"
                  min="0"
                  value={valorNoche}
                  onChange={(e) => setValorNoche(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Estimado ($)</label>
                <input
                  type="text"
                  value={`$${totalEstimado.toLocaleString()}`}
                  disabled
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Abono / Anticipo ($)</label>
                <input
                  type="number"
                  min="0"
                  value={abonoAnticipo}
                  onChange={(e) => setAbonoAnticipo(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notas / Peticiones Especiales</label>
            <textarea
              rows={2}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. Cama matrimonial, llegada después de las 6:00 PM..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
