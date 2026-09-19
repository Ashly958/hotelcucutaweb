import { useUsuarios } from '../hooks/useUsuarios';
import { UsuariosTable } from '../components/UsuariosTable';
import { UsuarioModal } from '../components/UsuarioModal';
import { CambiarClaveModal } from '../components/CambiarClaveModal';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Search, Users, ShieldCheck, UserCheck } from 'lucide-react';

export function UsuariosPage() {
  const {
    usuarios,
    todosLosUsuarios,
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
    recargar,
  } = useUsuarios();

  if (cargando) {
    return <Loading mensaje="Cargando directorio de usuarios y permisos..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  const totalActivos = todosLosUsuarios.filter((u) => u.activo).length;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Control de Usuarios, Roles & Seguridad
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administración de cuentas de acceso, roles asignados y credenciales seguras (RF-023, RN-014).
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setUsuarioAEditar(null);
            setModalUsuarioAbierto(true);
          }}
          icono={<Plus className="w-4 h-4" />}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Resumen de Accesos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Usuarios Registrados
            </span>
            <div className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              {todosLosUsuarios.length}
            </div>
            <span className="text-[10px] text-slate-400">Personal del hotel</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Cuentas Activas
            </span>
            <div className="text-2xl font-display font-bold text-emerald-600 tracking-tight">
              {totalActivos}
            </div>
            <span className="text-[10px] text-slate-400">Con acceso autorizado</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Roles Configurados
            </span>
            <div className="text-2xl font-display font-bold text-amber-600 tracking-tight">
              4 Roles
            </div>
            <span className="text-[10px] text-slate-400">Admin, Recepción, Lavandería, Mantenimiento</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex gap-1.5 w-full sm:w-auto">
          {[
            { id: 'todos', label: 'Todos los Roles' },
            { id: 'ADMIN', label: 'Admin' },
            { id: 'RECEPCION', label: 'Recepción' },
            { id: 'LAVANDERIA', label: 'Lavandería' },
            { id: 'MANTENIMIENTO', label: 'Mantenimiento' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroRol(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtroRol === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <UsuariosTable
        usuarios={usuarios}
        onEditar={(u) => {
          setUsuarioAEditar(u);
          setModalUsuarioAbierto(true);
        }}
        onAlternarEstado={alternarEstado}
        onEliminar={eliminarUsuario}
        onCambiarClave={(u) => {
          setUsuarioParaClave(u);
          setModalClaveAbierto(true);
        }}
        onCrearUsuario={() => {
          setUsuarioAEditar(null);
          setModalUsuarioAbierto(true);
        }}
      />

      {/* Modales */}
      <UsuarioModal
        isOpen={modalUsuarioAbierto}
        usuario={usuarioAEditar}
        onClose={() => {
          setModalUsuarioAbierto(false);
          setUsuarioAEditar(null);
        }}
        onSubmit={guardarUsuario}
      />

      <CambiarClaveModal
        isOpen={modalClaveAbierto}
        usuario={usuarioParaClave}
        onClose={() => {
          setModalClaveAbierto(false);
          setUsuarioParaClave(null);
        }}
        onSubmit={cambiarClave}
      />
    </div>
  );
}
