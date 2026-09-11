import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout minimalista para flujos públicos (Login, Recuperación de contraseña).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="min-h-screen w-full bg-[#FAF8F5]">{children}</div>;
}
