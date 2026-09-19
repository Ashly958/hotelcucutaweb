import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Estadia,
  RegistrarCheckInDTO,
  RespuestaCheckInDTO,
} from '../types/estadia.types';

// Mock data en memoria para desarrollo o fallback
let memoriaEstadias: Estadia[] = [
  {
    id: 1,
    codigo_estadia: 'EST-2026-001',
    habitacion_id: 5,
    habitacion_numero: '05',
    huesped_id: 1,
    huesped: {
      nombres: 'Pedro',
      apellidos: 'Rangel',
      tipo_documento: 'CC',
      numero_documento: '13456789',
      telefono: '+57 312 4567890',
      ciudad_procedencia: 'Ocaña',
      direccion: 'Calle 5 # 4-20',
      profesion: 'Comerciante',
    },
    fecha_checkin: '2026-09-10 14:30:00',
    fecha_prevista_checkout: '2026-09-12 13:00:00',
    dias_estadia: 2,
    valor_habitacion: 45000,
    iva: 0,
    total: 90000,
    abonos_totales: 90000,
    saldo_pendiente: 0,
    estado: 'activa',
    observaciones: 'Huésped habitual, habitación con ventilador.',
    acompanantes: [],
  },
  {
    id: 2,
    codigo_estadia: 'EST-2026-002',
    habitacion_id: 8,
    habitacion_numero: '08',
    huesped_id: 2,
    huesped: {
      nombres: 'María Fernanda',
      apellidos: 'Ruiz',
      tipo_documento: 'CC',
      numero_documento: '60345123',
      telefono: '+57 310 9876543',
      ciudad_procedencia: 'Bucaramanga',
      direccion: 'Carrera 27 # 36-12',
      profesion: 'Docente',
    },
    fecha_checkin: '2026-09-09 15:00:00',
    fecha_prevista_checkout: '2026-09-11 13:00:00',
    dias_estadia: 2,
    valor_habitacion: 70000,
    iva: 0,
    total: 140000,
    abonos_totales: 105000,
    saldo_pendiente: 35000,
    estado: 'activa',
    observaciones: 'Habitación matrimonial con aire acondicionado.',
    acompanantes: [
      {
        nombres: 'Carlos Ruiz',
        tipo_documento: 'CC',
        numero_documento: '60345124',
        parentesco: 'Esposo',
      },
    ],
  },
  {
    id: 3,
    codigo_estadia: 'EST-2026-003',
    habitacion_id: 9,
    habitacion_numero: '09',
    huesped_id: 3,
    huesped: {
      nombres: 'Familia Gómez',
      apellidos: 'Colmenares',
      tipo_documento: 'CC',
      numero_documento: '88234567',
      telefono: '+57 315 2345678',
      ciudad_procedencia: 'Pamplona',
      direccion: 'Calle Real # 8-15',
      profesion: 'Empresarios',
    },
    fecha_checkin: '2026-09-08 11:20:00',
    fecha_prevista_checkout: '2026-09-12 13:00:00',
    dias_estadia: 4,
    valor_habitacion: 120000,
    iva: 0,
    total: 480000,
    abonos_totales: 360000,
    saldo_pendiente: 120000,
    estado: 'activa',
    observaciones: 'Habitación familiar para 4 personas con A/C.',
    acompanantes: [
      {
        nombres: 'Gloria Colmenares',
        tipo_documento: 'CC',
        numero_documento: '37890123',
        parentesco: 'Cónyuge',
      },
      {
        nombres: 'Santiago Gómez',
        tipo_documento: 'TI',
        numero_documento: '1090234567',
        parentesco: 'Hijo',
      },
    ],
  },
  {
    id: 4,
    codigo_estadia: 'EST-2026-004',
    habitacion_id: 4,
    habitacion_numero: '04',
    huesped_id: 4,
    huesped: {
      nombres: 'Carlos',
      apellidos: 'Durán Mendoza',
      tipo_documento: 'CC',
      numero_documento: '1090483921',
      telefono: '+57 314 5556677',
      ciudad_procedencia: 'Bucaramanga',
      direccion: 'Av 0 # 12-40',
      profesion: 'Abogado',
    },
    fecha_checkin: '2026-09-06 13:00:00',
    fecha_checkout_real: '2026-09-08 12:45:00',
    fecha_prevista_checkout: '2026-09-08 13:00:00',
    dias_estadia: 2,
    valor_habitacion: 50000,
    iva: 0,
    total: 100000,
    abonos_totales: 100000,
    saldo_pendiente: 0,
    estado: 'finalizada',
    observaciones: 'Check-out completado sin novedades.',
    acompanantes: [],
  },
];

export const estadiasService = {
  async obtenerTodas(): Promise<Estadia[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...memoriaEstadias];
    }

    try {
      const response = await api.get<RespuestaApi<Estadia[]>>('/estadias');
      return response.data.data;
    } catch {
      return [...memoriaEstadias];
    }
  },

  async obtenerPorId(id: number): Promise<Estadia> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const estadia = memoriaEstadias.find((e) => e.id === id);
      if (!estadia) throw new Error('Estadía no encontrada');
      return estadia;
    }

    try {
      const response = await api.get<RespuestaApi<Estadia>>(`/estadias/${id}`);
      return response.data.data;
    } catch {
      const estadia = memoriaEstadias.find((e) => e.id === id);
      if (!estadia) throw new Error('Estadía no encontrada');
      return estadia;
    }
  },

  async registrarCheckIn(datos: RegistrarCheckInDTO): Promise<RespuestaCheckInDTO> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const nuevoId = memoriaEstadias.length + 1;
      const codigo = `EST-2026-${String(nuevoId).padStart(3, '0')}`;
      const total = datos.valor_habitacion * datos.dias_estadia;

      const nuevaEstadia: Estadia = {
        id: nuevoId,
        codigo_estadia: codigo,
        habitacion_id: datos.habitacion_id,
        habitacion_numero: String(datos.habitacion_id).padStart(2, '0'),
        huesped_id: nuevoId,
        huesped: {
          nombres: datos.nombres,
          apellidos: datos.apellidos,
          tipo_documento: datos.tipo_documento,
          numero_documento: datos.numero_documento,
          telefono: datos.telefono,
          ciudad_procedencia: datos.ciudad_procedencia,
          direccion: datos.direccion,
          profesion: datos.profesion,
        },
        fecha_checkin: datos.fecha_checkin,
        fecha_prevista_checkout: datos.fecha_prevista_checkout,
        dias_estadia: datos.dias_estadia,
        valor_habitacion: datos.valor_habitacion,
        iva: datos.iva || 0,
        total,
        abonos_totales: 0,
        saldo_pendiente: total,
        estado: 'activa',
        observaciones: datos.observaciones,
        acompanantes: datos.acompanantes || [],
      };

      memoriaEstadias = [nuevaEstadia, ...memoriaEstadias];

      return {
        codigo_estadia: codigo,
        estadia_id: nuevoId,
        huesped_id: nuevoId,
      };
    }

    const response = await api.post<RespuestaApi<RespuestaCheckInDTO>>(
      '/check-in/manual',
      datos
    );
    return response.data.data;
  },

  async realizarCheckOut(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      memoriaEstadias = memoriaEstadias.map((e) =>
        e.id === id
          ? {
              ...e,
              estado: 'finalizada',
              fecha_checkout_real: new Date().toISOString().replace('T', ' ').substring(0, 19),
              saldo_pendiente: 0,
            }
          : e
      );
      return;
    }

    await api.post<RespuestaApi<null>>(`/estadias/${id}/check-out`);
  },
};
