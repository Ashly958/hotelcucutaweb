import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/modules/Login/pages/LoginPage';
import { HabitacionesPage } from '@/modules/Habitaciones/pages/HabitacionesPage';
import { OnboardingPage } from '@/modules/Onboarding/pages/OnboardingPage';
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

      {/* Ruta Protegida: Panel Inicial PMS (Control de Habitaciones) */}
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

      {/* Ruta Pública: Onboarding (Landing) */}
      <Route path="/" element={<OnboardingPage />} />

      {/* Ruta por defecto para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
