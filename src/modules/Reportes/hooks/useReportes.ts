import { useState, useEffect, useCallback } from 'react';
import { reportesService } from '../services/reportesService';
import type {
  ReportesTab,
  FiltroReportes,
  ReporteOcupacionResponse,
  ReporteIngresosResponse,
  ReporteDianResponse,
  ReportePoliciaTraResponse,
  ReporteSireResponse,
  ReporteMincitResponse,
  ReporteAuditoriaDiariaResponse,
} from '../types/reporte.types';

export function useReportes() {
  const [tabActivo, setTabActivo] = useState<ReportesTab>('ocupacion');
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtros, setFiltros] = useState<FiltroReportes>({
    filtroPeriodo: 'mes',
    fechaInicio: undefined,
    fechaFin: undefined,
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  // Datos de cada pestaña
  const [ocupacionData, setOcupacionData] = useState<ReporteOcupacionResponse | null>(null);
  const [ingresosData, setIngresosData] = useState<ReporteIngresosResponse | null>(null);
  const [dianData, setDianData] = useState<ReporteDianResponse | null>(null);
  const [policiaTraData, setPoliciaTraData] = useState<ReportePoliciaTraResponse | null>(null);
  const [sireData, setSireData] = useState<ReporteSireResponse | null>(null);
  const [mincitData, setMincitData] = useState<ReporteMincitResponse | null>(null);
  const [auditoriaData, setAuditoriaData] = useState<ReporteAuditoriaDiariaResponse | null>(null);

  // Carga de datos para el tab activo
  const cargarDatosTab = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      switch (tabActivo) {
        case 'ocupacion': {
          const res = await reportesService.getOcupacion(filtros);
          setOcupacionData(res);
          break;
        }
        case 'ingresos': {
          const res = await reportesService.getIngresos(filtros);
          setIngresosData(res);
          break;
        }
        case 'dian': {
          const res = await reportesService.getDian(filtros);
          setDianData(res);
          break;
        }
        case 'policia': {
          const res = await reportesService.getPoliciaTra(filtros);
          setPoliciaTraData(res);
          break;
        }
        case 'sire': {
          const res = await reportesService.getSire(filtros);
          setSireData(res);
          break;
        }
        case 'mincit': {
          const res = await reportesService.getMincit(filtros);
          setMincitData(res);
          break;
        }
        case 'auditoria': {
          const res = await reportesService.getAuditoriaDiaria(filtros);
          setAuditoriaData(res);
          break;
        }
      }
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar los reportes.';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }, [tabActivo, filtros]);

  useEffect(() => {
    cargarDatosTab();
  }, [cargarDatosTab]);

  // Acciones de negocio
  const actualizarSire = async (
    id: number,
    datos: { estado_reporte: string; codigo_confirmacion_sire?: string; observaciones?: string }
  ) => {
    await reportesService.actualizarEstadoSire(id, datos);
    await cargarDatosTab();
  };

  const ejecutarCierreAuditoria = async (datos: {
    fecha_auditoria: string;
    observaciones?: string;
    saldo_real_entregado?: number;
  }) => {
    await reportesService.cerrarAuditoriaDiaria(datos);
    await cargarDatosTab();
  };

  const exportarPoliciaCsv = () => {
    if (policiaTraData?.registros) {
      reportesService.exportarCsvPoliciaTra(policiaTraData.registros);
    }
  };

  const exportarSireCsv = () => {
    if (sireData?.registros) {
      reportesService.exportarCsvSire(sireData.registros);
    }
  };

  const exportarDianCsv = () => {
    if (dianData?.facturas) {
      reportesService.exportarCsvDian(dianData.facturas, dianData.resolucion_dian?.prefijo ?? 'HC');
    }
  };

  return {
    tabActivo,
    setTabActivo,
    filtros,
    setFiltros,
    cargando,
    error,
    ocupacionData,
    ingresosData,
    dianData,
    policiaTraData,
    sireData,
    mincitData,
    auditoriaData,
    recargar: cargarDatosTab,
    actualizarSire,
    ejecutarCierreAuditoria,
    exportarPoliciaCsv,
    exportarSireCsv,
    exportarDianCsv,
  };
}
