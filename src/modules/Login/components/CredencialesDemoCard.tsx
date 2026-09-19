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
      icon: <IconoRecepcion size={14} />,
    },
    {
      rol: 'ADMIN',
      label: 'Gerencia',
      sublabel: 'P. Ramírez',
      icon: <IconoAdmin size={14} />,
    },
    {
      rol: 'LAVANDERIA',
      label: 'Lavandería',
      sublabel: 'Piso 5',
      icon: <IconoLavanderia size={14} />,
    },
    {
      rol: 'MANTENIMIENTO',
      label: 'Mantenimiento',
      sublabel: 'Equipos',
      icon: <IconoMantenimiento size={14} />,
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
    <div className="mt-3.5 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Perfiles de Acceso Rápido:
        </span>
        <span className="text-[10px] text-slate-400 font-medium">1 Clic para seleccionar</span>
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
                py-1.5 px-1 rounded-xl text-[11px] font-medium border transition-all duration-150 flex flex-col items-center justify-center gap-0.5
                ${
                  estaActivo
                    ? 'bg-red-50/90 text-red-700 border-red-300 shadow-soft-xs font-semibold ring-1 ring-red-200'
                    : 'bg-slate-50/60 text-slate-600 border-slate-200/70 hover:bg-slate-100/80 hover:border-slate-300'
                }
              `}
            >
              <span className={estaActivo ? 'text-red-700' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span className="leading-tight text-[11px] font-medium">{item.label}</span>
              <span
                className={`text-[9px] ${
                  estaActivo ? 'text-red-600 font-medium' : 'text-slate-400'
                } leading-none`}
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
