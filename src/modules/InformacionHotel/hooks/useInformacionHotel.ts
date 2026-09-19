import { useState, useEffect, useCallback } from 'react';
import { informacionHotelService } from '../services/informacionHotelService';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';

export function useInformacionHotel() {
  const [info, setInfo] = useState<InformacionHotel | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarInformacion = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await informacionHotelService.obtener();
      setInfo(data);
    } catch {
      setError('No fue posible cargar la información institucional del hotel.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarInformacion();
  }, [cargarInformacion]);

  const guardarInformacion = async (datos: GuardarInformacionHotelDTO): Promise<boolean> => {
    try {
      setGuardando(true);
      setError(null);
      setMensajeExito(null);
      const actualizada = await informacionHotelService.guardar(datos, info?.id);
      setInfo(actualizada);
      setMensajeExito('Información y políticas del hotel actualizadas con éxito.');
      setTimeout(() => setMensajeExito(null), 4000);
      return true;
    } catch {
      setError('Error al actualizar la configuración del hotel.');
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return {
    info,
    cargando,
    guardando,
    error,
    mensajeExito,
    guardarInformacion,
    recargar: cargarInformacion,
  };
}
