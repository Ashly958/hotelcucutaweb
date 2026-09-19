import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Habitacion,
  CheckInDTO,
  EstadoHabitacion,
  CrearHabitacionDTO,
  ActualizarHabitacionDTO,
} from '../types/habitacion.types';


/**
 * Base de datos Mock de las 45 habitaciones del Hotel Cúcuta (Pisos 1 a 4)
 * Generada con estricto apego al documento de requerimientos 'hotel-cucuta.pdf' (Pág. 7-8).
 */
const HABITACIONES_INICIALES: Habitacion[] = [
  // --- PISO 1 (21 Habitaciones: 01 a 21) ---
  { id: '01', numero: '01', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 50000, estado: 'disponible' },
  { id: '02', numero: '02', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 50000, estado: 'disponible' },
  { id: '03', numero: '03', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 50000, estado: 'limpieza' },
  { id: '04', numero: '04', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 50000, estado: 'disponible' },
  {
    id: '05', numero: '05', piso: 1, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 45000, estado: 'ocupada',
    huesped: { nombre: 'Pedro Rangel', documento: 'CC 13.456.789', nacionalidad: 'Colombiana', telefono: '+57 312 4567890', procedencia: 'Ocaña', destino: 'Cúcuta', pax: 1, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 45000 }
  },
  { id: '06', numero: '06', piso: 1, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 45000, estado: 'disponible' },
  { id: '07', numero: '07', piso: 1, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 45000, estado: 'disponible' },
  {
    id: '08', numero: '08', piso: 1, tipo: 'Matrimonial', camas: '1 cama matrimonial', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 70000, estado: 'ocupada',
    huesped: { nombre: 'María Fernanda Ruiz', documento: 'CC 60.345.123', nacionalidad: 'Colombiana', telefono: '+57 310 9876543', procedencia: 'Bucaramanga', destino: 'San Cristóbal', pax: 2, noches: 2, fechaIngreso: '09/09/2026', saldoPendiente: 35000, abonoInicial: 105000 }
  },
  {
    id: '09', numero: '09', piso: 1, tipo: 'Familiar', camas: '1 matrimonial + camarote 3p', capacidadMax: 5, tieneAire: true, tieneVentilador: false, precioNoche: 120000, estado: 'ocupada',
    huesped: { nombre: 'Familia Gómez Colmenares', documento: 'CC 88.234.567', nacionalidad: 'Colombiana', telefono: '+57 315 2345678', procedencia: 'Pamplona', destino: 'Cúcuta', pax: 4, noches: 3, fechaIngreso: '08/09/2026', saldoPendiente: 120000, abonoInicial: 240000 }
  },
  { id: '10', numero: '10', piso: 1, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: false, tieneVentilador: true, precioNoche: 60000, estado: 'disponible' },
  {
    id: '11', numero: '11', piso: 1, tipo: 'Familiar', camas: '1 matrimonial + camarote 3p', capacidadMax: 5, tieneAire: true, tieneVentilador: false, precioNoche: 120000, estado: 'ocupada',
    huesped: { nombre: 'Jorge Eliécer Mora', documento: 'CC 13.890.123', nacionalidad: 'Colombiana', telefono: '+57 320 8765432', procedencia: 'Medellín', destino: 'San Antonio', pax: 5, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 120000 }
  },
  { id: '12', numero: '12', piso: 1, tipo: 'Familiar', camas: '1 matrimonial + camarote 3p', capacidadMax: 5, tieneAire: true, tieneVentilador: false, precioNoche: 120000, estado: 'disponible' },
  { id: '13', numero: '13', piso: 1, tipo: 'Familiar', camas: '1 matrimonial + camarote 3p', capacidadMax: 5, tieneAire: true, tieneVentilador: false, precioNoche: 120000, estado: 'limpieza' },
  { id: '14', numero: '14', piso: 1, tipo: 'Matrimonial', camas: '1 cama matrimonial', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 70000, estado: 'disponible' },
  {
    id: '15', numero: '15', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'ocupada',
    huesped: { nombre: 'Andrés Camilo Soto', documento: 'CC 1090.234.123', nacionalidad: 'Colombiana', telefono: '+57 301 2345678', procedencia: 'Bogotá', destino: 'Cúcuta', pax: 1, noches: 2, fechaIngreso: '09/09/2026', saldoPendiente: 0, abonoInicial: 130000 }
  },
  { id: '16', numero: '16', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '17', numero: '17', piso: 1, tipo: 'Matrimonial', camas: '1 cama matrimonial', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 70000, estado: 'disponible' },
  { id: '18', numero: '18', piso: 1, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'mantenimiento', observaciones: 'Revisión técnica de compresor A/C' },
  { id: '19', numero: '19', piso: 1, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: false, tieneVentilador: true, precioNoche: 60000, estado: 'disponible' },
  { id: '20', numero: '20', piso: 1, tipo: 'Estándar', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 50000, estado: 'disponible' },
  { id: '21', numero: '21', piso: 1, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: false, tieneVentilador: true, precioNoche: 45000, estado: 'disponible' },

  // --- PISO 2 (8 Habitaciones: 22 a 29) ---
  {
    id: '22', numero: '22', piso: 2, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'ocupada',
    huesped: { nombre: 'Lucía Villamizar', documento: 'CC 37.890.123', nacionalidad: 'Colombiana', telefono: '+57 311 2345678', procedencia: 'Pamplona', destino: 'Cúcuta', pax: 1, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 65000 }
  },
  { id: '23', numero: '23', piso: 2, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '24', numero: '24', piso: 2, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  {
    id: '25', numero: '25', piso: 2, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'ocupada',
    huesped: { nombre: 'Roberto Pineda', documento: 'PA AP987654', nacionalidad: 'Venezolana', telefono: '+58 414 1234567', procedencia: 'Caracas', destino: 'Bogotá', pax: 1, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 65000 }
  },
  { id: '26', numero: '26', piso: 2, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
  { id: '27', numero: '27', piso: 2, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '28', numero: '28', piso: 2, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'limpieza' },
  {
    id: '29', numero: '29', piso: 2, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'ocupada',
    huesped: { nombre: 'Sandra Milena Castro', documento: 'CC 1092.345.678', nacionalidad: 'Colombiana', telefono: '+57 318 7654321', procedencia: 'Arauca', destino: 'Cúcuta', pax: 2, noches: 2, fechaIngreso: '09/09/2026', saldoPendiente: 0, abonoInicial: 150000 }
  },

  // --- PISO 3 (8 Habitaciones: 30 a 37) ---
  { id: '30', numero: '30', piso: 3, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '31', numero: '31', piso: 3, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  {
    id: '32', numero: '32', piso: 3, tipo: 'Matrimonial', camas: '1 cama matrimonial', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 70000, estado: 'ocupada',
    huesped: { nombre: 'Gustavo Adolfo Buitrago', documento: 'CC 13.567.890', nacionalidad: 'Colombiana', telefono: '+57 313 4567890', procedencia: 'Cali', destino: 'Cúcuta', pax: 2, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 70000 }
  },
  {
    id: '33', numero: '33', piso: 3, tipo: 'Familiar', camas: '1 matrimonial + 1 individual', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 90000, estado: 'ocupada',
    huesped: { nombre: 'Nelson Javier Parra', documento: 'CC 88.123.456', nacionalidad: 'Colombiana', telefono: '+57 316 7890123', procedencia: 'Duitama', destino: 'Cúcuta', pax: 3, noches: 2, fechaIngreso: '09/09/2026', saldoPendiente: 24000, abonoInicial: 180000 }
  },
  { id: '34', numero: '34', piso: 3, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
  { id: '35', numero: '35', piso: 3, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
  { id: '36', numero: '36', piso: 3, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'mantenimiento', observaciones: 'Cambio de luminarias' },
  {
    id: '37', numero: '37', piso: 3, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'ocupada',
    huesped: { nombre: 'Claudia Marcela Rincón', documento: 'CC 63.456.789', nacionalidad: 'Colombiana', telefono: '+57 317 8901234', procedencia: 'Bucaramanga', destino: 'San Antonio', pax: 2, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 75000 }
  },

  // --- PISO 4 (8 Habitaciones: 38 a 45) ---
  { id: '38', numero: '38', piso: 4, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '39', numero: '39', piso: 4, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  {
    id: '40', numero: '40', piso: 4, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'ocupada',
    huesped: { nombre: 'Wilson Ramírez', documento: 'CC 13.987.654', nacionalidad: 'Colombiana', telefono: '+57 312 9012345', procedencia: 'Barrancabermeja', destino: 'Cúcuta', pax: 1, noches: 3, fechaIngreso: '08/09/2026', saldoPendiente: 0, abonoInicial: 195000 }
  },
  { id: '41', numero: '41', piso: 4, tipo: 'Individual', camas: '1 cama', capacidadMax: 2, tieneAire: true, tieneVentilador: false, precioNoche: 65000, estado: 'disponible' },
  { id: '42', numero: '42', piso: 4, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
  {
    id: '43', numero: '43', piso: 4, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'ocupada',
    huesped: { nombre: 'Edgar Fernando Cárdenas', documento: 'CC 88.765.432', nacionalidad: 'Colombiana', telefono: '+57 321 0123456', procedencia: 'Cúcuta', destino: 'San Cristóbal', pax: 2, noches: 1, fechaIngreso: '10/09/2026', saldoPendiente: 0, abonoInicial: 75000 }
  },
  { id: '44', numero: '44', piso: 4, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
  { id: '45', numero: '45', piso: 4, tipo: 'Estándar', camas: '2 camas', capacidadMax: 3, tieneAire: true, tieneVentilador: false, precioNoche: 75000, estado: 'disponible' },
];

function deducirTipoHabitacion(item: any): import('../types/habitacion.types').TipoHabitacion {
  if (item.tipo) return item.tipo;
  const detalle = String(item.detalleCamas || item.detalle_camas || '').toLowerCase();
  const cap = Number(item.capacidadMaxima || item.capacidad_maxima || 2);
  if (detalle.includes('matrimonial')) return 'Matrimonial';
  if (detalle.includes('familiar') || cap >= 4) return 'Familiar';
  if (detalle.includes('sencilla') || cap === 1) return 'Individual';
  return 'Estándar';
}

function mapearHabitacionDesdeApi(item: any): Habitacion {
  return {
    id: String(item.id),
    numero: String(item.numero),
    piso: Number(item.pisoId ?? item.piso_id ?? item.piso ?? 1),
    tipo: deducirTipoHabitacion(item),
    camas: String(item.detalleCamas ?? item.detalle_camas ?? item.camas ?? '1 Cama Doble'),
    capacidadMax: Number(item.capacidadMaxima ?? item.capacidad_maxima ?? item.capacidadMax ?? 2),
    tieneAire: Boolean(item.tieneAire ?? item.tiene_aire),
    tieneVentilador: Boolean(item.tieneVentilador ?? item.tiene_ventilador),
    precioNoche: Number(item.precioNocheBase ?? item.precio_noche_base ?? item.precioNoche ?? 50000),
    estado: (item.estado ?? 'disponible') as EstadoHabitacion,
    observaciones: item.observaciones ?? undefined,
    huesped: item.huesped ?? null,
    estadiaId: item.estadiaId ?? item.estadia_id ?? item.huesped?.estadiaId ?? undefined,
  };
}

let memoriaHabitaciones = [...HABITACIONES_INICIALES];

export const habitacionesService = {
  async obtenerTodas(): Promise<Habitacion[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...memoriaHabitaciones];
    }

    try {
      const respuesta = await api.get<RespuestaApi<any[]>>('/habitaciones');
      if (Array.isArray(respuesta.data.data) && respuesta.data.data.length > 0) {
        return respuesta.data.data.map(mapearHabitacionDesdeApi);
      }
      return [...memoriaHabitaciones];
    } catch {
      return [...memoriaHabitaciones];
    }
  },

  async obtenerPorId(id: string): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const hab = memoriaHabitaciones.find((h) => h.id === id || h.numero === id);
      if (!hab) throw new Error('Habitación no encontrada');
      return hab;
    }

    try {
      const respuesta = await api.get<RespuestaApi<any>>(`/habitaciones/${id}`);
      return mapearHabitacionDesdeApi(respuesta.data.data);
    } catch {
      const hab = memoriaHabitaciones.find((h) => h.id === id || h.numero === id);
      if (!hab) throw new Error('Habitación no encontrada');
      return hab;
    }
  },

  async crear(datos: CrearHabitacionDTO): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const nuevaHab: Habitacion = {
        id: String(Date.now()),
        numero: datos.numero,
        piso: datos.piso,
        tipo: datos.tipo,
        camas: datos.camas,
        capacidadMax: datos.capacidadMax,
        tieneAire: datos.tieneAire,
        tieneVentilador: datos.tieneVentilador,
        precioNoche: datos.precioNoche,
        estado: 'disponible',
        observaciones: datos.observaciones,
      };
      memoriaHabitaciones = [...memoriaHabitaciones, nuevaHab];
      return nuevaHab;
    }

    const payload = {
      piso_id: datos.piso,
      numero: datos.numero,
      capacidad_maxima: datos.capacidadMax,
      tiene_aire: datos.tieneAire,
      tiene_ventilador: datos.tieneVentilador,
      detalle_camas: datos.camas,
      precio_noche_base: datos.precioNoche,
      estado: 'disponible',
      observaciones: datos.observaciones || null,
    };

    const respuesta = await api.post<RespuestaApi<any>>('/habitaciones', payload);
    return mapearHabitacionDesdeApi(respuesta.data.data);
  },

  async actualizar(id: string, datos: ActualizarHabitacionDTO): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      memoriaHabitaciones = memoriaHabitaciones.map((h) =>
        h.id === id ? { ...h, ...datos } : h
      );
      const hab = memoriaHabitaciones.find((h) => h.id === id);
      if (!hab) throw new Error('Habitación no encontrada');
      return hab;
    }

    const payload: Record<string, any> = {};
    if (datos.piso !== undefined) payload.piso_id = datos.piso;
    if (datos.numero !== undefined) payload.numero = datos.numero;
    if (datos.capacidadMax !== undefined) payload.capacidad_maxima = datos.capacidadMax;
    if (datos.tieneAire !== undefined) payload.tiene_aire = datos.tieneAire;
    if (datos.tieneVentilador !== undefined) payload.tiene_ventilador = datos.tieneVentilador;
    if (datos.camas !== undefined) payload.detalle_camas = datos.camas;
    if (datos.precioNoche !== undefined) payload.precio_noche_base = datos.precioNoche;
    if (datos.estado !== undefined) payload.estado = datos.estado;
    if (datos.observaciones !== undefined) payload.observaciones = datos.observaciones;

    const respuesta = await api.put<RespuestaApi<any>>(`/habitaciones/${id}`, payload);
    return mapearHabitacionDesdeApi(respuesta.data.data);
  },

  async eliminar(id: string): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      memoriaHabitaciones = memoriaHabitaciones.filter((h) => h.id !== id);
      return;
    }

    await api.delete<RespuestaApi<null>>(`/habitaciones/${id}`);
  },

  async cambiarEstado(habitacionId: string, nuevoEstado: EstadoHabitacion): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      memoriaHabitaciones = memoriaHabitaciones.map((h) => {
        if (h.id === habitacionId || h.numero === habitacionId) {
          return {
            ...h,
            estado: nuevoEstado,
            huesped: nuevoEstado === 'disponible' || nuevoEstado === 'limpieza' ? null : h.huesped,
          };
        }
        return h;
      });

      const actualizada = memoriaHabitaciones.find((h) => h.id === habitacionId || h.numero === habitacionId);
      if (!actualizada) throw new Error('Habitación no encontrada');
      return actualizada;
    }

    const respuesta = await api.patch<RespuestaApi<any>>(
      `/habitaciones/${habitacionId}/estado`,
      { estado: nuevoEstado }
    );
    return mapearHabitacionDesdeApi(respuesta.data.data);
  },

  async registrarCheckIn(datos: CheckInDTO): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const hab = memoriaHabitaciones.find((h) => h.id === datos.habitacionId || h.numero === datos.habitacionId);
      if (!hab) throw new Error('Habitación no encontrada');

      const totalCosto = hab.precioNoche * datos.noches;
      const saldo = Math.max(0, totalCosto - datos.abonoEfectivo);

      const habitacionActualizada: Habitacion = {
        ...hab,
        estado: 'ocupada',
        huesped: {
          nombre: datos.nombre,
          documento: `${datos.documentoTipo} ${datos.documentoNumero}`,
          nacionalidad: datos.nacionalidad,
          telefono: datos.telefono,
          procedencia: datos.procedencia,
          destino: datos.destino,
          pax: datos.pax,
          noches: datos.noches,
          fechaIngreso: new Date().toISOString().replace('T', ' ').substring(0, 19),
          saldoPendiente: saldo,
          abonoInicial: datos.abonoEfectivo,
        },
      };

      memoriaHabitaciones = memoriaHabitaciones.map((h) =>
        h.id === datos.habitacionId || h.numero === datos.habitacionId ? habitacionActualizada : h
      );

      return habitacionActualizada;
    }

    // Separar nombre
    const partes = datos.nombre.trim().split(' ');
    const nombres = partes.length > 1 ? partes.slice(0, -1).join(' ') : datos.nombre.trim();
    const apellidos = partes.length > 1 ? partes[partes.length - 1] : '.';

    const habitacionIdNum = parseInt(datos.habitacionId, 10);
    const habActual = await this.obtenerPorId(datos.habitacionId);
    const valorHabitacion = habActual ? habActual.precioNoche : 70000;

    const payload = {
      habitacion_id: habitacionIdNum,
      tipo_documento: datos.documentoTipo || 'CC',
      numero_documento: datos.documentoNumero,
      nombres,
      apellidos,
      telefono: datos.telefono,
      ciudad_procedencia: datos.procedencia,
      direccion: 'No registrada',
      profesion: 'No registrada',
      fecha_checkin: new Date().toISOString().substring(0, 10) + ' 14:00:00',
      fecha_prevista_checkout: new Date(Date.now() + datos.noches * 86400000).toISOString().substring(0, 10) + ' 13:00:00',
      dias_estadia: datos.noches,
      valor_habitacion: valorHabitacion,
      abono_inicial: datos.abonoEfectivo,
      observaciones: `Registro Check-in rápido. Destino: ${datos.destino || 'Cúcuta'}. Pax: ${datos.pax}`,
      acompanantes: datos.acompanantes || [],
    };

    await api.post<RespuestaApi<any>>('/check-in/manual', payload);
    return this.obtenerPorId(datos.habitacionId);
  },

  async registrarCheckOut(habitacionId: string): Promise<Habitacion> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return this.cambiarEstado(habitacionId, 'limpieza');
    }

    const hab = await this.obtenerPorId(habitacionId);
    const targetId = hab.estadiaId ? hab.estadiaId : parseInt(habitacionId, 10);

    await api.post<RespuestaApi<any>>(`/estadias/${targetId}/check-out`);
    return this.obtenerPorId(habitacionId);
  },
};

