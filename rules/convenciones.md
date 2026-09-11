# Convenciones de Código, Estilo y Nombres

Este documento detalla los estándares de nomenclatura, idioma, buenas prácticas en TypeScript, reglas de Tailwind CSS y convenciones de imports para el frontend de **Hotel Cúcuta**.

---

## 1. Regla del Idioma en el Frontend

Para preservar la coherencia con el backend y el lenguaje del negocio del hotel, se aplica una convención dual estricta:

### 1.1 Conceptos de Negocio: En Español
Todo lo que modele o represente el negocio hotelero debe escribirse en **español**:

* **Módulos:** `modules/Habitaciones/`, `modules/Reservas/`, `modules/Usuarios/`, `modules/Huespedes/`, `modules/Pagos/`.
* **Modelos e Interfaces:** `Habitacion`, `Reserva`, `Huesped`, `Tarifa`, `Usuario`.
* **DTOs y Tipos:** `CrearHabitacionDTO`, `EstadoReserva`.
* **Variables y Funciones:** `habitacionSeleccionada`, `calcularNoches()`.

### 1.2 Términos Técnicos y Ecosistema: En Inglés
La estructura de directorios técnicos y las palabras reservadas del ecosistema permanecen en **inglés**:

* **Carpetas:** `components/`, `hooks/`, `layouts/`, `pages/`, `services/`, `types/`, `utils/`, `store/`.
* **Términos técnicos:** `Component`, `Hook`, `Service`, `Props`, `State`, `Slice`, `Reducer`, `Payload`.

---

## 2. Tabla Exhaustiva de Nomenclatura

| Elemento | Convención | Ejemplo Válido | Prohibido |
| :--- | :--- | :--- | :--- |
| **Módulos** | `PascalCase` (Español) | `Habitaciones`, `Reservas`, `Usuarios` | `rooms`, `habitacion_modulo` |
| **Carpetas técnicas** | `lowercase` (Inglés) | `components`, `hooks`, `services` | `Componentes`, `Hooks` |
| **Componentes React** | `PascalCase.tsx` | `HabitacionCard.tsx`, `HabitacionTable.tsx` | `habitacionCard.tsx`, `habitacion-card.tsx` |
| **Páginas (Views)** | `PascalCase` + Sufijo `Page.tsx` | `HabitacionesPage.tsx`, `LoginPage.tsx` | `Habitaciones.tsx`, `loginView.tsx` |
| **Custom Hooks** | `camelCase` + Prefijo `use.ts` | `useHabitaciones.ts`, `useLogin.ts` | `HabitacionesHook.ts`, `getHabitaciones.ts` |
| **Servicios de Módulo** | `camelCase` + Sufijo `Service.ts`| `habitacionesService.ts`, `authService.ts` | `HabitacionesApi.ts`, `serviceHabitaciones.ts` |
| **Interfaces / Types** | `PascalCase` | `Habitacion`, `CrearReservaDTO` | `IHabitacion`, `habitacionInterface` |
| **Archivos de Tipos** | `camelCase.types.ts` | `habitacion.types.ts`, `auth.types.ts` | `types.ts`, `HabitacionTypes.ts` |
| **Funciones y Métodos**| `camelCase` | `formatearPrecio()`, `iniciarSesion()` | `FormatearPrecio()`, `iniciar_sesion()` |
| **Variables y Estados**| `camelCase` | `habitacionSeleccionada`, `cargando` | `Habitacion_Activa`, `Cargando` |
| **Constantes Globales**| `SCREAMING_SNAKE_CASE` | `MAX_INTENTOS_LOGIN`, `DEFAULT_PAGE_SIZE` | `maxIntentos`, `default_page_size` |

---

## 3. Directivas de TypeScript Estricto

1. **Cero Tolerancia a `any` Injustificado:**
   * Está prohibido tipar datos con `any`.
   * Si una estructura externa o dinámica es incierta, utilice `unknown` y refine el tipo mediante guardas de tipo (*Type Guards*).
2. **Tipado Obligatorio de Props:**
   Todo componente debe declarar su interfaz de propiedades:
   ```tsx
   interface HabitacionCardProps {
     habitacion: Habitacion;
     onSeleccionar: (id: string) => void;
     destacada?: boolean;
   }

   export function HabitacionCard({ habitacion, onSeleccionar, destacada = false }: HabitacionCardProps) {
     // ...
   }
   ```
3. **DTOs Inmutables y Tipados:**
   Modelar siempre los datos de envío hacia la API mediante tipos explícitos para evitar discrepancias con el backend.

---

## 4. Estándares de Tailwind CSS

1. **Enfoque de Clases Utilitarias:**
   * Usar las clases estándar de Tailwind CSS para espaciado, colores, tipografía y responsive.
   * Evitar crear archivos CSS externos a menos que se trate de animaciones complejas o estilos de terceros indispensables.
2. **Prohibidos Estilos Inline Arbitrarios:**
   * ❌ `style={{ marginTop: '24px', color: '#ff0000' }}`
   * ✅ `className="mt-6 text-red-600"`
3. **Variantes Reutilizables Mediante Props:**
   Evitar crear componentes separados para cada variante estética. Utilizar props:
   ```tsx
   interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary' | 'danger';
   }

   export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
     const baseStyles = "px-4 py-2 rounded font-medium transition";
     const variants = {
       primary: "bg-blue-600 text-white hover:bg-blue-700",
       secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
       danger: "bg-red-600 text-white hover:bg-red-700",
     };

     return <button className={`${baseStyles} ${variants[variant]} ${className ?? ''}`} {...props} />;
   }
   ```

---

## 5. Imports y Configuración de Alias (`@`)

Se utiliza el alias `@` configurado en `vite.config.ts` y `tsconfig.json` para apuntar a la raíz de `src/`:

```ts
// ✅ Correcto: Limpio y legible
import { api } from '@/services/api';
import { Button } from '@/components/Button';
import { useHabitaciones } from '@/modules/Habitaciones/hooks/useHabitaciones';

// ❌ Incorrecto: Frágil y difícil de mantener
import { api } from '../../../../services/api';
```

### Regla de Higiene de Código:
* Eliminar todos los imports no utilizados antes de confirmar cambios.
* Mantener los imports agrupados: 1) Librerías externas (React, Redux), 2) Componentes y utilidades globales (`@/...`), 3) Elementos locales relativos (`./...`).

---

## 6. Principios de Clean Code en Frontend

* **Componentes Pequeños (Menores a 150-200 líneas):** Si un componente visual crece demasiado, debe dividirse en subcomponentes atómicos.
* **Separación de Lógica:** Toda lógica de más de 10-15 líneas en una página debe trasladarse a un custom hook.
* **Nombres Autoexplicativos:** Preferir `esHabitacionOcupada` antes que condiciones booleanas ambiguas como `estado === 2`.
