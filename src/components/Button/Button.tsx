import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  cargando?: boolean;
  icono?: React.ReactNode;
  iconoDerecha?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  cargando = false,
  icono,
  iconoDerecha,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseEstilos =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantes = {
    primary:
      'bg-red-700 hover:bg-red-800 text-white shadow-soft-xs hover:shadow-soft focus:ring-red-600',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-soft-xs focus:ring-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-soft-xs focus:ring-rose-600',
    outline:
      'border border-slate-200/80 hover:bg-slate-50 text-slate-700 focus:ring-slate-300 bg-white shadow-soft-xs',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-200',
  };

  const tamanos = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 font-bold',
  };

  return (
    <button
      disabled={disabled || cargando}
      className={`${baseEstilos} ${variantes[variant]} ${tamanos[size]} ${className}`}
      {...props}
    >
      {cargando ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          {icono && <span className="inline-flex shrink-0">{icono}</span>}
          {children}
          {iconoDerecha && <span className="inline-flex shrink-0">{iconoDerecha}</span>}
        </>
      )}
    </button>
  );
}
