import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Usuario, EstadoAutenticacion, RespuestaAutenticacion } from '@/modules/Login/types/auth.types';

const STORAGE_TOKEN_KEY = 'hc_token';
const STORAGE_USER_KEY = 'hc_usuario';

// Restaurar sesión persistida si existe
const tokenGuardado = localStorage.getItem(STORAGE_TOKEN_KEY);
const usuarioGuardado = localStorage.getItem(STORAGE_USER_KEY);

let initialUsuario: Usuario | null = null;
if (usuarioGuardado) {
  try {
    initialUsuario = JSON.parse(usuarioGuardado) as Usuario;
  } catch {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
}

const initialState: EstadoAutenticacion = {
  token: tokenGuardado,
  usuario: initialUsuario,
  autenticado: Boolean(tokenGuardado && initialUsuario),
  cargando: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    iniciarCarga: (state) => {
      state.cargando = true;
      state.error = null;
    },
    iniciarSesionExitoso: (state, action: PayloadAction<RespuestaAutenticacion>) => {
      const { token, usuario } = action.payload;
      state.cargando = false;
      state.autenticado = true;
      state.token = token;
      state.usuario = usuario;
      state.error = null;

      // Persistencia segura en localStorage
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
    },
    iniciarSesionFallido: (state, action: PayloadAction<string>) => {
      state.cargando = false;
      state.autenticado = false;
      state.error = action.payload;
    },
    cerrarSesion: (state) => {
      state.token = null;
      state.usuario = null;
      state.autenticado = false;
      state.cargando = false;
      state.error = null;

      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    },
    limpiarErrorAuth: (state) => {
      state.error = null;
    },
  },
});

export const {
  iniciarCarga,
  iniciarSesionExitoso,
  iniciarSesionFallido,
  cerrarSesion,
  limpiarErrorAuth,
} = authSlice.actions;

export default authSlice.reducer;
