import { useState } from 'react';
import { useFacturacion } from '../hooks/useFacturacion';
import { CajaControlCard } from '../components/CajaControlCard';
import { FacturasTable } from '../components/FacturasTable';
import { EgresosTable } from '../components/EgresosTable';
import { RegistrarAbonoModal } from '../components/RegistrarAbonoModal';
import { RegistrarEgresoModal } from '../components/RegistrarEgresoModal';
import { CajaModal } from '../components/CajaModal';
import { FacturaDetalleModal } from '../components/FacturaDetalleModal';
import { EmitirFacturaModal } from '../components/EmitirFacturaModal';
import { CuentaFolioModal } from '../components/CuentaFolioModal';
import { RegistrarConsumoModal } from '../components/RegistrarConsumoModal';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Search, DollarSign, FileText, AlertCircle, RefreshCw, CheckCircle2, ArrowDownCircle, Download } from 'lucide-react';
import { exportarLibroFacturas, exportarLibroEgresos } from '../utils/exportadorContable';

export function FacturacionPage() {
  const {
    facturas,
    turnoCaja,
    egresos,
    estadias,
    cargando,
    error,
    metricas,
    filtroEstado,
    setFiltroEstado,
    filtroFecha,
    setFiltroFecha,
    limite,
    setLimite,
    pagina,
    setPagina,
    paginacion,
    busqueda,
    setBusqueda,
    modalAbonoAbierto,
    setModalAbonoAbierto,
    modalEgresoAbierto,
    setModalEgresoAbierto,
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
    registrarEgreso,
    emitirFacturaEstadia,
    remitirDian,
    verCuentaFolio,
    recargar,
  } = useFacturacion();

  const [modalEmitirAbierto, setModalEmitirAbierto] = useState(false);
  const [modalConsumoAbierto, setModalConsumoAbierto] = useState(false);
  const [estadiaPreseleccionadaId, setEstadiaPreseleccionadaId] = useState<number | null>(null);
  const [vistaTab, setVistaTab] = useState<'facturas' | 'folios' | 'egresos'>('facturas');

  const handleAbrirConsumo = (estadiaId?: number) => {
    setEstadiaPreseleccionadaId(estadiaId || null);
    setModalConsumoAbierto(true);
  };

  const handleAbrirAbono = (estadiaId?: number) => {
    setEstadiaPreseleccionadaId(estadiaId || null);
    setModalAbonoAbierto(true);
  };

  const handleAbrirEgreso = () => {
    setModalEgresoAbierto(true);
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
            Turnos de caja, egresos menores, recaudos en efectivo, folios centralizados y resoluciones DIAN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            onClick={() => {
              if (vistaTab === 'egresos') {
                exportarLibroEgresos(egresos);
              } else {
                exportarLibroFacturas(facturas);
              }
            }}
            title="Exportar libro contable actual a Excel (.csv UTF-8)"
            icono={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Exportar Excel
          </Button>

          {turnoCaja?.estado === 'abierta' && (
            <Button
              variant="outline"
              size="md"
              onClick={handleAbrirEgreso}
              icono={<ArrowDownCircle className="w-4 h-4 text-rose-600" />}
            >
              Registrar Egreso
            </Button>
          )}

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
        onRegistrarEgreso={handleAbrirEgreso}
      />

      {/* Métricas Financieras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Facturado
            </span>
            <div className="text-2xl font-display font-bold text-slate-900">
              ${metricas.totalFacturado.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {metricas.totalFacturas} comprobantes emitidos
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center shadow-soft-xs">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Saldos Pendientes
            </span>
            <div
              className={`text-2xl font-display font-bold ${
                metricas.totalPendiente === 0 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              ${metricas.totalPendiente.toLocaleString('es-CO')}
            </div>
            <span
              className={`text-[11px] mt-0.5 block ${
                metricas.totalPendiente === 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'
              }`}
            >
              {metricas.totalPendiente === 0 ? 'Al día' : 'Por recaudar en recepción'}
            </span>
          </div>
          <div
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-soft-xs ${
              metricas.totalPendiente === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            {metricas.totalPendiente === 0 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Recaudos Turno Activo
            </span>
            <div className="text-2xl font-display font-bold text-emerald-700">
              ${metricas.totalRecaudadoCaja.toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {turnoCaja?.estado === 'abierta' ? 'Cobros en efectivo' : 'Turno cerrado'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shadow-soft-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block mb-1">
              Egresos Caja Menor
            </span>
            <div className="text-2xl font-display font-bold text-rose-700">
              ${(metricas.totalEgresosCaja || 0).toLocaleString('es-CO')}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {egresos.length} gasto(s) registrados
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center justify-center shadow-soft-xs">
            <ArrowDownCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pestañas de Vista */}
      <div className="flex gap-6 border-b border-slate-200/80 mb-6 mt-4 px-2">
        <button
          onClick={() => setVistaTab('facturas')}
          className={`pb-3 text-sm font-medium transition-colors relative ${vistaTab === 'facturas' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Facturas Emitidas
          {vistaTab === 'facturas' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setVistaTab('folios')}
          className={`pb-3 text-sm font-medium transition-colors relative ${vistaTab === 'folios' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Cuentas en Curso (Folios)
          {vistaTab === 'folios' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setVistaTab('egresos')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${vistaTab === 'egresos' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Egresos y Gastos Menores
          {egresos.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
              {egresos.length}
            </span>
          )}
          {vistaTab === 'egresos' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-t-full" />}
        </button>
      </div>

      {vistaTab === 'facturas' && (
        <>
          {/* Barra de Filtros y Búsqueda de Facturas */}
          <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-soft mb-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
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

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filtroFecha}
                  onChange={(e) => { setFiltroFecha(e.target.value as 'hoy' | 'todas'); setPagina(1); }}
                  className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all appearance-none"
                >
                  <option value="hoy">Hoy</option>
                  <option value="todas">Todas las fechas</option>
                </select>

                <select
                  value={limite}
                  onChange={(e) => setLimite(Number(e.target.value))}
                  className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all appearance-none"
                >
                  <option value="10">10 por página</option>
                  <option value="50">50 por página</option>
                  <option value="100">100 por página</option>
                  <option value="500">500 por página</option>
                </select>

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
            </div>
          </div>

          <FacturasTable
            facturas={facturas}
            onVerDetalle={(f) => setFacturaSeleccionada(f)}
            onVerFolio={(id) => verCuentaFolio(id)}
            onEmitirFactura={() => handleAbrirEmitir()}
          />

          {/* Paginación */}
          {paginacion && paginacion.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <span className="text-xs text-slate-500 font-medium">
                Página {paginacion.current_page} de {paginacion.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina((p) => Math.min(paginacion.last_page, p + 1))}
                disabled={pagina === paginacion.last_page}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {vistaTab === 'folios' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/80 font-medium">
                <tr>
                  <th className="py-3 px-4">Estadía / Hab.</th>
                  <th className="py-3 px-4">Huésped Titular</th>
                  <th className="py-3 px-4 text-right">Cargos Totales</th>
                  <th className="py-3 px-4 text-right">Saldo Pendiente</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estadias.filter(e => e.estado === 'activa').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No hay cuentas en curso activas</td>
                  </tr>
                ) : estadias.filter(e => e.estado === 'activa').map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold block">{e.codigo_estadia}</span>
                      <span className="text-[10px] text-slate-400">Hab. {e.habitacion_numero || e.habitacion_id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{e.huesped ? `${e.huesped.nombres} ${e.huesped.apellidos}` : 'Huésped'}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                      ${(e.total || 0).toLocaleString('es-CO')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      {(e.saldo_pendiente || 0) > 0 ? (
                        <span className="text-amber-600 font-mono">
                          ${(e.saldo_pendiente || 0).toLocaleString('es-CO')}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-mono">
                          $0 (Al día)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => verCuentaFolio(e.id)} className="px-2 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors text-[11px]">Ver Folio & Consumos</button>
                        <button onClick={() => handleAbrirEmitir(e.id)} className="px-2 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-[11px]">Emitir Factura</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaTab === 'egresos' && (
        <EgresosTable
          egresos={egresos}
          onRegistrarEgreso={handleAbrirEgreso}
          cajaAbierta={turnoCaja?.estado === 'abierta'}
        />
      )}

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

      <RegistrarEgresoModal
        isOpen={modalEgresoAbierto}
        saldoDisponible={turnoCaja?.saldo_esperado ?? turnoCaja?.total_efectivo ?? 0}
        onClose={() => setModalEgresoAbierto(false)}
        onSubmit={registrarEgreso}
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
        onRemitirDian={remitirDian}
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
        onRegistrarConsumo={(id) => handleAbrirConsumo(id)}
      />

      <RegistrarConsumoModal
        isOpen={modalConsumoAbierto}
        estadiaId={estadiaPreseleccionadaId}
        onClose={() => {
          setModalConsumoAbierto(false);
          setEstadiaPreseleccionadaId(null);
        }}
        onSuccess={() => {
          if (folioSeleccionado) verCuentaFolio(folioSeleccionado.estadia_id);
          recargar();
        }}
      />
    </div>
  );
}
