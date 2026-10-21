// ─── Tipos del Módulo Onboarding (Guía Pública del Hotel) ─────────────────────

export interface TipoHabitacion {
  nombre: string;
  descripcion: string;
  precio: string;
  camas: string;
  maxPersonas: string;
  amenidades: string[];
  destacado: boolean;
  badge?: string;
  imagenUrl?: string;
}

export interface InfoPiso {
  nivel: number;
  nombre: string;
  habitaciones: string;
  caracteristicas: string[];
  areas: string;
  // NOTA: Las credenciales WiFi (red, clave) son información
  // operativa interna y NO se exponen en la guía pública.
}

export interface PoliticaHotel {
  titulo: string;
  descripcion: string;
  colorClase: 'red' | 'blue' | 'emerald' | 'purple' | 'amber';
  icono: 'smoke' | 'volume' | 'users' | 'car' | 'shield';
}
