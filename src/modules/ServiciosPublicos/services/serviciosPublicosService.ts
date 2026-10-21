import { api } from '@/services/api';
import type { RespuestaApi } from '@/types/api';
import type {
  ServicioPublico,
  RegistrarServicioDTO,
  PagarServicioDTO,
  EstadisticasAnualesServicios,
  FiltrosServicios,
} from '../types/serviciosPublicos.types';

export const serviciosPublicosService = {
  /**
   * Obtener lista de servicios públicos con filtros.
   */
  async obtenerServicios(filtros?: Partial<FiltrosServicios>): Promise<{
    data: ServicioPublico[];
    total: number;
    current_page: number;
    last_page: number;
  }> {
    const params: Record<string, any> = {};
    if (filtros?.anio !== undefined && filtros.anio !== 'todos') params.anio = filtros.anio;
    if (filtros?.mes !== undefined && filtros.mes !== 'todos') params.mes = filtros.mes;
    if (filtros?.tipo_servicio && filtros.tipo_servicio !== 'todos') params.tipo_servicio = filtros.tipo_servicio;
    if (filtros?.estado && filtros.estado !== 'todos') params.estado = filtros.estado;
    if (filtros?.search) params.search = filtros.search;

    const res = await api.get<RespuestaApi<any>>('/servicios-publicos', { params });
    const payload = res.data.data;
    return {
      data: payload.data || [],
      total: payload.total || 0,
      current_page: payload.current_page || 1,
      last_page: payload.last_page || 1,
    };
  },

  /**
   * Obtener detalle de un servicio.
   */
  async obtenerDetalle(id: number): Promise<ServicioPublico> {
    const res = await api.get<RespuestaApi<ServicioPublico>>(`/servicios-publicos/${id}`);
    return res.data.data;
  },

  /**
   * Registrar un nuevo recibo de servicio con soporte.
   */
  async registrarServicio(datos: RegistrarServicioDTO): Promise<ServicioPublico> {
    const formData = new FormData();
    formData.append('tipo_servicio', datos.tipo_servicio);
    if (datos.empresa_proveedor) formData.append('empresa_proveedor', datos.empresa_proveedor);
    if (datos.numero_factura_referencia) formData.append('numero_factura_referencia', datos.numero_factura_referencia);
    formData.append('periodo_mes', String(datos.periodo_mes));
    formData.append('periodo_anio', String(datos.periodo_anio));
    formData.append('monto_facturado', String(datos.monto_facturado));
    if (datos.monto_pagado !== undefined) formData.append('monto_pagado', String(datos.monto_pagado));
    if (datos.fecha_emision) formData.append('fecha_emision', datos.fecha_emision);
    if (datos.fecha_vencimiento) formData.append('fecha_vencimiento', datos.fecha_vencimiento);
    if (datos.fecha_pago) formData.append('fecha_pago', datos.fecha_pago);
    if (datos.metodo_pago) formData.append('metodo_pago', datos.metodo_pago);
    if (datos.observaciones) formData.append('observaciones', datos.observaciones);
    if (datos.soporte_recibo) formData.append('soporte_recibo', datos.soporte_recibo);
    if (datos.soporte_pago) formData.append('soporte_pago', datos.soporte_pago);
    if (datos.soporte_recibo_url) formData.append('soporte_recibo_url', datos.soporte_recibo_url);
    if (datos.soporte_pago_url) formData.append('soporte_pago_url', datos.soporte_pago_url);

    const res = await api.post<RespuestaApi<ServicioPublico>>('/servicios-publicos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  /**
   * Actualizar servicio público.
   */
  async actualizarServicio(id: number, datos: Partial<RegistrarServicioDTO>): Promise<ServicioPublico> {
    const formData = new FormData();
    if (datos.tipo_servicio) formData.append('tipo_servicio', datos.tipo_servicio);
    if (datos.empresa_proveedor !== undefined) formData.append('empresa_proveedor', datos.empresa_proveedor);
    if (datos.numero_factura_referencia !== undefined) formData.append('numero_factura_referencia', datos.numero_factura_referencia);
    if (datos.periodo_mes !== undefined) formData.append('periodo_mes', String(datos.periodo_mes));
    if (datos.periodo_anio !== undefined) formData.append('periodo_anio', String(datos.periodo_anio));
    if (datos.monto_facturado !== undefined) formData.append('monto_facturado', String(datos.monto_facturado));
    if (datos.monto_pagado !== undefined) formData.append('monto_pagado', String(datos.monto_pagado));
    if (datos.fecha_emision !== undefined) formData.append('fecha_emision', datos.fecha_emision || '');
    if (datos.fecha_vencimiento !== undefined) formData.append('fecha_vencimiento', datos.fecha_vencimiento || '');
    if (datos.fecha_pago !== undefined) formData.append('fecha_pago', datos.fecha_pago || '');
    if (datos.metodo_pago) formData.append('metodo_pago', datos.metodo_pago);
    if (datos.observaciones !== undefined) formData.append('observaciones', datos.observaciones || '');
    if (datos.soporte_recibo) formData.append('soporte_recibo', datos.soporte_recibo);
    if (datos.soporte_pago) formData.append('soporte_pago', datos.soporte_pago);
    if (datos.soporte_recibo_url) formData.append('soporte_recibo_url', datos.soporte_recibo_url);
    if (datos.soporte_pago_url) formData.append('soporte_pago_url', datos.soporte_pago_url);

    const res = await api.post<RespuestaApi<ServicioPublico>>(`/servicios-publicos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  /**
   * Registrar pago con foto del comprobante.
   */
  async registrarPago(id: number, datos: PagarServicioDTO): Promise<ServicioPublico> {
    const formData = new FormData();
    formData.append('monto_pagado', String(datos.monto_pagado));
    if (datos.fecha_pago) formData.append('fecha_pago', datos.fecha_pago);
    if (datos.metodo_pago) formData.append('metodo_pago', datos.metodo_pago);
    if (datos.observaciones) formData.append('observaciones', datos.observaciones);
    if (datos.soporte_pago) formData.append('soporte_pago', datos.soporte_pago);
    if (datos.soporte_pago_url) formData.append('soporte_pago_url', datos.soporte_pago_url);

    const res = await api.post<RespuestaApi<ServicioPublico>>(`/servicios-publicos/${id}/pagar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  /**
   * Eliminar recibo.
   */
  async eliminarServicio(id: number): Promise<void> {
    await api.delete<RespuestaApi<null>>(`/servicios-publicos/${id}`);
  },

  /**
   * Obtener estadísticas anuales completas con desglose mes a mes.
   */
  async obtenerEstadisticasAnuales(anio?: number): Promise<EstadisticasAnualesServicios> {
    const params = anio ? { anio } : undefined;
    const res = await api.get<RespuestaApi<EstadisticasAnualesServicios>>('/servicios-publicos/estadisticas', { params });
    return res.data.data;
  },
};
