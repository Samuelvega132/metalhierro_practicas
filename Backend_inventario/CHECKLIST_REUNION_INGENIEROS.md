# CHECKLIST_REUNION_INGENIEROS.md

# Hoja de Trabajo Presencial para Conexion con BDD Fisica

## 1. Objetivo de la Reunion

Validar con los Ingenieros / TI de planta los datos exactos de conexion a Microsoft SQL Server, revisar permisos, confirmar el estado del servidor fisico y dejar lista la configuracion para conectar el backend `Backend_inventario` con la base de datos real de Metalhierro S.A.

Sistema:

```text
Sistema Web Empresarial de Inventario, Auditoria y Reportes de TI
```

Backend:

```text
Express + TypeScript + Prisma ORM + SQL Server + Swagger UI
```

## 2. Datos Generales de la Reunion

| Campo | Valor |
| --- | --- |
| Fecha |  |
| Hora inicio |  |
| Hora fin |  |
| Lugar |  |
| Responsable TI |  |
| Participantes |  |
| Responsable del proyecto | Samuel Andres Vega Mendoza |

## 3. Hoja de Datos Tecnicos de la BDD Fisica

Completar en vivo con el equipo de TI.

- [ ] **IP / Hostname del Servidor:**

```text
Ejemplo: 192.168.1.X o SRV-SQL-METALHIERRO
Valor real:
```

- [ ] **Puerto de SQL Server:**

```text
Ejemplo: 1433
Valor real:
```

- [ ] **Nombre exacto de la Base de Datos:**

```text
Ejemplo: DB_TICKETS, Metalhierro_Inv, InventarioTI
Valor real:
```

- [ ] **Nombre del Servidor / Instancia, si aplica:**

```text
Ejemplo: SQLEXPRESS, MSSQLSERVER, SRV-SQL-METALHIERRO\SQLEXPRESS
Valor real:
```

- [ ] **Usuario SQL Server para la aplicacion web:**

```text
Recomendado: usr_inventario_app
Valor real:
```

- [ ] **Contrasena del usuario SQL Server:**

```text
Valor real:
```

- [ ] **Tipo de autenticacion habilitada:**

```text
[ ] SQL Server Authentication
[ ] Windows Authentication
[ ] Modo mixto
Observacion:
```

- [ ] **Permisos del usuario de aplicacion:**

```text
[ ] Lectura
[ ] Escritura
[ ] Crear/alterar tablas, solo si se aplicaran migraciones
[ ] Ejecutar introspeccion
[ ] Otro:
```

## 4. Variable de Entorno `.env`

Archivo a configurar:

```text
Backend_inventario/.env
```

Plantilla oficial para Prisma + SQL Server:

```env
DATABASE_URL="sqlserver://<HOST>:<PUERTO>;database=<DATABASE>;user=<USUARIO>;password=<PASSWORD>;encrypt=true;trustServerCertificate=true;"
```

Ejemplo con valores ficticios:

```env
DATABASE_URL="sqlserver://192.168.1.50:1433;database=Metalhierro_Inv;user=usr_inventario_app;password=ClaveSegura123;encrypt=true;trustServerCertificate=true;"
```

Variables completas esperadas:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="sqlserver://<HOST>:<PUERTO>;database=<DATABASE>;user=<USUARIO>;password=<PASSWORD>;encrypt=true;trustServerCertificate=true;"
JWT_SECRET="definir-clave-segura-con-ti"
JWT_EXPIRES_IN="8h"
```

Checklist de `.env`:

- [ ] Crear archivo `.env` a partir de `.env.example`.
- [ ] Configurar `DATABASE_URL` con datos reales.
- [ ] Configurar `JWT_SECRET` seguro.
- [ ] Confirmar puerto del backend: `3000` o el definido por TI.
- [ ] Verificar que `.env` no se suba a Git.

## 5. Paso A: Validar TCP/IP en SQL Server Configuration Manager

Revisar con TI en el servidor SQL:

- [ ] Abrir **SQL Server Configuration Manager**.
- [ ] Ir a **SQL Server Network Configuration**.
- [ ] Seleccionar protocolos de la instancia correspondiente.
- [ ] Confirmar que **TCP/IP** este habilitado.
- [ ] Abrir propiedades de TCP/IP.
- [ ] Revisar pestana **IP Addresses**.
- [ ] Confirmar puerto TCP configurado.
- [ ] Validar si se usa puerto fijo `1433` o puerto dinamico.
- [ ] Reiniciar servicio SQL Server si se cambio configuracion.

Notas:

```text

