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

function mapFactura(item: any): Factura {
  return {
    id: item.id,
    codigo_factura: item.numero_factura,
    numero_factura: item.numero_factura,
    estadia_id: item.estadia_id,
    cliente_nombre: item.huesped ? item.huesped.nombres + ' ' + item.huesped.apellidos : 'Cliente',
    cliente_documento: item.huesped ? item.huesped.numero_documento : '000000',
    fecha_emision: item.fecha_emision,
    subtotal: Number(item.subtotal),
    iva: Number(item.valor_iva),
    total: Number(item.total_factura),
    total_factura: Number(item.total_factura),
    saldo_pendiente_dinamico: Number(item.saldo_pendiente_dinamico || 0),
    estado: item.estado,
    detalles: item.detalles || [],
  };
}

function mapCaja(item: any): TurnoCaja {
  return {
    id: item.id,
    usuario_id: item.usuario_id,
    usuario_nombre: 'Usuario ID: ' + item.usuario_id,
    estado: item.estado,
    fecha_apertura: item.fecha_apertura,
    fecha_cierre: item.fecha_cierre,
    base_inicial: Number(item.base_inicial_efectivo),
    total_recaudado: Number(item.total_entradas_efectivo) - Number(item.total_salidas_efectivo),
    total_efectivo: Number(item.total_entradas_efectivo),
    saldo_esperado: Number(item.saldo_calculado),
    saldo_real: item.saldo_real_entregado ? Number(item.saldo_real_entregado) : undefined,
    diferencia: item.diferencia ? Number(item.diferencia) : undefined,
    observaciones: item.observaciones,
  };
}

export const facturacionService = {
  async obtenerFacturas(): Promise<Factura[]> {
    try {
      const response = await api.get<RespuestaApi<any[]>>('/facturacion/facturas');
      return (response.data.data || []).map(mapFactura);
    } catch {
      return [];
    }
  },

  async emitirFacturaPorEstadia(datos: EmitirFacturaEstadiaDTO): Promise<Factura> {
    const response = await api.post<RespuestaApi<any>>(
      '/facturacion/facturas/estadia',
      datos
    );
    return mapFactura(response.data.data);
  },

  async obtenerEstadoCaja(): Promise<TurnoCaja> {
    const response = await api.get<RespuestaApi<any>>('/caja/estado');
    return mapCaja(response.data.data);
  },

  async abrirCaja(datos: AbrirCajaDTO): Promise<TurnoCaja> {
    const response = await api.post<RespuestaApi<any>>('/caja/abrir', datos);
    return mapCaja(response.data.data);
  },

  async cerrarCaja(datos: CerrarCajaDTO): Promise<TurnoCaja> {
    const response = await api.post<RespuestaApi<any>>('/caja/cerrar', datos);
    return mapCaja(response.data.data);
  },

  async registrarRecaudo(datos: RegistrarRecaudoDTO): Promise<void> {
    await api.post<RespuestaApi<unknown>>('/recaudos', datos);
  },

  async obtenerCuentaEstadia(estadiaId: number): Promise<CuentaCentralizadaEstadia> {
    const response = await api.get<RespuestaApi<any>>(
      `/facturacion/cuenta/${estadiaId}`
    );
    const data = response.data.data;
    return {
      estadia_id: data.estadia_id,
      saldo_base: Number(data.saldo_base),
      total_abonos: Number(data.total_abonos),
      saldo_pendiente: Number(data.saldo_pendiente),
      facturas: (data.facturas || []).map(mapFactura),
      recibos: data.recibos || [],
    };
  },

  async obtenerRecibos(estadiaId?: number): Promise<ReciboCaja[]> {
    const params = estadiaId ? { estadia_id: estadiaId } : undefined;
    const response = await api.get<RespuestaApi<any[]>>('/recaudos', { params });
    return response.data.data;
  },

  async obtenerHistorialCaja(): Promise<TurnoCaja[]> {
    const response = await api.get<RespuestaApi<any[]>>('/caja/historial');
    return (response.data.data || []).map(mapCaja);
  },
};
