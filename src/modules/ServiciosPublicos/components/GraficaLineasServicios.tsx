import { useState, useId } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  Zap,
  Droplets,
  Info,
} from 'lucide-react';
import type { MesEstadistica, TipoServicio, TotalPorTipoServicio } from '../types/serviciosPublicos.types';

interface GraficaLineasServiciosProps {
  matrizMensual: MesEstadistica[];
  totalesPorTipo: Record<TipoServicio, TotalPorTipoServicio>;
  anioSeleccionado: number;
  tipoConfig: Record<TipoServicio, { label: string; icon: any; color: string; hex: string }>;
}

export function GraficaLineasServicios({
  matrizMensual,
  totalesPorTipo,
  anioSeleccionado,
  tipoConfig,
}: GraficaLineasServiciosProps) {
  // Estado para alternar visibilidad de cada serie
  const [serviciosVisibles, setServiciosVisibles] = useState<Record<TipoServicio, boolean>>({
    luz: true,
    agua: true,
    gas: true,
    internet: true,
    aseo: true,
    otro: true,
  });

  // Mostrar u ocultar línea total consolidada
  const [mostrarTotal, setMostrarTotal] = useState<boolean>(true);

  // Modo de visualización: Líneas de Tendencia vs Comparativa de Barras
  const [modoVisualizacion, setModoVisualizacion] = useState<'lineas' | 'barras'>('lineas');

  // Tooltip interactivo
  const [hoveredPoint, setHoveredPoint] = useState<{
    mesIndex: number;
    servicio?: TipoServicio | 'total';
    x: number;
    y: number;
  } | null>(null);

  const filterId = useId();

  // Servicios disponibles
  const tiposArray: TipoServicio[] = ['luz', 'agua', 'gas', 'internet', 'aseo', 'otro'];

  // Calcular picos máximos anuales por cada servicio y total
  const picosPorServicio: Partial<Record<TipoServicio, { mes: string; mesIndex: number; valor: number }>> = {};
  tiposArray.forEach((tipo) => {
    let maxVal = 0;
    let maxMes = '';
    let maxIdx = -1;
    matrizMensual.forEach((m, idx) => {
      const val = m.servicios[tipo]?.facturado || 0;
      if (val > maxVal) {
        maxVal = val;
        maxMes = m.nombre_mes;
        maxIdx = idx;
      }
    });
    if (maxVal > 0) {
      picosPorServicio[tipo] = { mes: maxMes, mesIndex: maxIdx, valor: maxVal };
    }
  });

  // Pico del total consolidado
  let picoTotal = { mes: '', mesIndex: -1, valor: 0 };
  let minTotal = { mes: '', mesIndex: -1, valor: Infinity };
  matrizMensual.forEach((m, idx) => {
    if (m.total_facturado > picoTotal.valor) {
      picoTotal = { mes: m.nombre_mes, mesIndex: idx, valor: m.total_facturado };
    }
    if (m.total_facturado > 0 && m.total_facturado < minTotal.valor) {
      minTotal = { mes: m.nombre_mes, mesIndex: idx, valor: m.total_facturado };
    }
  });
  if (minTotal.valor === Infinity) {
    minTotal = { mes: 'N/A', mesIndex: -1, valor: 0 };
  }

  // Servicio con mayor costo anual
  type ServicioMayorInfo = { tipo: TipoServicio; total: number };
  let servicioMayorCosto: ServicioMayorInfo | null = null;
  for (const tipo of tiposArray) {
    const tot = totalesPorTipo[tipo]?.total_facturado || 0;
    if (!servicioMayorCosto || tot > servicioMayorCosto.total) {
      servicioMayorCosto = { tipo, total: tot };
    }
  }

  // Encontrar el valor máximo para escalar la gráfica
  let maxValorEscala = 0;
  matrizMensual.forEach((m) => {
    if (mostrarTotal && m.total_facturado > maxValorEscala) {
      maxValorEscala = m.total_facturado;
    }
    tiposArray.forEach((tipo) => {
      if (serviciosVisibles[tipo]) {
        const val = m.servicios[tipo]?.facturado || 0;
        if (val > maxValorEscala) {
          maxValorEscala = val;
        }
      }
    });
  });

  // Asegurar mínimo de escala si no hay datos
  if (maxValorEscala <= 0) maxValorEscala = 1000000;
  // Margen superior del 15% para que los picos no toquen el techo
  const yMax = Math.ceil((maxValorEscala * 1.15) / 100000) * 100000;

  // Dimensiones SVG responsivas basadas en viewBox
  const width = 850;
  const height = 340;
  const paddingLeft = 75;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordenadas X para los 12 meses (0 a 11)
  const getX = (mesIndex: number) => {
    return paddingLeft + (mesIndex / 11) * chartWidth;
  };

  // Coordenadas Y para los montos en COP
  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / yMax) * chartHeight;
  };

  // Generador de caminos SVG suaves (Spline Catmull-Rom o Curva Cúbica)
  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  // Líneas de guía de la cuadrícula Y (4 intervalos)
  const gridTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const formatCOP = (val: number) => {
    if (val >= 1000000) {
      const mills = val / 1000000;
      return `$${mills % 1 === 0 ? mills.toFixed(0) : mills.toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val}`;
  };

  const toggleServicio = (tipo: TipoServicio) => {
    setServiciosVisibles((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden space-y-4 p-5">
      {/* Barra superior de controles y títulos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span>Evolución Mensual & Tendencias de Gastos · {anioSeleccionado}</span>
          </h4>
          <p className="text-slate-500 text-xs mt-0.5">
            Diferenciación por líneas de servicio, picos máximos del año y tooltips interactivos
          </p>
        </div>

        {/* Selector de modo y botones de vista */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setModoVisualizacion('lineas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                modoVisualizacion === 'lineas'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-red-600" />
              <span>Líneas de Tendencia</span>
            </button>
            <button
              type="button"
              onClick={() => setModoVisualizacion('barras')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                modoVisualizacion === 'barras'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Barras Comparativas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leyenda interactiva de servicios con Toggle on/off */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Servicios:
        </span>

        {/* Toggle para Total Consolidado */}
        <button
          type="button"
          onClick={() => setMostrarTotal(!mostrarTotal)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            mostrarTotal
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Total Consolidado</span>
        </button>

        {tiposArray.map((tipo) => {
          const conf = tipoConfig[tipo];
          const activo = serviciosVisibles[tipo];
          const facturado = totalesPorTipo[tipo]?.total_facturado || 0;
          const Icon = conf.icon;

          return (
            <button
              key={tipo}
              type="button"
              onClick={() => toggleServicio(tipo)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                activo
                  ? 'bg-white text-slate-800 border-slate-300 shadow-2xs hover:border-slate-400'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: conf.hex }}
              />
              <Icon className="w-3 h-3 text-slate-500" />
              <span>{conf.label}</span>
              {facturado > 0 && (
                <span className="text-[10px] font-mono text-slate-400 ml-0.5">
                  ({formatCOP(facturado)})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tarjetas de Picos y Extremos Financieros del Año */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
        {/* Mes Pico General */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Mes de Mayor Gasto Total
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-slate-900 text-sm">
                {picoTotal.mes || 'Sin datos'}
              </span>
              {picoTotal.valor > 0 && (
                <span className="font-mono text-xs font-bold text-red-600">
                  ${picoTotal.valor.toLocaleString('es-CO')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mes de Menor Gasto */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
            <TrendingUp className="w-5 h-5 rotate-180" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Mes de Menor Gasto Total
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-slate-900 text-sm">
                {minTotal.mes !== 'N/A' ? minTotal.mes : 'Sin datos'}
              </span>
              {minTotal.valor > 0 && (
                <span className="font-mono text-xs font-bold text-emerald-600">
                  ${minTotal.valor.toLocaleString('es-CO')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Servicio de Mayor Costo Anual */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Servicio de Mayor Costo
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-slate-900 text-sm">
                {servicioMayorCosto ? tipoConfig[servicioMayorCosto.tipo]?.label : 'N/A'}
              </span>
              {servicioMayorCosto && servicioMayorCosto.total > 0 && (
                <span className="font-mono text-xs font-bold text-amber-700">
                  ${servicioMayorCosto.total.toLocaleString('es-CO')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pico de Energía / Luz */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pico Luz (CENS) vs Agua (Kpital)
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
              <span>Luz: {picosPorServicio.luz ? `${picosPorServicio.luz.mes} (${formatCOP(picosPorServicio.luz.valor)})` : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE GRÁFICA SVG */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] overflow-visible"
        >
          <defs>
            {/* Gradientes para las áreas bajo la curva */}
            <linearGradient id={`${filterId}-grad-total`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
            </linearGradient>

            {tiposArray.map((tipo) => (
              <linearGradient
                key={tipo}
                id={`${filterId}-grad-${tipo}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={tipoConfig[tipo].hex} stopOpacity="0.2" />
                <stop offset="100%" stopColor={tipoConfig[tipo].hex} stopOpacity="0.0" />
              </linearGradient>
            ))}

            <filter id={`${filterId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Líneas horizontales de cuadrícula y etiquetas del Eje Y */}
          {gridTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={idx === 0 ? '#cbd5e1' : '#f1f5f9'}
                  strokeWidth={idx === 0 ? '1.5' : '1'}
                  strokeDasharray={idx > 0 ? '3 3' : undefined}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 font-medium"
                >
                  {formatCOP(val)}
                </text>
              </g>
            );
          })}

          {/* Líneas verticales de los meses y etiquetas del Eje X */}
          {matrizMensual.map((m, idx) => {
            const x = getX(idx);
            const esHovered = hoveredPoint?.mesIndex === idx;
            const esPico = picoTotal.mesIndex === idx;

            return (
              <g key={m.mes}>
                {/* Línea guía vertical suave en hover o pico */}
                {(esHovered || esPico) && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke={esPico ? '#fca5a5' : '#cbd5e1'}
                    strokeWidth={esPico ? '1.5' : '1'}
                    strokeDasharray={esPico ? '4 2' : '2 2'}
                  />
                )}

                {/* Etiqueta del mes en el Eje X */}
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    esPico
                      ? 'fill-red-600 font-bold'
                      : esHovered
                      ? 'fill-slate-900 font-bold'
                      : 'fill-slate-500'
                  }`}
                >
                  {m.nombre_mes.slice(0, 3)}
                </text>

                {/* Badge de Mes Pico */}
                {esPico && (
                  <g transform={`translate(${x}, ${height - paddingBottom + 26})`}>
                    <rect
                      x="-14"
                      y="0"
                      width="28"
                      height="12"
                      rx="3"
                      fill="#fee2e2"
                      stroke="#fca5a5"
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="9"
                      textAnchor="middle"
                      className="text-[8px] font-bold fill-red-700 uppercase"
                    >
                      PICO
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* MODO BARRAS COMPARATIVAS */}
          {modoVisualizacion === 'barras' && (
            <g>
              {matrizMensual.map((m, idx) => {
                const groupX = getX(idx);
                // Tipos visibles con facturación
                const tiposActivos = tiposArray.filter((t) => serviciosVisibles[t]);
                const barGroupWidth = Math.min(chartWidth / 13, 44);
                const barWidth = Math.max(3, (barGroupWidth - 4) / Math.max(1, tiposActivos.length));

                return (
                  <g key={`bar-group-${m.mes}`}>
                    {/* Barra de fondo hoverable */}
                    <rect
                      x={groupX - barGroupWidth / 2}
                      y={paddingTop}
                      width={barGroupWidth}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer hover:fill-slate-100/50"
                      onMouseEnter={() => setHoveredPoint({ mesIndex: idx, x: groupX, y: paddingTop + 40 })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Barras por servicio */}
                    {tiposActivos.map((tipo, tIdx) => {
                      const val = m.servicios[tipo]?.facturado || 0;
                      if (val <= 0) return null;
                      const barH = (val / yMax) * chartHeight;
                      const bx = groupX - barGroupWidth / 2 + 2 + tIdx * barWidth;
                      const by = paddingTop + chartHeight - barH;

                      return (
                        <rect
                          key={tipo}
                          x={bx}
                          y={by}
                          width={barWidth - 1}
                          height={barH}
                          rx="2"
                          fill={tipoConfig[tipo].hex}
                          className="transition-all hover:opacity-80"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* MODO LÍNEAS DE TENDENCIA */}
          {modoVisualizacion === 'lineas' && (
            <>
              {/* Áreas y líneas por cada servicio público */}
              {tiposArray.map((tipo) => {
                if (!serviciosVisibles[tipo]) return null;
                const points = matrizMensual.map((m, idx) => ({
                  x: getX(idx),
                  y: getY(m.servicios[tipo]?.facturado || 0),
                  val: m.servicios[tipo]?.facturado || 0,
                }));

                const pathData = buildSmoothPath(points);
                const areaPath = `${pathData} L ${points[points.length - 1].x} ${
                  paddingTop + chartHeight
                } L ${points[0].x} ${paddingTop + chartHeight} Z`;

                const pico = picosPorServicio[tipo];

                return (
                  <g key={`line-group-${tipo}`}>
                    {/* Área sombreada bajo la curva */}
                    <path
                      d={areaPath}
                      fill={`url(#${filterId}-grad-${tipo})`}
                      className="pointer-events-none transition-all"
                    />

                    {/* Línea principal trazada */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={tipoConfig[tipo].hex}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all"
                    />

                    {/* Puntos circulares en cada mes */}
                    {points.map((p, idx) => {
                      if (p.val <= 0) return null;
                      const esPicoServicio = pico?.mesIndex === idx;

                      return (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={esPicoServicio ? '5' : '3.5'}
                            fill="#ffffff"
                            stroke={tipoConfig[tipo].hex}
                            strokeWidth={esPicoServicio ? '3' : '2'}
                            className="cursor-pointer transition-transform hover:scale-150"
                            onMouseEnter={() =>
                              setHoveredPoint({ mesIndex: idx, servicio: tipo, x: p.x, y: p.y })
                            }
                            onMouseLeave={() => setHoveredPoint(null)}
                          />

                          {/* Destacado visual permanente del pico máximo anual de este servicio */}
                          {esPicoServicio && (
                            <g transform={`translate(${p.x}, ${p.y - 12})`}>
                              <rect
                                x="-24"
                                y="-14"
                                width="48"
                                height="14"
                                rx="4"
                                fill="#ffffff"
                                stroke={tipoConfig[tipo].hex}
                                strokeWidth="1"
                                filter={`url(#${filterId}-shadow)`}
                              />
                              <text
                                x="0"
                                y="-4"
                                textAnchor="middle"
                                className="text-[8.5px] font-mono font-bold"
                                fill={tipoConfig[tipo].hex}
                              >
                                {formatCOP(p.val)}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* LÍNEA TOTAL CONSOLIDADA (ROJO GRUESO) */}
              {mostrarTotal && (
                <g key="line-group-total">
                  {(() => {
                    const points = matrizMensual.map((m, idx) => ({
                      x: getX(idx),
                      y: getY(m.total_facturado),
                      val: m.total_facturado,
                    }));

                    const pathData = buildSmoothPath(points);
                    const areaPath = `${pathData} L ${points[points.length - 1].x} ${
                      paddingTop + chartHeight
                    } L ${points[0].x} ${paddingTop + chartHeight} Z`;

                    return (
                      <>
                        <path
                          d={areaPath}
                          fill={`url(#${filterId}-grad-total)`}
                          className="pointer-events-none"
                        />
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {points.map((p, idx) => {
                          if (p.val <= 0) return null;
                          const esPicoGen = picoTotal.mesIndex === idx;

                          return (
                            <g key={`total-point-${idx}`}>
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={esPicoGen ? '6.5' : '4.5'}
                                fill="#ffffff"
                                stroke="#e11d48"
                                strokeWidth={esPicoGen ? '3.5' : '2.5'}
                                className="cursor-pointer transition-transform hover:scale-150"
                                onMouseEnter={() =>
                                  setHoveredPoint({ mesIndex: idx, servicio: 'total', x: p.x, y: p.y })
                                }
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {esPicoGen && (
                                <g transform={`translate(${p.x}, ${p.y - 14})`}>
                                  <rect
                                    x="-30"
                                    y="-15"
                                    width="60"
                                    height="15"
                                    rx="4"
                                    fill="#991b1b"
                                    stroke="#fee2e2"
                                    strokeWidth="1"
                                    filter={`url(#${filterId}-shadow)`}
                                  />
                                  <text
                                    x="0"
                                    y="-4"
                                    textAnchor="middle"
                                    className="text-[9px] font-mono font-bold fill-white"
                                  >
                                    PICO {formatCOP(p.val)}
                                  </text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </g>
              )}
            </>
          )}

          {/* Columna transparente para capturar hover en cada mes si no se apunta al punto */}
          {matrizMensual.map((_, idx) => {
            const x = getX(idx);
            const colWidth = chartWidth / 12;
            return (
              <rect
                key={`hover-col-${idx}`}
                x={x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint({ mesIndex: idx, x, y: paddingTop + 40 })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* TOOLTIP FLOTANTE INTERACTIVO */}
        {hoveredPoint && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-150 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs w-60"
            style={{
              left: `${Math.min(Math.max(hoveredPoint.x, 80), width - 180)}px`,
              top: `${Math.max(10, hoveredPoint.y - 120)}px`,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
              <span className="font-display font-bold text-slate-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {matrizMensual[hoveredPoint.mesIndex]?.nombre_mes} {anioSeleccionado}
              </span>
              <span className="font-mono font-bold text-emerald-400">
                ${matrizMensual[hoveredPoint.mesIndex]?.total_facturado.toLocaleString('es-CO')}
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              {tiposArray.map((tipo) => {
                const conf = tipoConfig[tipo];
                const val = matrizMensual[hoveredPoint.mesIndex]?.servicios[tipo]?.facturado || 0;
                const isSelected = hoveredPoint.servicio === tipo;

                if (val <= 0 && !isSelected) return null;

                return (
                  <div
                    key={tipo}
                    className={`flex items-center justify-between py-0.5 px-1 rounded ${
                      isSelected ? 'bg-white/10 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: conf.hex }}
                      />
                      <span className="text-slate-300">{conf.label}:</span>
                    </div>
                    <span className="font-mono text-white font-medium">
                      ${val.toLocaleString('es-CO')}
                    </span>
                  </div>
                );
              })}

              <div className="pt-1.5 mt-1 border-t border-slate-700/80 flex items-center justify-between text-slate-400 text-[10px]">
                <span>Total Pagado:</span>
                <span className="font-mono font-semibold text-emerald-300">
                  ${matrizMensual[hoveredPoint.mesIndex]?.total_pagado.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nota de ayuda de interpretación */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Haz clic en los botones de servicios para activar u ocultar sus líneas y aislar comparaciones directas.
          </span>
        </div>
        <span className="font-mono">
          Valores en Pesos Colombianos (COP)
        </span>
      </div>
    </div>
  );
}
