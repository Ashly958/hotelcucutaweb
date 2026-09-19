import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type { Piso, GuardarPisoDTO } from '../types/piso.types';

// Los 5 pisos estipulados en la documentación técnica oficial (hotel-cucuta.pdf)
let memoriaPisos: Piso[] = [
  {
    id: 1,
    numero_piso: 1,
    nombre: 'Primer Piso - Recepción & Habitaciones 01 al 21',
    descripcion: 'Entrada principal, Front desk 24h, acceso a parqueadero y 21 habitaciones.',
    total_habitaciones: 21,
    areas_servicio: 'Recepción Central, Parqueadero de autos y motos, Sala de espera',
  },
  {
    id: 2,
    numero_piso: 2,
    nombre: 'Segundo Piso - Habitaciones 22 al 29',
    descripcion: 'Piso residencial con 8 habitaciones ejecutivas e individuales con aire acondicionado.',
    total_habitaciones: 8,
    areas_servicio: 'Punto A2 (Área de Aseo y lencería), Punto B2 (Depósito de residuos)',
  },
  {
    id: 3,
    numero_piso: 3,
    nombre: 'Tercer Piso - Habitaciones 30 al 37',
    descripcion: 'Piso residencial con 8 habitaciones matrimoniales y familiares con aire acondicionado.',
    total_habitaciones: 8,
    areas_servicio: 'Punto A3 (Área de Aseo y lencería), Punto B3 (Depósito de residuos)',
  },
  {
    id: 4,
    numero_piso: 4,
    nombre: 'Cuarto Piso - Habitaciones 38 al 45',
    descripcion: 'Piso residencial con 8 habitaciones matrimoniales e individuales climatizadas.',
    total_habitaciones: 8,
    areas_servicio: 'Punto A4 (Área de Aseo y lencería), Punto B4 (Depósito de residuos)',
  },
  {
    id: 5,
    numero_piso: 5,
    nombre: 'Quinto Piso - Centro de Lavandería Operativa',
    descripcion: 'Planta propia de lavado, secado, planchado textil y almacenamiento central de lencería.',
    total_habitaciones: 0,
    areas_servicio: 'Lavadoras de alto flujo, secadoras industriales, zona de planchado por prendas',
  },
];

function mapearPisoDesdeApi(item: any): Piso {
  return {
    id: Number(item.id),
    numero_piso: Number(item.numeroPiso ?? item.numero_piso ?? 0),
    nombre: String(item.nombre ?? ''),
    descripcion: item.descripcion ?? '',
    total_habitaciones: Number(item.totalHabitaciones ?? item.total_habitaciones ?? 0),
    areas_servicio: item.areas_servicio ?? item.areasServicio ?? undefined,
  };
}

export const pisosService = {
  async obtenerTodos(): Promise<Piso[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      return [...memoriaPisos];
    }

    try {
      const res = await api.get<RespuestaApi<any[]>>('/pisos');
      if (Array.isArray(res.data.data)) {
        return res.data.data.map(mapearPisoDesdeApi);
      }
      return [...memoriaPisos];
    } catch {
      return [...memoriaPisos];
    }
  },

  async crear(datos: GuardarPisoDTO): Promise<Piso> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      const nuevo: Piso = {
        id: memoriaPisos.length + 1,
        numero_piso: datos.numero_piso,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        total_habitaciones: 0,
        areas_servicio: 'Área en configuración',
      };
      memoriaPisos.push(nuevo);
      return nuevo;
    }

    const payload = {
      numero_piso: datos.numero_piso,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    };
    const res = await api.post<RespuestaApi<any>>('/pisos', payload);
    return mapearPisoDesdeApi(res.data.data);
  },

  async actualizar(id: number, datos: GuardarPisoDTO): Promise<Piso> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 200));
      memoriaPisos = memoriaPisos.map((p) =>
        p.id === id ? { ...p, ...datos } : p
      );
      const updated = memoriaPisos.find((p) => p.id === id);
      if (!updated) throw new Error('Piso no encontrado');
      return updated;
    }

    const payload = {
      numero_piso: datos.numero_piso,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    };
    const res = await api.put<RespuestaApi<any>>(`/pisos/${id}`, payload);
    return mapearPisoDesdeApi(res.data.data);
  },

  async eliminar(id: number): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      memoriaPisos = memoriaPisos.filter((p) => p.id !== id);
      return;
    }

    await api.delete<RespuestaApi<null>>(`/pisos/${id}`);
  },
};
