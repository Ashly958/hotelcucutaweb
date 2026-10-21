// ─── ModalQr — Modal con código QR para compartir la guía pública ─────────────

import { Check, Copy } from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Button } from '@/components/Button';

interface ModalQrProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  copiado: boolean;
  onCopiarEnlace: () => void;
}

export function ModalQr({ isOpen, onClose, qrCodeUrl, copiado, onCopiarEnlace }: ModalQrProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guía Digital del Hotel para Huéspedes"
      maxWidth="sm"
    >
      <div className="p-5 text-center space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          Escanea este código QR para abrir la guía digital de servicios del hotel
          directamente en tu teléfono.
        </p>

        {/* QR Code */}
        <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mx-auto shadow-sm">
          <img
            src={qrCodeUrl}
            alt="Código QR — Guía Digital Hotel Cúcuta"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Copiar enlace */}
        <Button
          id="btn-copiar-enlace-qr"
          variant="outline"
          size="sm"
          onClick={onCopiarEnlace}
          icono={
            copiado
              ? <Check className="w-3.5 h-3.5 text-emerald-600" />
              : <Copy className="w-3.5 h-3.5" />
          }
          className="w-full justify-center text-xs"
        >
          {copiado ? '¡Enlace copiado!' : 'Copiar enlace de la guía'}
        </Button>
      </div>
    </Modal>
  );
}
