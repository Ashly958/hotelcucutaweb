import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../Button';

interface ErrorStateProps {
  titulo?: string;
  mensaje: string;
  onReintentar?: () => void;
}

export function ErrorState({
  titulo = 'Ha ocurrido un error',
  mensaje,
  onReintentar,
}: ErrorStateProps) {
  return (
    <div className="p-6 max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-brand-red">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-neutral-900 text-base">{titulo}</h3>
      <p className="text-xs text-neutral-600 leading-relaxed">{mensaje}</p>
      {onReintentar && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReintentar}
            icono={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
}
