import { useState, useEffect, useMemo, useCallback } from 'react';
import { estadiasService } from '../services/estadiasService';
import type { Estadia, RegistrarCheckInDTO } from '../types/estadia.types';

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
      return true;
    } catch {
      setError('Error al registrar el check-in. Por favor verifique los datos ingresados.');
      return false;
    }
  };

  const realizarCheckOut = async (id: number): Promise<boolean> => {
    try {
      await estadiasService.realizarCheckOut(id);
      await cargarEstadias();
      if (estadiaSeleccionada?.id === id) {
        setModalDetalleAbierto(false);
        setEstadiaSeleccionada(null);
      }
      return true;
    } catch {
      setError('Error al procesar el check-out de la estadía.');
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
    abrirDetalle,
    registrarCheckIn,
    realizarCheckOut,
    recargar: cargarEstadias,
  };
}
