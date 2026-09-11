import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectEsAutenticado } from '@/store/selectors/authSelectors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guardián de rutas autenticadas. Redirige a /login si no hay token o sesión activa,
 * preservando la ruta previa en el estado para retornar al autenticar.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const autenticado = useAppSelector(selectEsAutenticado);
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
