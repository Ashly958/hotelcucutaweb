import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { User, Plus, Trash2, Calendar, FileText, DollarSign, AlertCircle } from 'lucide-react';
import type { RegistrarCheckInDTO, Acompanante } from '../types/estadia.types';
import { habitacionesService } from '@/modules/Habitaciones/services/habitacionesService';
import type { Habitacion } from '@/modules/Habitaciones/types/habitacion.types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: RegistrarCheckInDTO) => Promise<boolean>;
}

export function CheckInModal({ isOpen, onClose, onSubmit }: CheckInModalProps) {
  const [cargando, setCargando] = useState(false);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargandoHabs, setCargandoHabs] = useState(false);

  // Datos de estadía y habitación
  const [habitacionId, setHabitacionId] = useState<number>(1);
  const [diasEstadia, setDiasEstadia] = useState<number>(1);
  const [valorHabitacion, setValorHabitacion] = useState<number>(65000);
  const [abonoInicial, setAbonoInicial] = useState<number>(65000);
  const [observaciones, setObservaciones] = useState<string>('');

  const fechaCheckin = new Date().toISOString().substring(0, 10) + ' 14:00:00';
  const fechaCheckout = new Date(Date.now() + diasEstadia * 86400000).toISOString().substring(0, 10) + ' 13:00:00';

  // Datos del titular
  const [tipoDocumento, setTipoDocumento] = useState<string>('CC');
  const [numeroDocumento, setNumeroDocumento] = useState<string>('');
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [ciudadProcedencia, setCiudadProcedencia] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [profesion, setProfesion] = useState<string>('');

  // Acompañantes
  const [acompanantes, setAcompanantes] = useState<Acompanante[]>([]);
  const [acNombre, setAcNombre] = useState('');
  const [acTipoDoc, setAcTipoDoc] = useState('CC');
  const [acNumDoc, setAcNumDoc] = useState('');
  const [acParentesco, setAcParentesco] = useState('');

  // Cargar habitaciones reales del hotel al abrir
  useEffect(() => {
    if (isOpen) {
      setCargandoHabs(true);
      habitacionesService.obtenerTodas()
        .then((habs) => {
          setHabitaciones(habs);
          // Auto-seleccionar la primera disponible
          const disponible = habs.find((h) => h.estado === 'disponible');
          if (disponible) {
            const idNum = parseInt(disponible.id, 10);
            setHabitacionId(idNum);
            setValorHabitacion(disponible.precioNoche);
            setAbonoInicial(disponible.precioNoche * diasEstadia);
          }
        })
        .catch(() => {})
        .finally(() => setCargandoHabs(false));
    }
  }, [isOpen]);

  const habitacionSeleccionada = habitaciones.find(
    (h) => parseInt(h.id, 10) === habitacionId
  );

  const handleSeleccionarHabitacion = (idNum: number) => {
    setHabitacionId(idNum);
    const hab = habitaciones.find((h) => parseInt(h.id, 10) === idNum);
    if (hab) {
      setValorHabitacion(hab.precioNoche);
      setAbonoInicial(hab.precioNoche * diasEstadia);
      // Si los acompañantes exceden la capacidad de la nueva habitación, recortar
      const maxAc = Math.max(0, hab.capacidadMax - 1);
      if (acompanantes.length > maxAc) {
        setAcompanantes(acompanantes.slice(0, maxAc));
      }
    }
  };

  const totalCalculado = valorHabitacion * diasEstadia;
  const capacidadMax = habitacionSeleccionada?.capacidadMax ?? 3;
  const maxAcompanantes = Math.max(0, capacidadMax - 1);
  const puedeAgregarAcompanante = acompanantes.length < maxAcompanantes;

  const agregarAcompanante = () => {
    if (!acNombre.trim()) return;
    if (!puedeAgregarAcompanante) {
      alert(`La habitación tiene capacidad máxima de ${capacidadMax} personas.`);
      return;
    }

    setAcompanantes([
      ...acompanantes,
      {
        nombres: acNombre.trim(),
        tipo_documento: acTipoDoc,
        numero_documento: acNumDoc.trim() || 'S/D',
        parentesco: acParentesco.trim() || 'Acompañante',
      },
    ]);
    setAcNombre('');
    setAcNumDoc('');
    setAcParentesco('');
  };

  const eliminarAcompanante = (index: number) => {
    setAcompanantes(acompanantes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim() || !numeroDocumento.trim()) {
      alert('Por favor complete los campos obligatorios del huésped titular.');
      return;
    }

    setCargando(true);
    const exito = await onSubmit({
      habitacion_id: habitacionId,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
      nombres,
      apellidos,
      telefono,
      ciudad_procedencia: ciudadProcedencia,
      direccion,
      profesion,
      fecha_checkin: fechaCheckin,
      fecha_prevista_checkout: fechaCheckout,
      dias_estadia: diasEstadia,
      valor_habitacion: valorHabitacion,
      abono_inicial: abonoInicial,
      observaciones,
      acompanantes,
    });

    setCargando(false);
    if (exito) {
      setNumeroDocumento('');
      setNombres('');
      setApellidos('');
      setTelefono('');
      setCiudadProcedencia('');
      setDireccion('');
      setProfesion('');
      setObservaciones('');
      setAcompanantes([]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registro de Check-In Manual"
      subtitle="Ingreso formal de huésped titular y acompañantes (RF-004 y RF-005)"
      maxWidth="2xl"
      icon={<User className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {/* Sección: Habitación y Fechas */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Asignación de Habitación y Duración</span>
            </h4>
            {habitacionSeleccionada && (
              <span className="text-[11px] bg-red-50 text-red-700 border border-red-200/60 px-2 py-0.5 rounded-full font-medium">
                Capacidad: {habitacionSeleccionada.capacidadMax} personas · {habitacionSeleccionada.tipo}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Habitación *
              </label>
              <select
                value={habitacionId}
                disabled={cargandoHabs}
                onChange={(e) => handleSeleccionarHabitacion(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              >
                {habitaciones.length > 0 ? (
                  habitaciones.map((h) => {
                    const idNum = parseInt(h.id, 10);
                    const esDisp = h.estado === 'disponible';
                    return (
                      <option key={h.id} value={idNum} disabled={!esDisp}>
                        Hab. {h.numero} (Piso {h.piso}) {esDisp ? '— Disponible' : `(${h.estado})`}
                      </option>
                    );
                  })
                ) : (
                  Array.from({ length: 45 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      Habitación {String(n).padStart(2, '0')} (Piso {Math.ceil(n / 11)})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Noches *
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={diasEstadia}
                onChange={(e) => {
                  const n = parseInt(e.target.value) || 1;
                  setDiasEstadia(n);
                  setAbonoInicial(valorHabitacion * n);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tarifa x Noche (COP) *
              </label>
              <input
                type="number"
                step="1000"
                value={valorHabitacion}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setValorHabitacion(val);
                  setAbonoInicial(val * diasEstadia);
                }}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Total Estadía
              </label>
              <div className="p-2 bg-white text-red-600 font-mono font-bold rounded-xl border border-red-200 text-center">
                ${totalCalculado.toLocaleString('es-CO')}
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Datos del Huésped Titular */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
            <User className="w-4 h-4 text-red-600" />
            <span>Datos del Huésped Titular (SIRE / Policía)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tipo Documento *
              </label>
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              >
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
                <option value="PA">Pasaporte (PA)</option>
                <option value="PPT">Permiso de Protección Temporal (PPT)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. 1090123456"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+57 300 1234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                required
                placeholder="Nombres completos"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                placeholder="Apellidos completos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Profesión / Ocupación
              </label>
              <input
                type="text"
                placeholder="Ej. Comerciante / Ingeniero"
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Ciudad de Procedencia
              </label>
              <input
                type="text"
                placeholder="Ej. Bucaramanga / Bogotá"
                value={ciudadProcedencia}
                onChange={(e) => setCiudadProcedencia(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Dirección Residencial
              </label>
              <input
                type="text"
                placeholder="Dirección completa"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Sección: Acompañantes Dinámicos con Validación de Capacidad */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
              <span>Acompañantes Adicionales ({acompanantes.length} / {maxAcompanantes})</span>
            </h4>
            {!puedeAgregarAcompanante && (
              <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Habitación al tope de capacidad ({capacidadMax} personas)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Nombre del acompañante"
                value={acNombre}
                disabled={!puedeAgregarAcompanante}
                onChange={(e) => setAcNombre(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 disabled:bg-slate-100 shadow-2xs"
              />
            </div>
            <div>
              <select
                value={acTipoDoc}
                disabled={!puedeAgregarAcompanante}
                onChange={(e) => setAcTipoDoc(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 disabled:bg-slate-100 shadow-2xs"
              >
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="RC">RC</option>
                <option value="CE">CE</option>
                <option value="PA">PA</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Documento"
                value={acNumDoc}
                disabled={!puedeAgregarAcompanante}
                onChange={(e) => setAcNumDoc(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-red-500 disabled:bg-slate-100 shadow-2xs"
              />
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Parentesco"
                value={acParentesco}
                disabled={!puedeAgregarAcompanante}
                onChange={(e) => setAcParentesco(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 disabled:bg-slate-100 shadow-2xs"
              />
              <button
                type="button"
                disabled={!puedeAgregarAcompanante || !acNombre.trim()}
                onClick={agregarAcompanante}
                title={puedeAgregarAcompanante ? 'Agregar acompañante' : 'Capacidad máxima alcanzada'}
                className="px-2.5 py-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {acompanantes.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {acompanantes.map((ac, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs"
                >
                  <span className="font-medium text-slate-800">{ac.nombres}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {ac.tipo_documento}: {ac.numero_documento}
                  </span>
                  <span className="text-slate-500 text-[11px]">{ac.parentesco}</span>
                  <button
                    type="button"
                    onClick={() => eliminarAcompanante(idx)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección: Abono en Efectivo y Observaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-xs">
            <label className="block text-[11px] font-medium text-slate-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-red-600" />
              <span>Abono / Pago en Efectivo al Ingreso (RN-010)</span>
            </label>
            <input
              type="number"
              step="1000"
              min="0"
              max={totalCalculado}
              value={abonoInicial}
              onChange={(e) => setAbonoInicial(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-red-500 focus:bg-white"
            />
            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Saldo a liquidar en salida:</span>
              <strong className={totalCalculado - abonoInicial > 0 ? 'text-red-600 font-mono' : 'text-emerald-600 font-mono'}>
                ${Math.max(0, totalCalculado - abonoInicial).toLocaleString('es-CO')} COP
              </strong>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Observaciones o Solicitudes
            </label>
            <textarea
              rows={2}
              placeholder="Peticiones especiales, lencería adicional..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
            />
          </div>
        </div>

        {/* Footer y botones */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<FileText className="w-4 h-4" />}
          >
            Registrar Check-In
          </Button>
        </div>
      </form>
    </Modal>
  );
}
