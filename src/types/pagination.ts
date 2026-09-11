// Tipado genérico para respuestas paginadas del backend
export interface RespuestaPaginada<T> {
  success: boolean;
  data: {
    items: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface PaginacionParams {
  page?: number;
  per_page?: number;
}
