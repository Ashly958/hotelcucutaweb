import { BrandBadge } from '@/components';
import { LoginBanner } from '../components/LoginBanner';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

export function LoginPage() {
  const { cargando, error, iniciarSesion, limpiarError } = useLogin();

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-[#FAF8F5] text-neutral-900 font-sans">
      {/* Banner Izquierdo Limpio con Foto de Hotel y Logo Transparente */}
      <LoginBanner />

      {/* Panel Derecho de Formulario (El que le gustaba al usuario) */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 sm:p-8 xl:p-10 overflow-hidden">
        {/* Cabecera Superior */}
        <div className="flex items-center justify-between shrink-0">
          <BrandBadge />
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema 24/7 Conectado</span>
          </div>
        </div>

        {/* Bloque Central de Formulario */}
        <div className="my-auto w-full">
          <div className="max-w-sm mx-auto mb-4 text-center sm:text-left space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Ingreso al Sistema
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Panel de Control y Operación de Hotel Cúcuta
            </p>
          </div>

          <LoginForm
            cargando={cargando}
            error={error}
            onSubmit={(credenciales) => iniciarSesion(credenciales, '/dashboard')}
            onLimpiarError={limpiarError}
          />
        </div>

        {/* Pie Discreto */}
        <div className="shrink-0 pt-2 border-t border-neutral-200/60 text-center text-[10px] text-neutral-400">
          <span>Hotel Cúcuta · Sistema PMS v1.0 · Cúcuta, Norte de Santander</span>
        </div>
      </div>
    </div>
  );
}
