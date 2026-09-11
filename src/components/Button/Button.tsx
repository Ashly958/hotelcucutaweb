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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantes = {
    primary:
      'bg-brand-red hover:bg-brand-redHover text-white shadow-lg shadow-brand-red/20 focus:ring-brand-red',
    secondary:
      'bg-neutral-800 hover:bg-neutral-900 text-white shadow focus:ring-neutral-800',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow focus:ring-red-600',
    outline:
      'border border-neutral-300 hover:bg-neutral-100 text-neutral-800 focus:ring-brand-red bg-white',
    ghost:
      'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400',
  };

  const tamanos = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
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
