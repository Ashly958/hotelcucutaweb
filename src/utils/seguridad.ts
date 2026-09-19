/**
 * Módulo de Seguridad y Protección de Consola en el Navegador.
 * 
 * Cumple con el requerimiento expreso del usuario:
 * "claramente tene ncuenta de bloquear todo en la consola del navegador, lo de los json y demas. que sea segura."
 * 
 * - Neutraliza console.log, console.debug, console.info, console.dir, console.table.
 * - Sanitiza console.error y console.warn para evitar fugas de objetos JSON, tokens, payloads o contraseñas.
 * - Evita la exposición de datos del negocio en las herramientas de desarrollo del navegador.
 */

export function inicializarSeguridadNavegador(): void {
  const noop = () => {};

  if (typeof window !== 'undefined') {
    window.console.log = noop;
    window.console.debug = noop;
    window.console.info = noop;
    window.console.dir = noop;
    window.console.dirxml = noop;
    window.console.table = noop;
    window.console.trace = noop;

    const originalWarn = window.console.warn;
    window.console.warn = (...args: unknown[]) => {
      const sanitized = args.map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          return '[Dato protegido]';
        }
        return arg;
      });
      originalWarn.apply(window.console, sanitized);
    };

    const originalError = window.console.error;
    window.console.error = (...args: unknown[]) => {
      const sanitized = args.map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          return '[Error protegido del sistema]';
        }
        return arg;
      });
      originalError.apply(window.console, sanitized);
    };
  }
}
