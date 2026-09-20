import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Input, Button } from '@/components';

import type { CredencialesDTO } from '../types/auth.types';

interface LoginFormProps {
  onSubmit: (credenciales: CredencialesDTO) => Promise<boolean>;
  cargando: boolean;
  error: string | null;
  onLimpiarError: () => void;
}

export function LoginForm({ onSubmit, cargando, error, onLimpiarError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordarSesion, setRecordarSesion] = useState(true);
  const [erroresCampos, setErroresCampos] = useState<{ email?: string; password?: string }>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nuevosErrores.email = 'El correo es obligatorio.';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      nuevosErrores.email = 'Correo inválido.';
    }

    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    }

    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLimpiarError();

    if (!validarFormulario()) {
      return;
    }

    await onSubmit({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      recordarSesion,
    });
  };



  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Alerta de Error */}
      {error && (
        <div
          role="alert"
          className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">{error}</p>
        </div>
      )}

      {/* Formulario Limpio */}
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <div>
          <Input
            label="Correo Institucional"
            type="email"
            placeholder="usuario@hotelcucuta.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erroresCampos.email) setErroresCampos((prev) => ({ ...prev, email: undefined }));
            }}
            error={erroresCampos.email}
            iconoIzquierda={<Mail className="w-4 h-4 text-neutral-400" />}
            autoComplete="email"
            disabled={cargando}
            required
          />
        </div>

        <div>
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (erroresCampos.password) setErroresCampos((prev) => ({ ...prev, password: undefined }));
            }}
            error={erroresCampos.password}
            iconoIzquierda={<Lock className="w-4 h-4 text-neutral-400" />}
            permitirTogglePassword
            autoComplete="current-password"
            disabled={cargando}
            required
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600 select-none">
            <input
              type="checkbox"
              checked={recordarSesion}
              onChange={(e) => setRecordarSesion(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-brand-red focus:ring-brand-red border-neutral-300"
              disabled={cargando}
            />
            <span className="text-[11px]">Recordar sesión</span>
          </label>

          <button
            type="button"
            onClick={() =>
              alert(
                'El restablecimiento de credenciales debe ser solicitado formalmente a la Administración General de Hotel Cúcuta.'
              )
            }
            className="text-[11px] text-neutral-500 hover:text-brand-red font-medium transition-colors"
          >
            ¿Olvidó su clave?
          </button>
        </div>

        <div className="pt-0.5">
          <Button
            type="submit"
            size="md"
            cargando={cargando}
            className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs shadow-soft-xs transition-colors"
            iconoDerecha={<ArrowRight className="w-4 h-4" />}
          >
            Ingresar al PMS
          </Button>
        </div>


      </form>
    </div>
  );
}
