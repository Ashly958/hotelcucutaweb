/**
 * Utilidades para formateo y envío de mensajes oficiales por WhatsApp
 * para Hotel Cúcuta.
 */

export function normalizarTelefonoColombia(telefono?: string | null): string {
  if (!telefono) return '';
  const digits = telefono.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('57') && digits.length === 12) {
    return digits;
  }
  if (digits.length === 10) {
    return `57${digits}`;
  }
  return digits;
}

export function generarEnlaceWhatsApp(telefono?: string | null, mensaje: string = ''): string {
  const telNorm = normalizarTelefonoColombia(telefono);
  const textoCodificado = encodeURIComponent(mensaje);
  return telNorm
    ? `https://wa.me/${telNorm}?text=${textoCodificado}`
    : `https://wa.me/?text=${textoCodificado}`;
}

export function abrirWhatsApp(telefono?: string | null, mensaje: string = ''): void {
  const url = generarEnlaceWhatsApp(telefono, mensaje);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function formatearMensajeFactura(datos: {
  codigoFactura: string;
  clienteNombre: string;
  total: number;
  totalPagado: number;
  saldo: number;
  habitacionNumero?: string;
  cufe?: string;
}): string {
  const estado = datos.saldo <= 0 ? '✅ Al día (Paz y Salvo)' : '⏳ Pendiente de liquidación';
  return [
    `🏨 *HOTEL CÚCUTA* - Comprobante de Factura`,
    `----------------------------------------`,
    `Estimado(a) *${datos.clienteNombre}*,`,
    `Le compartimos el detalle de su factura electrónica:`,
    ``,
    `📄 *Factura:* ${datos.codigoFactura}`,
    datos.habitacionNumero ? `🚪 *Habitación:* ${datos.habitacionNumero}` : null,
    `💵 *Total Factura:* $${datos.total.toLocaleString('es-CO')} COP`,
    `💳 *Total Pagado:* $${datos.totalPagado.toLocaleString('es-CO')} COP`,
    `💰 *Saldo Pendiente:* $${datos.saldo.toLocaleString('es-CO')} COP`,
    `📌 *Estado:* ${estado}`,
    datos.cufe ? `🔐 *CUFE DIAN:* ${datos.cufe.slice(0, 20)}...` : null,
    ``,
    `Gracias por preferir a Hotel Cúcuta. ¡Esperamos que haya disfrutado su estadía!`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatearMensajeReciboCaja(datos: {
  numeroRecibo: string;
  clienteNombre: string;
  valor: number;
  metodoPago: string;
  concepto: string;
  saldoRestante?: number;
}): string {
  const saldoTxt =
    datos.saldoRestante !== undefined && datos.saldoRestante > 0
      ? `\n💰 *Saldo Restante:* $${datos.saldoRestante.toLocaleString('es-CO')} COP`
      : '\n✅ *Saldo:* $0 (Al día)';

  return [
    `🏨 *HOTEL CÚCUTA* - Recibo de Caja`,
    `----------------------------------------`,
    `Estimado(a) *${datos.clienteNombre}*,`,
    `Hemos registrado su pago satisfactoriamente:`,
    ``,
    `🧾 *Comprobante N°:* ${datos.numeroRecibo}`,
    `💵 *Monto Recibido:* $${datos.valor.toLocaleString('es-CO')} COP`,
    `💳 *Método de Pago:* ${datos.metodoPago.toUpperCase()}`,
    `📝 *Concepto:* ${datos.concepto}${saldoTxt}`,
    ``,
    `Gracias por su confianza en Hotel Cúcuta.`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatearMensajeInformeEstadia(datos: {
  codigoEstadia: string;
  huespedNombre: string;
  habitacionNumero?: string;
  totalCargos: number;
  totalAbonos: number;
  saldoPendiente: number;
}): string {
  const estado = datos.saldoPendiente <= 0 ? '✅ Al día (Paz y Salvo)' : '⏳ Pendiente de liquidación';
  return [
    `🏨 *HOTEL CÚCUTA* - Estado de Cuenta / Folio`,
    `----------------------------------------`,
    `Estimado(a) *${datos.huespedNombre}*,`,
    `Le compartimos el resumen oficial de su estadía:`,
    ``,
    `📋 *Folio de Estadía:* ${datos.codigoEstadia}`,
    datos.habitacionNumero ? `🚪 *Habitación:* ${datos.habitacionNumero}` : null,
    `🏨 *Total Cargos:* $${datos.totalCargos.toLocaleString('es-CO')} COP`,
    `💳 *Total Abonos:* $${datos.totalAbonos.toLocaleString('es-CO')} COP`,
    `💰 *Saldo Pendiente:* $${datos.saldoPendiente.toLocaleString('es-CO')} COP`,
    `📌 *Estado:* ${estado}`,
    ``,
    `Para cualquier consulta adicional, la recepción está a su entera disposición.`,
  ]
    .filter(Boolean)
    .join('\n');
}
