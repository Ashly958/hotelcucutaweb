import { Loader2 } from 'lucide-react';

interface LoadingProps {
  mensaje?: string;
  tamano?: 'sm' | 'md' | 'lg';
}

export function Loading({ mensaje = 'Cargando datos...', tamano = 'md' }: LoadingProps) {
  const tamanosSpinner = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${tamanosSpinner[tamano]} text-brand-red animate-spin`} />
      {mensaje && <p className="text-xs font-medium text-neutral-600">{mensaje}</p>}
    </div>
  );
}
