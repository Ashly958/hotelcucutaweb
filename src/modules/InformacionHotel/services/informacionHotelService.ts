import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';

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
    const res = await api.get<RespuestaApi<any>>('/informacion-hotel');
    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
      return mapearInformacionHotel(res.data.data[0]);
    }
    return mapearInformacionHotel(res.data.data);
  },

  async guardar(datos: GuardarInformacionHotelDTO, id?: number): Promise<InformacionHotel> {
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
      const res = await api.put<RespuestaApi<any>>(`/informacion-hotel/${id}`, payload);
      return mapearInformacionHotel(res.data.data);
    } else {
      const res = await api.post<RespuestaApi<any>>('/informacion-hotel', payload);
      return mapearInformacionHotel(res.data.data);
    }
  },
};
