import type { Usuario, CredencialesDTO, RespuestaAutenticacion } from '@/modules/Login/types/auth.types';
import type { RespuestaApi } from '@/types/api';

/**
 * Mock Data oficial para Hotel Cúcuta basada en:
 * 1. Documento de Requerimientos 'hotel-cucuta.pdf' (RF-023, RN-001..RN-015)
 * 2. Brand Book & Inducción 'Onboarding Huésped' (5 pisos, 45 habitaciones)
 */
export const USUARIOS_MOCK: Array<Usuario & { passwordValida: string }> = [
  {
    id: 'usr-001',
    nombre: 'Paulina',
    apellido: 'Ramírez',
    email: 'admin@hotelcucuta.com',
    passwordValida: 'Password123!',
    rol: 'ADMIN',
    rolNombre: 'Administradora General / Propietaria',
    estado: 'ACTIVO',
    turno: 'Administrativo',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta - Sede Central',
    ultimoAcceso: '2026-09-10T14:32:00Z',
    permisos: ['TODO_EL_SISTEMA', 'MODIFICAR_TARIFAS', 'AUDITORIA_COMPLETA', 'LIBRO_POLICIA_SIRE'],
  },
  {
    id: 'usr-002',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'recepcion@hotelcucuta.com',
    passwordValida: 'Password123!',
    rol: 'RECEPCION',
    rolNombre: 'Recepcionista Turno Tarde',
    estado: 'ACTIVO',
    turno: 'Tarde',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta - Sede Central',
    ultimoAcceso: '2026-09-10T16:05:00Z',
    permisos: ['CHECK_IN', 'CHECK_OUT', 'CONSULTA_HABITACIONES', 'PAGOS_EFECTIVO_RN010'],
  },
  {
    id: 'usr-003',
    nombre: 'Marta Elena',
    apellido: 'Suárez',
    email: 'lavanderia@hotelcucuta.com',
    passwordValida: 'Password123!',
    rol: 'LAVANDERIA',
    rolNombre: 'Operaria de Lavandería (Piso 5)',
    estado: 'ACTIVO',
    turno: 'Mañana',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta - Sede Central',
    ultimoAcceso: '2026-09-10T08:12:00Z',
    permisos: ['GESTION_LAVANDERIA_PISO5', 'CARGO_PRENDAS_RF010'],
  },
  {
    id: 'usr-004',
    nombre: 'José Gregorio',
    apellido: 'Rivas',
    email: 'mantenimiento@hotelcucuta.com',
    passwordValida: 'Password123!',
    rol: 'MANTENIMIENTO',
    rolNombre: 'Técnico de Mantenimiento & Infraestructura',
    estado: 'ACTIVO',
    turno: 'Mañana',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta - Sede Central',
    ultimoAcceso: '2026-09-09T17:45:00Z',
    permisos: ['HOJAS_VIDA_EQUIPOS', 'ESTADO_MANTENIMIENTO_RF002'],
  },
];

/**
 * Simula la respuesta del endpoint POST /api/v1/login con latencia de red realista.
 */
export async function simularLoginApi(
  credenciales: CredencialesDTO
): Promise<RespuestaApi<RespuestaAutenticacion>> {
  // Latencia realista de red (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const emailLimpio = credenciales.email.trim().toLowerCase();
  const usuarioEncontrado = USUARIOS_MOCK.find((u) => u.email.toLowerCase() === emailLimpio);

  if (!usuarioEncontrado) {
    throw {
      message: 'Las credenciales ingresadas no coinciden con nuestros registros del hotel.',
      statusCode: 401,
    };
  }

  if (usuarioEncontrado.passwordValida !== credenciales.password) {
    throw {
      message: 'La contraseña ingresada es incorrecta. Verifique sus datos o contacte a Gerencia.',
      statusCode: 401,
    };
  }

  if (usuarioEncontrado.estado !== 'ACTIVO') {
    throw {
      message: 'Su cuenta se encuentra inactiva. Por favor contacte al Administrador del sistema.',
      statusCode: 403,
    };
  }

  // Generar token JWT simulado
  const tokenFalso = `hc_jwt_${usuarioEncontrado.rol.toLowerCase()}_${Date.now()}`;
  const { passwordValida, ...usuarioLimpio } = usuarioEncontrado;

  return {
    success: true,
    data: {
      usuario: {
        ...usuarioLimpio,
        ultimoAcceso: new Date().toISOString(),
      },
      token: tokenFalso,
      expiraEn: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
      tipoToken: 'Bearer',
    },
    message: `Bienvenido(a) de nuevo, ${usuarioEncontrado.nombre} (${usuarioEncontrado.rolNombre}).`,
  };
}
