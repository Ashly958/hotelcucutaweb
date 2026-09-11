# Gestión de Estado, Servicios HTTP y Formularios

Este documento establece las directrices para la administración del estado, la configuración de la capa de comunicación HTTP y el manejo de formularios en el frontend de **Hotel Cúcuta**.

---

## 1. Estrategia de Gestión de Estado

La aplicación clasifica el estado en dos niveles claramente delimitados:

```
                      ESTADO EN LA APLICACIÓN
                                 │
           ┌─────────────────────┴─────────────────────┐
           │                                           │
      ESTADO LOCAL                               ESTADO GLOBAL
  (useState / useReducer)                   (Redux Toolkit / Context)
           │                                           │
  - Modales abiertos/cerrados               - Sesión y token de usuario
  - Texto de un input temporal              - Roles y permisos activos
  - Pestaña (Tab) activa                    - Perfil del usuario autenticado
  - Dropdown desplegado                     - Configuración global del hotel
  - Paginador de una tabla concreta         - Notificaciones globales (Toasts)
```

### 1.1 Regla de Oro de Redux
> [!CAUTION]
> **No utilizar Redux para estados locales de un componente.**
> Si la información solo le interesa a una vista o modal, debe vivir en `useState`. Redux Toolkit se reserva exclusivamente para datos compartidos entre múltiples módulos o que persisten entre cambios de página.

### 1.2 Estructura Recomendada de Redux Toolkit (`src/store/`)
```text
src/store/
├── index.ts               # Configuración del store (configureStore)
├── slices/
│   ├── authSlice.ts       # Estado de sesión, token y usuario actual
│   └── uiSlice.ts         # Modales globales, temas o toasters
└── selectors/
    └── authSelectors.ts   # Selectores memoizados (createSelector)
```

---

## 2. Capa HTTP Centralizada (`src/services/api.ts`)

Toda petición HTTP debe emitirse a través de una **instancia única de Axios** configurada globalmente:

```ts
// src/services/api.ts
import axios from 'axios';
import { store } from '@/store';
import { cerrarSesion } from '@/store/slices/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de Petición: Inyección de Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo Global de 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(cerrarSesion());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Reglas Estrictas de HTTP:
1. **Prohibido `axios.create()` en módulos:** Ningún archivo dentro de `src/modules/` debe crear su propio cliente Axios. Todos deben importar `api` desde `@/services/api`.
2. **Prohibido Bearer Token manual:** No concatenar encabezados `Authorization` en los servicios individuales; el interceptor lo hace automáticamente.
3. **Prohibido Axios en Componentes o Páginas:** La UI solo interactúa con custom hooks, y los hooks con los servicios del módulo.

---

## 3. Tipado Estricto de la API (`src/types/api.ts`)

Para alinearse con las respuestas estandarizadas del backend Laravel, el frontend utiliza tipos genéricos de TypeScript:

### 3.1 Respuesta Estándar
```ts
// src/types/api.ts
export interface RespuestaApi<T> {
  success: boolean;
  data: T;
  message: string;
}
```

### 3.2 Respuesta Paginada
```ts
// src/types/pagination.ts
export interface RespuestaPaginada<T> {
  success: boolean;
  data: {
    items: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface PaginacionParams {
  page?: number;
  per_page?: number;
}
```

---

## 4. Paginación Reutilizable

La paginación no debe reimplementarse de cero en cada módulo:
1. Los parámetros estándar (`page`, `per_page`) se definen en `@/types/pagination`.
2. El componente visual de control paginador se centraliza en `@/components/Pagination/Pagination.tsx`.
3. Cada hook de módulo solo administra la página actual y recarga la consulta correspondiente.

```
useHabitaciones(page, perPage)
   ↓
Petición: GET /api/v1/habitaciones?page=1&per_page=10
   ↓
Retorno: RespuestaPaginada<Habitacion>
   ↓
Render: <Pagination currentPage={data.current_page} totalPages={data.last_page} onPageChange={setPage} />
```

---

## 5. Manejo de Estados de UI (`Loading`, `Empty`, `Error`)

Toda vista que consuma datos asíncronos debe soportar de forma explícita los cuatro estados de la interfaz:

| Estado | Significado | Representación Visual |
| :--- | :--- | :--- |
| **Loading** | Petición en curso | Componente `<Loading />` o skeletons animados |
| **Success** | Datos obtenidos satisfactoriamente | Tablas, tarjetas o formulario listo |
| **Empty** | Consulta exitosa pero sin registros | Componente `<EmptyState mensaje="No hay habitaciones registradas" />` |
| **Error** | Falla de conexión o rechazo del backend | Mensaje legible y amigable, opción de reintentar |

### Regla para Errores:
> **Nunca mostrar mensajes técnicos crudos al usuario final.**  
> ❌ `"SQLSTATE[23000]: Integrity constraint violation..."`  
> ✅ `"No fue posible registrar la habitación debido a un conflicto con los datos ingresados."`

---

## 6. Formularios y Custom Hooks

Los formularios complejos deben separar limpiamente la presentación del procesamiento:

```
HabitacionForm (UI, Inputs, Botones)
        │
        ▼ (Consume lógica y estado)
useCrearHabitacion (Validación, submit, loading, errores)
        │
        ▼ (Invoca servicio)
habitacionesService.crear(datos)
```

### Beneficios:
* El formulario queda libre de `try/catch` extensos y llamadas Axios directas.
* Se facilita el testeo unitario de la validación y el submit sin necesidad de levantar el navegador.
* La UI del formulario se mantiene reactiva y estilizada con Tailwind CSS de manera concisa.
