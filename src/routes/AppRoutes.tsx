import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/modules/Login/pages/LoginPage';
import { HabitacionesPage } from '@/modules/Habitaciones/pages/HabitacionesPage';
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

      {/* Redirección raíz a /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
