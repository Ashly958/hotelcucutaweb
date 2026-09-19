import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';

let memoriaInformacion: InformacionHotel = {
  id: 1,
  nombre: 'Hotel Cúcuta',
  nit: '900.123.456-7',
  telefono: '+57 (607) 5712345',
  whatsapp: '+57 300 1234567',
  direccion: 'Calle 10 # 4-50 Centro',
  ciudad: 'Cúcuta, Norte de Santander',
  emailContacto: 'contacto@hotelcucuta.com',
  horarioCheckin: '15:00',
  horarioCheckout: '13:00',
  redWifi: 'HotelCucuta_Piso_1_a_5',
  claveWifi: 'HC_Familiar2026',
  politicasGenerales:
    'Ambiente Estrictamente Familiar. Horario de silencio nocturno desde las 10:00 PM. Espacios 100% libres de humo de tabaco. Solo se permite el acceso a habitaciones a huéspedes previamente registrados en recepción con documento de identidad.',
  urlLogo: '/assets/logotipo_hotel_cucuta.png',
};

function mapearInformacionHotel(item: any): InformacionHotel {
  return {
    id: item.id ? Number(item.id) : undefined,
    nombre: item.nombre ?? '',
    nit: item.nit ?? '',
    telefono: item.telefono ?? '',
    whatsapp: item.whatsapp ?? '',
    direccion: item.direccion ?? '',
    ciudad: item.ciudad ?? '',
    emailContacto: item.emailContacto ?? item.email_contacto ?? '',
    email_contacto: item.emailContacto ?? item.email_contacto ?? '',
    horarioCheckin: item.horarioCheckin ?? item.horario_checkin ?? '15:00',
    horario_checkin: item.horarioCheckin ?? item.horario_checkin ?? '15:00',
    horarioCheckout: item.horarioCheckout ?? item.horario_checkout ?? '13:00',
    horario_checkout: item.horarioCheckout ?? item.horario_checkout ?? '13:00',
    redWifi: item.redWifi ?? item.red_wifi ?? '',
    red_wifi: item.redWifi ?? item.red_wifi ?? '',
    claveWifi: item.claveWifi ?? item.clave_wifi ?? '',
    clave_wifi: item.claveWifi ?? item.clave_wifi ?? '',
    politicasGenerales: item.politicasGenerales ?? item.politicas_generales ?? '',
    politicas_generales: item.politicasGenerales ?? item.politicas_generales ?? '',
    urlLogo: item.urlLogo ?? item.url_logo ?? '',
    url_logo: item.urlLogo ?? item.url_logo ?? '',
  };
}

export const informacionHotelService = {
  async obtener(): Promise<InformacionHotel> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 150));
      return { ...memoriaInformacion };
    }

    try {
      const res = await api.get<RespuestaApi<any>>('/informacion-hotel');
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        return mapearInformacionHotel(res.data.data[0]);
      }
      if (res.data.data && typeof res.data.data === 'object') {
        return mapearInformacionHotel(res.data.data);
      }
      return { ...memoriaInformacion };
    } catch {
      return { ...memoriaInformacion };
    }
  },

  async guardar(datos: GuardarInformacionHotelDTO, id?: number): Promise<InformacionHotel> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (usarMock) {
      await new Promise((r) => setTimeout(r, 250));
      memoriaInformacion = {
        id: id || memoriaInformacion.id || 1,
        nombre: datos.nombre,
        nit: datos.nit,
        telefono: datos.telefono,
        whatsapp: datos.whatsapp,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
        emailContacto: datos.email_contacto,
        horarioCheckin: datos.horario_checkin,
        horarioCheckout: datos.horario_checkout,
        redWifi: datos.red_wifi,
        claveWifi: datos.clave_wifi,
        politicasGenerales: datos.politicas_generales,
        urlLogo: datos.url_logo || memoriaInformacion.urlLogo,
      };
      return { ...memoriaInformacion };
    }

    const payload = {
      nombre: datos.nombre,
      nit: datos.nit,
      telefono: datos.telefono || null,
      whatsapp: datos.whatsapp || null,
      direccion: datos.direccion || null,
      ciudad: datos.ciudad,
      email_contacto: datos.email_contacto || null,
      horario_checkin: datos.horario_checkin,
      horario_checkout: datos.horario_checkout,
      red_wifi: datos.red_wifi || null,
      clave_wifi: datos.clave_wifi || null,
      politicas_generales: datos.politicas_generales || null,
      url_logo: datos.url_logo || null,
    };

    if (id) {
      const res = await api.put<RespuestaApi<any>>(
        `/informacion-hotel/${id}`,
        payload
      );
      return mapearInformacionHotel(res.data.data);
    } else {
      const res = await api.post<RespuestaApi<any>>(
        '/informacion-hotel',
        payload
      );
      return mapearInformacionHotel(res.data.data);
    }
  },
};
