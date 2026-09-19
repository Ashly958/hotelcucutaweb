import { useState, useEffect, useMemo, useCallback } from 'react';
import { usuariosService } from '../services/usuariosService';
import type { UsuarioSistema, GuardarUsuarioDTO } from '../types/usuario.types';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Modales
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState<boolean>(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<UsuarioSistema | null>(null);

  const [modalClaveAbierto, setModalClaveAbierto] = useState<boolean>(false);
  const [usuarioParaClave, setUsuarioParaClave] = useState<UsuarioSistema | null>(null);

  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await usuariosService.obtenerTodos();
      setUsuarios(data);
    } catch {
      setError('No fue posible cargar el listado de usuarios.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroRol !== 'todos') {
        const rolU = String(u.rol || '').toUpperCase();
        if (filtroRol === 'ADMIN' && !rolU.includes('ADMIN')) return false;
        if (filtroRol === 'RECEPCION' && !rolU.includes('RECEP')) return false;
        if (filtroRol === 'LAVANDERIA' && !rolU.includes('LAVAND') && !rolU.includes('LIMPIE')) return false;
        if (filtroRol === 'MANTENIMIENTO' && !rolU.includes('MANTEN')) return false;
      }
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const nom = (u.nombre_completo || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return nom.includes(q) || email.includes(q);
      }
      return true;
    });
  }, [usuarios, filtroRol, busqueda]);

  const guardarUsuario = async (datos: GuardarUsuarioDTO): Promise<boolean> => {
    try {
      if (usuarioAEditar) {
        await usuariosService.actualizar(usuarioAEditar.id, datos);
      } else {
        await usuariosService.crear(datos);
      }
      await cargarUsuarios();
      setModalUsuarioAbierto(false);
      setUsuarioAEditar(null);
      return true;
    } catch {
      setError('Error al guardar datos del usuario.');
      return false;
    }
  };

  const alternarEstado = async (id: number): Promise<boolean> => {
    try {
      await usuariosService.alternarInactivar(id);
      await cargarUsuarios();
      return true;
    } catch {
      setError('Error al cambiar el estado del usuario.');
      return false;
    }
  };

  const eliminarUsuario = async (id: number): Promise<boolean> => {
    try {
      await usuariosService.eliminar(id);
      await cargarUsuarios();
      return true;
    } catch {
      setError('Error al eliminar usuario.');
      return false;
    }
  };

  const cambiarClave = async (password: string): Promise<boolean> => {
    if (!usuarioParaClave) return false;
    try {
      await usuariosService.cambiarClave(usuarioParaClave.id, { password });
      setModalClaveAbierto(false);
      setUsuarioParaClave(null);
      return true;
    } catch {
      setError('Error al cambiar la contraseña.');
      return false;
    }
  };

  return {
    usuarios: usuariosFiltrados,
    todosLosUsuarios: usuarios,
    cargando,
    error,
    filtroRol,
    setFiltroRol,
    busqueda,
    setBusqueda,
    modalUsuarioAbierto,
    setModalUsuarioAbierto,
    usuarioAEditar,
    setUsuarioAEditar,
    modalClaveAbierto,
    setModalClaveAbierto,
    usuarioParaClave,
    setUsuarioParaClave,
    guardarUsuario,
    alternarEstado,
    eliminarUsuario,
    cambiarClave,
    recargar: cargarUsuarios,
  };
}
