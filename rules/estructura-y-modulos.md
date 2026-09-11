# Estructura de Carpetas y Guía de Módulos

Este documento define la organización de directorios global del proyecto y la estructura interna de los módulos de **Hotel Cúcuta**.

---

## 1. Estructura Principal del Proyecto (`src/`)

La carpeta `src/` organiza el código en capas técnicas compartidas y contextos de negocio modulares:

```text
src/
├── assets/          # Imágenes, íconos y recursos estáticos globales
├── components/      # Componentes UI reutilizables y atómicos compartidos
├── context/         # Contextos de React para sesión y estado general
├── fonts/           # Tipografías locales del proyecto
├── layouts/         # Estructuras visuales envolventes (MainLayout, AuthLayout)
├── modules/         # Módulos y contextos del negocio (el corazón de la app)
├── services/        # Cliente Axios centralizado e interceptores globales
├── store/           # Configuración de Redux Toolkit (slices, selectors)
├── types/           # Interfaces y tipos de TypeScript globales (API, paginación)
└── utils/           # Funciones utilitarias puras y formateadores compartidos
```

### Regla contra Carpetas Fantasma:
> No mantener carpetas vacías en el repositorio únicamente por "cumplir la estructura". Si un módulo o capa no necesita `utils/` o `assets/`, no se crea dicha carpeta.

---

## 2. Estructura Interna Estándar de un Módulo

Todo módulo dentro de `src/modules/<NombreModulo>/` sigue una estructura predecible:

```text
src/modules/
└── Habitaciones/
    ├── assets/       # Recursos gráficos exclusivos del módulo (opcional)
    ├── components/   # Componentes visuales específicos de este módulo
    ├── hooks/        # Custom hooks que encapsulan estado y llamadas API
    ├── pages/        # Pantallas y vistas accesibles mediante enrutamiento
    ├── services/     # Métodos de consumo de endpoints correspondientes al módulo
    ├── types/        # Interfaces y types específicos de este dominio
    └── utils/        # Funciones utilitarias específicas del módulo (opcional)
```

---

## 3. Responsabilidades por Carpeta del Módulo

### 3.1 `pages/` (Composición de UI)
Las páginas componen los componentes visuales y los conectan con los custom hooks.
* **Responsabilidad:** Orquestar qué se muestra en pantalla según el estado devuelto por los hooks.
* **Prohibido:** Escribir peticiones Axios directas, useEffects con llamadas HTTP complejas o cientos de líneas de lógica dentro de la página.

```tsx
// src/modules/Habitaciones/pages/HabitacionesPage.tsx
import { useHabitaciones } from '../hooks/useHabitaciones';
import { HabitacionTable } from '../components/HabitacionTable';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';

export function HabitacionesPage() {
  const { habitaciones, cargando, error, cambiarEstado } = useHabitaciones();

  if (cargando) return <Loading mensaje="Cargando habitaciones..." />;
  if (error) return <ErrorState mensaje={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Habitaciones</h1>
      <HabitacionTable items={habitaciones} onCambiarEstado={cambiarEstado} />
    </div>
  );
}
```

### 3.2 `components/` (Componentes del Módulo)
Representan partes especializadas de la interfaz exclusivas del módulo:
* Formularios (`HabitacionForm.tsx`), tarjetas (`HabitacionCard.tsx`), tablas específicas (`HabitacionTable.tsx`).
* **Responsabilidad:** Recibir datos por `props` y emitir eventos mediante `callbacks`.
* **Aislamiento:** Un componente visual **nunca** debe conocer de Axios, tokens, headers ni URLs de backend.

### 3.3 `hooks/` (Lógica de Interacción y Estado)
Los hooks encapsulan el ciclo de vida, estados de carga (`loading`), mensajes de error (`error`), paginación y llamadas a servicios.
* Permiten que la lógica de negocio sea 100% testeable sin depender de renderizar toda la pantalla.

