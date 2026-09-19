import { Edit, Trash2, FolderTree } from 'lucide-react';
import type { Categoria } from '../types/inventario.types';
import { EmptyState } from '@/components/EmptyState';

interface CategoriasTabProps {
  categorias: Categoria[];
  onEditar: (c: Categoria) => void;
  onEliminar: (id: number) => void;
  onCrearCategoria: () => void;
}

export function CategoriasTab({
  categorias,
  onEditar,
  onEliminar,
  onCrearCategoria,
}: CategoriasTabProps) {
  if (categorias.length === 0) {
    return (
      <EmptyState
        titulo="No hay categorías"
        descripcion="Cree categorías para clasificar insumos, lencería y consumos."
        textoAccion="Crear Categoría"
        onAccion={onCrearCategoria}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {categorias.map((cat) => (
        <div
          key={cat.id}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">{cat.nombre}</h4>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              {cat.descripcion || 'Sin descripción'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
            <button
              onClick={() => onEditar(cat)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Editar categoría"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) {
                  onEliminar(cat.id);
                }
              }}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Eliminar categoría"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
