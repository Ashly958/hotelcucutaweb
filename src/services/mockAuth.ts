import type { Usuario, CredencialesDTO, RespuestaAutenticacion } from '@/modules/Login/types/auth.types';
import type { RespuestaApi } from '@/types/api';

/**
 * Mock Data oficial para Hotel Cúcuta basada en:
 * 1. Documento de Requerimientos 'hotel-cucuta.pdf' (RF-023, RN-001..RN-015)
 * 2. Brand Book & Inducción 'Onboarding Huésped' (5 pisos, 45 habitaciones)
 */
export const USUARIOS_MOCK: Array<Usuario & { passwordValida: string }> = [
  {
    id: 'usr-000',
    nombre: 'Junior',
    apellido: 'Arias',
    email: 'junior.arias02yt@gmail.com',
    passwordValida: 'qweasdzxc',
    rol: 'ADMIN',
    rolNombre: 'Administrador General del Sistema',
    estado: 'ACTIVO',
    turno: 'Administrativo',
    hotelId: 'hc-principal',
    hotelNombre: 'Hotel Cúcuta - Sede Central',
    ultimoAcceso: '2026-09-18T14:32:00Z',
    permisos: ['TODO_EL_SISTEMA', 'MODIFICAR_TARIFAS', 'AUDITORIA_COMPLETA', 'LIBRO_POLICIA_SIRE'],
  },
  {
    id: 'usr-001',
    nombre: 'Patricia',
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
    rolNombre: 'Recepcionista Front Desk',
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
    nombre: 'Javier',
    apellido: 'Blanco',
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
 * Simula la respuesta del endpoint POST /api/autenticacion/login con resiliencia.
 */
export async function simularLoginApi(
  credenciales: CredencialesDTO
): Promise<RespuestaApi<RespuestaAutenticacion>> {
  // Latencia sutil (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  const emailLimpio = credenciales.email.trim().toLowerCase();
  let usuarioEncontrado = USUARIOS_MOCK.find((u) => u.email.toLowerCase() === emailLimpio);

  // Si no coincide exactamente, deducir por prefijo de correo
  if (!usuarioEncontrado) {
    if (emailLimpio.includes('admin') || emailLimpio.includes('geren') || emailLimpio.includes('junior')) {
      usuarioEncontrado = USUARIOS_MOCK[1];
    } else if (emailLimpio.includes('recep')) {
      usuarioEncontrado = USUARIOS_MOCK[2];
    } else if (emailLimpio.includes('lavan')) {
      usuarioEncontrado = USUARIOS_MOCK[3];
    } else if (emailLimpio.includes('manten')) {
      usuarioEncontrado = USUARIOS_MOCK[4];
    }
  }

  if (!usuarioEncontrado) {
    throw {
      message: 'Las credenciales ingresadas no coinciden con nuestros registros del hotel.',
      statusCode: 401,
    };
  }

  const passIngresada = credenciales.password;
  const esPassValida =
    passIngresada === usuarioEncontrado.passwordValida ||
    passIngresada === 'Password123!' ||
    passIngresada === 'qweasdzxc' ||
    passIngresada.length >= 4;

  if (!esPassValida) {
    throw {
      message: 'La contraseña ingresada es incorrecta. Use "Password123!" o la clave asignada.',
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
