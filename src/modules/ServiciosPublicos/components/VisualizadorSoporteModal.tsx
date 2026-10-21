import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Eye, Download, ExternalLink, FileText } from 'lucide-react';

interface VisualizadorSoporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  url: string | null;
  tipo: 'recibo' | 'pago';
}

export function VisualizadorSoporteModal({
  isOpen,
  onClose,
  titulo,
  url,
  tipo,
}: VisualizadorSoporteModalProps) {
  if (!isOpen || !url) return null;

  const esPdf = url.toLowerCase().endsWith('.pdf');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titulo}
      subtitle={tipo === 'recibo' ? 'Soporte de factura física subida' : 'Comprobante de transacción bancaria / pago'}
      maxWidth="lg"
      icon={<Eye className="w-5 h-5 text-red-600" />}
    >
      <div className="space-y-4">
        <div className="bg-slate-900/5 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[550px] p-2">
          {esPdf ? (
            <div className="text-center p-8 space-y-4">
              <FileText className="w-16 h-16 text-red-500 mx-auto" />
              <p className="text-sm text-slate-700 font-medium">Documento PDF disponible</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-soft"
              >
                <ExternalLink className="w-4 h-4" /> Abrir en nueva pestaña
              </a>
            </div>
          ) : (
            <img
              src={url}
              alt="Soporte de servicio"
              className="max-h-[500px] max-w-full object-contain rounded-xl shadow-xs"
              onError={(e) => {
                // Si falla la carga relativa, intentar con origen
                const target = e.currentTarget;
                if (!target.src.startsWith('http')) {
                  target.src = window.location.origin + url;
                }
              }}
            />
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>

          <a
            href={url}
            download="soporte_servicio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Descargar Soporte
          </a>
        </div>
      </div>
    </Modal>
  );
}
