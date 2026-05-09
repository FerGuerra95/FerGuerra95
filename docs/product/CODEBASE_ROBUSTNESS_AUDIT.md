# Codebase Robustness & Coherence Audit

Fecha: 07/05/2026

Objetivo: auditar codigo y estructura para identificar que cambios faltan para que CEO's OS, y especialmente M&A, sea mas robusto, coherente y defendible como producto enterprise.

Actualizacion: la primera capa de hardening derivada de esta auditoria ya esta aplicada y documentada en `docs/product/CODEBASE_HARDENING_STATUS.md`.

## Veredicto ejecutivo

El producto tiene una base muy prometedora:

- estructura modular por dominios (`ma`, `compliance`, `funding`, `pmi`, `ecosystem`);
- backend Express con SQLite persistente;
- autenticacion backend activa;
- aislamiento por `organizationId` en M&A y Compliance;
- informes M&A ya elevados a formato ejecutivo;
- tests unitarios, integracion y e2e existentes;
- documentacion comercial/producto bastante avanzada.

Pero todavia no esta cerrado como plataforma enterprise robusta. La capa de producto esta mas avanzada que la capa de hardening tecnico. Lo mas importante antes de vender a una multinacional grande es reforzar seguridad, validacion, migraciones, auditoria, separacion demo/produccion y consistencia visual/codigo.

## Hallazgos prioritarios

### 1. Critico - Autenticacion y sesiones no son aun enterprise

Evidencia:

- `backend/services/auth/auth.service.js:11` usa `AUTH_SECRET` con fallback local.
- `backend/services/auth/auth.service.js:14` define tokens de 7 dias.
- `backend/services/auth/auth.service.js:18` mantiene usuarios demo en backend.
- `backend/services/auth/auth.service.js:136` usa SHA-256 salteado para passwords.
- `src/shared/services/httpClient.js:29` guarda token en `localStorage`.
- `backend/auth/session.service.js:2` es un stub de sesion.

Riesgo:

- SHA-256 salteado no es suficiente para passwords enterprise.
- No hay revocacion real de sesiones.
- No hay refresh tokens, rotacion, lista de bloqueo ni control de dispositivos.
- `localStorage` aumenta el impacto de un XSS.
- Los usuarios demo son aceptables en desarrollo, pero deben quedar cerrados por bandera en cualquier entorno cliente.

Cambios recomendados:

- Migrar passwords a `argon2id` o `bcrypt` con parametros fuertes.
- Usar libreria JWT probada o sesiones server-side firmadas.
- Implementar expiracion corta de access token y refresh token revocable.
- Guardar token sensible en cookie `HttpOnly`, `Secure`, `SameSite=Lax/Strict` si el despliegue lo permite.
- Crear tabla `auth_sessions` con `user_id`, `organization_id`, `created_at`, `expires_at`, `revoked_at`, `ip_hash`, `user_agent_hash`.
- Anadir logout real con revocacion.
- Bloquear usuarios demo en `NODE_ENV=production` salvo bandera explicita de demo privada.

### 2. Alto - Validacion de API incompleta

Evidencia:

- `backend/api/middlewares/validate.middleware.js:1` solo hace `next()`.
- `backend/api/validators/ma.validator.js:1` contiene esquemas vacios.
- `backend/api/routes/ma.routes.js` no usa validadores por ruta.

Riesgo:

- Parte de la validacion vive dentro de servicios, pero no hay contrato uniforme por endpoint.
- Otros modulos pueden aceptar payloads demasiado amplios.
- Es mas dificil asegurar errores consistentes, limites de tamanio, enums y tipos numericos.

Cambios recomendados:

- Elegir un validador unico (`zod`, `valibot`, `joi` o similar).
- Crear esquemas por endpoint:
  - `auth.login`;
  - `ma.case.create`;
  - `ma.case.update`;
  - `ma.snapshot.create`;
  - `ma.report.export`;
  - compliance suppliers/alerts/evidence/reviews/reports.
- Hacer que `validate(schema)` valide `body`, `params` y `query`.
- Normalizar errores `VALIDATION_ERROR` con campo, codigo y mensaje.
- Rechazar keys desconocidas en endpoints sensibles.

### 3. Alto - Migraciones y esquema de datos aun son MVP

Evidencia:

