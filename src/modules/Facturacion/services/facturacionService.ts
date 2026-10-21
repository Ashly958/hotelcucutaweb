import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  Factura,
  TurnoCaja,
  AbrirCajaDTO,
  CerrarCajaDTO,
  RegistrarRecaudoDTO,
  RegistrarEgresoDTO,
  EgresoCaja,
  EmitirFacturaEstadiaDTO,
  CuentaCentralizadaEstadia,
  ReciboCaja,
  InformeHuespedData,
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
    iva: Number(item.valor_iva ?? item.iva ?? 0),
    impuesto_consumo: Number(item.impuesto_consumo ?? 0),
    total: Number(item.total_factura),
    total_factura: Number(item.total_factura),
    saldo_pendiente_dinamico: Number(item.saldo_pendiente_dinamico || 0),
    estado: item.estado,
    cufe: item.cufe,
    detalles: item.detalles || [],
  };
}

function mapCaja(item: any): TurnoCaja {
  const baseInicial = Number(item.base_inicial_efectivo ?? item.base_inicial ?? 0);
  const recaudos = Number(item.total_recaudos_efectivo ?? item.total_entradas_efectivo ?? 0);
  const egresos = Number(item.total_egresos ?? item.total_salidas_efectivo ?? 0);
  const saldoEsperado = Number(item.saldo_calculado ?? (baseInicial + recaudos - egresos));

  return {
    id: item.id,
    usuario_id: item.usuario_id,
    usuario_nombre: 'Usuario ID: ' + item.usuario_id,
    estado: item.estado,
    fecha_apertura: item.fecha_apertura,
    fecha_cierre: item.fecha_cierre,
    base_inicial: baseInicial,
    total_recaudado: recaudos,
    total_egresos: egresos,
    total_efectivo: Number(item.total_efectivo ?? saldoEsperado),
    saldo_esperado: saldoEsperado,
    saldo_real: item.saldo_real_entregado ? Number(item.saldo_real_entregado) : undefined,
    diferencia: item.diferencia ? Number(item.diferencia) : undefined,
    observaciones: item.observaciones,
  };
}

export const facturacionService = {
  async obtenerFacturas(params?: { fecha?: 'hoy' | 'todas'; limit?: number; page?: number }): Promise<{ data: Factura[], pagination: any }> {
    try {
      const response = await api.get<RespuestaApi<any>>('/facturacion/facturas', { params });
      if (response.data.data && response.data.data.current_page !== undefined) {
        return {
          data: (response.data.data.data || []).map(mapFactura),
          pagination: {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            per_page: response.data.data.per_page,
            total: response.data.data.total
          }
        };
      }
      return { data: (response.data.data || []).map(mapFactura), pagination: null };
    } catch {
      return { data: [], pagination: null };
    }
  },

  async emitirFacturaPorEstadia(datos: EmitirFacturaEstadiaDTO): Promise<Factura> {
    const response = await api.post<RespuestaApi<any>>(
      '/facturacion/facturas/estadia',
      datos
    );
    return mapFactura(response.data.data);
  },

  async remitirFacturaDian(facturaId: number): Promise<{cufe: string}> {
    const response = await api.post<RespuestaApi<{cufe: string}>>(
      `/facturacion/facturas/${facturaId}/dian`
    );
    return response.data.data;
  },

  async obtenerEstadoCaja(): Promise<TurnoCaja | null> {
    try {
      const response = await api.get<RespuestaApi<any>>('/caja/estado');
      return mapCaja(response.data.data);
    } catch {
      return null;
    }
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

  async registrarEgreso(datos: RegistrarEgresoDTO): Promise<EgresoCaja> {
    const response = await api.post<RespuestaApi<EgresoCaja>>('/caja/egresos', datos);
    return response.data.data;
  },

  async obtenerEgresos(params?: { arqueo_caja_id?: number; fecha?: string; turno_activo?: boolean }): Promise<EgresoCaja[]> {
    const response = await api.get<RespuestaApi<EgresoCaja[]>>('/caja/egresos', { params });
    return response.data.data || [];
  },

  async obtenerCuentaEstadia(estadiaId: number): Promise<CuentaCentralizadaEstadia> {
    const response = await api.get<RespuestaApi<any>>(
      `/facturacion/cuenta/${estadiaId}`
    );
    const data = response.data.data;
    return {
      estadia_id: data.estadia_id,
      codigo_estadia: data.codigo_estadia,
      habitacion: data.habitacion,
      huesped: data.huesped,
      hospedaje: {
        ...data.hospedaje,
        subtotal: data.hospedaje?.subtotal !== undefined ? Number(data.hospedaje.subtotal) : undefined,
        iva: data.hospedaje?.iva !== undefined ? Number(data.hospedaje.iva) : undefined,
        impuesto_consumo: data.hospedaje?.impuesto_consumo !== undefined ? Number(data.hospedaje.impuesto_consumo) : undefined,
        total_hospedaje: Number(data.hospedaje?.total_hospedaje ?? data.total_hospedaje),
      },
      subtotal: data.subtotal !== undefined ? Number(data.subtotal) : undefined,
      iva: data.iva !== undefined ? Number(data.iva) : undefined,
      impuesto_consumo: data.impuesto_consumo !== undefined ? Number(data.impuesto_consumo) : undefined,
      total_hospedaje: Number(data.total_hospedaje),
      consumos: data.consumos || [],
      total_consumos: Number(data.total_consumos),
      total_cargos: Number(data.total_cargos),
      total_abonos: Number(data.total_abonos),
      saldo_pendiente: Number(data.saldo_pendiente),
      factura: data.factura ? mapFactura(data.factura) : null,
      abonos: data.recibos || data.abonos || [],
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

  async obtenerInformeHuesped(estadiaId: number): Promise<InformeHuespedData> {
    const response = await api.get<RespuestaApi<InformeHuespedData>>(
      `/facturacion/informe-huesped/${estadiaId}`
    );
    return response.data.data;
  },
};
