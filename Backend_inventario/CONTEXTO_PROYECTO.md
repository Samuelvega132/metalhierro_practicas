# CONTEXTO_PROYECTO.md

# Sistema Web Empresarial de Inventario, Auditoria y Reportes de TI

## 1. Ficha del Proyecto

| Campo | Detalle |
| --- | --- |
| Proyecto | Sistema Web Empresarial de Inventario, Auditoria y Reportes de TI |
| Empresa principal | Metalhierro S.A. |
| Empresas / sedes relacionadas | Sermet, Renova |
| Autor | Samuel Andres Vega Mendoza |
| Rol | Pasante de Ingenieria de Software |
| Area objetivo | Departamento de TI / Sistemas |
| Marco de tiempo | 80 horas, Semana 1 de 5 |
| Backend | `Backend_inventario` |
| Tipo de sistema | API REST empresarial con documentacion interactiva |

## 2. Objetivo General

Construir un backend modular, seguro y listo para integrarse con una base de datos Microsoft SQL Server fisica de planta, destinado a administrar inventario tecnologico, asignaciones de equipos, suministros, licencias de software, auditoria operativa y reportes para Metalhierro S.A. y empresas relacionadas.

El backend permite que el personal autorizado consulte, registre y audite activos tecnologicos mediante una API REST protegida con JWT y documentada con Swagger UI.

## 3. Stack Tecnologico

| Capa | Tecnologia | Proposito |
| --- | --- | --- |
| Runtime | Node.js | Ejecucion del servidor backend |
| Framework API | Express.js | Exposicion de endpoints REST |
| Lenguaje | TypeScript | Tipado estricto, mantenibilidad y seguridad en desarrollo |
| ORM | Prisma ORM | Acceso tipado a Microsoft SQL Server |
| Base de datos | Microsoft SQL Server | BDD relacional real en servidor fisico de planta |
| Validacion | Zod | Validacion centralizada de `body`, `params` y `query` |
| Autenticacion | JWT | Login y proteccion de rutas |
| Password hashing | bcryptjs | Encriptacion segura de contrasenas |
| Autorizacion | RBAC | Roles `ADMIN`, `PASANTE`, `TRABAJADOR` |
| Documentacion API | Swagger UI + swagger-jsdoc | Dashboard interactivo para probar endpoints |
| Seguridad HTTP | Helmet + CORS | Endurecimiento basico del servidor Express |

## 4. Decisiones de Arquitectura

### 4.1 Patron Principal

El backend sigue una arquitectura por capas inspirada en Clean Architecture:

```text
Routes -> Middlewares -> Controllers -> Services -> Prisma ORM -> SQL Server
```

| Capa | Responsabilidad |
| --- | --- |
| Routes | Definir endpoints, middlewares y documentacion OpenAPI con JSDoc |
| Middlewares | Autenticacion, autorizacion, validacion y manejo global de errores |
| Controllers | Recibir request, invocar servicios y devolver respuestas HTTP |
| Services | Contener reglas de negocio, transacciones y validaciones operativas |
| Prisma ORM | Acceso tipado a tablas, relaciones y transacciones SQL Server |

### 4.2 Documentacion Interactiva de la API

La API cuenta con Swagger UI integrado:

| Recurso | URL |
| --- | --- |
| Interfaz Swagger UI | `http://localhost:3000/api-docs` |
| Especificacion OpenAPI JSON | `http://localhost:3000/api-docs.json` |

La configuracion principal se encuentra en:

```text
src/config/swagger.config.ts
```

Swagger lee los comentarios JSDoc `@openapi` desde:

```text
src/modules/**/*.routes.ts
```

Las rutas protegidas usan autenticacion Bearer Token. En Swagger UI se debe presionar el boton **Authorize** y pegar el JWT generado por `/api/v1/auth/login`.

### 4.3 Seguridad y RBAC

