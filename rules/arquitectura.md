# Arquitectura Modular, Flujos y Enrutamiento del Frontend

## 1. Principios Generales de la Arquitectura

El desarrollo del frontend de **Hotel Cúcuta** se rige por los siguientes principios:

* **Separación de Responsabilidades:** La vista presenta, los hooks orquestan la interacción y los servicios consumen la API.
* **Componentes Reutilizables y Pequeños:** Evitar componentes monolíticos ("God Components").
* **Tipado Fuerte:** TypeScript estricto en todos los contratos y modelos de datos.
* **Cero Lógica de Negocio en Componentes Visuales:** La lógica reside en custom hooks, servicios y utilidades puras.
* **Centralización HTTP:** Una única instancia global de Axios para toda la aplicación.
* **Aislamiento Modular:** Cada funcionalidad vive en su propio módulo dentro de `src/modules/`.
* **Consumo Progresivo:** Las páginas actúan únicamente como orquestadoras visuales.

---

## 2. El Núcleo Modular (`src/modules/`)

La arquitectura divide la aplicación en contextos de negocio independientes:

```
src/
└── modules/
    ├── Login/
    ├── Usuarios/
    ├── Habitaciones/
    ├── Reservas/
    ├── Huespedes/
    ├── Pagos/
    └── Reportes/
```

Cada módulo encapsula sus propios componentes, hooks, páginas, servicios y tipos, de modo que un cambio en `Reservas` no altere ni ponga en riesgo el funcionamiento de `Habitaciones`.

---

## 3. Flujo General de Ejecución

Toda interacción del usuario transita a través de un flujo unidireccional y predecible:

```
Usuario
   │ (Interacción / Click / Envío de Formulario)
   ▼
Page (Página del módulo)
   │ (Composición de componentes)
   ▼
Component (Componente visual especializado)
   │ (Ejecuta callback)
   ▼
Hook (Custom Hook del módulo: useHabitaciones, useLogin)
   │ (Gestiona estado local, loading, errores y transforma datos)
   ▼
Service (Servicio del módulo: habitacionesService)
   │ (Llama a los endpoints específicos)
   ▼
Axios Central (@/services/api.ts)
   │ (Añade baseURL, timeouts, headers globales)
   ▼
Interceptor
   │ (Inyecta automáticamente Authorization: Bearer <TOKEN>)
   ▼
Backend API
```

Para estados compartidos entre múltiples módulos o persistentes:
```
Hook ──► Redux Slice / Context ──► UI Global / Navbar / Sidebar
```

---

## 4. Flujo de Autenticación y Manejo de Sesión

El ciclo de vida de autenticación se gestiona de forma transparente y desacoplada de la UI:

```
LoginPage
    │
    ▼
useLogin()
    │
    ▼
AutenticacionService.iniciarSesion(credenciales)
    │
    ▼
Axios Central ──► Backend API (/api/v1/login)
    │
    ▼
Retorno exitoso: Token + Datos de Usuario
    │
    ▼
Almacenamiento en Redux Toolkit / AuthContext
    │
    ▼
Redirección automática hacia /dashboard
    │
    ▼
ProtectedRoute valida sesión activa ──► Renderiza MainLayout
```

### 4.1 Inyección Automática del Bearer Token
Ningún servicio debe concatenar manualmente encabezados de autenticación. El interceptor de Axios se encarga de inyectar el token en cada petición saliente:

```ts
// src/services/api.ts (conceptual)
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4.2 Manejo Centralizado de Expiración (Error 401)
Cuando el backend responde con `401 Unauthorized`:
```
Petición rechazada con 401
          ↓
Interceptor de Respuesta (Response Interceptor)
          ↓
Limpieza automática de la sesión (Redux / LocalStorage)
          ↓
Redirección inmediata hacia la pantalla de /login con mensaje informativo
```
Esta lógica nunca debe duplicarse en los servicios individuales de los módulos.

---

## 5. Estructura de Navegación y Layouts

La aplicación distingue entre layouts para usuarios autenticados y vistas públicas:

```
                        App
                         │
              ┌──────────┴──────────┐
              │                     │
         Rutas Públicas        Rutas Protegidas
              │                     │
          AuthLayout            MainLayout
              │                     │
         LoginPage /           ┌────┴────────────┐
         RecuperarPage         │                 │
                            Navbar            Sidebar
                               │
                          Contenido de Página
```

### 5.1 Layouts Principales (`src/layouts/`)
* **`MainLayout.tsx`:** Marco principal del sistema para usuarios autenticados (incluye Navbar superior, Sidebar lateral colapsable y contenedor de vistas principales).
* **`AuthLayout.tsx`:** Estructura limpia y centrada para pantallas públicas (Login, recuperación de contraseña, bienvenida).

---

## 6. Rutas Públicas vs. Rutas Protegidas

* **Rutas Públicas:** Accesibles sin credenciales (`/login`, `/recuperar-password`, consulta pública de disponibilidad).
* **Rutas Protegidas:** Exigen un token válido y activo (`/dashboard`, `/habitaciones`, `/reservas`, `/usuarios`, `/reportes`).
* **Componente `ProtectedRoute`:** Envuelve las rutas autenticadas. Si el usuario no tiene sesión válida, lo redirige a `/login` preservando la ruta previa para retorno posterior.

---

## 7. Autorización Visual en la UI

La interfaz puede condicionar la visualización de elementos interactivos basándose en roles y permisos del usuario (ej. Administrador, Recepcionista, Mantenimiento):
* Ocultar botones de *"Crear habitación"*, *"Eliminar reserva"* o enlaces a *"Reportes"*.
* Deshabilitar campos según el nivel de acceso.

> [!WARNING]
> **La autorización visual es una mejora de experiencia de usuario (UX), NO una medida de seguridad.**
> El backend Laravel es siempre la autoridad final y obligatoria para validar cada operación y denegar accesos no autorizados.

---

## 8. Regla de Independencia entre Módulos

Un módulo jamás debe importar componentes internos ni utilidades privadas de otro módulo:

```
❌ Incorrecto:
Reservas ─────► Habitaciones/components/HabitacionCardInterna.tsx

✅ Correcto:
Reservas ─────► src/components/Card/ (Componente global reutilizable)
```

Si dos módulos necesitan compartir un componente visual, este debe promoverse a `src/components/` con props genéricas y desacopladas.

---

## 9. Regla de Reutilización y Crecimiento

Antes de crear un nuevo archivo o abstracción, responda:
1. ¿Ya existe un componente similar en `src/components/`?
2. ¿Ya existe un hook con la lógica necesaria?
3. ¿Ya existe un servicio o método en la capa HTTP?
4. ¿Ya existe una interfaz o type para este modelo?

Si existe, reutilícelo o extiéndalo mediante props opcionales antes de duplicar código.

---

## 10. Arquitectura en una Frase

> **Cada módulo representa una funcionalidad del negocio, cada capa tiene una responsabilidad clara y ninguna página debería tener que saber cómo funciona la comunicación con el backend.**
