import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  IconoRecepcion,
  IconoAdmin,
  IconoLavanderia,
  IconoMantenimiento,
} from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cerrarSesion } from '@/store/slices/authSlice';
import { selectUsuario } from '@/store/selectors/authSelectors';
import { authService } from '@/modules/Login/services/authService';
import type { RolUsuario } from '@/modules/Login/types/auth.types';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const usuario = useAppSelector(selectUsuario);

  const handleCerrarSesion = async () => {
    await authService.cerrarSesion();
    dispatch(cerrarSesion());
    navigate('/login', { replace: true });
  };

  const rolInfo: Record<RolUsuario, { label: string; tagClass: string; icon: React.ReactNode }> = {
    RECEPCION: {
      label: 'Recepción & Front Desk',
      tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <IconoRecepcion size={15} className="text-emerald-600" />,
    },
    ADMIN: {
      label: 'Gerencia General',
      tagClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <IconoAdmin size={15} className="text-amber-600" />,
    },
    LAVANDERIA: {
      label: 'Lavandería Piso 5',
      tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <IconoLavanderia size={15} className="text-blue-600" />,
    },
    MANTENIMIENTO: {
      label: 'Mantenimiento & Técnico',
      tagClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <IconoMantenimiento size={15} className="text-purple-600" />,
    },
  };

  const currentRol = usuario?.rol ? rolInfo[usuario.rol] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Barra de Navegación Limpia y Profesional */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Marca / Identidad */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto flex items-center justify-center">
              <img src={logoHC} alt="Hotel Cúcuta" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-tight text-slate-900">
                  HOTEL CÚCUTA
                </span>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-medium">
                  PMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Operación Central · 45 Habitaciones</p>
            </div>
          </div>

          {/* Perfil del Usuario Activo + Botón Cerrar Sesión */}
          <div className="flex items-center gap-3 sm:gap-4">
            {usuario && currentRol && (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-800">
                    {usuario.nombre} {usuario.apellido}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {usuario.email}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${currentRol.tagClass}`}
                >
                  {currentRol.icon}
                  <span>{currentRol.label}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleCerrarSesion}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
