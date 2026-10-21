// ─── Datos estáticos del módulo Onboarding ────────────────────────────────────
// ⚠️  Este archivo es PÚBLICO — nunca incluir credenciales WiFi, contraseñas
//     ni información interna de operaciones del hotel.

import type { TipoHabitacion, InfoPiso, PoliticaHotel } from '../types/onboarding.types';

export const TIPOS_HABITACION: TipoHabitacion[] = [
  {
    nombre: 'Individual',
    descripcion: 'Confort y descanso para 1 o 2 personas',
    precio: '$45.000',
    camas: '1 Cama Doble',
    maxPersonas: 'Hasta 2 personas',
    amenidades: ['Ventilador / A/C', 'Baño Privado', 'Wi-Fi Dedicado', 'TV Cable'],
    destacado: false,
  },
  {
    nombre: 'Estándar',
    descripcion: 'Comodidad ejecutiva con 1 o 2 camas',
    precio: '$50.000',
    camas: '1 o 2 Camas',
    maxPersonas: 'Hasta 3 personas',
    amenidades: ['Aire Acondicionado', 'Baño Privado', 'Wi-Fi Alta Velocidad', 'TV Cable'],
    destacado: true,
    badge: 'Más Popular',
  },
  {
    nombre: 'Matrimonial',
    descripcion: 'Espacio cálido y acogedor para parejas',
    precio: '$70.000',
    camas: '1 Cama Matrimonial',
    maxPersonas: '2 personas',
    amenidades: ['Aire Acondicionado', 'Baño Privado', 'Smart TV', 'Lencería 200 hilos'],
    destacado: false,
  },
  {
    nombre: 'Suite Familiar',
    descripcion: 'Amplitud para familias o grupos de viaje',
    precio: '$90.000',
    camas: '1 Matrimonial + Camarote',
    maxPersonas: 'Hasta 5 personas',
    amenidades: ['Aire Acondicionado', 'Baño Amplio', 'Wi-Fi Dedicado', 'Nevera en pasillo'],
    destacado: false,
  },
];

export const PISOS_INFO: Record<number, InfoPiso> = {
  1: {
    nivel: 1,
    nombre: 'Piso 1 — Recepción & Habitaciones 01 al 21',
    habitaciones: '21 Habitaciones (01 al 21)',
    caracteristicas: [
      'Recepción Central Front Desk 24 Horas',
      'Acceso peatonal principal y parqueadero vigilado',
      'Habitaciones con ventilador y aire acondicionado',
      'Áreas de Servicio A1 (Aseo) y B1 (Depósito de residuos)',
    ],
    areas: 'Recepción Central, Sala de Espera, Parqueadero de autos y motos',
  },
  2: {
    nivel: 2,
    nombre: 'Piso 2 — Habitaciones Ejecutivas 22 al 29',
    habitaciones: '8 Habitaciones (22 al 29)',
    caracteristicas: [
      'Habitaciones ejecutivas climatizadas con Aire Acondicionado',
      'Balcones con vista exterior y ventilación natural',
      'Área de aseo y lencería dedicada (Punto A2)',
      'Depósito técnico de residuos clasificados (Punto B2)',
    ],
    areas: 'Pasillo residencial climatizado, Puntos A2 y B2',
  },
  3: {
    nivel: 3,
    nombre: 'Piso 3 — Habitaciones Matrimoniales & Familiares 30 al 37',
    habitaciones: '8 Habitaciones (30 al 37)',
    caracteristicas: [
      'Habitaciones matrimoniales con cama doble',
      'Habitaciones familiares para hasta 5 personas',
      'Aire acondicionado y televisión por cable',
      'Puntos de servicio A3 y B3 en pasillo central',
    ],
    areas: 'Zona residencial familiar, Puntos A3 y B3',
  },
  4: {
    nivel: 4,
    nombre: 'Piso 4 — Habitaciones Climatizadas 38 al 45',
    habitaciones: '8 Habitaciones (38 al 45)',
    caracteristicas: [
      'Habitaciones con aire acondicionado y ventilador de respaldo',
      'Zona silenciosa ideal para descanso profundo o trabajo',
      'Baño privado con acabados cerámicos y agua caliente',
      'Puntos de servicio A4 y B4',
    ],
    areas: 'Piso residencial superior, Puntos A4 y B4',
  },
  5: {
    nivel: 5,
    nombre: 'Piso 5 — Centro de Lavandería Industrial',
    habitaciones: 'Planta de Operaciones (0 habitaciones)',
    caracteristicas: [
      'Lavadoras y secadoras industriales de alto flujo',
      'Mesa de planchado profesional por prendas textiles',
      'Almacenamiento y rotación central de sábanas y toallas',
      'Servicio de lavado de prendas personales para huéspedes',
    ],
    areas: 'Planta textil exclusiva del personal y servicio de lavandería',
  },
};

export const POLITICAS_HOTEL: PoliticaHotel[] = [
  {
    titulo: 'Libre de Humo',
    descripcion: 'Prohibido fumar en todas las habitaciones y pasillos cerrados.',
    colorClase: 'red',
    icono: 'smoke',
  },
  {
    titulo: 'Silencio Nocturno',
    descripcion: 'Desde las 10:00 PM volumen moderado para el descanso de todos.',
    colorClase: 'blue',
    icono: 'volume',
  },
  {
    titulo: 'Ambiente Familiar',
    descripcion: 'Acceso a habitaciones exclusivo para huéspedes registrados.',
    colorClase: 'emerald',
    icono: 'users',
  },
  {
    titulo: 'Parqueadero Vigilado',
    descripcion: 'Parqueadero privado para vehículos y motos con vigilancia 24h.',
    colorClase: 'purple',
    icono: 'car',
  },
];