- `backend/storage/databaseSchema.js:5` crea todo el esquema en runtime.
- `backend/storage/databaseSchema.js:188` define `ma_cases`.
- `backend/storage/databaseSchema.js:215` define `ma_reports`.
- `backend/storage/databaseSchema.js:240` inserta solo `001_initial_runtime_schema`.
- `backend/db/migrations/001_init.sql:1`, `002_ma_tables.sql:1` y `003_compliance_tables.sql:1` son placeholders.
- No hay `REFERENCES` ni `FOREIGN KEY` reales en `databaseSchema.js`.

Riesgo:

- En produccion no hay historial fiable de cambios de esquema.
- Es dificil auditar, revertir o desplegar cambios de datos sin riesgo.
- La integridad entre casos, reports, suppliers, alerts y evidence depende de codigo, no de la base de datos.

Cambios recomendados:

- Crear un runner de migraciones real.
- Convertir el runtime schema actual en migraciones versionadas.
- Anadir claves foraneas donde aplique:
  - `ma_reports.case_id -> ma_cases.id`;
  - compliance alert/evidence/review/report hacia suppliers/alerts.
- Crear tablas `organizations`, `audit_logs`, `auth_sessions`, `secure_share_links`.
- Documentar backup/restore y retention.
- Anadir tests de migracion desde base vacia y desde version anterior.

### 4. Alto - Hardening HTTP/seguridad de servidor incompleto

Evidencia:

- `backend/server.js:95` crea CORS custom.
- `backend/server.js:171` expone health con `environment`, `database` y `uptimeSeconds`.
- `backend/server.js:198` acepta JSON hasta `10mb`.
- No aparece `helmet`, rate limiting ni limite especifico de login.

Riesgo:

- Falta capa estandar de cabeceras de seguridad.
- Login queda expuesto a fuerza bruta sin throttling.
- Health expone detalles utiles para fingerprinting.
- El limite global de 10 MB puede ser demasiado amplio para endpoints no documentales.

Cambios recomendados:

- Anadir `helmet` con CSP adaptada a la SPA.
- Anadir rate limit global y rate limit especifico para `/api/auth/login`.
- Separar `/health` publico minimalista de `/api/health` interno.
- Reducir body limit global y ampliar solo endpoints documentales si hace falta.
- Anadir request id/correlation id por request.
- Sanear logs para no exponer datos sensibles.

### 5. Alto - Separacion demo/produccion debe cerrarse

Evidencia:

- `backend/services/auth/auth.service.js:18` mantiene credenciales demo.
- `backend/services/auth/auth.service.js:526` usa `DEMO_USERS` si no hay bootstrap en desarrollo.
- `src/app/pages/LoginPage.jsx:262` muestra credenciales demo.
- `src/shared/config/demoMode.js` ya fue ajustado para depender de `VITE_PUBLIC_DEMO_MODE=true`.
- `src/modules/ma/services/maCasesApi.js:5` permite fallback local por DEV o bandera.

Riesgo:

- Una build cliente puede mostrar botones/credenciales de demo si no se controla por entorno.
- El fallback local es util para desarrollo, pero no debe existir en ventas enterprise reales.

Cambios recomendados:

- Crear `VITE_PUBLIC_DEMO_MODE=false` por defecto.
- Ocultar credenciales y botones demo fuera de demo privada.
- Hacer fail-fast en produccion si `VITE_ENABLE_MA_LOCAL_FALLBACK=true`.
- Separar datos demo premium en seed controlado, no en UI permanente.
- Crear un checklist de release que valide que demo mode esta apagado.

### 6. Medio - Cliente HTTP necesita resiliencia y contrato de errores

Evidencia:

- `src/shared/services/httpClient.js:97` usa `fetch` sin timeout.
- `src/shared/services/httpClient.js:29` y `:38` leen/escriben token en `localStorage`.
- `src/shared/services/httpClient.js:143` tiene formato roto en `method: 'PATCH'`.

Riesgo:

- Requests colgados o lentos no se cortan de forma controlada.
- Un 401 no fuerza logout global.
- Los errores pierden `code`, `status`, `meta` y `path`.

Cambios recomendados:

- Crear `ApiError` con `status`, `code`, `message`, `meta`.
- Anadir `AbortController` con timeout.
- Manejar 401/403 de forma centralizada.
- Reintentar solo operaciones idempotentes y solo ante errores de red.
- Anadir `X-Request-Id` o leerlo del backend.

### 7. Medio - Permisos duplicados entre frontend y backend

Evidencia:

- `backend/api/middlewares/auth.middleware.js` define `PERMISSIONS` y `ROLE_PERMISSIONS`.
- `src/app/providers/AuthProvider.jsx` replica `PERMISSIONS` y `ROLE_PERMISSIONS`.

