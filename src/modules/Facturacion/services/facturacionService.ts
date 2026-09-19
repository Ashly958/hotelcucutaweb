import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Factura,
  TurnoCaja,
  AbrirCajaDTO,
  CerrarCajaDTO,
  RegistrarRecaudoDTO,
  EmitirFacturaEstadiaDTO,
  CuentaCentralizadaEstadia,
  ReciboCaja,
} from '../types/facturacion.types';

// Memoria mock de respaldo
let turnoCajaMemoria: TurnoCaja = {
  id: 1,
  usuario_id: 1,
  usuario_nombre: 'Recepcionista Turno',
  estado: 'abierta',
  fecha_apertura: '2026-09-17 07:00:00',
  fecha_cierre: null,
  base_inicial: 150000,
  total_recaudado: 890000,
  total_efectivo: 890000,
  saldo_esperado: 1040000,
  movimientos_count: 5,
};

let facturasMemoria: Factura[] = [
  {
    id: 1,
    codigo_factura: 'HC-0001',
    numero_factura: 'HC-0001',
    estadia_id: 1,
    cliente_nombre: 'María Fernanda Ruiz',
    cliente_documento: '60345123',
    fecha_emision: '2026-09-17 14:00:00',
    subtotal: 140000,
    iva: 0,
    total: 140000,
    total_factura: 140000,
    saldo_pendiente_dinamico: 35000,
    estado: 'pagada_parcial',
    detalles: [
      {
        id: 1,
        concepto: 'Servicio de Hospedaje (2 noche(s))',
        cantidad: 1,
        valor_unitario: 140000,
        subtotal: 140000,
      },
    ],
  },
];

export const facturacionService = {
  async obtenerFacturas(): Promise<Factura[]> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...facturasMemoria];
    }

    try {
      const response = await api.get<RespuestaApi<Factura[]>>('/facturacion/facturas');
      return response.data.data;
    } catch {
      return [...facturasMemoria];
    }
  },

  async emitirFacturaPorEstadia(datos: EmitirFacturaEstadiaDTO): Promise<Factura> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const nuevoId = facturasMemoria.length + 1;
      const nuevaFactura: Factura = {
        id: nuevoId,
        codigo_factura: `HC-${String(nuevoId).padStart(4, '0')}`,
        numero_factura: `HC-${String(nuevoId).padStart(4, '0')}`,
        estadia_id: datos.estadia_id,
        cliente_nombre: 'Huésped Consolidado',
        cliente_documento: '1090123456',
        fecha_emision: new Date().toISOString().replace('T', ' ').substring(0, 19),
        subtotal: 120000,
        iva: 0,
        total: 120000,
        total_factura: 120000,
        saldo_pendiente_dinamico: 0,
        estado: 'pagada_total',
        detalles: [
          {
            id: nuevoId,
            concepto: `Liquidación formal de Estadía #${datos.estadia_id}`,
            cantidad: 1,
            valor_unitario: 120000,
            subtotal: 120000,
          },
        ],
      };
      facturasMemoria = [nuevaFactura, ...facturasMemoria];
      return nuevaFactura;
    }

    const response = await api.post<RespuestaApi<Factura>>(
      '/facturacion/facturas/estadia',
      datos
    );
    return response.data.data;
  },

  async obtenerEstadoCaja(): Promise<TurnoCaja> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return { ...turnoCajaMemoria };
    }

    try {
      const response = await api.get<RespuestaApi<TurnoCaja>>('/caja/estado');
      return response.data.data;
    } catch {
      return { ...turnoCajaMemoria };
    }
  },

  async abrirCaja(datos: AbrirCajaDTO): Promise<TurnoCaja> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      turnoCajaMemoria = {
        id: (turnoCajaMemoria.id || 0) + 1,
        usuario_id: 1,
        usuario_nombre: 'Recepcionista Turno',
        estado: 'abierta',
        fecha_apertura: new Date().toISOString().replace('T', ' ').substring(0, 19),
        fecha_cierre: null,
        base_inicial: datos.base_inicial,
        total_recaudado: 0,
        total_efectivo: 0,
        saldo_esperado: datos.base_inicial,
      };
      return { ...turnoCajaMemoria };
    }

    const response = await api.post<RespuestaApi<TurnoCaja>>('/caja/abrir', datos);
    return response.data.data;
  },

  async cerrarCaja(datos: CerrarCajaDTO): Promise<TurnoCaja> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const esperado = turnoCajaMemoria.saldo_esperado || turnoCajaMemoria.base_inicial;
      const diferencia = datos.saldo_real - esperado;

      turnoCajaMemoria = {
        ...turnoCajaMemoria,
        estado: 'cerrada',
        fecha_cierre: new Date().toISOString().replace('T', ' ').substring(0, 19),
        saldo_real: datos.saldo_real,
        diferencia,
        observaciones: datos.observaciones,
      };
      return { ...turnoCajaMemoria };
    }

    const response = await api.post<RespuestaApi<TurnoCaja>>('/caja/cerrar', datos);
    return response.data.data;
  },

  async registrarRecaudo(datos: RegistrarRecaudoDTO): Promise<void> {
    const usarMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (usarMock) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (turnoCajaMemoria.estado === 'abierta') {
        const actual = turnoCajaMemoria.total_recaudado || 0;
        turnoCajaMemoria.total_recaudado = actual + datos.valor;
        turnoCajaMemoria.saldo_esperado = turnoCajaMemoria.base_inicial + turnoCajaMemoria.total_recaudado;
      }

      // Si aplica a factura, actualizar saldo pendiente
      if (datos.factura_id) {
        facturasMemoria = facturasMemoria.map((f) => {
          if (f.id === datos.factura_id) {
            const nuevoSaldo = Math.max(0, f.saldo_pendiente_dinamico - datos.valor);
            return {
              ...f,
              saldo_pendiente_dinamico: nuevoSaldo,
              estado: nuevoSaldo === 0 ? 'pagada_total' : 'pagada_parcial',
            };
          }
          return f;
        });
      }
      return;
    }

    await api.post<RespuestaApi<unknown>>('/recaudos', datos);
  },

  async obtenerCuentaEstadia(estadiaId: number): Promise<CuentaCentralizadaEstadia> {
    const response = await api.get<RespuestaApi<CuentaCentralizadaEstadia>>(
      `/facturacion/cuenta/${estadiaId}`
    );
    return response.data.data;
  },

  async obtenerRecibos(estadiaId?: number): Promise<ReciboCaja[]> {
    const params = estadiaId ? { estadia_id: estadiaId } : undefined;
    const response = await api.get<RespuestaApi<ReciboCaja[]>>('/recaudos', { params });
    return response.data.data;
  },

  async obtenerHistorialCaja(): Promise<TurnoCaja[]> {
    const response = await api.get<RespuestaApi<TurnoCaja[]>>('/caja/historial');
    return response.data.data;
  },
};
