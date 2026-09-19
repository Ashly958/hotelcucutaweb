import logoHC from '@/assets/logotipo_hotel_cucuta.png';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

export function LoginPage() {
  const { cargando, error, iniciarSesion, limpiarError } = useLogin();

  return (
    <div className="h-screen max-h-screen w-full flex flex-col justify-between bg-[#F8FAFC] text-slate-800 font-sans px-4 py-3 sm:px-8 sm:py-5 overflow-hidden">
      {/* Cabecera Superior Minimalista y Compacta */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white border border-slate-200/70 p-1 flex items-center justify-center shadow-soft-xs">
            <img src={logoHC} alt="Hotel Cúcuta" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
              HOTEL CÚCUTA
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none block">
              Gestión Hotelera · 45 Habitaciones
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-200/70 px-2.5 py-1 rounded-full shadow-soft-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistema PMS Activo</span>
        </div>
      </header>

      {/* Tarjeta Central en Una Sola Vista (Sin Scroll) */}
      <main className="w-full max-w-md mx-auto my-auto py-2">
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 sm:p-6 shadow-soft-lg">
          <div className="text-center mb-4 space-y-1">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-red-50 text-red-700 border border-red-100 shadow-soft-xs mb-1">
              <img src={logoHC} alt="Logo" className="h-6 w-auto object-contain" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-[11px] text-slate-500">
              Seleccione un perfil de acceso rápido o ingrese sus credenciales
            </p>
          </div>

          <LoginForm
            cargando={cargando}
            error={error}
            onSubmit={(credenciales) => iniciarSesion(credenciales, '/dashboard')}
            onLimpiarError={limpiarError}
          />
        </div>
      </main>

      {/* Pie Discreto y Sereno */}
      <footer className="w-full text-center text-[10px] sm:text-[11px] text-slate-400 font-medium shrink-0 pb-1">
        Hotel Cúcuta · Sistema PMS v1.0 · Cúcuta, Norte de Santander
      </footer>
    </div>
  );
}
