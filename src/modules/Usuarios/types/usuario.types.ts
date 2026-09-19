export type RolSistema = 'ADMIN' | 'RECEPCION' | 'LAVANDERIA' | 'MANTENIMIENTO';

export interface UsuarioSistema {
  id: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: RolSistema | string;
  activo: boolean;
  created_at?: string;
}

export interface GuardarUsuarioDTO {
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: string;
  password?: string;
}

export interface CambiarClaveDTO {
  password: string;
}
