import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Building2, Save } from 'lucide-react';
import type { Piso, GuardarPisoDTO } from '../types/piso.types';

interface PisoModalProps {
  isOpen: boolean;
  piso: Piso | null;
  onClose: () => void;
  onSubmit: (datos: GuardarPisoDTO) => Promise<boolean>;
}

export function PisoModal({ isOpen, piso, onClose, onSubmit }: PisoModalProps) {
  const [cargando, setCargando] = useState(false);
  const [numeroPiso, setNumeroPiso] = useState<number>(1);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (piso) {
      setNumeroPiso(piso.numero_piso);
      setNombre(piso.nombre);
      setDescripcion(piso.descripcion || '');
    } else {
      setNumeroPiso(6);
      setNombre('');
      setDescripcion('');
    }
  }, [piso, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setCargando(true);
    await onSubmit({
      numero_piso: numeroPiso,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
    setCargando(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={piso ? `Editar Piso ${piso.numero_piso}` : 'Agregar Nuevo Piso'}
      subtitle="Configuración de infraestructura y distribución física"
      maxWidth="md"
      icon={<Building2 className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Número de Piso *
          </label>
          <input
            type="number"
            required
            min="1"
            max="20"
            value={numeroPiso}
            onChange={(e) => setNumeroPiso(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Nombre / Título del Piso *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Quinto Piso - Lavandería y Lencería"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Descripción y Puntos de Servicio
          </label>
          <textarea
            rows={3}
            placeholder="Especifique áreas operativas, aseo (A) o basura (B)..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-colors shadow-2xs"
          />
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
            {piso ? 'Guardar Cambios' : 'Registrar Piso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