Riesgo:

- Drift entre UI y backend.
- La UI podria mostrar acciones que backend bloquea, o esconder acciones permitidas.

Cambios recomendados:

- Crear un contrato compartido de permisos en `src/shared/contracts` y una copia backend generada, o mover a paquete comun.
- Anadir test que compare permisos frontend/backend.
- Exponer `/api/auth/me` con permisos resueltos desde backend.
- La UI debe fiarse del backend como fuente de verdad.

### 8. Cerrado Fase 4 - M&A pipeline backend real

Evidencia:

- `src/modules/ma/pages/DealPipelinePage.jsx` contiene `DEMO_PIPELINE_DEALS`.
- `src/modules/ma/pages/DealDetailPage.jsx` contiene `DEMO_DEAL_DETAILS`.
- `backend/storage/migrations/002_ma_enterprise_saas.sql` crea `ma_deals`.
- `backend/services/ma/deals.service.js` opera pipeline real por organizacion.

Riesgo:

- El pipeline ya tiene entidad backend, permisos y audit trail.
- Las demos quedan como fallback visual/seed, no como unica fuente.

Cerrado:

- `ma_deals` creado por migracion versionada.
- Endpoints `GET/POST/PATCH/DELETE /api/ma/deals`.
- `/ma/pipeline` carga backend y permite sincronizar deals visibles.
- Stage, owner, prioridad, riesgo, next step, IC memo y status persistidos.
- Audit log de crear, actualizar y borrar deals.

Pendiente opcional:

- Drag and drop entre fases.
- Comentarios/adjuntos por deal.
- Convertir demos en seeds por organizacion demo.

### 9. Medio - Export/reporting esta duplicado y depende mucho de `document.write`

Evidencia:

- `src/modules/ma/services/maReportsApi.js:47` abre ventana print.
- `src/modules/ma/components/MAReportExportButton.jsx:105` repite logica similar.
- `src/shared/utils/exportHtmlReport.js:6` escribe HTML directamente.
- Compliance, Funding y PMI tambien tienen exportadores propios con `document.write`.

Riesgo:

- Inconsistencias entre informes.
- Mas superficie XSS si algun HTML procede de inputs no escapados.
- Dificultad para certificar estilo PDF y gobernanza documental.

Cambios recomendados:

- Crear un `reportExportService` compartido.
- Centralizar:
  - `ensureHtmlDocument`;
  - escape/sanitizacion;
  - print window;
  - download HTML;
  - metadata `noindex`;
  - classification/confidentiality.
- Para enterprise, guardar reports server-side y exportar PDF desde backend o job controlado.
- Anadir tests de HTML escaping y snapshot basico de informe.

### 10. Medio - Arquitectura visual fragil

Evidencia:

- `src/app/layout/Sidebar.jsx:73` contiene CSS inline grande.
- `src/app/layout/Sidebar.jsx:663` usa `padding-bottom: 190vh !important`.
- `src/app/layout/Sidebar.jsx:712` mantiene `stableScrollSidebarToWorkspace` sin uso visible.
- `src/styles/executivePolish.css` y `src/modules/ma/styles/maExecutiveTheme.css` aplican capas globales.
- `src/modules/ma/styles/maExecutiveTheme.css:69` usa letter spacing negativo.

Riesgo:

- Cambios visuales globales pueden romper rutas no auditadas.
- Mucho `!important` hace dificil mantener consistencia.
- El sidebar es dificil de evolucionar y testear.

Cambios recomendados:

- Extraer CSS del Sidebar a archivo dedicado.
- Crear tokens de diseno:
  - colores;
  - espaciados;
  - radios;
  - sombras;
  - tipografia;
  - densidad de tablas/cards.
- Reducir `!important` progresivamente.
- Eliminar funciones muertas y paddings artificiales.
- Anadir e2e visual que recorra desktop/mobile en rutas clave.

### 11. Medio - Higiene de repositorio y estructura

Evidencia:

- `git status --short` muestra muchas modificaciones pendientes y archivos no trackeados.
- `test-results/` aparece como no trackeado.
- `src/app/store/ui.Store.js` existe vacio junto a `src/app/store/uiStore.js`.
- Hay deletes pendientes como `DealDetailPage.jsx.bak` y scripts antiguos.

Riesgo:

- Es dificil distinguir trabajo real de artefactos generados.
- En Windows, nombres que solo cambian en mayusculas/minusculas pueden dar problemas.
- La auditoria y despliegue se vuelven menos fiables.

