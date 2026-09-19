import { useState } from 'react';
import { useFacturacion } from '../hooks/useFacturacion';
import { CajaControlCard } from '../components/CajaControlCard';
import { FacturasTable } from '../components/FacturasTable';
import { RegistrarAbonoModal } from '../components/RegistrarAbonoModal';
import { CajaModal } from '../components/CajaModal';
import { FacturaDetalleModal } from '../components/FacturaDetalleModal';
import { EmitirFacturaModal } from '../components/EmitirFacturaModal';
import { CuentaFolioModal } from '../components/CuentaFolioModal';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Search, DollarSign, FileText, AlertCircle, RefreshCw } from 'lucide-react';

export function FacturacionPage() {
  const {
    facturas,
    turnoCaja,
    estadias,
    cargando,
    error,
    metricas,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    modalAbonoAbierto,
    setModalAbonoAbierto,
    modalAbrirCajaAbierto,
    setModalAbrirCajaAbierto,
    modalCerrarCajaAbierto,
    setModalCerrarCajaAbierto,
    facturaSeleccionada,
    setFacturaSeleccionada,
    folioSeleccionado,
    setFolioSeleccionado,
    abrirCaja,
    cerrarCaja,
    registrarAbono,
    emitirFacturaEstadia,
    verCuentaFolio,
    recargar,
  } = useFacturacion();

  const [modalEmitirAbierto, setModalEmitirAbierto] = useState(false);
  const [estadiaPreseleccionadaId, setEstadiaPreseleccionadaId] = useState<number | null>(null);

  const handleAbrirAbono = (estadiaId?: number) => {
    setEstadiaPreseleccionadaId(estadiaId || null);
    setModalAbonoAbierto(true);
  };

  const handleAbrirEmitir = (estadiaId?: number) => {
    setEstadiaPreseleccionadaId(estadiaId || null);
    setModalEmitirAbierto(true);
  };

  if (cargando) {
    return <Loading mensaje="Cargando módulo de facturación, caja y recaudos..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Facturación, Caja y Recaudos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnos de caja, recaudos en efectivo, folios centralizados y resoluciones DIAN (RF-019, RF-020, RN-010).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={recargar}
            title="Recargar datos"
            icono={<RefreshCw className="w-4 h-4" />}
          >
            Actualizar
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => handleAbrirAbono()}
            icono={<DollarSign className="w-4 h-4 text-emerald-600" />}
          >
            Registrar Abono
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => handleAbrirEmitir()}
            icono={<Plus className="w-4 h-4" />}
          >
            Emitir Factura DIAN
          </Button>
        </div>
      </div>

      {/* Control de Caja de Turno */}
      <CajaControlCard
        caja={turnoCaja}
        onAbrirCaja={() => setModalAbrirCajaAbierto(true)}
        onCerrarCaja={() => setModalCerrarCajaAbierto(true)}
        onRegistrarAbono={() => handleAbrirAbono()}
      />

      {/* Métricas Financieras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Facturado
            </span>
            <div className="text-3xl font-display font-bold text-slate-900">
              ${metricas.totalFacturado.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {metricas.totalFacturas} comprobantes emitidos
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center shadow-soft-xs">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Saldos Pendientes
            </span>
            <div className="text-3xl font-display font-bold text-amber-700">
              ${metricas.totalPendiente.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Por recaudar en recepción</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shadow-soft-xs">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Recaudos Turno Activo
            </span>
            <div className="text-3xl font-display font-bold text-emerald-700">
              ${metricas.totalRecaudadoCaja.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {turnoCaja?.estado === 'abierta' ? 'En gaveta de recepción' : 'Turno cerrado'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shadow-soft-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda de Facturas */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-soft">
        <div className="flex gap-1.5 w-full sm:w-auto">
          {(
            [
              { id: 'todas', label: `Todas (${metricas.totalFacturas})` },
              { id: 'pagada', label: 'Pagadas' },
              { id: 'pendiente', label: 'Pendientes' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroEstado(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtroEstado === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
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
            placeholder="Buscar por N° factura, cliente o C.C..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tabla de Facturas */}
      <FacturasTable
        facturas={facturas}
        onVerDetalle={(f) => setFacturaSeleccionada(f)}
        onVerFolio={(id) => verCuentaFolio(id)}
        onEmitirFactura={() => handleAbrirEmitir()}
      />

      {/* Modales */}
      <RegistrarAbonoModal
        isOpen={modalAbonoAbierto}
        estadias={estadias.filter((e) => e.estado === 'activa')}
        estadiaInicialId={estadiaPreseleccionadaId}
        onClose={() => {
          setModalAbonoAbierto(false);
          setEstadiaPreseleccionadaId(null);
        }}
        onSubmit={registrarAbono}
      />

      <CajaModal
        isOpen={modalAbrirCajaAbierto}
        modo="abrir"
        caja={turnoCaja}
        onClose={() => setModalAbrirCajaAbierto(false)}
        onAbrir={abrirCaja}
        onCerrar={cerrarCaja}
      />

      <CajaModal
        isOpen={modalCerrarCajaAbierto}
        modo="cerrar"
        caja={turnoCaja}
        onClose={() => setModalCerrarCajaAbierto(false)}
        onAbrir={abrirCaja}
        onCerrar={cerrarCaja}
      />

      <FacturaDetalleModal
        isOpen={!!facturaSeleccionada}
        factura={facturaSeleccionada}
        onClose={() => setFacturaSeleccionada(null)}
      />

      <EmitirFacturaModal
        isOpen={modalEmitirAbierto}
        estadias={estadias}
        estadiaInicialId={estadiaPreseleccionadaId}
        onClose={() => {
          setModalEmitirAbierto(false);
          setEstadiaPreseleccionadaId(null);
        }}
        onSubmit={emitirFacturaEstadia}
      />

      <CuentaFolioModal
        isOpen={!!folioSeleccionado}
        folio={folioSeleccionado}
        onClose={() => setFolioSeleccionado(null)}
        onRegistrarAbono={(id) => handleAbrirAbono(id)}
        onEmitirFactura={(id) => handleAbrirEmitir(id)}
      />
    </div>
  );
}
