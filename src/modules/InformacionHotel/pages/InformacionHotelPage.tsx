import { useInformacionHotel } from '../hooks/useInformacionHotel';
import { InformacionHotelForm } from '../components/InformacionHotelForm';
import { Loading, ErrorState } from '@/components';
import { CheckCircle2 } from 'lucide-react';

export function InformacionHotelPage() {
  const { info, cargando, guardando, error, mensajeExito, guardarInformacion, recargar } =
    useInformacionHotel();

  if (cargando) {
    return <Loading mensaje="Cargando configuración institucional del hotel..." />;
  }

  if (error) {
    return <ErrorState mensaje={error} onReintentar={recargar} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
          Información del Hotel & Políticas
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configuración central de datos tributarios, conectividad Wi-Fi, horarios de Check-Out y normas de convivencia familiar.
        </p>
      </div>

      {mensajeExito && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Formulario */}
      <InformacionHotelForm
        info={info}
        guardando={guardando}
        onGuardar={guardarInformacion}
      />
    </div>
  );
}
