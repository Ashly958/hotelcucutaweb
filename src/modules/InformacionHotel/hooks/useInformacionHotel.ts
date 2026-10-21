import { useState, useEffect, useCallback } from 'react';
import { informacionHotelService } from '../services/informacionHotelService';
import type {
  InformacionHotel,
  GuardarInformacionHotelDTO,
} from '../types/informacionHotel.types';

export function useInformacionHotel() {
  const [info, setInfo] = useState<InformacionHotel | null>(null);
  const [precios, setPrecios] = useState<any[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarInformacion = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const [dataInfo, dataPrecios] = await Promise.all([
        informacionHotelService.obtener(),
        informacionHotelService.obtenerPreciosOnboarding()
      ]);
      setInfo(dataInfo);
      setPrecios(dataPrecios);
    } catch {
      setError('No fue posible cargar la información institucional del hotel.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarInformacion();
  }, [cargarInformacion]);

  const guardarInformacion = async (datos: GuardarInformacionHotelDTO, nuevosPrecios?: any[]): Promise<boolean> => {
    try {
      setGuardando(true);
      setError(null);
      setMensajeExito(null);
      
      const requests: Promise<any>[] = [
        informacionHotelService.guardar(datos, info?.id)
      ];

      if (nuevosPrecios && nuevosPrecios.length > 0) {
        requests.push(informacionHotelService.actualizarPreciosOnboarding(nuevosPrecios));
      }

      const results = await Promise.all(requests);
      setInfo(results[0]);
      if (results.length > 1) {
        setPrecios(results[1]);
      }
      
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
    precios,
    cargando,
    guardando,
    error,
    mensajeExito,
    guardarInformacion,
    recargar: cargarInformacion,
  };
}