Cambios recomendados:

- Cerrar una rama/commit de estabilizacion.
- Anadir `test-results/` y `playwright-report/` a `.gitignore`.
- Eliminar archivos vacios/duplicados si no tienen uso.
- Separar commits:
  - producto M&A;
  - informes;
  - estilos;
  - backend hardening;
  - docs.
- Mantener `dist/` fuera de git salvo decision explicita de despliegue estatico.

### 12. Medio - Encoding/i18n mezclado

Evidencia:

- Hay mojibake visible en backend y docs, por ejemplo palabras de produccion, contrasena y organizacion renderizadas con secuencias corruptas.
- La UI mezcla castellano e ingles en areas enterprise.

Riesgo:

- Mala percepcion profesional.
- Inconsistencia en informes y errores.
- Dificultad para vender multinacionalmente.

Cambios recomendados:

- Normalizar todo el repo a UTF-8.
- Decidir idioma por producto:
  - UI enterprise en ingles;
  - docs comerciales en castellano/ingles;
  - informes M&A en ingles por defecto.
- Crear diccionario de labels o capa i18n ligera.
- Anadir test/grep de mojibake a CI.

### 13. Bajo - Tooling de calidad incompleto

Evidencia:

- `package.json:19` a `:22` tiene tests, pero no `lint`, `format` ni `typecheck`.
- Dependencias `html2pdf.js` y `jspdf` siguen presentes aunque el flujo actual usa print/HTML.

Riesgo:

- Errores de estilo, imports muertos y variables sin uso no se detectan antes.
- Dependencias no usadas aumentan peso y mantenimiento.

Cambios recomendados:

- Anadir ESLint.
- Anadir Prettier o formatter unico.
- Anadir `npm run quality` con build + unit + integration + lint.
- Revisar dependencias no usadas despues de consolidar exports.

## Orden recomendado de trabajo

### Sprint 0 - Estabilizar repo

Objetivo: que el codigo actual sea facil de auditar y desplegar.

1. Limpiar archivos vacios/duplicados.
2. Ignorar artefactos Playwright.
3. Separar commits por area.
4. Corregir mojibake mas visible.
5. Anadir script `quality`.

Resultado esperado:

```txt
Repo limpio, reproducible y facil de revisar.
```

### Sprint 1 - Seguridad base enterprise

Objetivo: cerrar los riesgos mas importantes.

1. Rate limit login.
2. Helmet/cabeceras.
3. Validacion real de API.
4. Password hashing fuerte.
5. Sesiones revocables.
6. Demo mode apagado por defecto.

Resultado esperado:

```txt
Backend defendible para piloto cliente real.
```

### Sprint 2 - Datos, migraciones y audit trail

Objetivo: hacer robusta la persistencia.

1. Runner de migraciones.
2. Migraciones SQL reales.
3. Foreign keys.
4. `audit_logs`.
5. `auth_sessions`.
6. Backups y restore drill documentados.

Resultado esperado:

```txt
Persistencia preparada para operaciones controladas.
```

### Sprint 3 - Producto M&A coherente de punta a punta

Objetivo: que M&A no dependa de demos internas para parecer enterprise.

1. Entidad real de pipeline/deal.
2. Secure sharing server-side.
3. Export/reporting compartido.
4. 3 casos demo premium como seed controlado.
5. PDF visualmente validado.
6. e2e de las 8 rutas M&A.
7. Data room M&A foundation.

Resultado esperado:

```txt
M&A listo como producto vendible controlado.
```

### Sprint 4 - QA y release enterprise

Objetivo: poder entregar a cliente con confianza.

1. Lint/quality gate.
2. Tests permisos admin/user/viewer.
3. Tests multi-tenant.
4. Tests sin fallback local en produccion.
5. Screenshots desktop/mobile.
6. Checklist release.

Resultado esperado:

```txt
Release candidate enterprise privado.
```

## Punto de arranque recomendado

Empezaria por este orden:

1. Crear validacion real de API y rate limit de login.
2. Apagar demo mode por defecto y ocultar credenciales demo fuera de entorno privado.
3. Extraer el schema runtime inicial completo a migraciones baseline.
4. Crear `audit_logs` para acciones M&A.
5. Consolidar exportadores de informes en un servicio compartido.
6. Extraer CSS del Sidebar y reducir capas globales `!important`.

Ese orden ataca primero los riesgos que una multinacional miraria antes: seguridad, datos, trazabilidad, demo/produccion y coherencia de mantenibilidad.
