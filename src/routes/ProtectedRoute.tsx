import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectEsAutenticado, selectUsuario } from '@/store/selectors/authSelectors';
import type { RolUsuario } from '@/modules/Login/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  rolesPermitidos?: RolUsuario[];
}

/**
 * Guardián de rutas autenticadas. Redirige a /login si no hay token o sesión activa.
 * Valida también roles permitidos cuando se definen restricciones por perfil.
 */
export function ProtectedRoute({ children, rolesPermitidos }: ProtectedRouteProps) {
  const autenticado = useAppSelector(selectEsAutenticado);
  const usuario = useAppSelector(selectUsuario);
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rolesPermitidos && usuario?.rol && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

