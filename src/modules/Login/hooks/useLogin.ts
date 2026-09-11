import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  iniciarCarga,
  iniciarSesionExitoso,
  iniciarSesionFallido,
  limpiarErrorAuth,
} from '@/store/slices/authSlice';
import { selectCargandoAuth, selectErrorAuth } from '@/store/selectors/authSelectors';
import { authService } from '../services/authService';
import type { CredencialesDTO } from '../types/auth.types';

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cargando = useAppSelector(selectCargandoAuth);
  const errorRedux = useAppSelector(selectErrorAuth);

  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const error = errorLocal || errorRedux;

  const iniciarSesion = async (credenciales: CredencialesDTO, redirectPath: string = '/dashboard') => {
    try {
      setErrorLocal(null);
      dispatch(limpiarErrorAuth());
      dispatch(iniciarCarga());

      // Validaciones en cliente
      if (!credenciales.email.trim()) {
        throw new Error('Por favor ingrese su correo electrónico institucional.');
      }
      if (!credenciales.password) {
        throw new Error('Por favor ingrese su contraseña de acceso.');
      }

      const datosSesion = await authService.iniciarSesion(credenciales);

      // Guardar en Redux
      dispatch(iniciarSesionExitoso(datosSesion));

      // Navegar a la ruta protegida
      navigate(redirectPath, { replace: true });
      return true;
    } catch (err: unknown) {
      let mensajeError = 'Ocurrió un error inesperado al iniciar sesión. Inténtelo nuevamente.';

      if (err instanceof Error) {
        mensajeError = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        mensajeError = String((err as { message: unknown }).message);
      }

      setErrorLocal(mensajeError);
      dispatch(iniciarSesionFallido(mensajeError));
      return false;
    }
  };

  const limpiarError = () => {
    setErrorLocal(null);
    dispatch(limpiarErrorAuth());
  };

  return {
    cargando,
    error,
    iniciarSesion,
    limpiarError,
  };
}
