import { usePisos } from '../hooks/usePisos';
import { PisosGrid } from '../components/PisosGrid';
import { PisoModal } from '../components/PisoModal';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Building2, Layers, CheckCircle } from 'lucide-react';

export function PisosPage() {
  const {
    pisos,
    cargando,
    error,
    modalPisoAbierto,
    setModalPisoAbierto,
    pisoAEditar,
    setPisoAEditar,
    guardarPiso,
    eliminarPiso,
    recargar,
  } = usePisos();

  if (cargando) {
    return <Loading mensaje="Cargando niveles y distribución de pisos..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Pisos e Infraestructura del Hotel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribución física en 5 niveles de servicio, áreas operativas y puntos de aseo (hotel-cucuta.pdf).
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setPisoAEditar(null);
            setModalPisoAbierto(true);
          }}
          icono={<Plus className="w-4 h-4" />}
        >
          Agregar Nivel
        </Button>
      </div>

      {/* Resumen de Infraestructura */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Edificación Principal
            </span>
            <div className="text-xl font-display font-bold text-slate-900 tracking-tight">
              {pisos.length} Niveles Físicos
            </div>
            <span className="text-[10px] text-slate-400">Distribución operativa del hotel</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Capacidad de Alojamiento
            </span>
            <div className="text-xl font-display font-bold text-slate-900 tracking-tight">
              45 Habitaciones
            </div>
            <span className="text-[10px] text-slate-400">Pisos 1 al 4 (hotel-cucuta.pdf)</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50/80 text-red-600 border border-red-200/50 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Planta Textil Propia
            </span>
            <div className="text-xl font-display font-bold text-slate-900 tracking-tight">
              Piso 5 Operativo
            </div>
            <span className="text-[10px] text-slate-400">Lavandería central & lencería</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Listado de Pisos */}
      <PisosGrid
        pisos={pisos}
        onEditar={(p) => {
          setPisoAEditar(p);
          setModalPisoAbierto(true);
        }}
        onEliminar={eliminarPiso}
      />

      {/* Modal */}
      <PisoModal
        isOpen={modalPisoAbierto}
        piso={pisoAEditar}
        onClose={() => {
          setModalPisoAbierto(false);
          setPisoAEditar(null);
        }}
        onSubmit={guardarPiso}
      />
    </div>
  );
}