| Rol | Alcance |
| --- | --- |
| `ADMIN` | Acceso administrativo completo a modulos operativos y reportes |
| `PASANTE` | Acceso operativo a dashboard, inventario, suministros, licencias y reportes |
| `TRABAJADOR` | Acceso limitado a consultas permitidas de equipos e historial |

Las contrasenas se almacenan con hash mediante `bcryptjs`. El JWT contiene:

```json
{
  "usr_id": 1,
  "usr_username": "admin",
  "usr_role": "ADMIN",
  "emp_id": 1
}
```

### 4.4 Regla de Negocio Exclusiva

Se excluye completamente el modulo de tickets.

No se generan ni se consumen endpoints, controladores, servicios ni rutas para:

```text
SOLICITUDTICKETS
SOPORTETICKETS
```

Esta exclusion protege el alcance del sistema actual, que se concentra en inventario, auditoria, suministros, licencias y reportes de TI.

## 5. Resumen del Esquema de Datos

El modelo Prisma activo contiene 18 tablas funcionales.

| Tabla | Proposito |
| --- | --- |
| `EMPRESAS` | Registra empresas principales o relacionadas, como Metalhierro S.A., Sermet y Renova |
| `LOCALES` | Registra ubicaciones fisicas o sedes asociadas a cada empresa |
| `DEPARTAMENTOS` | Registra areas internas vinculadas a locales |
| `TIPOEMPLEADOS` | Catalogo de tipos o categorias de empleados |
| `EMPLEADOS` | Registra personal y su relacion con departamento y tipo |
| `MODELOEQUIPOS` | Catalogo de modelos de equipos |
| `MARCAEQUIPOS` | Catalogo de marcas relacionadas con modelos |
| `TIPOEQUIPOS` | Catalogo de tipos de activos, como laptop, desktop, impresora, monitor |
| `ESTADOEQUIPOS` | Catalogo de estados, como Bodega, Asignado, Reparacion y Baja |
| `PROVEEDOREQUIPOS` | Registra proveedores de equipos y suministros |
| `EQUIPOS` | Inventario principal de activos tecnologicos |
| `ASIGNACIONEQUIPOS` | Historial de custodia, entrega y devolucion de equipos |
| `SUMINISTROS` | Catalogo y stock actual de insumos tecnologicos |
| `TRANSACCIONSUMINISTROS` | Trazabilidad de ingresos y egresos de suministros |
| `SOFTWARE` | Catalogo de software instalado o administrado |
| `LICENCIAS` | Registro de licencias, vencimientos, costos y cantidades |
| `EQUIPOLICENCIAS` | Relacion entre licencias y equipos donde fueron instaladas |
| `USUARIOS` | Usuarios de la aplicacion para login JWT y control RBAC |

## 6. Estructura del Proyecto

```text
Backend_inventario/
├── .env.example
├── .gitignore
├── CONTEXTO_PROYECTO.md
├── CHECKLIST_REUNION_INGENIEROS.md
├── package.json
├── package-lock.json
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── env.config.ts
│   │   ├── prisma.config.ts
│   │   └── swagger.config.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── equipos/
│   │   ├── licencias/
│   │   ├── reportes/
│   │   └── suministros/
│   ├── types/
│   │   └── express.d.ts
│   └── utils/
│       ├── app-error.ts
│       ├── async-handler.ts
│       ├── jwt.handle.ts
│       └── password.handle.ts
└── tsconfig.json
```

## 7. Endpoints Disponibles

La API usa el prefijo:

```text
/api/v1
```

Total de rutas documentadas en Swagger: 14.

### 7.1 Auth

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Publica | Valida credenciales y devuelve JWT |
| `GET` | `/api/v1/auth/me` | Bearer JWT | Devuelve datos del usuario autenticado |

