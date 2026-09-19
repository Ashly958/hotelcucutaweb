export interface ServicioGuia {
  nombre: string;
  ubicacion: string;
  horario: string;
  modalidad: string;
  icono: string;
}

export interface NormaConvivencia {
  titulo: string;
  descripcion: string;
  tipo: 'familia' | 'silencio' | 'humo' | 'seguridad';
}
