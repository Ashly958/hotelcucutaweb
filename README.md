# Hotel Cúcuta - Property Management System (PMS) Frontend

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.16-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.5.0-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)

Sistema de gestión hotelera (PMS) de alta fidelidad, diseñado para operar las 45 habitaciones del **Hotel Cúcuta** (Pisos 1 a 4) y su centro operativo textil en el Piso 5. Desarrollado con arquitectura modular por capas, estricta tipificación en TypeScript (cero `any`), cliente HTTP centralizado con interceptores y espacios de trabajo 100% desacoplados por rol.

---

## 📋 Tabla de Contenidos

1. [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
2. [Espacios de Trabajo por Rol](#-espacios-de-trabajo-por-rol)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Convenciones de Nomenclatura e Idioma](#-convenciones-de-nomenclatura-e-idioma)
5. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Credenciales Demo para Pruebas](#-credenciales-demo-para-pruebas)
8. [Cumplimiento de Requerimientos](#-cumplimiento-de-requerimientos)

---

## 🛠 Arquitectura y Stack Tecnológico

* **Framework Base:** [React 18](https://react.js.org/) en modo estricto (`StrictMode`) junto a [Vite 6](https://vitejs.dev/) para compilación ultrarrápida.
* **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) con reglas estrictas (`strict: true`, `noUnusedLocals: true`, guardas de tipo para manejo seguro de errores).
* **Gestión de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) para estado global de autenticación y sesión, combinado con Custom Hooks para estados locales de interfaz.
* **Capa HTTP:** [Axios](https://axios-http.com/) centralizado (`src/services/api.ts`) con interceptor automático para inyección de `Bearer Token` y captura global de respuestas `401 Unauthorized`.
* **Estilos y Diseño:** [Tailwind CSS](https://tailwindcss.com/) con diseño responsivo, paleta cromática de marca personalizada y tipografía editorial.
* **Iconografía:** [Lucide React](https://lucide.dev/) e iconografía SVG boutique personalizada para roles y equipamiento hotelero.

---

## 🏢 Espacios de Trabajo por Rol

Cada rol cuenta con un espacio de trabajo **completamente aislado**, sin pestañas ni botones que permitan cruzar roles dentro del panel:

1. **Recepción & Front Desk (`RECEPCION`):**
   * Visualización del mapa interactivo de las 45 habitaciones distribuidas en 4 pisos.
   * Filtros dinámicos por piso, estado (Disponible, Ocupada, Limpieza, Mantenimiento) y buscador en tiempo real.
   * Modales de detalle con soporte para Check-In directo (cálculo automático de saldos y abonos) y Check-Out (transición automática a limpieza).
   * Monitoreo de arqueo de caja de turno en efectivo (RN-010).

2. **Gerencia & Administración General (`ADMIN`):**
   * Panel de métricas ejecutivas y ocupación global.
   * Generación y exportación de reportes obligatorios para autoridades: **SIRE (Migración Colombia)** y **Policía Nacional** (RF-008, RF-022).
   * Control de usuarios autorizados y delimitación de accesos (RF-023).
   * Visualización de tarifas fijas inmutables del establecimiento (RN-011).

3. **Lavandería (`LAVANDERIA`):**
   * Centro operativo de lavado ubicado exclusivamente en el **Piso 5** (RN-005).
   * Registro de órdenes por habitación con tarifa fija de $6.000 COP por prenda (RF-010).
   * Flujo de estados: `RECIBIDO` → `LAVANDO` → `LISTO` → `ENTREGADO`.

4. **Mantenimiento Técnico (`MANTENIMIENTO`):**
   * Bloqueo y habilitación técnica de habitaciones fuera de servicio (RF-002, RN-007).
   * Monitoreo de unidades de aire acondicionado y ventiladores.
   * Registro de novedades por equipo y nivel de prioridad (`ALTA`, `MEDIA`, `BAJA`).

---

## 📁 Estructura del Proyecto

```text
hotelcucutaweb/
├── rules/                    # Especificaciones y directivas de arquitectura del frontend
│   ├── AGENTS.md
│   ├── arquitectura.md
│   ├── convenciones.md
│   ├── estado-y-servicios.md
│   ├── estandares-tecnicos.md
│   └── estructura-y-modulos.md
├── src/
│   ├── assets/               # Logotipos oficiales e imágenes arquitectónicas
│   ├── components/           # Componentes UI atómicos compartidos con exportaciones en barril
│   │   ├── BrandBadge/
│   │   ├── Button/
│   │   ├── ErrorState/
│   │   ├── Icons/
│   │   ├── Input/
│   │   └── Loading/
│   ├── layouts/              # Envolventes visuales (MainLayout, AuthLayout)
│   ├── modules/              # Módulos de dominio del negocio hotelero
│   │   ├── Habitaciones/     # Gestión de pisos, habitaciones, check-in y workspaces
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── Login/            # Autenticación, validaciones y formulario institucional
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── services/
│   │       └── types/
│   ├── routes/               # Enrutamiento React Router con rutas protegidas
│   ├── services/             # Instancia central de Axios y mock data
│   ├── store/                # Configuración de Redux Toolkit (slices, hooks, selectors)
│   └── types/                # Contratos TypeScript globales (API, paginación)
├── .env.example              # Plantilla de variables de entorno
├── index.html                # Plantilla base HTML5 con fuentes tipográficas
├── package.json              # Dependencias y scripts
├── tailwind.config.js        # Configuración de Tailwind CSS y tokens de marca
├── tsconfig.json             # Configuración TypeScript estricta
└── vite.config.ts            # Configuración de empaquetador Vite con alias '@'
```

---

## 🌐 Convenciones de Nomenclatura e Idioma

El proyecto implementa la **convención dual estricta**:
* **Lógica y Dominio de Negocio (Español):** `Habitacion`, `HuespedActual`, `Usuario`, `EstadoHabitacion`, `CheckInDTO`, `OrdenLavanderia`, `iniciarSesion()`, `obtenerTodas()`.
* **Infraestructura y Ecosistema Técnico (Inglés):** `components`, `hooks`, `layouts`, `services`, `types`, `store`, `slices`, `selectors`, `Props`, `State`.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* Node.js v18.0.0 o superior (recomendado Node.js 20+ LTS).
* npm v9.0.0 o superior.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ashly958/hotelcucutaweb.git
cd hotelcucutaweb
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:3000`.

### 5. Compilar para producción
```bash
npm run build
```

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor Predeterminado |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base del backend REST (Laravel) | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Nombre oficial de la aplicación | `"Hotel Cúcuta"` |
| `VITE_STORAGE_URL`| URL de almacenamiento de archivos multimedia | `http://localhost:8000/storage` |
| `VITE_ENVIRONMENT`| Entorno de ejecución | `development` |
| `VITE_USE_MOCK_DATA` | Habilita datos simulados cuando no hay backend activo | `true` |

---

## 🔑 Credenciales Demo para Pruebas

El formulario de inicio de sesión cuenta con botones de acceso rápido de **1 clic** para alternar perfiles:

| Rol | Correo Electrónico | Contraseña | Espacio de Trabajo |
| :--- | :--- | :--- | :--- |
| **Recepción** | `recepcion@hotelcucuta.com` | `Password123!` | Front Desk & Mapa de 45 Habitaciones |
| **Administración** | `admin@hotelcucuta.com` | `Password123!` | Reportes SIRE / Policía, Usuarios y Tarifas |
| **Lavandería** | `lavanderia@hotelcucuta.com` | `Password123!` | Piso 5 & Registro de Prendas |
| **Mantenimiento** | `mantenimiento@hotelcucuta.com` | `Password123!` | Control de Bloqueos & Equipos Climatizados |

---

## 📜 Cumplimiento de Requerimientos

* **RF-001 / RF-002:** Control de ocupación, check-in, check-out y bloqueo de habitaciones por avería.
* **RF-008 / RF-022:** Libro oficial de huéspedes exportable con formato para Policía Nacional y Migración Colombia (SIRE).
* **RF-010:** Módulo de lavandería con cálculo automático de tarifas por prenda ($6.000 COP).
* **RF-023:** Delimitación de perfiles y permisos independientes por rol de usuario.
* **RN-005:** Exclusividad del Piso 5 como área de lavandería e intendencia.
* **RN-010:** Control estricto de arqueo de caja en efectivo por turno.
* **RN-011:** Tarifas fijas transparentes sin alteración manual.

---

### Licencia y Autoría
Desarrollado para **Hotel Cúcuta**. Todos los derechos reservados.
