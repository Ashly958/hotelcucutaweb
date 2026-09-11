import { useState } from 'react';
import {
  IconoRecepcion,
  IconoAdmin,
  IconoLavanderia,
  IconoMantenimiento,
} from '@/components';
import { USUARIOS_MOCK } from '@/services/mockAuth';
import type { CredencialesDTO, RolUsuario } from '../types/auth.types';

interface CredencialesDemoCardProps {
  onSeleccionarCredencial: (credenciales: CredencialesDTO) => void;
}

export function CredencialesDemoCard({ onSeleccionarCredencial }: CredencialesDemoCardProps) {
  const [rolActivo, setRolActivo] = useState<RolUsuario | null>('RECEPCION');

  const roles: Array<{
    rol: RolUsuario;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }> = [
    {
      rol: 'RECEPCION',
      label: 'Recepción',
      sublabel: 'C. Mendoza',
      icon: <IconoRecepcion size={15} />,
    },
    {
      rol: 'ADMIN',
      label: 'Gerencia',
      sublabel: 'P. Ramírez',
      icon: <IconoAdmin size={15} />,
    },
    {
      rol: 'LAVANDERIA',
      label: 'Lavandería',
      sublabel: 'Piso 5',
      icon: <IconoLavanderia size={15} />,
    },
    {
      rol: 'MANTENIMIENTO',
      label: 'Mantenimiento',
      sublabel: 'Equipos',
      icon: <IconoMantenimiento size={15} />,
    },
  ];

  const handleSeleccionar = (rol: RolUsuario) => {
    setRolActivo(rol);
    const usuario = USUARIOS_MOCK.find((u) => u.rol === rol);
    if (usuario) {
      onSeleccionarCredencial({
        email: usuario.email,
        password: usuario.passwordValida,
        recordarSesion: true,
      });
    }
  };

  return (
    <div className="mt-4 pt-3.5 border-t border-neutral-200/80">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
          Probar Rol con 1 Clic (RF-023):
        </span>
        <span className="text-[9px] text-neutral-400 font-mono">Mock Auth</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {roles.map((item) => {
          const estaActivo = rolActivo === item.rol;
          return (
            <button
              key={item.rol}
              type="button"
              onClick={() => handleSeleccionar(item.rol)}
              className={`
                py-2 px-1 rounded-xl text-[11px] font-medium border transition-all duration-150 flex flex-col items-center justify-center gap-1
                ${
                  estaActivo
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                }
              `}
            >
              <span className={estaActivo ? 'text-brand-gold' : 'text-neutral-500'}>
                {item.icon}
              </span>
              <span className="font-semibold leading-none">{item.label}</span>
              <span
                className={`text-[9px] ${
                  estaActivo ? 'text-neutral-300' : 'text-neutral-400'
                } font-mono leading-none`}
              >
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
