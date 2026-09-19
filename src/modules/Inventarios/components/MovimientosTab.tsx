import React from 'react';
import { ArrowDownLeft, ArrowUpRight, AlertCircle, History, PackageMinus } from 'lucide-react';
import type { Movimiento, TipoMovimientoInventario } from '../types/inventario.types';
import { EmptyState } from '@/components/EmptyState';

interface MovimientosTabProps {
  movimientos: Movimiento[];
  onRegistrarMovimiento: () => void;
}

export function MovimientosTab({
  movimientos,
  onRegistrarMovimiento,
}: MovimientosTabProps) {
  if (movimientos.length === 0) {
    return (
      <EmptyState
        titulo="No hay movimientos registrados"
        descripcion="El historial de entradas y salidas de bodega se mostrará aquí."
        textoAccion="Registrar Primer Movimiento"
        onAccion={onRegistrarMovimiento}
      />
    );
  }

  const tiposInfo: Record<
    TipoMovimientoInventario,
    { label: string; clase: string; icono: React.ReactNode }
  > = {
    entrada_compra: {
      label: 'Entrada (Compra)',
      clase: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icono: <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />,
    },
    salida_consumo: {
      label: 'Consumo Estadía',
      clase: 'bg-blue-50 text-blue-700 border-blue-200/80',
      icono: <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />,
    },
    salida_consumo_huesped: {
      label: 'Consumo Estadía',
      clase: 'bg-blue-50 text-blue-700 border-blue-200/80',
      icono: <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />,
    },
    salida_dotacion: {
      label: 'Dotación Operación',
      clase: 'bg-purple-50 text-purple-700 border-purple-200/80',
      icono: <PackageMinus className="w-3.5 h-3.5 text-purple-600" />,
    },
    salida_merma: {
      label: 'Baja / Merma (RN-013)',
      clase: 'bg-red-50 text-red-700 border-red-200/80',
      icono: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
    },
    ajuste_merma: {
      label: 'Baja / Merma (RN-013)',
      clase: 'bg-red-50 text-red-700 border-red-200/80',
      icono: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
    },
    ajuste_inventario: {
      label: 'Ajuste de Conteo',
      clase: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icono: <History className="w-3.5 h-3.5 text-amber-600" />,
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-medium">
            <tr>
              <th className="py-3 px-4">Fecha y Hora</th>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Tipo de Movimiento</th>
              <th className="py-3 px-4 text-center">Cantidad</th>
              <th className="py-3 px-4 text-center">Stock Antes / Después</th>
              <th className="py-3 px-4">Motivo / Estadía / Auditoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movimientos.map((m) => {
              const tipo = (m.tipo_movimiento || m.tipoMovimiento || 'entrada_compra') as TipoMovimientoInventario;
              const info = tiposInfo[tipo] || tiposInfo.entrada_compra;
              const esEntrada = tipo === 'entrada_compra';
              const productoNombre = m.producto_nombre || m.productoNombre || `Producto #${m.producto_id || m.productoId}`;
              const usuarioNombre = m.usuario_nombre || m.usuarioNombre;
              const fecha = m.fecha_movimiento || m.created_at || 'Reciente';
              const estadiaId = m.estadia_id ?? m.estadiaId;

              return (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {fecha}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {productoNombre}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${info.clase}`}
                    >
                      {info.icono}
                      <span>{info.label}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span className={esEntrada ? 'text-emerald-600' : 'text-slate-800'}>
                      {esEntrada ? `+${m.cantidad}` : `-${m.cantidad}`}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
                    {m.stock_anterior !== undefined && m.stock_posterior !== undefined ? (
                      <span>
                        {m.stock_anterior} &rarr; <span className="font-semibold text-slate-800">{m.stock_posterior}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{m.motivo || 'Sin motivo especificado'}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {estadiaId && (
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                          Estadía #{estadiaId}
                        </span>
                      )}
                      {usuarioNombre && (
                        <span className="text-[10px] text-slate-400">
                          Por: {usuarioNombre}
                        </span>
                      )}
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