```

## 6. Paso B: Probar Conectividad de Red Local

Desde la laptop de desarrollo o equipo autorizado:

### 6.1 Ping al servidor

```powershell
ping <HOST>
```

Resultado:

```text
[ ] Responde correctamente
[ ] No responde
Observacion:
```

### 6.2 Probar puerto TCP

```powershell
Test-NetConnection <HOST> -Port <PUERTO>
```

Ejemplo:

```powershell
Test-NetConnection 192.168.1.50 -Port 1433
```

Resultado esperado:

```text
TcpTestSucceeded : True
```

Checklist:

- [ ] El host responde en red local.
- [ ] El puerto SQL Server esta abierto.
- [ ] Firewall de Windows permite conexiones entrantes a SQL Server.
- [ ] El servicio SQL Server esta iniciado.
- [ ] El servicio SQL Server Browser esta revisado si se usa instancia nombrada.

## 7. Paso C: Prisma contra la Base Real

Antes de ejecutar cualquier cambio sobre la base real, confirmar con TI si la base ya existe y si contiene datos productivos.

### Opcion 1: Base existente con tablas reales

Usar introspeccion:

```bash
npx prisma db pull
npx prisma generate
```

Objetivo:

- [ ] Leer estructura real de la base.
- [ ] Comparar schema real contra `prisma/schema.prisma`.
- [ ] Confirmar nombres exactos de tablas y columnas.
- [ ] Detectar diferencias antes de modificar nada.

### Opcion 2: Base vacia o ambiente de pruebas

Aplicar el modelo Prisma sobre una base vacia:

```bash
npx prisma db push
npx prisma generate
```

Checklist:

- [ ] Confirmar que NO es una base productiva con datos importantes.
- [ ] Confirmar autorizacion de TI para crear tablas.
- [ ] Ejecutar `db push` solo con permiso.
- [ ] Verificar tablas creadas desde SQL Server Management Studio.

### Opcion 3: Validar solo conexion

```bash
npx prisma validate
npx prisma generate
```

Notas:

```text

```

## 8. Paso D: Verificacion de Tabla `USUARIOS`

El backend agrega la tabla `USUARIOS` para autenticacion con JWT y RBAC.

Proposito:

- Login de usuarios del sistema web.
- Hash seguro de contrasenas.
- Asociacion opcional con `EMPLEADOS`.
- Control de roles: `ADMIN`, `PASANTE`, `TRABAJADOR`.

Tabla esperada:

```text
USUARIOS
```

Campos principales:

| Campo | Proposito |
| --- | --- |
| `usr_id` | Identificador unico |
| `usr_username` | Usuario de login, unico |
| `usr_password` | Hash bcrypt de la contrasena |
| `usr_role` | Rol RBAC |
| `emp_id` | Relacion opcional con empleado |

Checklist con TI:

- [ ] Confirmar si ya existe una tabla de usuarios.
- [ ] Confirmar si se puede crear `USUARIOS`.
- [ ] Confirmar politica de nombres de tablas.
- [ ] Confirmar roles iniciales requeridos.
- [ ] Crear al menos un usuario `ADMIN` para pruebas.
- [ ] Verificar que la contrasena se almacene hasheada, no en texto plano.

Comando sugerido para generar hash desde Node:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('Admin12345', 12).then(console.log)"
```

## 9. Paso E: Demostracion Interactiva con Swagger UI

Cuando el backend este levantado:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000/api-docs
```

Tambien se puede revisar la especificacion JSON:

```text
http://localhost:3000/api-docs.json
```

Demostracion recomendada:

- [ ] Abrir `http://localhost:3000/health`.
- [ ] Confirmar respuesta `ok`.
- [ ] Abrir `http://localhost:3000/api-docs`.
- [ ] Ejecutar `POST /api/v1/auth/login`.
- [ ] Copiar token JWT.
- [ ] Presionar boton **Authorize**.
- [ ] Pegar token Bearer.
- [ ] Probar `GET /api/v1/dashboard/metrics`.
- [ ] Probar `GET /api/v1/equipos`.
- [ ] Probar reportes disponibles.

