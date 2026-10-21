import { motion } from 'framer-motion';
import logoHC from '@/assets/logotipo_hotel_cucuta.png';
import hotelLoginBg from '@/assets/hotel_login_bg.jpg';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

export function LoginPage() {
  const { cargando, error, iniciarSesion, limpiarError } = useLogin();

  return (
    <div className="min-h-screen w-full flex bg-slate-50 lg:bg-slate-900 font-sans overflow-hidden">
      {/* Sección Izquierda: Imagen de Fondo (oculta en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-slate-900">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={hotelLoginBg}
            alt="Fondo Login"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-10"
        >
          <h2 className="text-4xl xl:text-5xl font-display font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            Bienvenido al Sistema
          </h2>
          <p className="text-slate-300 max-w-md mx-auto leading-relaxed text-sm xl:text-base drop-shadow">
            Gestión hotelera eficiente, centralizada y en tiempo real para brindarle el mejor servicio a sus huéspedes.
          </p>
        </motion.div>
      </div>

      {/* Sección Derecha: Formulario de Login Integrado */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-slate-50 lg:bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative z-10 w-full max-w-sm p-6 sm:p-8"
        >
          <div className="text-center mb-10 space-y-3">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
              className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-red-50 text-red-700 mb-2"
            >
              <img src={logoHC} alt="Logo Hotel Cúcuta" className="h-10 w-auto object-contain" />
            </motion.div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Iniciar Sesión
              </h1>
              <p className="text-[13px] text-slate-500 mt-1">
                Acceso exclusivo para el personal
              </p>
            </div>
          </div>

          <LoginForm
            cargando={cargando}
            error={error}
            onSubmit={(credenciales) => iniciarSesion(credenciales, '/dashboard')}
            onLimpiarError={limpiarError}
          />

          {/* Pie de página */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center text-xs text-slate-400 font-medium"
          >
            &copy; {new Date().getFullYear()} Hotel Cúcuta. Todos los derechos reservados.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
