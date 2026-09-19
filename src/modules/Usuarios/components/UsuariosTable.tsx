import { Edit, Trash2, Key, UserCheck, UserX, Shield } from 'lucide-react';
import type { UsuarioSistema } from '../types/usuario.types';
import { EmptyState } from '@/components/EmptyState';

interface UsuariosTableProps {
  usuarios: UsuarioSistema[];
  onEditar: (u: UsuarioSistema) => void;
  onAlternarEstado: (id: number) => void;
  onEliminar: (id: number) => void;
  onCambiarClave: (u: UsuarioSistema) => void;
  onCrearUsuario: () => void;
}

export function UsuariosTable({
  usuarios,
  onEditar,
  onAlternarEstado,
  onEliminar,
  onCambiarClave,
  onCrearUsuario,
}: UsuariosTableProps) {
  if (usuarios.length === 0) {
    return (
      <EmptyState
        titulo="No se encontraron usuarios"
        descripcion="No hay cuentas de usuario que coincidan con la búsqueda o filtro."
        textoAccion="Registrar Primer Usuario"
        onAccion={onCrearUsuario}
      />
    );
  }

  const rolesBadge: Record<string, { label: string; class: string }> = {
    ADMIN: { label: 'Administrador General', class: 'bg-amber-50 text-amber-800 border-amber-200' },
    administrador: { label: 'Administrador General', class: 'bg-amber-50 text-amber-800 border-amber-200' },
    RECEPCION: { label: 'Recepción', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    recepcionista: { label: 'Recepción', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    LAVANDERIA: { label: 'Lavandería P5', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    personal_limpieza: { label: 'Lavandería P5', class: 'bg-blue-50 text-blue-700 border-blue-200' },
    MANTENIMIENTO: { label: 'Mantenimiento', class: 'bg-purple-50 text-purple-700 border-purple-200' },
    personal_mantenimiento: { label: 'Mantenimiento', class: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="py-3 px-4">Nombre Completo</th>
              <th className="py-3 px-4">Correo Electrónico</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4">Rol Asignado</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((u) => {
              const rolInfo =
                rolesBadge[u.rol as keyof typeof rolesBadge] || {
                  label: u.rol,
                  class: 'bg-slate-100 text-slate-700 border-slate-200',
                };

              return (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {u.nombre_completo}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>

                  <td className="py-3.5 px-4 text-slate-500">{u.telefono || '-'}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${rolInfo.class}`}
                    >
                      <Shield className="w-3 h-3" />
                      {rolInfo.label}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {u.activo ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <UserX className="w-3 h-3" />
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onCambiarClave(u)}
                        title="Cambiar contraseña"
                        className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditar(u)}
                        title="Editar datos del usuario"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAlternarEstado(u.id)}
                        title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.activo
                            ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar al usuario ${u.nombre_completo}?`)) {
                            onEliminar(u.id);
                          }
                        }}
                        title="Eliminar usuario"
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
