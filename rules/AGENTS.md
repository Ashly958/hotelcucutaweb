# Directivas y Reglas para Agentes de IA (Frontend Hotel Cúcuta)

> **Este archivo contiene las directivas e instrucciones de cumplimiento obligatorio para cualquier Agente de IA (Antigravity, Cursor, Copilot, etc.) que desarrolle o modifique código en el frontend de Hotel Cúcuta.**

---

## 🧭 Contexto y Filosofía Fundamental

Estás desarrollando el frontend web de **Hotel Cúcuta**, construido con **React, Vite, TypeScript, Redux Toolkit, Tailwind CSS y Axios**, siguiendo una **Arquitectura Modular orientada a Contextos de Negocio**.

Tu principio rector supremo es:
> **"LA UI DEBE SER SIMPLE; LA LÓGICA DEBE ESTAR ORGANIZADA Y AISLADA."**
> Los componentes visuales y páginas se limitan a presentar información y recibir eventos. La lógica de negocio y las llamadas a la API pertenecen a custom hooks y servicios centralizados.

---

## 🚫 Reglas Inquebrantables (DON'Ts)

1. **NUNCA invoques Axios desde Componentes o Páginas**:
   * ❌ `axios.get(...)` o `api.get(...)` dentro de `HabitacionesPage.tsx` o `HabitacionCard.tsx`.
   * ✅ La UI consume custom hooks (`useHabitaciones()`), los hooks llaman a `services/`, y los servicios usan la instancia `@/services/api`.
2. **NUNCA instancies Axios de forma aislada**:
   * ❌ `axios.create(...)` dentro de `modules/Login/services/`.
   * ✅ Todos los servicios deben importar el cliente central `import { api } from '@/services/api';`.
3. **NUNCA concatenes Bearer Token manualmente**:
   * ❌ `headers: { Authorization: \`Bearer ${token}\` }` en cada servicio.
   * ✅ El interceptor central de Axios se encarga automáticamente de inyectar el token.
4. **NUNCA expongas secretos en el frontend**:
   * ❌ Claves privadas, contraseñas de BD o API secrets en variables `VITE_*` o en el bundle.
5. **NUNCA utilices `any` en TypeScript**:
   * Modela interfaces explícitas para props, modelos y respuestas de API. Usa `unknown` con guardas de tipo si la estructura es verdaderamente incierta.
6. **NUNCA utilices Redux para estados puramente locales**:
   * Modales, pestañas, toggles e inputs de un componente deben gestionarse con `useState`.
7. **NUNCA uses inglés para los nombres de módulos o conceptos del negocio**:
   * ❌ `modules/Rooms`, `modules/Bookings`, `interface User`
   * ✅ `modules/Habitaciones`, `modules/Reservas`, `interface Usuario`
8. **NUNCA importes componentes internos de otro módulo**:
   * ❌ `import { Item } from '@/modules/Habitaciones/components/SubItem';` en `Reservas`.
   * ✅ Promueve componentes compartidos a `src/components/`.

---

## ✅ Directivas de Implementación (DOs)

1. **Flujo de Peticiones Determinista**:
   ```
   Page ──► Component ──► Hook ──► Service ──► Axios Central ──► Interceptor (Bearer) ──► API
   ```
2. **Estructura Estándar de Módulo**:
   Organiza cada módulo dentro de `src/modules/<NombreEnEspañol>/`:
   * `components/`: UI específica del módulo.
   * `hooks/`: Custom hooks con estado, loading y llamadas al servicio.
   * `pages/`: Vistas ensambladas para enrutamiento.
   * `services/`: Consumo de endpoints con `api`.
   * `types/`: Interfaces del módulo (`<modulo>.types.ts`).
3. **Uso del Alias `@`**:
   Configura y utiliza siempre `@/` apuntando a `src/` (ej. `@/services/api`, `@/components/Button`).
4. **Tailwind CSS Estándar**:
   Usa clases utilitarias de Tailwind. Prohibidos estilos inline arbitrarios (`style={{ ... }}`).
5. **Soporte de los 4 Estados Visuales**:
   Siempre que un hook consuma datos asíncronos, la UI debe contemplar: `Loading`, `Success`, `Empty` y `Error`.
6. **Contratos Tipados de API**:
   Consume las respuestas utilizando las interfaces genéricas `RespuestaApi<T>` y `RespuestaPaginada<T>`.

---

## 🛠️ Guía Paso a Paso para Implementar una Funcionalidad

Cuando el usuario te solicite una nueva funcionalidad en el frontend:

1. **Ubicación:** Verifica si pertenece a un módulo existente o si requiere crear uno nuevo en `src/modules/`.
2. **Tipos:** Define o ajusta las interfaces de TypeScript en `types/<modulo>.types.ts` (`Entidad`, `DTO`, `Props`).
3. **Servicio:** Implementa las funciones asíncronas en `services/<modulo>Service.ts` utilizando `@/services/api`.
4. **Hook:** Crea el custom hook en `hooks/use<Funcionalidad>.ts` administrando los estados `cargando`, `error` y las acciones.
5. **Componentes:** Desarrolla los componentes visuales necesarios en `components/` con tipado estricto en sus props y clases de Tailwind CSS.
6. **Página:** Crea la pantalla en `pages/<Funcionalidad>Page.tsx` conectando el hook con los componentes visuales.
7. **Rutas:** Agrega la ruta en el router correspondiente (protegida mediante `ProtectedRoute` si requiere autenticación).
8. **Verificación:** Valida que no haya errores de compilación en TypeScript ni advertencias de ESLint.

---

## 📋 Checklist de Validación Pre-Entrega

Antes de confirmar tu respuesta o cambios al usuario, revisa:
- [ ] ¿El componente o página está libre de llamadas directas a Axios?
- [ ] ¿Los servicios HTTP utilizan el cliente centralizado `@/services/api`?
- [ ] ¿Todos los datos y props están tipados sin usar `any`?
- [ ] ¿Los nombres de conceptos del negocio están en español y las carpetas técnicas en inglés?
- [ ] ¿Se manejaron los estados de carga (`loading`) y error de forma amigable?
- [ ] ¿Se utilizaron clases de Tailwind CSS en lugar de estilos inline?
- [ ] ¿No se añadieron secretos ni credenciales sensibles en el frontend?

---

## 📚 Enlaces de Referencia
* [Visión General y Mapa Documental](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/README.md)
* [Arquitectura Modular y Flujos](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/arquitectura.md)
* [Estructura de Carpetas y Módulos](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estructura-y-modulos.md)
* [Gestión de Estado y Servicios HTTP](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estado-y-servicios.md)
* [Convenciones de Código y Nomenclatura](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/convenciones.md)
* [Estándares Técnicos y Definition of Done](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estandares-tecnicos.md)
