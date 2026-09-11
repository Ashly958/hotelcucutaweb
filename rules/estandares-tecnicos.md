# Estándares Técnicos, Variables de Entorno, Seguridad y Definition of Done

Este documento establece las directrices de configuración, seguridad, desarrollo de funcionalidades y el checklist de criterios de aceptación (*Definition of Done*) para el frontend de **Hotel Cúcuta**.

---

## 1. Variables de Entorno (`.env`)

Vite utiliza el prefijo `VITE_` para exponer variables al bundle del cliente en tiempo de compilación.

### 1.1 Configuración Estándar
```env
# .env.example
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Hotel Cúcuta"
VITE_STORAGE_URL=http://localhost:8000/storage
VITE_ENVIRONMENT=development
```

### 1.2 Consumo en Código
```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

> **Prohibido:** Hardcodear URLs de entornos (`https://produccion.hotelcucuta.com/api`) directamente en el código fuente.

### 1.3 Qué DEBE ir en Variables de Entorno:
* URLs base de APIs y microservicios.
* URLs de almacenamiento de imágenes o CDN.
* Claves públicas de proveedores externos (ej. Public Key de pasarela de pagos).
* Banderas de características (*Feature Flags*).

### 1.4 Qué NUNCA debe ir en Variables de Entorno del Frontend:
> [!CAUTION]
> **El bundle de JavaScript generado por Vite es público y visible para cualquier usuario que inspeccione la web en su navegador.**
> 
> Queda terminantemente prohibido incluir:
> * Contraseñas de bases de datos.
> * Claves privadas (`private_key`, `secret_key`).
> * Secretos de APIs del backend (`API_SECRET`).
> * Tokens de administración maestros.

---

## 2. Seguridad en el Cliente

1. **Prevención de XSS:** Evitar el uso de `dangerouslySetInnerHTML`. Confiar siempre en el escape automático de JSX.
2. **Manejo de Sesión:** Al detectar un error `401 Unauthorized` o cierre de sesión, borrar inmediatamente los tokens en memoria y en almacenamiento local antes de redirigir al login.
3. **Validación de Formularios:** Validar las entradas tanto en cliente (para brindar feedback visual instantáneo con Tailwind) como en el backend Laravel (que actúa siempre como la autoridad definitiva).

---

## 3. Guía Paso a Paso para Crear una Funcionalidad

Cuando deba implementar una nueva pantalla o funcionalidad (ej. *"Crear reserva desde la recepción"*), siga este procedimiento ordenado:

```
Paso 1: Identificar o crear el módulo en src/modules/<NombreModulo>/
   ↓
Paso 2: Modelar los tipos e interfaces en types/<modulo>.types.ts (Entidad, DTO, Props)
   ↓
Paso 3: Implementar el servicio en services/<modulo>Service.ts consumiendo @/services/api
   ↓
Paso 4: Crear el custom hook en hooks/use<Accion>.ts (gestiona loading, error, submit)
   ↓
Paso 5: Crear o reutilizar componentes atómicos en components/
   ↓
Paso 6: Ensamblar la pantalla en pages/<Accion>Page.tsx conectando el hook con la UI
   ↓
Paso 7: Registrar la ruta en la configuración de navegación (pública o protegida)
   ↓
Paso 8: Implementar los estados visuales (Loading, Empty, Error, Success)
   ↓
Paso 9: Aplicar estilos responsivos consistentes con Tailwind CSS
   ↓
Paso 10: Validar que TypeScript compile sin advertencias ni uso de 'any'
```

---

## 4. Antipatrones Prohibidos ("Qué NO Hacer")

* ❌ **No colocar Axios dentro de Pages o Components.** Las llamadas HTTP pertenecen exclusivamente a `services/` y son orquestadas por `hooks/`.
* ❌ **No colocar reglas de negocio dentro de componentes visuales.**
* ❌ **No ubicar componentes exclusivos de un módulo dentro de `src/components/` globales.**
* ❌ **No concatenar Bearer Token manualmente en cada servicio.**
* ❌ **No utilizar `any` en TypeScript.**
* ❌ **No utilizar Redux para almacenar estados locales de un componente.**
* ❌ **No crear componentes o hooks monolíticos ("God Components").**
* ❌ **No exponer mensajes técnicos crudos de base de datos en la interfaz.**

---

## 5. Definition of Done (DoD) del Frontend

Una tarea, componente o pantalla se considera **terminada y lista para producción** únicamente cuando cumple con los 17 puntos del siguiente checklist:

- [ ] **1. Ubicación Modular:** La funcionalidad reside dentro del módulo adecuado en `src/modules/<NombreModulo>/`.
- [ ] **2. Tipado Fuerte:** Todos los modelos, DTOs y props cuentan con interfaces TypeScript estrictas.
- [ ] **3. Cero `any`:** No se utilizó `any` injustificado.
- [ ] **4. Servicios HTTP:** Todas las peticiones pasan por `services/` utilizando la instancia central `@/services/api`.
- [ ] **5. Interceptor de Autenticación:** El Bearer Token es inyectado por el interceptor global sin código manual.
- [ ] **6. Variables de Entorno:** Las URLs externas y configuraciones de entorno provienen de `import.meta.env`.
- [ ] **7. Cero Secretos:** No se expusieron contraseñas, secretos ni llaves privadas en el código ni en el `.env`.
- [ ] **8. Lógica en Hooks:** La orquestación, estados de carga y errores residen en custom hooks.
- [ ] **9. Páginas Enfocadas:** Las páginas solo se encargan de composición y renderizado visual.
- [ ] **10. Componentes Cohesivos:** Cada componente visual tiene una responsabilidad única y props claras.
- [ ] **11. Paginación Estandarizada:** Las tablas o listas con paginación utilizan la estructura y componentes estándar.
- [ ] **12. Estados de UI Contemplados:** Se manejan adecuadamente los estados de `Loading`, `Success`, `Empty` y `Error`.
- [ ] **13. Errores Amigables:** Los mensajes de error al usuario son claros y libres de tecnicismos crudos.
- [ ] **14. Estado Global Racional:** Redux Toolkit solo se utilizó si el dato requiere compartirse entre módulos.
- [ ] **15. Tailwind CSS:** El diseño utiliza clases utilitarias de Tailwind sin estilos inline arbitrarios.
- [ ] **16. Módulos Desacoplados:** No existen dependencias internas directas entre módulos independientes.
- [ ] **17. Nomenclatura Estricta:** Conceptos de negocio en español, estructura técnica en inglés, sin archivos redundantes.
