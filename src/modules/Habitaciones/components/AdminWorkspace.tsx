import { useState } from 'react';
import {
  IconoAdmin,
  IconoDocumentoRegistro,
  IconoEfectivo,
  IconoCamaHotel,
} from '@/components';
import { Download, ShieldCheck, UserCheck } from 'lucide-react';

interface AdminWorkspaceProps {
  metricas: {
    total: number;
    disponibles: number;
    ocupadas: number;
    limpieza: number;
    mantenimiento: number;
    porcentaje: number;
  };
}

export function AdminWorkspace({ metricas }: AdminWorkspaceProps) {
  const [tabAdmin, setTabAdmin] = useState<'sire' | 'usuarios' | 'tarifas'>('sire');

  const huespedesSire = [
    {
      id: '1',
      habitacion: '04',
      nombre: 'Carlos Durán Mendoza',
      tipoDoc: 'C.C.',
      documento: '1090483921',
      nacionalidad: 'Colombiana',
      fechaIngreso: '2026-09-09',
      procedencia: 'Bucaramanga',
      destino: 'San Cristóbal',
    },
    {
      id: '2',
      habitacion: '08',
      nombre: 'María Elena Ruiz',
      tipoDoc: 'C.E.',
      documento: '58492019',
      nacionalidad: 'Venezolana',
      fechaIngreso: '2026-09-08',
      procedencia: 'Caracas',
      destino: 'Bogotá D.C.',
    },
    {
      id: '3',
      habitacion: '15',
      nombre: 'Juan Pablo Pérez',
      tipoDoc: 'Pasaporte',
      documento: 'PA-9382019',
      nacionalidad: 'Ecuatoriana',
      fechaIngreso: '2026-09-10',
      procedencia: 'Quito',
      destino: 'Medellín',
    },
    {
      id: '4',
      habitacion: '22',
      nombre: 'Luz Marina Gómez',
      tipoDoc: 'C.C.',
      documento: '37281902',
      nacionalidad: 'Colombiana',
      fechaIngreso: '2026-09-09',
      procedencia: 'Pamplona',
      destino: 'Cúcuta',
    },
  ];

  const usuariosSistema = [
    {
      nombre: 'Patricia Ramírez',
      email: 'admin@hotelcucuta.com',
      rol: 'Administrador General',
      estado: 'Activo',
      acceso: 'Control Total',
    },
    {
      nombre: 'Carlos Mendoza',
      email: 'recepcion@hotelcucuta.com',
      rol: 'Recepcionista',
      estado: 'Activo',
      acceso: 'Front Desk & Caja de Turno',
    },
    {
      nombre: 'Rosa Gómez',
      email: 'lavanderia@hotelcucuta.com',
      rol: 'Operario de Lavandería',
      estado: 'Activo',
      acceso: 'Piso 5 & Cobro de Prendas',
    },
    {
      nombre: 'Javier Blanco',
      email: 'mantenimiento@hotelcucuta.com',
      rol: 'Operario de Mantenimiento',
      estado: 'Activo',
      acceso: 'Equipos & Bloqueo Técnico',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Ocupación Total
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                {metricas.porcentaje}%
              </span>
              <span className="text-xs text-slate-400">45 Habitaciones</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700">
            <IconoCamaHotel size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Ingresos del Día
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-emerald-600 tracking-tight">
                ${(2240000).toLocaleString('es-CO')}
              </span>
              <span className="text-xs text-slate-400">COP</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <IconoEfectivo size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Auditoría de Turnos
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                Al Día
              </span>
              <span className="text-xs text-slate-400">Caja cerrada 06:00</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Políticas de Precio
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-amber-600 tracking-tight">
                Inmutables
              </span>
              <span className="text-xs text-slate-400">RN-011</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
            <IconoAdmin size={18} />
          </div>
        </div>
      </div>

      {/* Subnavegación de Gerencia */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTabAdmin('sire')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tabAdmin === 'sire'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Reporte SIRE & Policía Nacional (RF-008)
        </button>

        <button
          onClick={() => setTabAdmin('usuarios')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tabAdmin === 'usuarios'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Control de Usuarios & Roles (RF-023)
        </button>

        <button
          onClick={() => setTabAdmin('tarifas')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            tabAdmin === 'tarifas'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Tarifas Fijas del Hotel (RN-011)
        </button>
      </div>

      {/* TAB 1: Reporte SIRE & Policía Nacional */}
      {tabAdmin === 'sire' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Libro de Huéspedes para Autoridades (SIRE / Policía Nacional)
              </h3>
              <p className="text-xs text-slate-500">
                Registro obligatorio y exportable conforme a los requerimientos RF-008 y RF-022.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exportando archivo CSV formal para Migración Colombia (SIRE)...')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-soft-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar SIRE</span>
              </button>
              <button
                onClick={() => alert('Generando plantilla oficial para la Policía Nacional...')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-soft-xs"
              >
                <IconoDocumentoRegistro size={14} />
                <span>Policía Nacional</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Hab.</th>
                  <th className="py-2.5 px-3 font-medium">Nombre Completo</th>
                  <th className="py-2.5 px-3 font-medium">Documento</th>
                  <th className="py-2.5 px-3 font-medium">Nacionalidad</th>
                  <th className="py-2.5 px-3 font-medium">Ingreso</th>
                  <th className="py-2.5 px-3 font-medium">Procedencia</th>
                  <th className="py-2.5 px-3 font-medium">Destino</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {huespedesSire.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-display font-bold text-slate-900">{h.habitacion}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{h.nombre}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{h.tipoDoc} {h.documento}</td>
                    <td className="py-2.5 px-3 text-slate-600">{h.nacionalidad}</td>
                    <td className="py-2.5 px-3 text-slate-500">{h.fechaIngreso}</td>
                    <td className="py-2.5 px-3 text-slate-600">{h.procedencia}</td>
                    <td className="py-2.5 px-3 text-slate-600">{h.destino}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Control de Usuarios & Roles */}
      {tabAdmin === 'usuarios' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Personal Autorizado y Delimitación de Roles (RF-023)
            </h3>
            <p className="text-xs text-slate-500">
              Cada perfil opera estrictamente en su ámbito sin interferir en los demás módulos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {usuariosSistema.map((u) => (
              <div key={u.email} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900">{u.nombre}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                  <p className="text-[11px] text-slate-600 mt-1">Alcance: {u.acceso}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-800">
                    {u.rol}
                  </span>
                  <div className="flex items-center gap-1 justify-end mt-1.5 text-[10px] text-emerald-600 font-medium">
                    <UserCheck className="w-3 h-3" />
                    <span>{u.estado}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Políticas de Precios Fijas */}
      {tabAdmin === 'tarifas' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
              Política de Precios Inmutables (RN-011)
            </h3>
            <p className="text-xs text-slate-500">
              Para garantizar la transparencia, las tarifas se calculan automáticamente sin alteraciones manuales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs text-slate-500">Habitaciones con Ventilador</span>
              <div className="text-xl font-bold font-display text-slate-900 tracking-tight">$60.000 COP</div>
              <p className="text-[10px] text-slate-400">Por noche · Pisos 1 al 4</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs text-slate-500">Habitaciones con Aire Acondicionado</span>
              <div className="text-xl font-bold font-display text-slate-900 tracking-tight">$80.000 COP</div>
              <p className="text-[10px] text-slate-400">Por noche · Pisos 1 al 4</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs text-slate-500">Servicio de Lavandería</span>
              <div className="text-xl font-bold font-display text-slate-900 tracking-tight">$6.000 COP</div>
              <p className="text-[10px] text-slate-400">Por prenda · Piso 5 (RF-010)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
