import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  iconoIzquierda?: React.ReactNode;
  permitirTogglePassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconoIzquierda,
      permitirTogglePassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const esPassword = type === 'password';
    const tipoFinal = esPassword && mostrarPassword ? 'text' : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wide text-neutral-700 uppercase font-sans"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-xl shadow-sm">
          {iconoIzquierda && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              {iconoIzquierda}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={tipoFinal}
            className={`
              w-full text-sm rounded-xl border bg-white py-2.5 transition-colors duration-200 outline-none
              placeholder:text-neutral-400
              ${iconoIzquierda ? 'pl-10' : 'pl-3.5'}
              ${esPassword && permitirTogglePassword ? 'pr-10' : 'pr-3.5'}
              ${
                error
                  ? 'border-red-400 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-neutral-300 text-neutral-900 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20'
              }
              ${className}
            `}
            {...props}
          />

          {esPassword && permitirTogglePassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {mostrarPassword ? (
                <EyeOff className="w-4 h-4 text-neutral-500" />
              ) : (
                <Eye className="w-4 h-4 text-neutral-500" />
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && helperText && (
          <p className="text-xs text-neutral-500 pt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
