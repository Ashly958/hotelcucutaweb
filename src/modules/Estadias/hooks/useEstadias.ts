import { useState, useEffect, useMemo, useCallback } from 'react';
import { estadiasService } from '../services/estadiasService';
import type { Estadia, RegistrarCheckInDTO } from '../types/estadia.types';
import { facturacionService } from '@/modules/Facturacion/services/facturacionService';
import { alertaService } from '@/utils/alertaService';

export function useEstadias() {
  const [todasLasEstadias, setTodasLasEstadias] = useState<Estadia[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'activa' | 'finalizada'>('activa');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modales
  const [modalCheckInAbierto, setModalCheckInAbierto] = useState<boolean>(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState<boolean>(false);
  const [estadiaSeleccionada, setEstadiaSeleccionada] = useState<Estadia | null>(null);

  // Modal Facturación Orquestado
  const [modalFacturacionAbierto, setModalFacturacionAbierto] = useState<boolean>(false);
  const [estadiaIdFacturar, setEstadiaIdFacturar] = useState<number | null>(null);

  const cargarEstadias = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await estadiasService.obtenerTodas();
      setTodasLasEstadias(data);
    } catch {
      setError('No fue posible cargar el listado de estadías del hotel.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadias();
  }, [cargarEstadias]);

  // Lista filtrada
  const estadiasFiltradas = useMemo(() => {
    return todasLasEstadias.filter((est) => {
      // Filtro de estado
      if (filtroEstado !== 'todas' && est.estado !== filtroEstado) {
        return false;
      }

      // Filtro de búsqueda (código, nombre huésped, documento, habitación)
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const matchCodigo = est.codigo_estadia.toLowerCase().includes(query);
        const matchHab = (est.habitacion_numero || String(est.habitacion_id)).includes(query);
        const matchNombre = est.huesped
          ? `${est.huesped.nombres} ${est.huesped.apellidos}`.toLowerCase().includes(query)
          : false;
        const matchDoc = est.huesped?.numero_documento.toLowerCase().includes(query) || false;

        return matchCodigo || matchHab || matchNombre || matchDoc;
      }

      return true;
    });
  }, [todasLasEstadias, filtroEstado, busqueda]);

  // Métricas rápidas
  const metricas = useMemo(() => {
    const activas = todasLasEstadias.filter((e) => e.estado === 'activa');
    const finalizadas = todasLasEstadias.filter((e) => e.estado === 'finalizada');
    const saldoPendienteTotal = activas.reduce((acc, curr) => acc + (curr.saldo_pendiente || 0), 0);

    return {
      total: todasLasEstadias.length,
      activas: activas.length,
      finalizadas: finalizadas.length,
      saldoPendienteTotal,
    };
  }, [todasLasEstadias]);

  const registrarCheckIn = async (datos: RegistrarCheckInDTO): Promise<boolean> => {
    try {
      await estadiasService.registrarCheckIn(datos);
      await cargarEstadias();
      setModalCheckInAbierto(false);
      alertaService.exito('Check-In Registrado', 'El huésped ha ingresado formalmente a la habitación.');
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Error al registrar el check-in. Por favor verifique los datos ingresados.';
      alertaService.error('Error al Registrar Check-In', errorMsg);
      return false;
    }
  };

  const realizarCheckOut = async (id: number, onAbrirAbono?: (estadiaId: number) => void): Promise<boolean> => {
    try {
      await estadiasService.realizarCheckOut(id);
      await cargarEstadias();
      if (estadiaSeleccionada?.id === id) {
        setModalDetalleAbierto(false);
        setEstadiaSeleccionada(null);
      }
      alertaService.exito('Check-Out Exitoso', 'La salida del huésped ha sido registrada y la habitación pasó a estado de limpieza.');
      return true;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || '';

      // 1. Si el backend rechaza por saldo pendiente
      if (errorMsg.includes('saldo pendiente')) {
        const est = todasLasEstadias.find((e) => e.id === id);
        const saldo = est?.saldo_pendiente || 0;
        alertaService.saldoPendienteCheckOut(saldo, {
          onIrAFacturacion: onAbrirAbono ? () => onAbrirAbono(id) : undefined,
        });
        return false;
      }

      // 2. Si el backend requiere factura antes de check-out, orquestamos el flujo
      if (errorMsg.includes('factura') || errorMsg.includes('facturada')) {
        setEstadiaIdFacturar(id);
        setModalFacturacionAbierto(true);
        return false;
      }

      // 3. Cualquier otro error operativo se muestra en alerta sin desmontar la página
      alertaService.error('No se pudo realizar el Check-Out', errorMsg || 'Error al procesar el check-out de la estadía.');
      return false;
    }
  };

  const emitirFactura = async (id: number): Promise<boolean> => {
    try {
      await facturacionService.emitirFacturaPorEstadia({ estadia_id: id });
      // Factura emitida con éxito, ahora intentamos hacer check-out automáticamente
      setModalFacturacionAbierto(false);
      const exitoCheckout = await realizarCheckOut(id);
      return exitoCheckout;
    } catch (err: any) {
      alertaService.error('Error al Emitir Factura', err?.response?.data?.message || 'Error al emitir la factura.');
      return false;
    }
  };

  const abrirDetalle = (estadia: Estadia) => {
    setEstadiaSeleccionada(estadia);
    setModalDetalleAbierto(true);
  };

  return {
    estadias: estadiasFiltradas,
    todasLasEstadias,
    cargando,
    error,
    metricas,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    modalCheckInAbierto,
    setModalCheckInAbierto,
    modalDetalleAbierto,
    setModalDetalleAbierto,
    estadiaSeleccionada,
    setEstadiaSeleccionada,
    modalFacturacionAbierto,
    setModalFacturacionAbierto,
    estadiaIdFacturar,
    setEstadiaIdFacturar,
    abrirDetalle,
    registrarCheckIn,
    realizarCheckOut,
    emitirFactura,
    recargar: cargarEstadias,
  };
}
