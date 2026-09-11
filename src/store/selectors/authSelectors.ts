import type { RootState } from '../index';

export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUsuario = (state: RootState) => state.auth.usuario;
export const selectEsAutenticado = (state: RootState) => state.auth.autenticado;
export const selectCargandoAuth = (state: RootState) => state.auth.cargando;
export const selectErrorAuth = (state: RootState) => state.auth.error;
export const selectRolUsuario = (state: RootState) => state.auth.usuario?.rol ?? null;
