export type TipoVehiculoParqueadero = 'moto' | 'carro';
export type EstadoVehiculoParqueadero = 'dentro' | 'retirado';

export interface RegistroParqueadero {
  id: number;
  ficho: string;
  placa: string;
  tipo_vehiculo: TipoVehiculoParqueadero;
  tipo_vehiculo_etiqueta: string;
  tarifa_hora_aplicada: number;
  hora_entrada: string;
  hora_salida: string | null;
  minutos_transcurridos: number;
  tiempo_formateado: string;
  valor_sin_redondear: number;
  valor_estimado_o_liquidado: number;
  estado: EstadoVehiculoParqueadero;
  estado_etiqueta: string;
  huesped_id: number | null;
  huesped_nombre: string | null;
  huesped_documento: string | null;
  estadia_id: number | null;
  habitacion_numero: string | null;
  observaciones: string | null;
}

export interface ParqueaderoDashboardResponse {
  tarifas: {
    moto: number;
    carro: number;
  };
  metricas: {
    total_dentro: number;
    motos_dentro: number;
    carros_dentro: number;
    retirados_hoy: number;
    recaudo_hoy: number;
  };
  vehiculos_dentro: RegistroParqueadero[];
  historial: RegistroParqueadero[];
}

export interface RegistrarIngresoParqueaderoDTO {
  placa: string;
  tipo_vehiculo: TipoVehiculoParqueadero;
  huesped_id?: number;
  estadia_id?: number;
  observaciones?: string;
}

export interface FiltrosParqueadero {
  estado?: 'todos' | EstadoVehiculoParqueadero;
  tipo_vehiculo?: 'todos' | TipoVehiculoParqueadero;
  busqueda?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
