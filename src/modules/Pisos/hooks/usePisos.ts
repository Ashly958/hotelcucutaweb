import { useState, useEffect, useCallback } from 'react';
import { pisosService } from '../services/pisosService';
import type { Piso, GuardarPisoDTO } from '../types/piso.types';

export function usePisos() {
  const [pisos, setPisos] = useState<Piso[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalPisoAbierto, setModalPisoAbierto] = useState<boolean>(false);
  const [pisoAEditar, setPisoAEditar] = useState<Piso | null>(null);

  const cargarPisos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await pisosService.obtenerTodos();
      setPisos(data);
    } catch {
      setError('No fue posible cargar la información de pisos e infraestructura.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPisos();
  }, [cargarPisos]);

  const guardarPiso = async (datos: GuardarPisoDTO): Promise<boolean> => {
    try {
      if (pisoAEditar) {
        await pisosService.actualizar(pisoAEditar.id, datos);
      } else {
        await pisosService.crear(datos);
      }
      await cargarPisos();
      setModalPisoAbierto(false);
      setPisoAEditar(null);
      return true;
    } catch {
      setError('Error al guardar el piso.');
      return false;
    }
  };

  const eliminarPiso = async (id: number): Promise<boolean> => {
    try {
      await pisosService.eliminar(id);
      await cargarPisos();
      return true;
    } catch {
      setError('Error al eliminar el piso.');
      return false;
    }
  };

  return {
    pisos,
    cargando,
    error,
    modalPisoAbierto,
    setModalPisoAbierto,
    pisoAEditar,
    setPisoAEditar,
    guardarPiso,
    eliminarPiso,
    recargar: cargarPisos,
  };
}
