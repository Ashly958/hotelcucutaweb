import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { User, Save } from 'lucide-react';
import type { UsuarioSistema, GuardarUsuarioDTO } from '../types/usuario.types';

interface UsuarioModalProps {
  isOpen: boolean;
  usuario: UsuarioSistema | null;
  onClose: () => void;
  onSubmit: (datos: GuardarUsuarioDTO) => Promise<boolean>;
}

export function UsuarioModal({
  isOpen,
  usuario,
  onClose,
  onSubmit,
}: UsuarioModalProps) {
  const [cargando, setCargando] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('RECEPCION');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (usuario) {
      setNombreCompleto(usuario.nombre_completo || (usuario as any).nombreCompleto || '');
      setEmail(usuario.email);
      setTelefono(usuario.telefono || '');
      const r = String(usuario.rol || '').toLowerCase();
      if (r.includes('admin')) setRol('ADMIN');
      else if (r.includes('recep')) setRol('RECEPCION');
      else if (r.includes('lavand') || r.includes('limpie')) setRol('LAVANDERIA');
      else if (r.includes('manten')) setRol('MANTENIMIENTO');
      else setRol('RECEPCION');
      setPassword('');
    } else {
      setNombreCompleto('');
      setEmail('');
      setTelefono('');
      setRol('RECEPCION');
      setPassword('');
    }
  }, [usuario, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim() || !email.trim()) return;

    setCargando(true);
    await onSubmit({
      nombre_completo: nombreCompleto.trim(),
      email: email.trim(),
      telefono: telefono.trim() || undefined,
      rol,
      password: password ? password : usuario ? undefined : '123456',
    });
    setCargando(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={usuario ? 'Editar Usuario del Sistema' : 'Crear Nuevo Usuario'}
      subtitle="Asignación de credenciales y delimitación de roles operativos (RF-023)"
      maxWidth="md"
      icon={<User className="w-5 h-5 text-red-600" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Laura Victoria Gómez"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Correo Electrónico (Login) *
          </label>
          <input
            type="email"
            required
            placeholder="usuario@hotelcucuta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Teléfono de Contacto
          </label>
          <input
            type="tel"
            placeholder="+57 300 0000000"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Rol Operativo *
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
          >
            <option value="ADMIN">Administrador General (Control Total)</option>
            <option value="RECEPCION">Recepción (Front Desk, Check-In/Out, Caja)</option>
            <option value="LAVANDERIA">Operario de Lavandería (Piso 5)</option>
            <option value="MANTENIMIENTO">Operario de Mantenimiento (Equipos y Habitaciones)</option>
          </select>
        </div>

        {!usuario && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Contraseña de Acceso Inicial *
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-red-600"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Si se deja vacío, la clave temporal será 123456.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            cargando={cargando}
            icono={<Save className="w-4 h-4" />}
          >
            {usuario ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
