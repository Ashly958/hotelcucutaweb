import { useState, useEffect, useCallback } from 'react';
import { parqueaderoService } from '../services/parqueaderoService';
import type {
  ParqueaderoDashboardResponse,
  RegistroParqueadero,
  TipoVehiculoParqueadero,
  EstadoVehiculoParqueadero,
} from '../types/parqueadero.types';
import { estadiasService } from '@/modules/Estadias/services/estadiasService';
import type { Estadia } from '@/modules/Estadias/types/estadia.types';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import {
  Car,
  Bike,
  Clock,
  Ticket,
  DollarSign,
  Plus,
  Search,
  Settings,
  CheckCircle2,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  History,
  LogOut,
} from 'lucide-react';

/**
 * Regla de Redondeo Financiero (múltiplos de 100 COP):
 * - 01 a 49 COP redondean hacia abajo (ej. 4.249 -> 4.200)
 * - 50 a 99 COP redondean hacia arriba (ej. 4.250 -> 4.300)
 */
function redondearAMultiploDe100(valor: number): number {
  const entero = Math.max(0, Math.round(valor));
  const resto = entero % 100;
  if (resto === 0) return entero;
  if (resto <= 49) return entero - resto;
  return entero + (100 - resto);
}

export function ParqueaderoPage() {
  const [cargando, setCargando] = useState(true);
  const [data, setData] = useState<ParqueaderoDashboardResponse | null>(null);
  const [tabActiva, setTabActiva] = useState<'monitor' | 'historial'>('monitor');
  const [ahoraTick, setAhoraTick] = useState<number>(Date.now());

  // Filtros de Búsqueda / Historial
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoVehiculoParqueadero>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoVehiculoParqueadero>('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Modal de Ingreso
  const [modalIngresoAbierto, setModalIngresoAbierto] = useState(false);
  const [placaIngreso, setPlacaIngreso] = useState('');
  const [tipoIngreso, setTipoIngreso] = useState<TipoVehiculoParqueadero>('carro');
  const [estadiaVinculadaId, setEstadiaVinculadaId] = useState('');
  const [observacionesIngreso, setObservacionesIngreso] = useState('');
  const [estadiasActivas, setEstadiasActivas] = useState<Estadia[]>([]);
  const [guardandoIngreso, setGuardandoIngreso] = useState(false);

  // Modal de Salida / Liquidación
  const [vehiculoParaSalida, setVehiculoParaSalida] = useState<RegistroParqueadero | null>(null);
  const [observacionesSalida, setObservacionesSalida] = useState('');
  const [procesandoSalida, setProcesandoSalida] = useState(false);

  // Modal de Configuración de Tarifas
  const [modalTarifasAbierto, setModalTarifasAbierto] = useState(false);
  const [tarifaMotoForm, setTarifaMotoForm] = useState(2500);
  const [tarifaCarroForm, setTarifaCarroForm] = useState(5000);
  const [guardandoTarifas, setGuardandoTarifas] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const res = await parqueaderoService.obtenerDatos({
        estado: filtroEstado,
        tipo_vehiculo: filtroTipo,
        busqueda: busqueda.trim() || undefined,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
      });
      setData(res);
      setTarifaMotoForm(res.tarifas.moto);
      setTarifaCarroForm(res.tarifas.carro);
    } catch (e) {
      console.error('Error al cargar parqueadero:', e);
    } finally {
      setCargando(false);
    }
  }, [filtroEstado, filtroTipo, busqueda, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Reloj en tiempo real cada 15 segundos para actualizar cálculo en vivo
  useEffect(() => {
    const timer = setInterval(() => {
      setAhoraTick(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const abrirModalIngreso = async () => {
    setPlacaIngreso('');
    setTipoIngreso('carro');
    setEstadiaVinculadaId('');
    setObservacionesIngreso('');
    setModalIngresoAbierto(true);
    try {
      const todas = await estadiasService.obtenerTodas();
      setEstadiasActivas(todas.filter((e) => e.estado === 'activa'));
    } catch {
      setEstadiasActivas([]);
    }
  };

  const handleRegistrarIngreso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placaIngreso.trim()) {
      alert('Por favor ingrese la placa del vehículo.');
      return;
    }

    try {
      setGuardandoIngreso(true);
      const nuevo = await parqueaderoService.registrarIngreso({
        placa: placaIngreso.toUpperCase().trim(),
        tipo_vehiculo: tipoIngreso,
        estadia_id: estadiaVinculadaId ? parseInt(estadiaVinculadaId) : undefined,
        observaciones: observacionesIngreso.trim() || undefined,
      });
      setModalIngresoAbierto(false);
      await cargarDatos();
      alert(`Ingreso exitoso. Ficho generado: ${nuevo.ficho}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al registrar el ingreso del vehículo.');
    } finally {
      setGuardandoIngreso(false);
    }
  };

  const handleConfirmarSalida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculoParaSalida) return;

    try {
      setProcesandoSalida(true);
      const liquidado = await parqueaderoService.registrarSalida(
        vehiculoParaSalida.id,
        observacionesSalida.trim() || undefined
      );
      setVehiculoParaSalida(null);
      setObservacionesSalida('');
      await cargarDatos();
      alert(
        `Liquidación completada:\nFicho: ${liquidado.ficho} | Placa: ${liquidado.placa}\nTiempo: ${liquidado.tiempo_formateado}\nTotal Cobrado: $${liquidado.valor_estimado_o_liquidado.toLocaleString('es-CO')} COP`
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al liquidar la salida del vehículo.');
    } finally {
      setProcesandoSalida(false);
    }
  };

  const handleGuardarTarifas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardandoTarifas(true);
      await parqueaderoService.actualizarTarifas({
        tarifa_moto: tarifaMotoForm,
        tarifa_carro: tarifaCarroForm,
      });
      setModalTarifasAbierto(false);
      await cargarDatos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar las tarifas.');
    } finally {
      setGuardandoTarifas(false);
    }
  };

  // Cálculo dinámico en vivo en el cliente (sincronizado con la regla del servidor)
  const calcularTiempoYValorEnVivo = (reg: RegistroParqueadero) => {
    if (reg.estado === 'retirado') {
      return {
        minutos: reg.minutos_transcurridos,
        tiempoTexto: reg.tiempo_formateado,
        sinRedondear: reg.valor_sin_redondear,
        redondeado: reg.valor_estimado_o_liquidado,
      };
    }

    const entradaMs = new Date(reg.hora_entrada.replace(' ', 'T')).getTime();
    const diffMs = Math.max(60000, ahoraTick - entradaMs);
    const minutos = Math.max(1, Math.floor(diffMs / 60000));
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    const tiempoTexto = horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
    const sinRedondear = Math.round(((minutos / 60) * reg.tarifa_hora_aplicada) * 100) / 100;
    const redondeado = redondearAMultiploDe100(sinRedondear);

    return { minutos, tiempoTexto, sinRedondear, redondeado };
  };

  if (cargando && !data) {
    return <Loading mensaje="Cargando sistema de parqueadero y control vehicular..." />;
  }

  const metricas = data?.metricas || {
    total_dentro: 0,
    motos_dentro: 0,
    carros_dentro: 0,
    retirados_hoy: 0,
    recaudo_hoy: 0,
  };

  const vehiculosDentroFiltrados = (data?.vehiculos_dentro || []).filter((v) => {
    if (filtroTipo !== 'todos' && v.tipo_vehiculo !== filtroTipo) return false;
    if (busqueda.trim()) {
      const q = busqueda.toUpperCase().trim();
      return v.placa.includes(q) || v.ficho.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Control de Parqueadero Independiente
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
              Unidad Autónoma
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de acceso vehicular, ficho único, liquidación en tiempo real y redondeo a múltiplos de 100 COP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setModalTarifasAbierto(true)}
            icono={<Settings className="w-4 h-4" />}
          >
            Tarifas / Hora
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={abrirModalIngreso}
            icono={<Plus className="w-4 h-4" />}
          >
            Registrar Ingreso
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas y Tarifas Vigentes */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Dentro del Parqueadero
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
              {metricas.total_dentro}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {metricas.carros_dentro} carros · {metricas.motos_dentro} motos
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft-xs">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-700 block mb-1">
              Tarifa Hora Carro
            </span>
            <div className="text-xl sm:text-2xl font-bold font-display text-blue-950 tracking-tight">
              ${(data?.tarifas.carro || 0).toLocaleString('es-CO')}
            </div>
            <span className="text-[10px] text-slate-400">Sin cobro retroactivo</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-700 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 block mb-1">
              Tarifa Hora Moto
            </span>
            <div className="text-xl sm:text-2xl font-bold font-display text-amber-950 tracking-tight">
              ${(data?.tarifas.moto || 0).toLocaleString('es-CO')}
            </div>
            <span className="text-[10px] text-slate-400">Sin cobro retroactivo</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center">
            <Bike className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Salidas Hoy
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-display text-slate-800 tracking-tight">
              {metricas.retirados_hoy}
            </div>
            <span className="text-[10px] text-slate-400">Vehículos liquidados</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 block mb-1">
              Recaudado Hoy
            </span>
            <div className="text-xl sm:text-2xl font-bold font-display text-emerald-700 tracking-tight">
              ${metricas.recaudo_hoy.toLocaleString('es-CO')}
            </div>
            <span className="text-[10px] text-slate-400">Caja parqueadero</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pestañas y Barra de Búsqueda / Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Pestañas */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setTabActiva('monitor')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tabActiva === 'monitor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Monitor en Tiempo Real ({metricas.total_dentro})</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('historial')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tabActiva === 'historial'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Historial y Auditoría</span>
            </button>
          </div>

          {/* Buscador Ágil por Placa o Ficho */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por Placa o N° Ficho..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
            >
              <option value="todos">Todos los tipos</option>
              <option value="carro">Solo Carros</option>
              <option value="moto">Solo Motos</option>
            </select>

            {tabActiva === 'historial' && (
              <>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as any)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
                >
                  <option value="todos">Estado: Todos</option>
                  <option value="dentro">Dentro del parqueadero</option>
                  <option value="retirado">Retirado</option>
                </select>

                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  title="Fecha desde"
                />
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  title="Fecha hasta"
                />
              </>
            )}

            <button
              type="button"
              onClick={cargarDatos}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refrescar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Pestaña 1: Monitor en Tiempo Real */}
      {tabActiva === 'monitor' && (
        <div className="space-y-4">
          {vehiculosDentroFiltrados.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200/70 text-center space-y-2">
              <Car className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                No hay vehículos en estancia con los criterios actuales
              </p>
              <p className="text-xs text-slate-400">
                Usa el botón "Registrar Ingreso" para capturar la placa y generar el ficho único.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehiculosDentroFiltrados.map((v) => {
                const vivo = calcularTiempoYValorEnVivo(v);
                const esMoto = v.tipo_vehiculo === 'moto';

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Cabecera: Placa y Ficho */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              esMoto
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                            }`}
                          >
                            {esMoto ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="px-2.5 py-0.5 bg-amber-300/90 border-2 border-slate-900 rounded-md font-mono font-extrabold text-base text-slate-950 tracking-wider inline-block leading-tight">
                              {v.placa}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                              <Ticket className="w-3 h-3 text-slate-400" />
                              <span className="font-mono font-semibold text-slate-700">{v.ficho}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {v.estado_etiqueta}
                        </span>
                      </div>

                      {/* Datos de Tiempo y Tarifa Congelada */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tiempo Transcurrido</span>
                          <span className="font-mono font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-red-600" />
                            {vivo.tiempoTexto}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tarifa Aplicada</span>
                          <span className="font-mono font-semibold text-slate-800 text-sm block mt-0.5">
                            ${v.tarifa_hora_aplicada.toLocaleString('es-CO')}/h
                          </span>
                        </div>
                        <div className="col-span-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Entrada: {v.hora_entrada}</span>
                        </div>
                      </div>

                      {/* Vinculación con Huésped si aplica */}
                      {v.huesped_nombre && (
                        <div className="px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-blue-900 font-medium truncate">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{v.huesped_nombre}</span>
                          </div>
                          {v.habitacion_numero && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                              Hab. {v.habitacion_numero}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pie: Valor Acumulado Redondeado y Botón de Salida */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Acumulado (Redondeo 100 COP)
                        </span>
                        <span className="text-xl font-display font-bold text-emerald-700">
                          ${vivo.redondeado.toLocaleString('es-CO')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setVehiculoParaSalida(v);
                          setObservacionesSalida('');
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Dar Salida y Liquidar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contenido Pestaña 2: Historial y Auditoría */}
      {tabActiva === 'historial' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ficho</th>
                  <th className="py-3.5 px-4">Placa / Tipo</th>
                  <th className="py-3.5 px-4">Huésped Vinculado</th>
                  <th className="py-3.5 px-4">Entrada</th>
                  <th className="py-3.5 px-4">Salida</th>
                  <th className="py-3.5 px-4 text-center">Tiempo</th>
                  <th className="py-3.5 px-4 text-right">Tarifa/Hora</th>
                  <th className="py-3.5 px-4 text-right">Valor Liquidado</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.historial || []).map((reg) => {
                  const vivo = calcularTiempoYValorEnVivo(reg);
                  const estaDentro = reg.estado === 'dentro';

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {reg.ficho}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-200/80 border border-slate-800 rounded font-mono font-bold text-slate-900">
                            {reg.placa}
                          </span>
                          <span className="text-[11px] text-slate-500 capitalize">
                            ({reg.tipo_vehiculo_etiqueta})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {reg.huesped_nombre ? (
                          <div>
                            <span className="font-medium text-slate-800">{reg.huesped_nombre}</span>
                            {reg.habitacion_numero && (
                              <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                                Hab. {reg.habitacion_numero}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Particular / Externo</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {reg.hora_entrada}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {reg.hora_salida || '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold">
                        {vivo.tiempoTexto}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ${reg.tarifa_hora_aplicada.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        ${vivo.redondeado.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            estaDentro
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {reg.estado_etiqueta}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {estaDentro ? (
                          <button
                            type="button"
                            onClick={() => {
                              setVehiculoParaSalida(reg);
                              setObservacionesSalida('');
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Liquidar
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Cerrado</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Registrar Ingreso de Vehículo */}
      <Modal
        isOpen={modalIngresoAbierto}
        onClose={() => setModalIngresoAbierto(false)}
        title="Registrar Ingreso al Parqueadero"
        subtitle="Generación automática de ficho único y captura de tarifa actual"
        maxWidth="md"
        icon={<Car className="w-5 h-5 text-red-600" />}
      >
        <form onSubmit={handleRegistrarIngreso} className="space-y-4 text-xs text-slate-700">
          {/* Tipo de Vehículo */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Tipo de Vehículo *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: 'carro' as const,
                  label: 'Carro / Camioneta',
                  tarifa: data?.tarifas.carro || 5000,
                  icono: Car,
                },
                {
                  id: 'moto' as const,
                  label: 'Motocicleta',
                  tarifa: data?.tarifas.moto || 2500,
                  icono: Bike,
                },
              ].map((item) => {
                const activo = tipoIngreso === item.id;
                const Icono = item.icono;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipoIngreso(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      activo
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icono className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className={`text-[10px] ${activo ? 'text-slate-300' : 'text-slate-400'}`}>
                        ${item.tarifa.toLocaleString('es-CO')} COP / hora
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Placa */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Placa del Vehículo *
            </label>
            <input
              type="text"
              required
              maxLength={15}
              placeholder="Ej. KLM-123"
              value={placaIngreso}
              onChange={(e) => setPlacaIngreso(e.target.value.toUpperCase())}
              className="w-full p-3 bg-amber-50/60 border-2 border-slate-800 rounded-xl text-center font-mono text-xl font-extrabold uppercase tracking-widest text-slate-900 outline-none focus:bg-white"
            />
          </div>

          {/* Vinculación Opcional con Huésped Hospedado */}
          <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Vincular con Huésped Hospedado (Opcional)</span>
              </span>
            </div>
            <select
              value={estadiaVinculadaId}
              onChange={(e) => setEstadiaVinculadaId(e.target.value)}
              className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs outline-none"
            >
              <option value="">Cliente externo / Sin asociar a habitación</option>
              {estadiasActivas.map((est) => (
                <option key={est.id} value={est.id}>
                  Hab. {est.habitacion_numero} — {est.huesped?.nombres} {est.huesped?.apellidos} (Doc: {est.huesped?.numero_documento})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-blue-700">
              Nota: El parqueadero opera como unidad independiente; no transfiere cargos automáticos a la factura de alojamiento.
            </p>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Observaciones (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Casco entregado en recepción, rayón lateral..."
              value={observacionesIngreso}
              onChange={(e) => setObservacionesIngreso(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="md" type="button" onClick={() => setModalIngresoAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" cargando={guardandoIngreso} icono={<Ticket className="w-4 h-4" />}>
              Generar Ficho e Ingresar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Salida y Liquidación con Regla de Redondeo */}
      <Modal
        isOpen={!!vehiculoParaSalida}
        onClose={() => setVehiculoParaSalida(null)}
        title="Liquidación y Salida de Vehículo"
        subtitle={`Ficho ${vehiculoParaSalida?.ficho || ''} · Placa ${vehiculoParaSalida?.placa || ''}`}
        maxWidth="md"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
      >
        {vehiculoParaSalida && (() => {
          const calc = calcularTiempoYValorEnVivo(vehiculoParaSalida);
          return (
            <form onSubmit={handleConfirmarSalida} className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tipo de Vehículo:</span>
                  <span className="font-bold text-slate-900">{vehiculoParaSalida.tipo_vehiculo_etiqueta}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hora de Entrada:</span>
                  <span className="font-mono">{vehiculoParaSalida.hora_entrada}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tiempo Total:</span>
                  <span className="font-mono font-bold text-slate-900">{calc.tiempoTexto} ({calc.minutos} min)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tarifa Pactada al Ingreso:</span>
                  <span className="font-mono">${vehiculoParaSalida.tarifa_hora_aplicada.toLocaleString('es-CO')} / hora</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-500">
                  <span>Valor proporcional exacto:</span>
                  <span className="font-mono">${calc.sinRedondear.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Total a Pagar (Redondeado)</span>
                    <span className="text-[10px] text-slate-400">Ajustado a múltiplo de 100 COP</span>
                  </div>
                  <span className="text-2xl font-display font-extrabold text-emerald-700">
                    ${calc.redondeado.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Notas de Salida (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pago en efectivo exacto..."
                  value={observacionesSalida}
                  onChange={(e) => setObservacionesSalida(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" type="button" onClick={() => setVehiculoParaSalida(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  cargando={procesandoSalida}
                  icono={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirmar Pago y Retirar
                </Button>
              </div>
            </form>
          );
        })()}
      </Modal>

      {/* Modal 3: Gestión de Tarifas por Hora */}
      <Modal
        isOpen={modalTarifasAbierto}
        onClose={() => setModalTarifasAbierto(false)}
        title="Configuración de Tarifas de Parqueadero"
        subtitle="Parametrización por hora para motos y carros"
        maxWidth="sm"
        icon={<Settings className="w-5 h-5 text-slate-700" />}
      >
        <form onSubmit={handleGuardarTarifas} className="space-y-4 text-xs text-slate-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900">
              Las modificaciones de tarifa aplicarán <strong>únicamente a los nuevos ingresos</strong>, protegiendo las liquidaciones de vehículos actualmente en estancia.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Tarifa por Hora — Motocicleta (COP) *
            </label>
            <input
              type="number"
              required
              min={0}
              step={100}
              value={tarifaMotoForm}
              onChange={(e) => setTarifaMotoForm(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm text-slate-900 outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Tarifa por Hora — Carro / Camioneta (COP) *
            </label>
            <input
              type="number"
              required
              min={0}
              step={100}
              value={tarifaCarroForm}
              onChange={(e) => setTarifaCarroForm(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm text-slate-900 outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="md" type="button" onClick={() => setModalTarifasAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" cargando={guardandoTarifas}>
              Guardar Tarifas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
