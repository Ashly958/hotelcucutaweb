import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/** 1. Recepción: Timbre clásico de mostrador de conserjería hotelera */
export function IconoRecepcion({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3v3" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <path d="M4 14a8 8 0 0 1 16 0H4Z" />
      <path d="M2 18h20" />
      <path d="M5 18v1.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V18" />
    </svg>
  );
}

/** 2. Administración: Escudo coronado de autoridad gerencial */
export function IconoAdmin({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2-3 2 2 2-2 2 3v2H9v-2Z" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}

/** 3. Lavandería (Piso 5): Centro textil de lavado industrial */
export function IconoLavanderia({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="2" width="18" height="20" rx="3" />
      <circle cx="12" cy="13" r="5" />
      <path d="M9.5 13.5c.8-.8 1.4-.8 2.2 0 .8.8 1.4.8 2.2 0" />
      <line x1="6" y1="6" x2="10" y2="6" />
      <circle cx="15.5" cy="6" r="1" fill="currentColor" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

/** 4. Mantenimiento: Herramientas de precisión técnica e infraestructura */
export function IconoMantenimiento({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** 5. Cama Hotelera: Cama de hospitalidad con respaldo y lencería higienizada */
export function IconoCamaHotel({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 4v16" />
      <path d="M2 11h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
      <path d="M2 17h20" />
      <path d="M22 13v7" />
      <path d="M6 8h4a1 1 0 0 1 1 1v2H5V9a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

/** 6. Aire Acondicionado: Climatización split con flujo fresco */
export function IconoAireAcondicionado({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="3" width="20" height="8" rx="2" />
      <line x1="6" y1="7.5" x2="10" y2="7.5" />
      <circle cx="17.5" cy="7.5" r="0.8" fill="currentColor" />
      <path d="M6 14.5c0 2 2 2.8 2 4" />
      <path d="M12 14.5c0 2.2 1.5 3 1.5 4" />
      <path d="M18 14.5c0 2 2 2.8 2 4" />
    </svg>
  );
}

/** 7. Ventilador: Aspas aerodinámicas de flujo continuo */
export function IconoVentilador({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5C12 5 15 3 17 4.5s0 5.5-5 5" />
      <path d="M9.8 13.3c-3.9 2.2-6.4 1.3-6.6-1.2s3.6-4.2 6.6 1.2" />
      <path d="M14.2 13.3c3.9 2.2 4.4 5.2 2.2 6.5s-6.1-.7-2.2-6.5" />
    </svg>
  );
}

/** 8. Efectivo (RN-010): Billete oficial y arqueo de caja en recepción */
export function IconoEfectivo({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M6 9h.01M18 15h.01" />
    </svg>
  );
}

/** 9. Llave / Check-In: Llave de habitación con medallón */
export function IconoLlaveCheckIn({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m11 12 8-8" />
      <path d="m16 4 3 3" />
      <path d="m13 7 2 2" />
    </svg>
  );
}

/** 10. Documento Oficial: Libro de Policía Nacional y reporte SIRE (RF-008) */
export function IconoDocumentoRegistro({ size = 18, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="2.5" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8" />
      <path d="M8 14h4" />
    </svg>
  );
}
