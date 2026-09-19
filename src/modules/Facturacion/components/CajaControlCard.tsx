import { ShieldCheck, AlertCircle, Unlock, Lock, DollarSign } from 'lucide-react';
import { Button } from '@/components/Button';
import type { TurnoCaja } from '../types/facturacion.types';

interface CajaControlCardProps {
  caja: TurnoCaja | null;
  onAbrirCaja: () => void;
  onCerrarCaja: () => void;
  onRegistrarAbono: () => void;
}

export function CajaControlCard({
  caja,
  onAbrirCaja,
  onCerrarCaja,
  onRegistrarAbono,
}: CajaControlCardProps) {
  const estaAbierta = caja?.estado === 'abierta';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              estaAbierta
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {estaAbierta ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                Turno de Caja de Recepción
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  estaAbierta
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}
              >
                {estaAbierta ? 'Caja Abierta' : 'Caja Cerrada'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {estaAbierta
                ? `Apertura registrada el ${caja?.fecha_apertura || 'hoy'}`
                : 'Turno cerrado. Realice la apertura para habilitar cobros en efectivo.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {estaAbierta ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={onRegistrarAbono}
                icono={<DollarSign className="w-3.5 h-3.5" />}
              >
                Registrar Recibo / Abono
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCerrarCaja}
                icono={<Lock className="w-3.5 h-3.5" />}
              >
                Cerrar Turno
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onAbrirCaja}
              icono={<Unlock className="w-3.5 h-3.5" />}
            >
              Abrir Turno de Caja
            </Button>
          )}
        </div>
      </div>

      {/* Indicadores Financieros de Caja */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
            Base Inicial en Caja
          </span>
          <div className="text-lg font-display font-bold text-slate-800">
            ${(caja?.base_inicial || 0).toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-slate-400">Efectivo inicial</span>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
            Recaudos del Turno
          </span>
          <div className="text-lg font-display font-bold text-emerald-700">
            ${(caja?.total_recaudado || 0).toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-slate-400">Cobros recibidos</span>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
            Saldo Total Esperado
          </span>
          <div className="text-lg font-display font-bold text-slate-900">
            ${(caja?.saldo_esperado || 0).toLocaleString('es-CO')}
          </div>
          <span className="text-[10px] text-slate-400">Base + Recaudos</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">
            Auditoría & Arqueo
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
            {caja?.diferencia !== undefined && caja.diferencia !== 0 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono text-amber-600">
                  Dif: ${caja.diferencia.toLocaleString('es-CO')}
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Cuadrada</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Cierre de arqueo</span>
        </div>
      </div>
    </div>
  );
}
