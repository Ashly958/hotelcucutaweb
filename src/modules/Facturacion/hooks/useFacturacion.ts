import { useState, useEffect, useMemo, useCallback } from 'react';
import { facturacionService } from '../services/facturacionService';
import { estadiasService } from '@/modules/Estadias/services/estadiasService';
import type {
  Factura,
  TurnoCaja,
  RegistrarRecaudoDTO,
  CuentaCentralizadaEstadia,
} from '../types/facturacion.types';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';

export function useFacturacion() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [turnoCaja, setTurnoCaja] = useState<TurnoCaja | null>(null);
  const [estadias, setEstadias] = useState<Estadia[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'pagada' | 'pendiente'>('todas');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modales
  const [modalAbonoAbierto, setModalAbonoAbierto] = useState<boolean>(false);
  const [modalAbrirCajaAbierto, setModalAbrirCajaAbierto] = useState<boolean>(false);
  const [modalCerrarCajaAbierto, setModalCerrarCajaAbierto] = useState<boolean>(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [folioSeleccionado, setFolioSeleccionado] = useState<CuentaCentralizadaEstadia | null>(null);
  const [cargandoFolio, setCargandoFolio] = useState<boolean>(false);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const [listaFacturas, estadoCaja, listaEstadias] = await Promise.all([
        facturacionService.obtenerFacturas(),
        facturacionService.obtenerEstadoCaja(),
        estadiasService.obtenerTodas().catch(() => []),
      ]);
      setFacturas(listaFacturas);
      setTurnoCaja(estadoCaja);
      setEstadias(listaEstadias);
    } catch {
      setError('No fue posible cargar la información financiera y de caja.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) => {
      const estaPagada =
        f.estado === 'pagada' ||
        f.estado === 'pagada_total' ||
        f.saldo_pendiente_dinamico === 0;

      const tieneSaldo = !estaPagada || f.saldo_pendiente_dinamico > 0;

      if (filtroEstado === 'pagada' && !estaPagada) return false;
      if (filtroEstado === 'pendiente' && !tieneSaldo) return false;

      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const codigo = (f.codigo_factura || f.numero_factura || '').toLowerCase();
        const cliente = (f.cliente_nombre || '').toLowerCase();
        const doc = (f.cliente_documento || '').toLowerCase();
        return codigo.includes(query) || cliente.includes(query) || doc.includes(query);
      }
      return true;
    });
  }, [facturas, filtroEstado, busqueda]);

  const metricas = useMemo(() => {
    const totalFacturado = facturas.reduce((acc, f) => acc + (f.total || f.total_factura || 0), 0);
    const totalPendiente = facturas.reduce((acc, f) => acc + (f.saldo_pendiente_dinamico || 0), 0);
    const totalRecaudadoCaja = turnoCaja?.total_recaudado || 0;

    return {
      totalFacturas: facturas.length,
      totalFacturado,
      totalPendiente,
      totalRecaudadoCaja,
      cajaAbierta: turnoCaja?.estado === 'abierta',
    };
  }, [facturas, turnoCaja]);

  const abrirCaja = async (baseInicial: number): Promise<boolean> => {
    try {
      const nuevaCaja = await facturacionService.abrirCaja({ base_inicial: baseInicial });
      setTurnoCaja(nuevaCaja);
      setModalAbrirCajaAbierto(false);
      await cargarDatos();
      return true;
    } catch {
      setError('Error al realizar la apertura de caja.');
      return false;
    }
  };

  const cerrarCaja = async (saldoReal: number, observaciones?: string): Promise<boolean> => {
    try {
      const cajaCerrada = await facturacionService.cerrarCaja({
        saldo_real: saldoReal,
        observaciones,
      });
      setTurnoCaja(cajaCerrada);
      setModalCerrarCajaAbierto(false);
      await cargarDatos();
      return true;
    } catch {
      setError('Error al cerrar el turno de caja.');
      return false;
    }
  };

  const registrarAbono = async (datos: RegistrarRecaudoDTO): Promise<boolean> => {
    try {
      await facturacionService.registrarRecaudo(datos);
      await cargarDatos();
      setModalAbonoAbierto(false);
      return true;
    } catch {
      setError('Error al registrar el recaudo o abono.');
      return false;
    }
  };

  const emitirFacturaEstadia = async (estadiaId: number): Promise<boolean> => {
    try {
      await facturacionService.emitirFacturaPorEstadia({ estadia_id: estadiaId });
      await cargarDatos();
      return true;
    } catch {
      setError('Error al emitir la factura por estadía.');
      return false;
    }
  };

  const verCuentaFolio = async (estadiaId: number) => {
    try {
      setCargandoFolio(true);
      const folio = await facturacionService.obtenerCuentaEstadia(estadiaId);
      setFolioSeleccionado(folio);
    } catch {
      alert('No se pudo cargar el folio de la estadía.');
    } finally {
      setCargandoFolio(false);
    }
  };

  return {
    facturas: facturasFiltradas,
    todasLasFacturas: facturas,
    turnoCaja,
    estadias,
    cargando,
    error,
    metricas,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    modalAbonoAbierto,
    setModalAbonoAbierto,
    modalAbrirCajaAbierto,
    setModalAbrirCajaAbierto,
    modalCerrarCajaAbierto,
    setModalCerrarCajaAbierto,
    facturaSeleccionada,
    setFacturaSeleccionada,
    folioSeleccionado,
    setFolioSeleccionado,
    cargandoFolio,
    abrirCaja,
    cerrarCaja,
    registrarAbono,
    emitirFacturaEstadia,
    verCuentaFolio,
    recargar: cargarDatos,
  };
}
