// Roles definidos en la especificación del Hotel Cúcuta (RF-023)
export type RolUsuario = 'ADMIN' | 'RECEPCION' | 'LAVANDERIA' | 'MANTENIMIENTO';

export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';

export interface PermisoUsuario {
  id: string;
  codigo: string;
  descripcion: string;
  modulo: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  rolNombre: string;
  estado: EstadoUsuario;
  turno?: 'Mañana' | 'Tarde' | 'Noche' | 'Administrativo';
  avatarUrl?: string;
  hotelId: string;
  hotelNombre: string;
  ultimoAcceso?: string;
  permisos?: string[];
}

export interface CredencialesDTO {
  email: string;
  password: string;
  recordarSesion?: boolean;
}

export interface RespuestaAutenticacion {
  usuario: Usuario;
  token: string;
  expiraEn: string; // ISO String o duración en segundos
  tipoToken: 'Bearer';
}

export interface EstadoAutenticacion {
  token: string | null;
  usuario: Usuario | null;
  autenticado: boolean;
  cargando: boolean;
  error: string | null;
}
