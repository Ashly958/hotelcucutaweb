export interface InformacionHotel {
  id?: number;
  nombre: string;
  nit: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad: string;
  emailContacto?: string;
  email_contacto?: string;
  horarioCheckin: string;
  horario_checkin?: string;
  horarioCheckout: string;
  horario_checkout?: string;
  redWifi?: string;
  red_wifi?: string;
  claveWifi?: string;
  clave_wifi?: string;
  politicasGenerales?: string;
  politicas_generales?: string;
  urlLogo?: string;
  url_logo?: string;
}

export interface GuardarInformacionHotelDTO {
  nombre: string;
  nit: string;
  telefono?: string;
  whatsapp?: string;
  direccion?: string;
  ciudad: string;
  email_contacto?: string;
  horario_checkin: string;
  horario_checkout: string;
  red_wifi?: string;
  clave_wifi?: string;
  politicas_generales?: string;
  url_logo?: string;
}
