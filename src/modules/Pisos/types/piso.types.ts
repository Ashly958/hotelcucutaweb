export interface Piso {
  id: number;
  numero_piso: number;
  nombre: string;
  descripcion?: string;
  total_habitaciones?: number;
  areas_servicio?: string;
}

export interface GuardarPisoDTO {
  numero_piso: number;
  nombre: string;
  descripcion?: string;
}
