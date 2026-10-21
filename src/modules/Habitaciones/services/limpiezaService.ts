import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';

export interface UsuarioColaborador {
  id: number;
  nombre_completo: string;
  email: string;
  rol: string;
}

export interface TareaLimpieza {
  id: number;
  habitacion_id: number;
  responsable_id: number;
  estado: 'en_proceso' | 'finalizada' | 'cancelada' | 'inspeccionada';
  fecha_inicio: string;
  fecha_fin?: string | null;
  observaciones_cierre?: string | null;
  evidencia_foto_url?: string | null;
  cerrado_por_id?: number | null;
  habitacion?: {
    id: number;
    numero: string;
    piso_id?: number;
    estado: string;
  };
  responsable?: UsuarioColaborador;
  cerradoPor?: UsuarioColaborador;
  colaboradores?: UsuarioColaborador[];
}

export interface DashboardLimpiezaResponse {
  metricas: {
    total: number;
    disponibles: number;
    pendientes_limpieza: number;
    en_proceso: number;
    mantenimiento: number;
    ocupadas: number;
  };
  habitaciones: any[];
  tareas_activas: TareaLimpieza[];
  tareas_recientes: TareaLimpieza[];
}

export const limpiezaService = {
  async obtenerDashboard(): Promise<DashboardLimpiezaResponse> {
    const res = await api.get<RespuestaApi<DashboardLimpiezaResponse>>('/habitaciones/limpieza/dashboard');
    return res.data.data;
  },

  async obtenerMisTareas(): Promise<TareaLimpieza[]> {
    const res = await api.get<RespuestaApi<TareaLimpieza[]>>('/habitaciones/limpieza/mis-tareas');
    return res.data.data;
  },

  async iniciarLimpieza(habitacionId: number): Promise<TareaLimpieza> {
    const res = await api.post<RespuestaApi<TareaLimpieza>>('/habitaciones/limpieza/iniciar', {
      habitacion_id: habitacionId,
    });
    return res.data.data;
  },

  async agregarColaborador(tareaId: number, usuarioId: number): Promise<TareaLimpieza> {
    const res = await api.post<RespuestaApi<TareaLimpieza>>(`/habitaciones/limpieza/${tareaId}/colaboradores`, {
      usuario_id: usuarioId,
    });
    return res.data.data;
  },

  async finalizarLimpieza(
    tareaId: number,
    datos: {
      observaciones?: string;
      evidencia_foto_url?: string;
      liberar_habitacion?: boolean;
    }
  ): Promise<TareaLimpieza> {
    const res = await api.post<RespuestaApi<TareaLimpieza>>(`/habitaciones/limpieza/${tareaId}/finalizar`, datos);
    return res.data.data;
  },
};
