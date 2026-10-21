/**
 * Utilidad de exportación estructurada a formato CSV compatible con Microsoft Excel (UTF-8 con BOM)
 * para los libros contables de Hotel Cúcuta.
 */

export function descargarCSV(nombreArchivo: string, columnas: string[], filas: (string | number)[][]): void {
  const formatearCelda = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const texto = String(val).replace(/"/g, '""');
    return `"${texto}"`;
  };

  const encabezado = columnas.map(formatearCelda).join(';');
  const contenido = filas.map((f) => f.map(formatearCelda).join(';')).join('\r\n');
  const csvCompleto = '\uFEFF' + encabezado + '\r\n' + contenido;

  const blob = new Blob([csvCompleto], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${nombreArchivo}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 1. Exportar Libro de Facturas y Ventas
export function exportarLibroFacturas(facturas: any[]): void {
  const columnas = [
    'Código Factura',
    'Fecha Emisión',
    'Huésped / Razón Social',
    'C.C. / NIT',
    'Habitación',
    'Subtotal COP',
    'IVA COP',
    'Total Factura COP',
    'Saldo Pendiente COP',
    'Estado',
    'Estado DIAN / CUFE',
  ];

  const filas = facturas.map((f) => [
    f.numero_factura || f.codigo_factura || `FAC-${f.id}`,
    f.fecha_emision ? f.fecha_emision.substring(0, 16).replace('T', ' ') : '',
    f.cliente_nombre || (f.huesped ? `${f.huesped.nombres} ${f.huesped.apellidos}` : 'Cliente General'),
    f.cliente_documento || (f.huesped ? f.huesped.numero_documento : ''),
    f.habitacion_numero || f.habitacion || (f.estadia?.habitacion_numero) || 'N/A',
    f.subtotal || f.total || 0,
    f.iva || 0,
    f.total || f.total_factura || 0,
    f.saldo_pendiente_dinamico ?? 0,
    f.estado || 'emitida',
    f.cufe ? 'Remitida DIAN' : 'Pendiente / Local',
  ]);

  const fechaHoy = new Date().toISOString().slice(0, 10);
  descargarCSV(`Libro_Facturas_Ventas_${fechaHoy}`, columnas, filas);
}

// 2. Exportar Libro de Recaudos / Caja
export function exportarLibroRecaudos(recibos: any[]): void {
  const columnas = [
    'N° Recibo',
    'Fecha Pago',
    'Huésped / Estadía',
    'Método de Pago',
    'Concepto',
    'Valor Recibido COP',
  ];

  const filas = recibos.map((r) => [
    r.numero_recibo || `REC-${r.id}`,
    r.fecha_pago ? r.fecha_pago.substring(0, 16).replace('T', ' ') : '',
    r.usuario_nombre || r.huesped_nombre || (r.estadia ? r.estadia.codigo_estadia : 'Recepción General'),
    (r.metodo_pago || 'efectivo').toUpperCase(),
    r.concepto || 'Abono hospedaje',
    r.valor || r.valor_recibido || 0,
  ]);

  const fechaHoy = new Date().toISOString().slice(0, 10);
  descargarCSV(`Libro_Recaudos_Caja_${fechaHoy}`, columnas, filas);
}

// 3. Exportar Libro de Egresos de Caja Menor
export function exportarLibroEgresos(egresos: any[]): void {
  const columnas = [
    'Fecha',
    'N° Arqueo / Turno',
    'Categoría',
    'Concepto',
    'Beneficiario / Proveedor',
    'N° Comprobante',
    'Monto COP',
  ];

  const filas = egresos.map((e) => [
    e.created_at ? e.created_at.substring(0, 16).replace('T', ' ') : '',
    e.arqueo_caja_id ? `Turno #${e.arqueo_caja_id}` : 'Turno Actual',
    e.categoria || 'otros',
    e.concepto || '',
    e.beneficiario || 'N/A',
    e.comprobante || 'N/A',
    e.monto || 0,
  ]);

  const fechaHoy = new Date().toISOString().slice(0, 10);
  descargarCSV(`Libro_Egresos_CajaMenor_${fechaHoy}`, columnas, filas);
}