### 7.2 Dashboard

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/v1/dashboard/metrics` | Bearer JWT | Metricas de equipos, garantias, licencias y suministros |

Parametros opcionales:

```text
empresaId
```

### 7.3 Equipos

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/v1/equipos` | Bearer JWT | Lista equipos con paginacion, busqueda y filtros |
| `POST` | `/api/v1/equipos` | Bearer JWT | Registra un nuevo equipo |
| `POST` | `/api/v1/equipos/asignar` | Bearer JWT | Asigna equipo a empleado y cambia estado a Asignado |
| `POST` | `/api/v1/equipos/devolver` | Bearer JWT | Registra devolucion y cambia estado a Bodega |
| `GET` | `/api/v1/equipos/{id}/historial` | Bearer JWT | Consulta historial completo de custodia |

Filtros disponibles:

```text
page
limit
search
tipoId
marcaId
empresaId
```

### 7.4 Suministros

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/v1/suministros` | Bearer JWT | Lista suministros y stock actual |
| `POST` | `/api/v1/suministros/transaccion` | Bearer JWT | Registra ingreso o egreso y actualiza stock |

Regla transaccional:

- `INGRESO`: incrementa stock.
- `EGRESO`: valida stock suficiente y decrementa stock.

### 7.5 Licencias

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/v1/licencias` | Bearer JWT | Lista licencias con software y equipos vinculados |
| `POST` | `/api/v1/licencias/asignar-equipo` | Bearer JWT | Asigna licencia a equipo validando cupos disponibles |

### 7.6 Reportes

| Metodo | Ruta | Seguridad | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/v1/reportes/inventario-general` | Bearer JWT | Consolidado por empresa, departamento y empleado asignado |
| `GET` | `/api/v1/reportes/licencias-vencimiento` | Bearer JWT | Reporte de licencias activas, por vencer y vencidas |
| `GET` | `/api/v1/reportes/movimientos-suministros` | Bearer JWT | Historial de entradas y salidas por rango de fechas |

## 8. Variables de Entorno

Archivo base:

```text
.env.example
```

Plantilla:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="sqlserver://SERVIDOR_SQL:1433;database=MetalhierroInventario;user=usuario;password=clave;encrypt=true;trustServerCertificate=true"
JWT_SECRET="cambia-esta-clave-en-produccion"
JWT_EXPIRES_IN="8h"
```

## 9. Comandos Principales

```bash
npm install
npm run prisma:generate
npm run dev
```

Compilacion:

```bash
npm run build
```

Validacion TypeScript estricta:

```bash
node .\node_modules\typescript\bin\tsc --noEmit
```

Validacion de Prisma:

```bash
npx prisma validate
```

Sincronizacion o introspeccion con base real:

```bash
npx prisma db pull
npx prisma generate
```

## 10. Estado Actual de Verificacion

| Verificacion | Estado | Observacion |
| --- | --- | --- |
| Instalacion de dependencias | Completada | `npm install` ejecutado correctamente |
| Auditoria de dependencias | Completada | `0 vulnerabilities` reportadas |
| Prisma Client | Completado | `prisma generate` exitoso |
| Prisma schema | Valido | `prisma validate` probado con URL temporal |
| TypeScript estricto | Pasante | `tsc --noEmit` sin errores |
| Healthcheck | Funcional | `/health` responde estado `ok` |
| Swagger UI | Funcional | `/api-docs` disponible |
| OpenAPI JSON | Funcional | `/api-docs.json` disponible |
| Rutas Swagger detectadas | Completado | 14 rutas documentadas con JSDoc `@openapi` |
| Bearer Token en Swagger | Configurado | Disponible mediante boton `Authorize` |
| Tickets excluidos | Confirmado | Sin rutas, servicios ni controladores de tickets |

## 11. Flujo Recomendado de Demostracion

1. Levantar backend:

```bash
npm run dev
```

2. Abrir healthcheck:

```text
http://localhost:3000/health
```

3. Abrir Swagger UI:

```text
http://localhost:3000/api-docs
```

4. Ejecutar login:

```text
POST /api/v1/auth/login
```

5. Copiar JWT de respuesta.

6. Presionar **Authorize** en Swagger UI.

7. Pegar el token Bearer.

8. Probar endpoints protegidos de inventario, dashboard, suministros, licencias y reportes.

