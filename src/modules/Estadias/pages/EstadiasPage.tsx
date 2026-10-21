import { useEstadias } from '../hooks/useEstadias';
import { EstadiasTable } from '../components/EstadiasTable';
import { CheckInModal } from '../components/CheckInModal';
import { EstadiaDetalleModal } from '../components/EstadiaDetalleModal';
import { InformeHuespedModal } from '../components/InformeHuespedModal';
import { EmitirFacturaModal } from '@/modules/Facturacion/components/EmitirFacturaModal';
import { CuentaFolioModal } from '@/modules/Facturacion/components/CuentaFolioModal';
import { RegistrarAbonoModal } from '@/modules/Facturacion/components/RegistrarAbonoModal';
import { RegistrarConsumoModal } from '@/modules/Facturacion/components/RegistrarConsumoModal';
import { facturacionService } from '@/modules/Facturacion/services/facturacionService';
import type { CuentaCentralizadaEstadia, RegistrarRecaudoDTO } from '@/modules/Facturacion/types/facturacion.types';
import { alertaService } from '@/utils/alertaService';
import { useState } from 'react';
import { Loading, ErrorState, Button } from '@/components';
import { Plus, Search, Users, CalendarCheck, DollarSign } from 'lucide-react';

export function EstadiasPage() {
  const {
    estadias,
    todasLasEstadias,
    cargando,
    error,
    metricas,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    modalCheckInAbierto,
    setModalCheckInAbierto,
    modalDetalleAbierto,
    setModalDetalleAbierto,
    estadiaSeleccionada,
    modalFacturacionAbierto,
    setModalFacturacionAbierto,
    estadiaIdFacturar,
    abrirDetalle,
    registrarCheckIn,
    realizarCheckOut,
    emitirFactura,
    recargar,
  } = useEstadias();

  const [modalFolioAbierto, setModalFolioAbierto] = useState(false);
  const [folioActual, setFolioActual] = useState<CuentaCentralizadaEstadia | null>(null);

  const [modalConsumoAbierto, setModalConsumoAbierto] = useState(false);
  const [estadiaIdOperacion, setEstadiaIdOperacion] = useState<number | null>(null);
  const [estadiaIdInforme, setEstadiaIdInforme] = useState<number | null>(null);

  // Modal para liquidar abono cuando hay saldo pendiente
  const [modalAbonoAbierto, setModalAbonoAbierto] = useState(false);
  const [estadiaIdAbono, setEstadiaIdAbono] = useState<number | null>(null);

  const handleAbrirAbono = (estadiaId: number) => {
    setEstadiaIdAbono(estadiaId);
    setModalAbonoAbierto(true);
  };

  const handleRegistrarAbono = async (datos: RegistrarRecaudoDTO): Promise<boolean> => {
    try {
      await facturacionService.registrarRecaudo(datos);
      await recargar();
      alertaService.exito('Abono Registrado', 'El pago ha sido registrado correctamente.');
      return true;
    } catch (err: any) {
      alertaService.error('Error al registrar abono', err?.response?.data?.message || 'No fue posible registrar el abono.');
      return false;
    }
  };

  const handleCheckOut = async (id: number): Promise<boolean> => {
    const est = todasLasEstadias.find((e) => e.id === id);
    const habNum = est?.habitacion_numero || String(est?.habitacion_id || '');
    const cod = est?.codigo_estadia || `ID ${id}`;

    // Confirmación interactiva antes de proceder
    const confirm = await alertaService.confirmarCheckOut(cod, habNum);
    if (!confirm.isConfirmed) return false;

    return await realizarCheckOut(id, handleAbrirAbono);
  };

  const handleVerFolio = async (estadiaId: number) => {
    setModalDetalleAbierto(false);
    try {
      const data = await facturacionService.obtenerCuentaEstadia(estadiaId);
      setFolioActual(data);
      setModalFolioAbierto(true);
    } catch (err) {
      alertaService.error('Error de Consulta', 'No se pudo obtener la cuenta centralizada de la estadía.');
    }
  };

  const handleAbrirRegistrarConsumo = (estadiaId: number) => {
    setEstadiaIdOperacion(estadiaId);
    setModalConsumoAbierto(true);
  };

  if (cargando) {
    return <Loading mensaje="Cargando registro de estadías..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Control de Estadías & Check-In
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de huéspedes, acompañantes y liquidación de salidas.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalCheckInAbierto(true)}
          icono={<Plus className="w-4 h-4" />}
        >
          Nuevo Check-In
        </Button>
      </div>

      {/* Tarjetas de Resumen Operativo Suaves */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Estadías Activas
            </span>
            <div className="text-3xl font-display font-bold text-slate-900">
              {metricas.activas}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shadow-soft-xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Finalizadas
            </span>
            <div className="text-3xl font-display font-bold text-slate-700">
              {metricas.finalizadas}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200/60 flex items-center justify-center shadow-soft-xs">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-soft flex items-center justify-between col-span-2">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Saldo Pendiente por Liquidar (Activas)
            </span>
            <div className="text-3xl font-display font-bold text-red-700">
              ${metricas.saldoPendienteTotal.toLocaleString('es-CO')} COP
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-200/60 flex items-center justify-center shadow-soft-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Pestañas de Estado */}
        <div className="flex gap-1.5 w-full sm:w-auto">
          {(
            [
              { id: 'activa', label: `Activas (${metricas.activas})` },
              { id: 'finalizada', label: `Historial (${metricas.finalizadas})` },
              { id: 'todas', label: `Todas (${metricas.total})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroEstado(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtroEstado === tab.id
                  ? 'bg-red-50 text-red-700 border border-red-200 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, huésped, hab..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Tabla de Estadías */}
      <EstadiasTable
        estadias={estadias}
        onVerDetalle={abrirDetalle}
        onCheckOut={handleCheckOut}
        onNuevoCheckIn={() => setModalCheckInAbierto(true)}
        onImprimirInforme={(id) => setEstadiaIdInforme(id)}
      />

      {/* Modales */}
      <CheckInModal
        isOpen={modalCheckInAbierto}
        onClose={() => setModalCheckInAbierto(false)}
        onSubmit={registrarCheckIn}
      />

      <EstadiaDetalleModal
        isOpen={modalDetalleAbierto}
        estadia={estadiaSeleccionada}
        onClose={() => setModalDetalleAbierto(false)}
        onCheckOut={handleCheckOut}
        onVerFolio={handleVerFolio}
        onEstadiaActualizada={recargar}
        onImprimirInforme={(id) => {
          setModalDetalleAbierto(false);
          setEstadiaIdInforme(id);
        }}
      />

      <InformeHuespedModal
        isOpen={estadiaIdInforme !== null}
        estadiaId={estadiaIdInforme}
        onClose={() => setEstadiaIdInforme(null)}
      />

      <EmitirFacturaModal
        isOpen={modalFacturacionAbierto}
        estadias={estadias}
        estadiaInicialId={estadiaIdFacturar}
        onClose={() => setModalFacturacionAbierto(false)}
        onSubmit={emitirFactura}
      />

      <CuentaFolioModal
        isOpen={modalFolioAbierto}
        folio={folioActual}
        onClose={() => setModalFolioAbierto(false)}
        onRegistrarConsumo={handleAbrirRegistrarConsumo}
      />

      <RegistrarConsumoModal
        isOpen={modalConsumoAbierto}
        estadiaId={estadiaIdOperacion}
        onClose={() => setModalConsumoAbierto(false)}
        onSuccess={() => {
          if (estadiaIdOperacion) handleVerFolio(estadiaIdOperacion);
          recargar();
        }}
      />

      {/* Modal para pagar / registrar abono ante saldo pendiente en Check-Out */}
      <RegistrarAbonoModal
        isOpen={modalAbonoAbierto}
        estadias={todasLasEstadias}
        estadiaInicialId={estadiaIdAbono}
        onClose={() => {
          setModalAbonoAbierto(false);
          setEstadiaIdAbono(null);
        }}
        onSubmit={handleRegistrarAbono}
      />
    </div>
  );
}
