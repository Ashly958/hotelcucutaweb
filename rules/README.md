# Hotel Cúcuta - Frontend Architecture & Engineering Guidelines

Bienvenido a la documentación arquitectónica y estándares de ingeniería del cliente web de **Hotel Cúcuta**.

El frontend está construido sobre un stack moderno con **React, Vite, TypeScript, Redux Toolkit, Tailwind CSS y Axios**, estructurado mediante una **Arquitectura Modular orientada a Contextos de Negocio**, lista para crecer como una plataforma hotelera multi-hotel escalable y mantenible.

---

## 🏛️ Regla Principal del Proyecto

> [!IMPORTANT]
> ### **"La UI debe ser simple; la lógica debe estar organizada y aislada."**
>
> Ningún componente visual ni página debe preocuparse por cómo se realizan las peticiones HTTP, cómo se inyectan los tokens ni cómo se procesan las reglas de comunicación con el backend.
> La interfaz se limita a presentar el estado y recibir interacciones del usuario.

```
                  ┌───────────────────────────────┐
                  │          PAGE / UI            │
                  │   Composición de pantallas    │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │         CUSTOM HOOKS          │
                  │   Estado, loading, errores,   │
                  │   orquestación de interacción │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │       MODULE SERVICES         │
                  │   Llamadas a endpoints del    │
                  │   módulo correspondiente      │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │     AXIOS CENTRAL / HTTP      │
                  │   Interceptors, Bearer Token, │
                  │   manejo global de 401        │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │          BACKEND API          │
                  └───────────────────────────────┘
```

---

## ⚡ Stack Tecnológico

* ⚛️ **React** (v18+ / v19)
* ⚡ **Vite** (Build tool y servidor de desarrollo ultra-rápido)
* 🟦 **TypeScript** (Tipado estricto en todo el código, cero tolerancia a `any` injustificado)
* 🟣 **Redux Toolkit** (Estado global para sesión, permisos e información compartida entre módulos)
* 🎨 **Tailwind CSS** (Sistema de utilidades visuales estandarizado)
* 🌐 **Axios** (Instancia HTTP centralizada con interceptores para Bearer Tokens y manejo de sesión)

---

## 📚 Mapa de Documentación

La documentación del frontend se ha dividido en módulos especializados:

| Documento | Descripción y Contenido |
| :--- | :--- |
| 📐 [**arquitectura.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/arquitectura.md) | Principios generales, arquitectura modular (`modules/`), flujo integral de peticiones, flujo de autenticación, layouts, rutas públicas vs protegidas y autorización visual. |
| 📁 [**estructura-y-modulos.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estructura-y-modulos.md) | Árbol completo de `src/`, estructura interna recomendada por módulo (`components`, `hooks`, `pages`, `services`, `types`, `utils`), responsabilidades de cada carpeta y ejemplo práctico del módulo `Habitaciones`. |
| 🔄 [**estado-y-servicios.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estado-y-servicios.md) | Estrategia de estado local (`useState`) vs global (`Redux Toolkit` / `Context`), cliente HTTP centralizado, interceptores de Bearer Token y 401, tipado de API (`RespuestaApi<T>`, paginación) y manejo de estados UI (`Loading`, `Empty`, `Error`). |
| 🏷️ [**convenciones.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/convenciones.md) | Regla del idioma (Módulos y conceptos de negocio en español, estructura técnica en inglés), tabla de nomenclatura (PascalCase, camelCase), directivas de TypeScript, estándares de Tailwind CSS y alias `@`. |
| 🛡️ [**estandares-tecnicos.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/estandares-tecnicos.md) | Manejo de variables de entorno (`VITE_*`), seguridad y protección de datos, guía de 10 pasos para crear una nueva funcionalidad, qué NO hacer y checklist de **Definition of Done (DoD)** de 17 puntos. |
| 🤖 [**AGENTS.md**](file:///home/junior-arias/Escritorio/proyectos/hotelcucuta/frontend/AGENTS.md) | **Directivas estrictas para Agentes de IA y Asistentes de Código**: Reglas inquebrantables (DOs & DON'Ts), guía operativa paso a paso y checklist de validación previa a la entrega. |

---

## 🏨 Visión de Plataforma y Crecimiento Progresivo

El frontend debe construirse de forma ágil y pragmática:
* **No sobreingeniería inicial:** No crear 20 carpetas vacías ni capas artificiales desde el inicio si no hay una necesidad real.
* **Preparado para Multi-Hotel:** Los selectores, estados y contextos no deben asumir de forma rígida la existencia de una única sede o cliente fijo.
* **Reutilización inteligente:** Comprobar si ya existe un componente, hook o servicio antes de crear uno nuevo.
