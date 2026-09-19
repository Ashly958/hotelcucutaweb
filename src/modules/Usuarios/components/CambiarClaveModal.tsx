import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Key, Lock } from 'lucide-react';
import type { UsuarioSistema } from '../types/usuario.types';

interface CambiarClaveModalProps {
  isOpen: boolean;
  usuario: UsuarioSistema | null;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}

export function CambiarClaveModal({
  isOpen,
  usuario,
  onClose,
  onSubmit,
}: CambiarClaveModalProps) {
  const [cargando, setCargando] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  if (!usuario) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    await onSubmit(password);
    setCargando(false);
    setPassword('');
    setConfirmarPassword('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Contraseña"
      subtitle={`Usuario: ${usuario.nombre_completo} (${usuario.email})`}
      maxWidth="sm"
      icon={<Key className="w-5 h-5 text-amber-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Nueva Contraseña *
          </label>
          <input
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Confirmar Nueva Contraseña *
          </label>
          <input
            type="password"
            required
            placeholder="Repita la contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<Lock className="w-4 h-4" />}
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </Modal>
  );
}
