import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { FilePlus } from 'lucide-react';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';

interface EmitirFacturaModalProps {
  isOpen: boolean;
  estadias?: Estadia[];
  estadiaInicialId?: number | null;
  onClose: () => void;
  onSubmit: (estadiaId: number) => Promise<boolean>;
}

export function EmitirFacturaModal({
  isOpen,
  estadias = [],
  estadiaInicialId = null,
  onClose,
  onSubmit,
}: EmitirFacturaModalProps) {
  const [cargando, setCargando] = useState(false);
  const [estadiaId, setEstadiaId] = useState<string>('');

  useEffect(() => {
    if (estadiaInicialId) {
      setEstadiaId(String(estadiaInicialId));
    } else if (estadias.length > 0 && !estadiaId) {
      setEstadiaId(String(estadias[0].id));
    }
  }, [estadiaInicialId, estadias, isOpen]);

  const estadiaSeleccionada = estadias.find((e) => String(e.id) === estadiaId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estadiaId) return;

    setCargando(true);
    const exito = await onSubmit(parseInt(estadiaId));
    setCargando(false);
    if (exito) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emitir Factura por Estadía"
      subtitle="Genera consecutivo oficial DIAN cruzando cargos de hospedaje y consumos."
      maxWidth="md"
      icon={<FilePlus className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {estadias.length > 0 ? (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Seleccione la Estadía a Facturar *
            </label>
            <select
              required
              value={estadiaId}
              onChange={(e) => setEstadiaId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 font-medium text-slate-800"
            >
              <option value="">Seleccione una estadía...</option>
              {estadias.map((est) => {
                const habNum =
                  est.habitacion_numero || String(est.habitacion_id).padStart(2, '0');
                const titular = est.huesped
                  ? `${est.huesped.nombres} ${est.huesped.apellidos}`
                  : 'Huésped';
                const total = (est.total || 0).toLocaleString('es-CO');
                const estado = est.estado === 'activa' ? 'En curso' : 'Finalizada';

                return (
                  <option key={est.id} value={est.id}>
                    Hab. {habNum} · {titular} ({estado} - Total: ${total})
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Número de Estadía a Facturar *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="Ej. 1, 2, 3..."
              value={estadiaId}
              onChange={(e) => setEstadiaId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-mono text-slate-900 outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        )}

        {estadiaSeleccionada && (
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Huésped titular:</span>
              <strong className="text-slate-800">
                {estadiaSeleccionada.huesped
                  ? `${estadiaSeleccionada.huesped.nombres} ${estadiaSeleccionada.huesped.apellidos}`
                  : 'Huésped'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>C.C. / Documento:</span>
              <span className="font-mono text-slate-800">
                {estadiaSeleccionada.huesped?.numero_documento || 'No registrado'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total hospedaje:</span>
              <span className="font-mono font-semibold text-slate-900">
                ${(estadiaSeleccionada.total || 0).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Abonos ya registrados:</span>
              <span className="font-mono text-emerald-600">
                ${(estadiaSeleccionada.abonos_totales || 0).toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-400">
          El sistema asignará el siguiente número correlativo de la resolución DIAN activa y
          convertirá los abonos previos en recibos cruzados con esta factura.
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<FilePlus className="w-4 h-4" />}
          >
            Emitir Factura DIAN
          </Button>
        </div>
      </form>
    </Modal>
  );
}
