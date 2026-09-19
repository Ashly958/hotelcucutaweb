import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { FolderTree, Save } from 'lucide-react';
import type { Categoria, GuardarCategoriaDTO } from '../types/inventario.types';

interface CategoriaModalProps {
  isOpen: boolean;
  categoria: Categoria | null;
  onClose: () => void;
  onSubmit: (datos: GuardarCategoriaDTO) => Promise<boolean>;
}

export function CategoriaModal({
  isOpen,
  categoria,
  onClose,
  onSubmit,
}: CategoriaModalProps) {
  const [cargando, setCargando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion || '');
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [categoria, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setCargando(true);
    await onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
    setCargando(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoria ? 'Editar Categoría' : 'Nueva Categoría de Inventario'}
      subtitle="Clasificación de insumos, lencería y consumibles"
      maxWidth="md"
      icon={<FolderTree className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Nombre de la Categoría *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Insumos de Cafetería"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Descripción
          </label>
          <textarea
            rows={3}
            placeholder="Breve explicación de los elementos que pertenecen a esta categoría..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
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
            {categoria ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
