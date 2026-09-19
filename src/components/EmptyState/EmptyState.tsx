import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/Button';

interface EmptyStateProps {
  titulo: string;
  descripcion?: string;
  icono?: React.ReactNode;
  textoAccion?: string;
  onAccion?: () => void;
}

export function EmptyState({
  titulo,
  descripcion,
  icono,
  textoAccion,
  onAccion,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4">
        {icono || <Inbox className="w-7 h-7" />}
      </div>

      <h3 className="text-base font-semibold text-slate-800 mb-1">{titulo}</h3>
      {descripcion && (
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
          {descripcion}
        </p>
      )}

      {textoAccion && onAccion && (
        <Button variant="outline" size="sm" onClick={onAccion}>
          {textoAccion}
        </Button>
      )}
    </div>
  );
}
