import { api } from '@/services/api';
import type {
  FiltroReportes,
  ReporteOcupacionResponse,
  ReporteIngresosResponse,
  ReporteDianResponse,
  ReportePoliciaTraResponse,
  ReporteSireResponse,
  ReporteMincitResponse,
  ReporteAuditoriaDiariaResponse,
  RegistroPoliciaTraItem,
  RegistroSireItem,
  FacturaDianItem,
} from '../types/reporte.types';

export const reportesService = {
  async getOcupacion(filtros?: FiltroReportes): Promise<ReporteOcupacionResponse> {
    const { data } = await api.get<RespuestaApi<ReporteOcupacionResponse>>('/reportes/ocupacion', {
      params: {
        fecha_inicio: filtros?.fechaInicio,
        piso_id: filtros?.pisoId,
      },
    });
    return data.data;
  },

  async getIngresos(filtros?: FiltroReportes): Promise<ReporteIngresosResponse> {
    const { data } = await api.get<RespuestaApi<ReporteIngresosResponse>>('/reportes/ingresos', {
      params: {
        filtro: filtros?.filtroPeriodo,
        fecha_inicio: filtros?.fechaInicio,
        fecha_fin: filtros?.fechaFin,
      },
    });
    return data.data;
  },

  async getDian(filtros?: FiltroReportes): Promise<ReporteDianResponse> {
    const { data } = await api.get<RespuestaApi<ReporteDianResponse>>('/reportes/dian', {
      params: {
        fecha_inicio: filtros?.fechaInicio,
        fecha_fin: filtros?.fechaFin,
      },
    });
    return data.data;
  },

  async getPoliciaTra(filtros?: FiltroReportes): Promise<ReportePoliciaTraResponse> {
    const { data } = await api.get<RespuestaApi<ReportePoliciaTraResponse>>('/reportes/policia-tra', {
      params: {
        fecha_inicio: filtros?.fechaInicio,
        fecha_fin: filtros?.fechaFin,
        estado: filtros?.estado,
      },
    });
    return data.data;
  },

  async getSire(filtros?: FiltroReportes): Promise<ReporteSireResponse> {
    const { data } = await api.get<RespuestaApi<ReporteSireResponse>>('/reportes/sire', {
      params: {
        estado: filtros?.estado,
        fecha_inicio: filtros?.fechaInicio,
        fecha_fin: filtros?.fechaFin,
      },
    });
    return data.data;
  },

  async actualizarEstadoSire(
    id: number,
    datos: { estado_reporte: string; codigo_confirmacion_sire?: string; observaciones?: string }
  ): Promise<void> {
    await api.patch(`/reportes/sire/${id}/estado`, datos);
  },

  async getMincit(filtros?: FiltroReportes): Promise<ReporteMincitResponse> {
    const { data } = await api.get<RespuestaApi<ReporteMincitResponse>>('/reportes/mincit', {
      params: {
        mes: filtros?.mes,
        anio: filtros?.anio,
      },
    });
    return data.data;
  },

  async getAuditoriaDiaria(filtros?: FiltroReportes): Promise<ReporteAuditoriaDiariaResponse> {
    const { data } = await api.get<RespuestaApi<ReporteAuditoriaDiariaResponse>>('/reportes/auditoria-diaria', {
      params: {
        fecha_inicio: filtros?.fechaInicio,
      },
    });
    return data.data;
  },

  async cerrarAuditoriaDiaria(datos: {
    fecha_auditoria: string;
    observaciones?: string;
    saldo_real_entregado?: number;
  }): Promise<void> {
    await api.post('/reportes/auditoria-diaria/cerrar', datos);
  },

  // --- Exportadores de Archivos ---

  exportarCsvPoliciaTra(registros: RegistroPoliciaTraItem[]): void {
    const encabezados = [
      'Folio',
      'Habitacion',
      'Tipo Doc',
      'Numero Doc',
      'Nombres Titular',
      'Apellidos Titular',
      'Nacionalidad',
      'Ciudad Procedencia',
      'Ciudad Destino',
      'Telefono',
      'Check-In',
      'Check-Out Previsto',
      'Check-Out Real',
      'Dias Estadia',
      'Total Personas',
      'Acompanantes',
      'Estado',
    ];

    const filas = registros.map((r) => {
      const acompStr = r.acompanantes.map((a) => `${a.nombre} (${a.tipo_documento} ${a.numero_documento})`).join('; ');
      return [
        `"${r.codigo_estadia}"`,
        `"${r.habitacion}"`,
        `"${r.huesped_titular.tipo_documento}"`,
        `"${r.huesped_titular.numero_documento}"`,
        `"${r.huesped_titular.nombres}"`,
        `"${r.huesped_titular.apellidos}"`,
        `"${r.huesped_titular.nacionalidad}"`,
        `"${r.huesped_titular.ciudad_procedencia || ''}"`,
        `"${r.huesped_titular.ciudad_destino || ''}"`,
        `"${r.huesped_titular.telefono || ''}"`,
        `"${r.fecha_checkin}"`,
        `"${r.fecha_prevista_checkout}"`,
        `"${r.fecha_real_checkout || ''}"`,
        r.dias_estadia,
        r.cantidad_personas,
        `"${acompStr}"`,
        `"${r.estado}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [encabezados.join(','), ...filas].join('\r\n');
    descargarArchivo(csvContent, `Libro_Huespedes_Policia_TRA_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  },

  exportarCsvSire(registros: RegistroSireItem[]): void {
    const encabezados = [
      'ID Registro',
      'Tipo Doc SIRE',
      'Numero Documento',
      'Nombre Completo',
      'Pais Emision',
      'Nacionalidad',
      'Fecha Nacimiento',
      'Fecha Ingreso Colombia',
      'Motivo Viaje',
      'Habitacion',
      'Codigo Estadia',
      'Fecha Check-In',
      'Estado SIRE',
      'Codigo Confirmacion',
    ];

    const filas = registros.map((r) => [
      r.id,
      `"${r.tipo_documento_sire}"`,
      `"${r.numero_documento_sire}"`,
      `"${r.huesped_nombre}"`,
      `"${r.pais_emision_doc}"`,
      `"${r.nacionalidad}"`,
      `"${r.fecha_nacimiento || ''}"`,
      `"${r.fecha_ingreso_colombia || ''}"`,
      `"${r.motivo_viaje}"`,
      `"${r.habitacion}"`,
      `"${r.codigo_estadia}"`,
      `"${r.fecha_checkin || ''}"`,
      `"${r.estado_reporte}"`,
      `"${r.codigo_confirmacion_sire || ''}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [encabezados.join(','), ...filas].join('\r\n');
    descargarArchivo(csvContent, `Reporte_SIRE_Migracion_Colombia_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  },

  exportarCsvDian(facturas: FacturaDianItem[], prefijo: string = 'HC'): void {
    const encabezados = [
      'Factura',
      'Fecha Emision',
      'Cliente',
      'Documento',
      'Subtotal',
      'IVA',
      'Impoconsumo',
      'Total',
      'Metodo Pago',
      'Estado',
      'CUFE',
    ];

    const filas = facturas.map((f) => [
      `"${f.numero_factura}"`,
      `"${f.fecha_emision}"`,
      `"${f.cliente_nombre}"`,
      `"${f.cliente_documento}"`,
      f.subtotal,
      f.valor_iva,
      f.impuesto_consumo,
      f.total_factura,
      `"${f.metodo_pago}"`,
      `"${f.estado}"`,
      `"${f.cufe}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [encabezados.join(','), ...filas].join('\r\n');
    descargarArchivo(csvContent, `Libro_Ventas_DIAN_${prefijo}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  },
};

function descargarArchivo(contenido: string, nombreArchivo: string, mimeType: string): void {
  const blob = new Blob([contenido], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
