import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/modules/Login/pages/LoginPage';
import { HabitacionesPage } from '@/modules/Habitaciones/pages/HabitacionesPage';
import { EstadiasPage } from '@/modules/Estadias/pages/EstadiasPage';
import { FacturacionPage } from '@/modules/Facturacion/pages/FacturacionPage';
import { InventariosPage } from '@/modules/Inventarios/pages/InventariosPage';
import { PisosPage } from '@/modules/Pisos/pages/PisosPage';
import { UsuariosPage } from '@/modules/Usuarios/pages/UsuariosPage';
import { InformacionHotelPage } from '@/modules/InformacionHotel/pages/InformacionHotelPage';
import { OnboardingPage } from '@/modules/Onboarding/pages/OnboardingPage';
import { ReportesPage } from '@/modules/Reportes/pages/ReportesPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Ruta Pública: Login */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />

      {/* Ruta Pública / Directa: Guía de Onboarding para Huéspedes */}
      <Route
        path="/guia"
        element={
          <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <OnboardingPage />
            </div>
          </div>
        }
      />

      {/* Rutas Protegidas en MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HabitacionesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/habitaciones"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HabitacionesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/estadias"
        element={
          <ProtectedRoute rolesPermitidos={['ADMIN', 'RECEPCION']}>
            <MainLayout>
              <EstadiasPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/facturacion"
        element={
          <ProtectedRoute rolesPermitidos={['ADMIN', 'RECEPCION']}>
            <MainLayout>
              <FacturacionPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventarios"
        element={
          <ProtectedRoute>
            <MainLayout>
              <InventariosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pisos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PisosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute rolesPermitidos={['ADMIN']}>
            <MainLayout>
              <UsuariosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/informacion-hotel"
        element={
          <ProtectedRoute rolesPermitidos={['ADMIN', 'RECEPCION']}>
            <MainLayout>
              <InformacionHotelPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OnboardingPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <ProtectedRoute rolesPermitidos={['ADMIN', 'RECEPCION']}>
            <MainLayout>
              <ReportesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirección raíz a /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

