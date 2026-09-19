import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  BedDouble,
  ClipboardList,
  CreditCard,
  Package,
  Layers,
  Users,
  Building2,
  BookOpen,
  ExternalLink,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
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

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: RolUsuario[];
}


const NAV_ITEMS: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Habitaciones',
    icon: BedDouble,
    roles: ['ADMIN', 'RECEPCION', 'LAVANDERIA', 'MANTENIMIENTO'],
  },
  {
    to: '/estadias',
    label: 'Estadías & Check-In',
    icon: ClipboardList,
    roles: ['ADMIN', 'RECEPCION'],
  },
  {
    to: '/facturacion',
    label: 'Caja & Facturación',
    icon: CreditCard,
    roles: ['ADMIN', 'RECEPCION'],
  },
  {
    to: '/inventarios',
    label: 'Inventarios',
    icon: Package,
    roles: ['ADMIN', 'RECEPCION', 'LAVANDERIA', 'MANTENIMIENTO'],
  },
  {
    to: '/pisos',
    label: 'Pisos',
    icon: Layers,
    roles: ['ADMIN', 'RECEPCION', 'LAVANDERIA', 'MANTENIMIENTO'],
  },
  {
    to: '/usuarios',
    label: 'Usuarios',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    to: '/reportes',
    label: 'Reportes & Estadísticas',
    icon: BarChart3,
    roles: ['ADMIN', 'RECEPCION'],
  },
  {
    to: '/informacion-hotel',
    label: 'Info Hotel',
    icon: Building2,
    roles: ['ADMIN', 'RECEPCION'],
  },
  {
    to: '/onboarding',
    label: 'Guía Huésped',
    icon: BookOpen,
    roles: ['ADMIN', 'RECEPCION', 'LAVANDERIA', 'MANTENIMIENTO'],
  },
];

export function MainLayout({ children }: MainLayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Filtrar enlaces según el rol del usuario autenticado
  const navItemsPermitidos = NAV_ITEMS.filter((item) =>
    usuario?.rol ? item.roles.includes(usuario.rol) : false
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Encabezado Principal Integrado y Sofisticado */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-soft-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fila Superior: Marca + Usuario */}
          <div className="h-16 flex items-center justify-between border-b border-slate-100">
            {/* Marca / Identidad */}
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center shadow-soft-xs">
                <img src={logoHC} alt="Hotel Cúcuta" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                    HOTEL CÚCUTA
                  </span>
                  <span className="text-[10px] bg-red-50 text-red-700 border border-red-200/80 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    PMS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Gestión Hotelera · 45 Habitaciones</p>
              </div>
            </div>

            {/* Perfil del Usuario Activo + Botón Cerrar Sesión */}
            <div className="flex items-center gap-3">
              {usuario && currentRol && (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-semibold text-slate-800 font-display">
                      {usuario.nombre} {usuario.apellido}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {usuario.email}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border shadow-soft-xs ${currentRol.tagClass}`}
                  >
                    {currentRol.icon}
                    <span className="hidden sm:inline font-semibold">{currentRol.label}</span>
                  </div>
                </div>
              )}

              <div className="h-6 w-px bg-slate-200/80 mx-1 hidden sm:block" />

              <button
                onClick={handleCerrarSesion}
                title="Cerrar sesión segura"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-700 hover:bg-red-50/80 border border-slate-200/70 hover:border-red-200 transition-all shadow-soft-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Fila Inferior: Píldoras de Navegación Fluidas */}
          <div className="py-2 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1.5 min-w-max">
              {navItemsPermitidos.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to ||
                  (item.to === '/dashboard' && location.pathname === '/habitaciones');
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-red-50/90 text-red-700 font-semibold border border-red-200/80 shadow-soft-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-red-700' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="h-4 w-px bg-slate-200/80 mx-1.5" />

              <a
                href="/onboarding"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-700 hover:bg-red-50/80 border border-transparent hover:border-red-200/60 transition-all"
                title="Abrir Ficha de Huésped en nueva ventana"
              >
                <ExternalLink size={13} />
                <span>Ficha Huésped</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido Principal con Fondo Relajado y Aire Natural */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {children}
      </main>
    </div>
  );
}

