# Codebase Hardening Status

Fecha: 07/05/2026

Objetivo: dejar documentado que cambios se han aplicado para robustecer la estructura de CEO's OS y que queda pendiente para cerrar una version enterprise mas completa.

## Estado actual

Se ha aplicado una primera capa real de hardening tecnico sobre backend, autenticacion, validacion, configuracion, demo mode, cliente HTTP, trazabilidad M&A y secure sharing autenticado.

El producto queda mas robusto que antes para piloto privado y venta controlada, pero aun no debe presentarse como SaaS enterprise plenamente certificado. La base ya esta mejor orientada para llegar ahi.

## Cambios cerrados

### Seguridad HTTP backend

Archivos principales:

- `backend/api/middlewares/security.middleware.js`
- `backend/server.js`

Cambios:

- Middleware de `X-Request-Id`.
- Cabeceras de seguridad:
  - `X-Content-Type-Options`;
  - `X-Frame-Options`;
  - `Referrer-Policy`;
  - `Cross-Origin-Opener-Policy`;
  - `Cross-Origin-Resource-Policy`;
  - `Permissions-Policy`;
  - CSP base compatible con la SPA.
- HSTS en produccion.
- Rate limit global para `/api`.
- Rate limit especifico para `/api/auth/login`.
- Body limit reducido de `10mb` a `2mb`.
- Healthcheck publico menos revelador.
- `/api/health` mantiene detalle solo fuera de produccion.
- Fail-fast en produccion si `VITE_ENABLE_MA_LOCAL_FALLBACK=true`.

### Validacion real de API

Archivos principales:

- `backend/api/middlewares/validate.middleware.js`
- `backend/api/validators/auth.validator.js`
- `backend/api/validators/ma.validator.js`
- `backend/api/routes/auth.routes.js`
- `backend/api/routes/ma.routes.js`

Cambios:

- `validate()` deja de ser placeholder.
- Validacion de login:
  - email requerido y con formato;
  - password requerido;
  - limite de longitud.
- Validacion M&A:
  - ids de caso;
  - create/update case;
  - snapshots;
  - run valuation;
  - export report;
  - enums de status;
  - campos financieros numericos.
- Errores de validacion normalizados como `VALIDATION_ERROR`.

### Autenticacion y sesiones

Archivos principales:

- `backend/services/auth/auth.service.js`
- `backend/api/controllers/auth.controller.js`
- `backend/api/middlewares/auth.middleware.js`
- `backend/storage/databaseSchema.js`

Cambios:

- Hash nuevo de password con `scrypt` nativo de Node.
- Compatibilidad temporal con hashes legacy SHA-256 salteados.
- Upgrade automatico del hash legacy tras login correcto.
- Tokens con `jti`.
- Tabla `auth_sessions`.
- Verificacion de sesion activa en cada request autenticada.
- Logout real con revocacion de sesion.
- `auth.middleware` guarda `authToken` y `authSessionId` en `req`.

### Trazabilidad y auditoria M&A

Archivos principales:

- `backend/services/audit/auditLog.service.js`
- `backend/api/controllers/ma.controller.js`
- `backend/storage/databaseSchema.js`

Cambios:

- Tabla `audit_logs`.
- Servicio `recordAuditLog`.
- Eventos auditados:
  - `ma.case.created`;
  - `ma.case.accessed`;
  - `ma.case.updated`;
  - `ma.case.deleted`;
  - `ma.snapshot.created`;
  - `ma.report.exported`;
  - `ma.secure_share.created`;
  - `ma.secure_share.accessed`;
  - `ma.secure_share.revoked`.

### Esquema de datos

Archivo principal:

- `backend/storage/databaseSchema.js`

Cambios:

- Nueva tabla `auth_sessions`.
- Nueva tabla `audit_logs`.
- Nueva tabla `secure_share_links` usada por secure sharing M&A.
- Foreign key `auth_sessions.user_id -> users.id`.
- Foreign key `ma_reports.case_id -> ma_cases.id`.
- `ma_reports.caseId` ahora se guarda como `NULL` si no hay caso asociado, para no romper integridad referencial.

### Secure sharing M&A

Archivos principales:

- `backend/services/ma/secureShare.service.js`
- `backend/api/controllers/ma.controller.js`
- `backend/api/routes/ma.routes.js`
- `backend/api/validators/ma.validator.js`
- `src/modules/ma/components/MAReportExportButton.jsx`
- `src/modules/ma/services/maReportsApi.js`

Cambios:

- Creacion de enlace seguro desde report M&A.
- Token aleatorio con hash server-side.
- Caducidad configurable.
- Revocacion server-side.
- Control por `organizationId`.
- Acceso autenticado, sin enlace publico anonimo.
- Auditoria de crear, acceder y revocar.
- Integracion frontend para crear report server-side y secure share si no se pasa handler externo.

### Demo enterprise M&A

Archivos principales:

- `src/shared/config/demoData.js`
- `src/modules/ma/pages/ValuationPage.jsx`
- `src/modules/ma/pages/DealPipelinePage.jsx`
- `src/modules/ma/pages/DealDetailPage.jsx`

Cambios:

- Tres casos demo premium centralizados.
- Pipeline y deal detail consumen datos demo compartidos.
- `ValuationPage` prepara los 3 casos cuando demo mode esta activo.
- Demo M&A deja de depender de un unico caso generico.