Notas de la demostracion:

```text

```

## 10. Plan B: Si No Hay Acceso a la Red Fisica Fuera de Planta

Si la base de datos solo es accesible dentro de la red local de planta, solicitar una alternativa de trabajo.

### 10.1 Copia de respaldo

Solicitar:

- [ ] Backup `.bak` de una base de pruebas.
- [ ] Script `.sql` de estructura.
- [ ] Script `.sql` con datos de prueba anonimizados.
- [ ] Diccionario de datos o diagrama entidad-relacion.

Formato preferido:

```text
[ ] .bak
[ ] .sql estructura
[ ] .sql datos de prueba
[ ] Diagrama ERD
[ ] Diccionario de datos
```

### 10.2 Desarrollo local

Opciones:

- [ ] SQL Server local en Windows.
- [ ] SQL Server en Docker.
- [ ] Base restaurada desde `.bak`.
- [ ] Base creada desde script `.sql`.

Ejemplo de conexion local:

```env
DATABASE_URL="sqlserver://localhost:1433;database=Metalhierro_Inv;user=sa;password=Password123;encrypt=true;trustServerCertificate=true;"
```

### 10.3 Acceso remoto

Consultar con TI:

- [ ] Existe VPN institucional.
- [ ] Tipo de VPN: FortiClient, OpenVPN, WireGuard, Cisco AnyConnect u otra.
- [ ] Usuario de VPN requerido.
- [ ] Permisos de red hacia servidor SQL.
- [ ] Restricciones por horario.
- [ ] Politica de seguridad para acceso externo.

Datos de VPN:

```text
Proveedor / Cliente VPN:
Servidor VPN:
Usuario:
Requiere MFA:
Horario permitido:
Observaciones:
```

## 11. Preguntas Clave para los Ingenieros / TI

- [ ] Cual es el nombre exacto de la base de datos de inventario o activos?
- [ ] La base actual ya contiene las tablas del modelo relacional?
- [ ] Las tablas usan exactamente los nombres definidos en Prisma?
- [ ] Se permite crear la tabla `USUARIOS`?
- [ ] Se permite modificar estructura o solo leer/escribir datos?
- [ ] Hay ambiente de pruebas separado de produccion?
- [ ] Que usuario SQL debe usar la aplicacion?
- [ ] Se debe usar autenticacion SQL Server o Windows?
- [ ] La aplicacion correra dentro de la red local o sera accesible fuera de planta?
- [ ] El puerto `3000` esta permitido para pruebas?
- [ ] Hay politicas internas para JWT, expiracion de sesion o contrasenas?
- [ ] Quien validara los reportes de inventario y licencias?

## 12. Checklist Final de Salida de Reunion

Antes de terminar la reunion, confirmar:

- [ ] Tengo host/IP real del SQL Server.
- [ ] Tengo puerto real.
- [ ] Tengo nombre exacto de base.
- [ ] Tengo usuario y contrasena de aplicacion.
- [ ] Se valido TCP/IP.
- [ ] Se valido conectividad al puerto.
- [ ] Se definio si haremos `db pull` o `db push`.
- [ ] Se confirmo tratamiento de la tabla `USUARIOS`.
- [ ] Se acordo como obtener backup o dump si no hay acceso remoto.
- [ ] Se mostro o se agendo demostracion con Swagger UI.
- [ ] Se definio proximo responsable tecnico de TI.
- [ ] Se definio siguiente fecha de revision.

## 13. Comandos Rapidos para Llevar a la Reunion

Instalar dependencias:

```bash
npm install
```

Generar Prisma Client:

```bash
npx prisma generate
```

Introspeccionar base real:

```bash
npx prisma db pull
```

Aplicar modelo a base vacia:

```bash
npx prisma db push
```

Levantar backend:

```bash
npm run dev
```

Validar TypeScript:

```bash
node .\node_modules\typescript\bin\tsc --noEmit
```

Healthcheck:

```text
http://localhost:3000/health
```

Swagger:

```text
http://localhost:3000/api-docs
```

