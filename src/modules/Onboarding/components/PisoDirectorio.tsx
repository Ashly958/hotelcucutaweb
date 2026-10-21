// ─── PisoDirectorio — Directorio interactivo de los 5 pisos (vista pública) ───
// ⚠️  IMPORTANTE: No se muestran nombres de red WiFi ni contraseñas.
//     Animaciones con Framer Motion: layout pill, AnimatePresence content swap,
//     stagger en lista de características y spring en badge WiFi.

import { useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Layers, Wifi } from 'lucide-react';
import { PISOS_INFO } from '../utils/onboarding.data';

interface PisoDirectorioProps {
  pisoSeleccionado: number;
  onSeleccionarPiso: (piso: number) => void;
}

// ── Variantes de animación ────────────────────────────────────────────────────

// Curva cubic-bezier suave (ease out expo) tipada correctamente
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Contenido de la tarjeta: sale por arriba y entra por abajo (slide + fade) */
const variantesContenido: Variants = {
  oculto: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease: EASE_OUT },
  },
  salida: {
    opacity: 0,
    y: -14,
    filter: 'blur(4px)',
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

/** Contenedor de la lista con stagger para cada ítem */
const variantesLista: Variants = {
  oculto: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

/** Cada ítem de característica entra con slide desde la izquierda */
const variantesItem: Variants = {
  oculto: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

/** Badge WiFi: spring con rebote suave */
const variantesWifi: Variants = {
  oculto: { opacity: 0, scale: 0.88, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 22, delay: 0.18 },
  },
};

/** Área de servicio: fade + scale desde abajo */
const variantesArea: Variants = {
  oculto: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT, delay: 0.2 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export function PisoDirectorio({ pisoSeleccionado, onSeleccionarPiso }: PisoDirectorioProps) {
  const piso = PISOS_INFO[pisoSeleccionado];
  const tarjetaRef = useRef<HTMLDivElement>(null);

  const handleSeleccionarPiso = (num: number) => {
    onSeleccionarPiso(num);
    // Scroll suave hacia la tarjeta de contenido.
    // `block: 'nearest'` evita mover la página si el elemento ya es visible.
    requestAnimationFrame(() => {
      tarjetaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  return (
    <section id="pisos" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-4">
      {/* Encabezado + pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">
            Distribución
          </span>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-700" />
            <span>Directorio de los 5 Pisos</span>
          </h2>
        </div>

        {/* Tabs con layout animation — el pill blanco se desliza entre tabs */}
        <LayoutGroup id="tabs-pisos">
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                id={`tab-piso-${num}`}
                onClick={() => handleSeleccionarPiso(num)}
                className="relative py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors z-10"
                style={{
                  color: pisoSeleccionado === num ? '#0f172a' : '#475569',
                }}
              >
                {/* Pill animado que se mueve con layout */}
                {pisoSeleccionado === num && (
                  <motion.span
                    layoutId="tab-pill-activo"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Piso {num}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Tarjeta principal con AnimatePresence para el swap de contenido */}
      <div ref={tarjetaRef} className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-xs overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pisoSeleccionado}
            variants={variantesContenido}
            initial="oculto"
            animate="visible"
            exit="salida"
            className="p-5 space-y-4"
          >
            {/* Header de la tarjeta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Título del piso */}
              <div>
                <motion.span
                  className="text-[10px] font-bold text-red-700 uppercase tracking-wider block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.05 } }}
                >
                  Nivel {piso.nivel}
                </motion.span>
                <h3 className="font-display font-bold text-base text-slate-900">{piso.nombre}</h3>
                <p className="text-xs text-slate-500">{piso.habitaciones}</p>
              </div>

              {/* Badge WiFi con spring */}
              <motion.div
                variants={variantesWifi}
                initial="oculto"
                animate="visible"
                className="bg-blue-50 p-2.5 px-3 rounded-xl border border-blue-100 text-xs space-y-0.5 shrink-0"
              >
                <div className="flex items-center gap-1.5 text-blue-700 text-[11px] font-semibold">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Wi-Fi disponible en este piso</span>
                </div>
                <p className="text-[10px] text-blue-500">
                  Credenciales entregadas en recepción al hacer check-in
                </p>
              </motion.div>
            </div>

            {/* Características y áreas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Lista con stagger */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Características
                </span>
                <motion.ul
                  className="space-y-1.5 text-slate-600"
                  variants={variantesLista}
                  initial="oculto"
                  animate="visible"
                >
                  {piso.caracteristicas.map((caracteristica) => (
                    <motion.li
                      key={caracteristica}
                      variants={variantesItem}
                      className="flex items-start gap-2"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                      />
                      <span>{caracteristica}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Área de servicio */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Áreas de Servicio
                </span>
                <motion.div
                  variants={variantesArea}
                  initial="oculto"
                  animate="visible"
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed"
                >
                  {piso.areas}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
