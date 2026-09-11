// Tipado genérico estandarizado para respuestas de la API Laravel de Hotel Cúcuta
export interface RespuestaApi<T> {
  success: boolean;
  data: T;
  message: string;
  code?: number;
  errors?: Record<string, string[]>;
}

export interface ErrorApi {
  message: string;
  statusCode?: number;
  erroresValidacion?: Record<string, string[]>;
}
