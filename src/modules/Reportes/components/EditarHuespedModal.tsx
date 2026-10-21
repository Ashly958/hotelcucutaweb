import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { api } from '@/services/api';
import { Input, Button } from '@/components';

interface Huesped {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  email: string | null;
  nacionalidad: string | null;
  ciudad_procedencia: string | null;
  ciudad_destino: string | null;
  es_extranjero: boolean;
}

interface EditarHuespedModalProps {
  isOpen: boolean;
  onClose: () => void;
  huesped: Huesped;
  onSuccess: () => void;
}

export function EditarHuespedModal({ isOpen, onClose, huesped, onSuccess }: EditarHuespedModalProps) {
  const [formData, setFormData] = useState<Partial<Huesped>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (huesped && isOpen) {
      setFormData(huesped);
    }
  }, [huesped, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.put(`/huespedes/${huesped.id}`, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el huésped');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] z-10">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Editar Huésped</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}
          <form id="edit-huesped-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nombres</label>
                <Input name="nombres" value={formData.nombres || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Apellidos</label>
                <Input name="apellidos" value={formData.apellidos || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Teléfono</label>
                <Input name="telefono" value={formData.telefono || ''} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nacionalidad</label>
                <Input name="nacionalidad" value={formData.nacionalidad || ''} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Procedencia</label>
                <Input name="ciudad_procedencia" value={formData.ciudad_procedencia || ''} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Destino</label>
                <Input name="ciudad_destino" value={formData.ciudad_destino || ''} onChange={handleChange} />
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-huesped-form" disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
