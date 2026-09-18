# CEO's OS — Deployment and Operational Baseline

**Baseline:** 17 September 2026. This is the observed operational path and future validation procedure, not a deployment authorization or production-readiness claim. Current release is BLOCKED; A01/P1 findings remain open.

## CURRENT — Node/Express, dist, SQLite and filesystem VDR

`package.json` uses `npm run build` for Vite and `npm start` / `npm run server` for `node backend/server.js`. `npm run dev` starts Vite development; it is not the canonical production-style runtime.

`backend/server.js` initializes storage and serves generated `dist` plus the Express API. Default local port is 4000. Canonical final QA is [http://127.0.0.1:4000](http://127.0.0.1:4000). During Astra, root HTML matched disk dist and public/guard observations succeeded; authenticated behavior and exact source-build parity remain UNVERIFIED.

Database runtime is SQLite/better-sqlite3, with WAL, FK enforcement and busy timeout configured. Default development path is `backend/data/ceo_os.sqlite`; production requires an explicit configured path. Active schema/migrations are under `backend/storage/`. Startup and authenticated requests can mutate state; do not launch them against canonical data during read-only validation.

VDR metadata and file bytes are separate. Files use `MA_VDR_STORAGE_DIR`, then `VDR_STORAGE_DIR`, otherwise `ma_vdr` beside the configured database. Both DB and file storage need coordinated persistence, backup and restore. A database-only backup does not prove document recovery.

## Environment and bootstrap

| Setting | Current source contract / caution |
|---|---|
| `PORT`, `NODE_ENV` | Process port/mode; local canonical QA 4000 |
| `AUTH_SECRET` | Production required, startup checks minimum 32 characters; never print/store in docs |
| `DB_PATH` | Primary SQLite path; `SQLITE_PATH` / `SQLITE_DB_PATH` accepted aliases |
| `MA_VDR_STORAGE_DIR` / `VDR_STORAGE_DIR` | Filesystem VDR root; coordinate with DB backup/restore |
| `PUBLIC_APP_URL`, `FRONTEND_URL`, `CORS_ORIGIN(S)` | Public-link/origin configuration; verify actual values privately for the deployment |
| Bootstrap user variables | Identity provisioning; secret-store values only; never copy production identities into test fixtures |
| Demo/local fallback flags | Production M&A local fallback is rejected; this does not fix Pipeline demo provenance A12 |
| OIDC settings | Optional issuer/client/redirect configuration; provider-specific A42 validation remains pending |

Do not substitute historical `DATABASE_URL`, `JWT_SECRET` or generic bucket/AI keys for the implemented storage/auth contract. Inspect `.env.example` and `infra/env/` without exposing real environment values.

**A03 OPEN:** `server.js` calls `dotenv.config()` after static imports. ESM dependency evaluation can capture auth/security settings first. Process-injected env avoids that particular timing; actual runtime impact remains UNVERIFIED. A deterministic bootstrap fix and startup regressions belong to Phase 2.

## Render configuration and scaffold distinction

The checked-in `render.yaml` specifies Node, `npm ci && npm run build`, `npm start`, production mode and `/health`. It does not itself prove a live persistent disk, VDR durability, approved secret configuration or successful current deployment. This pass did not access or change a hosted environment.

`infra/` Docker/compose material uses a Node development command and a Postgres service. That scaffold is inconsistent with the observed operational Node/SQLite path (A43). It is not evidence of a Postgres-backed production product, and no database migration or infrastructure rewrite is authorized.

## Future reproducible validation procedure

After isolated validation and an explicit implementation/operations scope:

1. Identify exact source commit plus accepted dirty manifest, package-lock/runtime identity and build inputs.
2. Resolve and verify isolated DB/VDR paths; snapshot schema/migration identity without exposing customer records.
3. Build from those inputs and record generated asset hashes; never manually edit dist.
4. Restart the intended Express process serving that dist; verify process/port and root/assets identity.
5. On canonical port 4000 in the approved data environment, run scoped public and authenticated role/tenant/workflow checks and record console/network evidence.
6. Verify backup/restore of SQLite including appropriate WAL handling and VDR objects, environment validation, monitoring and rate-limit behavior.
7. Record rollback/restore instructions and UAT sign-off. A health 200 alone is insufficient.

No install, build, server restart, migration, test, backup, restore or deployment was executed by this documentation pass. Existing historical production smoke is not current validation. See [test strategy](testing/TEST_STRATEGY.md), [data model](data-model.md) and [roadmap](roadmap.md).


## Historical record — superseded for current status

Preserved verbatim (earlier generic deployment proposal; original date not recorded). Every PASS, CLOSED, READY, RESOLVED and “current” statement below belongs to its historical phase, not the 17 September 2026 baseline. Current sections above take precedence; historical test output is not current validation.

<details>
<summary>Historical content — not current release evidence</summary>

# Despliegue

## Entornos
- **local**
- **staging**
- **production**

## Variables de entorno
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `STORAGE_BUCKET`
- `EMAIL_PROVIDER_KEY`
- `TRANSLATION_API_KEY`
- `OCR_API_KEY`
- `RAG_API_KEY`

## Requisitos
- Base de datos accesible.
- Almacenamiento de archivos.
- Sistema de logs y monitorización.
- Backups.

## Flujo recomendado
1. Desplegar backend.
2. Ejecutar migraciones.
3. Cargar seed inicial si aplica.
4. Desplegar frontend.
5. Validar health checks.
6. Activar monitorización y alertas.

## Buenas prácticas
- No desplegar sin `.env` validado.
- Mantener staging alineado con producción.
- Versionar API y migraciones.
- Registrar fallos de jobs y reintentos.

</details>