### Demo mode y fallback local

Archivos principales:

- `src/shared/config/demoMode.js`
- `src/app/providers/AuthProvider.jsx`
- `src/modules/ma/services/maCasesApi.js`
- `.env.example`

Cambios:

- `SHOW_DEMO_TOOLS` ya no esta siempre activo.
- Demo mode depende de `VITE_PUBLIC_DEMO_MODE=true`.
- Login solo muestra credenciales demo si el provider marca demo mode activo.
- Fallback local de M&A solo se permite si:
  - no es build de produccion;
  - `VITE_ENABLE_MA_LOCAL_FALLBACK=true`.
- Build de produccion falla si se intenta activar fallback local.

### Cliente HTTP

Archivos principales:

- `src/shared/services/httpClient.js`
- `src/app/providers/AuthProvider.jsx`

Cambios:

- `ApiError` tipado con `status`, `code` y `meta`.
- Timeout por request.
- Errores de red normalizados.
- Evento `ceos:auth-expired` en 401.
- `AuthProvider` escucha ese evento y limpia sesion.
- Correccion del formato roto en `PATCH`.

### Configuracion y estructura

Archivos principales:

- `.env.example`
- `infra/env/env.schema.js`
- `infra/env/README.md`
- `.gitignore`
- `package.json`

Cambios:

- `env.schema.js` alineado con variables reales:
  - `AUTH_SECRET`;
  - `DB_PATH`;
  - `PUBLIC_APP_URL`;
  - `FRONTEND_URL`;
  - `CORS_*`;
  - bootstrap users;
  - demo flags.
- `.env.example` actualizado y limpiado.
- `.gitignore` ignora `test-results/` y `playwright-report/`.
- Script `npm run quality` agregado:

```txt
npm run build && npm run test:unit && npm run test:integration
```

### Limpieza de stubs

Archivos:

- `backend/auth/session.service.js`
- `src/app/store/ui.Store.js`

Cambios:

- Eliminado `backend/auth/session.service.js`, que era un stub sin uso.
- Eliminado `src/app/store/ui.Store.js`, archivo vacio duplicado por casing frente a `uiStore.js`.

### M&A SaaS enterprise foundation

Archivos principales:

- `backend/storage/migrationRunner.js`
- `backend/storage/migrations/002_ma_enterprise_saas.sql`
- `backend/services/ma/dataRoom.service.js`
- `src/modules/ma/pages/MADataRoomPage.jsx`

Cambios:

- Runner de migraciones versionadas.
- Migracion M&A SaaS foundation con `ma_deals` y `ma_data_room_documents`.
- Endpoints de data room M&A.
- Ruta frontend `/ma/data-room`.
- Permisos `create:ma_share`, `revoke:ma_share` y `manage:ma_data_room`.
- Secure shares sincronizados con el data room al crear/revocar.
- Tests de migracion, data room multi-tenant y viewer read-only.
- Servicio/API/UI `ma_deals` conectado al pipeline.
- Audit ledger M&A visible y exportable.
- Revocacion de secure shares desde data room UI.

## Verificacion ejecutada

Resultado:

```txt
npm run build                         OK
npm run test:unit                     OK - 65 passed
npm run test:integration              OK - 10 passed
npx playwright test tests/e2e/ma      OK - 6 passed
```

Nota:

La primera ejecucion e2e fallo porque habia un backend viejo escuchando en `4000` y Playwright lo estaba reutilizando. Se paro ese proceso local, se corrigio el middleware de validacion para Express 5 y se relanzo M&A e2e correctamente.

## Pendiente

### Pendiente alto

- Extraer el schema runtime inicial completo a migraciones versionadas baseline.
- Anadir validadores reales para Compliance, Funding, PMI y reports generales.
- Crear contrato compartido de permisos backend/frontend.
- Consolidar exportadores de informes en un `reportExportService`.

### Pendiente medio

- Extraer CSS grande del Sidebar a archivo dedicado.
- Reducir capas globales con `!important`.
- Revisar mojibake/encoding en backend, tests y docs antiguos.
- Anadir ESLint/formatter cuando se decida tooling.
- Tests de permisos admin/user/viewer.
- Tests multi-tenant via API, no solo servicios.
- Tests de produccion sin local fallback.

### Pendiente producto M&A

- Drag and drop o workflow avanzado sobre `ma_deals`.
- Audit log admin global fuera de M&A si se requiere consola transversal.
- Mantener QA visual/PDF A4 periodico si cambia el builder o la capa visual.
- Data room avanzado sobre secure sharing.
- Seeds controlados si se quiere separar demo data de runtime/frontend.

## Punto exacto para continuar

Recomendacion para la siguiente sesion:

1. Extraer el schema inicial completo de `databaseSchema.js` a migraciones SQL baseline.
2. Extender `validate()` a Compliance y Funding.
3. Crear `reportExportService` compartido.
4. Extraer estilos del Sidebar.
5. Anadir tests de permisos y multi-tenant API transversales.
6. Preparar legal/SLA/billing para certificacion externa.

No empezar por nuevas pantallas de marketing hasta cerrar baseline de migraciones, validadores y report export compartido.