```ts
// src/modules/Habitaciones/hooks/useHabitaciones.ts
import { useState, useEffect } from 'react';
import { habitacionesService } from '../services/habitacionesService';
import type { Habitacion } from '../types/habitacion.types';

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarHabitaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await habitacionesService.obtenerTodas();
      setHabitaciones(data);
    } catch (err) {
      setError('No fue posible cargar el listado de habitaciones.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  return { habitaciones, cargando, error, recargar: cargarHabitaciones };
}
```

### 3.4 `services/` (Consumo de Endpoints)
Clases o módulos que llaman a los endpoints correspondientes utilizando la instancia centralizada `api`:
* **Regla estricta:** No instanciar `axios.create()` dentro de los módulos. Siempre consumir `@/services/api`.
* No contienen lógica de renderizado ni estado de React.

```ts
// src/modules/Habitaciones/services/habitacionesService.ts
import { api } from '@/services/api';
import type { Habitacion, CrearHabitacionDTO } from '../types/habitacion.types';
import type { RespuestaApi } from '@/types/api';

export const habitacionesService = {
  async obtenerTodas(): Promise<Habitacion[]> {
    const response = await api.get<RespuestaApi<Habitacion[]>>('/v1/habitaciones');
    return response.data.data;
  },

  async crear(datos: CrearHabitacionDTO): Promise<Habitacion> {
    const response = await api.post<RespuestaApi<Habitacion>>('/v1/habitaciones', datos);
    return response.data.data;
  },
};
```

### 3.5 `types/` (Tipado TypeScript del Módulo)
Interfaces y tipos de datos del módulo (`habitacion.types.ts`):
* Modelos de datos del negocio (`Habitacion`, `EstadoHabitacion`).
* DTOs de entrada/formulario (`CrearHabitacionDTO`, `ActualizarHabitacionDTO`).
* Props específicas de componentes del módulo.

### 3.6 `utils/` (Utilidades Locales)
Funciones puras y aisladas que solo tienen sentido dentro del módulo (ej. `calcularNochesReserva.ts`). Si una función puede utilizarse en varios módulos (ej. `formatCurrency.ts`), debe ubicarse en `src/utils/`.

---

## 4. Componentes Globales (`src/components/`)

Los componentes ubicados en la raíz `src/components/` son bloques de construcción comunes utilizados transversalmente:

```text
src/components/
├── Button/
│   └── Button.tsx          # Botón con variantes (primary, secondary, danger)
├── Input/
│   └── Input.tsx           # Input con soporte para errores y labels
├── Modal/
│   └── Modal.tsx           # Modal accesible y reutilizable
├── Table/
│   └── Table.tsx           # Estructura de tabla estandarizada
├── Pagination/
│   └── Pagination.tsx     # Barra de navegación paginada
├── Loading/
│   └── Loading.tsx         # Spinner o skeleton reutilizable
└── EmptyState/
    └── EmptyState.tsx      # Vista para listas sin resultados
```

> **Regla de Ubicación:** Si un componente solo se usa en un módulo, se mantiene dentro de ese módulo. Solo se promueve a `src/components/` cuando es adoptado por 2 o más módulos.

---

## 5. Ejemplo de Módulo Completo: `Habitaciones`

```text
src/modules/
└── Habitaciones/
    ├── components/
    │   ├── HabitacionCard.tsx
    │   ├── HabitacionForm.tsx
    │   └── HabitacionTable.tsx
    ├── hooks/
    │   ├── useHabitaciones.ts
    │   ├── useCrearHabitacion.ts
    │   └── useEditarHabitacion.ts
    ├── pages/
    │   ├── HabitacionesPage.tsx
    │   ├── CrearHabitacionPage.tsx
    │   └── EditarHabitacionPage.tsx
    ├── services/
    │   └── habitacionesService.ts
    └── types/
        └── habitacion.types.ts
```
