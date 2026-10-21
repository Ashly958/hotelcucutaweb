import { useState, useEffect, useCallback } from 'react';
import { reservasService } from '../services/reservasService';
import type {
  Reserva,
  RackData,
  FiltrosReserva,
  CrearReservaDTO,
  ConvertirReservaDTO,
} from '../types/reserva.types';

export function useReservas() {
  const [vista, setVista] = useState<'rack' | 'tabla'>('rack');
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Rango del Rack: control por mes y fechas
  const [fechaBase, setFechaBase] = useState<Date>(() => new Date());
  const [rackData, setRackData] = useState<RackData | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtros, setFiltros] = useState<FiltrosReserva>({});

  // Modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState<boolean>(false);
  const [modalCheckInAbierto, setModalCheckInAbierto] = useState<boolean>(false);
  const [reservaParaCheckIn, setReservaParaCheckIn] = useState<Reserva | null>(null);
  const [habitacionPreseleccionada, setHabitacionPreseleccionada] = useState<{ id: number; fecha: string } | null>(null);

  // Cálculo de fechas de inicio y fin de mes para el Rack
  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const fechaDesdeStr = `${año}-${String(mes + 1).padStart(2, '0')}-01`;
  const ultimoDiaMes = new Date(año, mes + 1, 0).getDate();
  const fechaHastaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(ultimoDiaMes).padStart(2, '0')}`;

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (vista === 'rack') {
        const data = await reservasService.obtenerRack(fechaDesdeStr, fechaHastaStr);
        setRackData(data);
      } else {
        const lista = await reservasService.obtenerTodas(filtros);
        setReservas(lista);
      }
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar datos de reservas';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }, [vista, fechaDesdeStr, fechaHastaStr, filtros]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const mesAnterior = () => {
    setFechaBase((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const mesSiguiente = () => {
    setFechaBase((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const irAHoy = () => {
    setFechaBase(new Date());
  };

  const crearReserva = async (dto: CrearReservaDTO) => {
    await reservasService.crear(dto);
    setModalCrearAbierto(false);
    setHabitacionPreseleccionada(null);
    await cargarDatos();
  };

  const cancelarReserva = async (id: number, motivo: string) => {
    await reservasService.cancelar(id, motivo);
    await cargarDatos();
  };

  const convertirACheckIn = async (id: number, dto?: ConvertirReservaDTO) => {
    const res = await reservasService.convertirACheckIn(id, dto);
    setModalCheckInAbierto(false);
    setReservaParaCheckIn(null);
    await cargarDatos();
    return res;
  };

  const abrirModalCrearConCelda = (habitacionId: number, fecha: string) => {
    setHabitacionPreseleccionada({ id: habitacionId, fecha });
    setModalCrearAbierto(true);
  };

  const abrirModalCheckIn = (reserva: Reserva) => {
    setReservaParaCheckIn(reserva);
    setModalCheckInAbierto(true);
  };

  return {
    vista,
    setVista,
    cargando,
    error,
    fechaBase,
    mesAnterior,
    mesSiguiente,
    irAHoy,
    rackData,
    reservas,
    filtros,
    setFiltros,
    modalCrearAbierto,
    setModalCrearAbierto,
    modalCheckInAbierto,
    setModalCheckInAbierto,
    reservaParaCheckIn,
    habitacionPreseleccionada,
    abrirModalCrearConCelda,
    abrirModalCheckIn,
    crearReserva,
    cancelarReserva,
    convertirACheckIn,
    recargar: cargarDatos,
  };
}
