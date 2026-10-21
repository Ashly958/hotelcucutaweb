import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { BedDouble, Save, Edit3 } from 'lucide-react';
import type { CrearHabitacionDTO, TipoHabitacion, Habitacion } from '../types/habitacion.types';

interface CrearHabitacionModalProps {
  isOpen: boolean;
  habitacion?: Habitacion | null;
  onClose: () => void;
  onSubmit: (datos: CrearHabitacionDTO) => Promise<boolean>;
}

export function CrearHabitacionModal({
  isOpen,
  habitacion,
  onClose,
  onSubmit,
}: CrearHabitacionModalProps) {
  const [cargando, setCargando] = useState(false);
  const [numero, setNumero] = useState('');
  const [piso, setPiso] = useState<number>(1);
  const [tipo, setTipo] = useState<TipoHabitacion>('Estándar');
  const [camas, setCamas] = useState('1 Cama Doble');
  const [capacidadMax, setCapacidadMax] = useState<number>(2);
  const [tieneAire, setTieneAire] = useState(true);
  const [tieneVentilador, setTieneVentilador] = useState(false);
  const [precioNoche, setPrecioNoche] = useState<number>(70000);
  const [observaciones, setObservaciones] = useState('');

  React.useEffect(() => {
    if (habitacion && isOpen) {
      setNumero(habitacion.numero);
      setPiso(habitacion.piso);
      setTipo(habitacion.tipo);
      setCamas(habitacion.camas || '1 Cama');
      setCapacidadMax(habitacion.capacidadMax || 2);
      setTieneAire(habitacion.tieneAire);
      setTieneVentilador(habitacion.tieneVentilador);
      setPrecioNoche(habitacion.precioNoche || 70000);
      setObservaciones(habitacion.observaciones || '');
    } else if (!habitacion && isOpen) {
      setNumero('');
      setPiso(1);
      setTipo('Estándar');
      setCamas('1 Cama Doble');
      setCapacidadMax(2);
      setTieneAire(true);
      setTieneVentilador(false);
      setPrecioNoche(70000);
      setObservaciones('');
    }
  }, [habitacion, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim()) return;

    setCargando(true);
    const exito = await onSubmit({
      numero: numero.trim(),
      piso_id: piso,
      tipo,
      detalle_camas: camas,
      capacidad_maxima: capacidadMax,
      tiene_aire: tieneAire,
      tiene_ventilador: tieneVentilador,
      precio_noche_base: precioNoche,
      estado: 'disponible',
      observaciones: observaciones.trim() || undefined,
    });
    setCargando(false);
    if (exito) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habitacion ? 'Editar Habitación' : 'Crear Nueva Habitación'}
      subtitle={habitacion ? `Modificar datos de la habitación ${habitacion.numero}` : 'Registro de unidad de alojamiento en el PMS'}
      maxWidth="md"
      icon={habitacion ? <Edit3 className="w-5 h-5 text-red-600" /> : <BedDouble className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Número de Habitación *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. 46, 47..."
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Piso Asignado *
            </label>
            <select
              value={piso}
              onChange={(e) => setPiso(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 shadow-2xs"
            >
              <option value="1">Piso 1</option>
              <option value="2">Piso 2</option>
              <option value="3">Piso 3</option>
              <option value="4">Piso 4</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Tipo de Habitación *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoHabitacion)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 shadow-2xs"
            >
              <option value="Estándar">Estándar</option>
              <option value="Individual">Individual</option>
              <option value="Matrimonial">Matrimonial</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Capacidad Máxima *
            </label>
            <select
              value={capacidadMax}
              onChange={(e) => setCapacidadMax(parseInt(e.target.value) || 2)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 shadow-2xs"
            >
              <option value="1">1 Persona</option>
              <option value="2">2 Personas</option>
              <option value="3">3 Personas</option>
              <option value="4">4 Personas</option>
              <option value="5">5 Personas</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Detalle de Camas *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. 1 cama matrimonial + camarote"
              value={camas}
              onChange={(e) => setCamas(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Tarifa Fija x Noche (COP) *
            </label>
            <input
              type="number"
              required
              min="10000"
              step="5000"
              value={precioNoche}
              onChange={(e) => setPrecioNoche(parseFloat(e.target.value) || 50000)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono font-semibold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Climatización
            </label>
            <div className="flex gap-3 pt-2">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneAire}
                  onChange={(e) => {
                    setTieneAire(e.target.checked);
                    if (e.target.checked) setTieneVentilador(false);
                  }}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                Aire Acondicionado
              </label>

              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={tieneVentilador}
                  onChange={(e) => {
                    setTieneVentilador(e.target.checked);
                    if (e.target.checked) setTieneAire(false);
                  }}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                Ventilador
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Observaciones
            </label>
            <textarea
              rows={2}
              placeholder="Notas técnicas o de infraestructura..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-2xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<Save className="w-4 h-4" />}
          >
            {habitacion ? 'Guardar Cambios' : 'Registrar Habitación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
