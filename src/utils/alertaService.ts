import Swal from 'sweetalert2';

/**
 * Utilidad de alertas y confirmaciones de Hotel Cúcuta usando SweetAlert2
 * Diseñado con estética limpia, tipografías elegantes y estilos alineados con Tailwind.
 */
export const alertaService = {
  /**
   * Alerta de saldo pendiente que impide el Check-Out.
   * Permite al recepcionista ir directamente a registrar el abono o cerrar.
   */
  async saldoPendienteCheckOut(saldo: number, opciones?: { onIrAFacturacion?: () => void }) {
    const formattedSaldo = saldo > 0 ? `$${saldo.toLocaleString('es-CO')} COP` : '';

    return Swal.fire({
      icon: 'warning',
      title: 'Saldo Pendiente de Pago',
      html: `
        <div style="font-size: 13px; color: #475569; text-align: center; line-height: 1.6;">
          <p style="margin-bottom: 8px;">
            No se puede realizar el <b>Check-Out</b> porque el huésped registra un saldo pendiente de liquidación.
          </p>
          ${
            saldo > 0
              ? `<div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 6px 14px; margin: 8px 0; color: #b91c1c; font-weight: 700; font-family: monospace; font-size: 15px;">
                  Saldo a Pagar: ${formattedSaldo}
                </div>`
              : ''
          }
          <p style="margin-top: 8px; font-size: 12px; color: #64748b;">
            Por favor registre el abono o pago restante de la habitación y consumos antes de dar salida formal.
          </p>
        </div>
      `,
      showCancelButton: Boolean(opciones?.onIrAFacturacion),
      confirmButtonText: opciones?.onIrAFacturacion ? '💳 Registrar Abono / Pagar' : 'Entendido',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#94a3b8',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-xs shadow-md',
        cancelButton: 'rounded-xl px-4 py-2.5 font-semibold text-xs',
      },
    }).then((result) => {
      if (result.isConfirmed && opciones?.onIrAFacturacion) {
        opciones.onIrAFacturacion();
      }
      return result;
    });
  },

  /**
   * Confirmación elegante antes de realizar el Check-Out.
   */
  async confirmarCheckOut(codigoEstadia: string, habitacion: string) {
    return Swal.fire({
      icon: 'question',
      title: '¿Confirmar Check-Out?',
      html: `
        <div style="font-size: 13px; color: #475569; text-align: center;">
          <p>¿Desea registrar la salida de la estadía <b>${codigoEstadia}</b> (Habitación <b>${habitacion}</b>)?</p>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
            La habitación pasará a estado de limpieza/mantenimiento y se emitirá la factura final.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, Registrar Salida',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl px-4 py-2.5 font-bold text-xs shadow-md',
        cancelButton: 'rounded-xl px-4 py-2.5 font-semibold text-xs',
      },
    });
  },

  /**
   * Alerta de error general o de negocio sin romper la vista del dashboard.
   */
  error(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-xs',
      },
    });
  },

  /**
   * Alerta de advertencia.
   */
  advertencia(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje,
      confirmButtonColor: '#d97706',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
        title: 'text-lg font-bold text-slate-900',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-xs',
      },
    });
  },

  /**
   * Alerta de éxito.
   */
  exito(titulo: string, mensaje?: string) {
    return Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      timer: 2500,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl p-6 border border-slate-100',
        title: 'text-lg font-bold text-slate-900',
      },
    });
  },
};
