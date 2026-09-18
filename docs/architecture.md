# CEO's OS — Current and Target Architecture

**Baseline:** Astra forensic audit, 17 September 2026, HEAD `43e470f630b8b2b79cc5241aeac6279492108081` plus audited dirty/untracked files. Current source is not reproducible from HEAD alone (A30). Runtime QA: [port 4000](http://127.0.0.1:4000).

This is the Level 2 canonical current/target architecture authority. The [Master Control](product/CEO_OS_MASTER_CONTROL_BASELINE.md) owns execution status and the [Source of Truth Registry](architecture/SOURCE_OF_TRUTH_REGISTRY.md) owns concept-level data/calculation authority.

## CURRENT — VERIFIED FACT from source

### Frontend and shared shell

React/Vite starts at `src/main.jsx`: BrowserRouter, AppErrorBoundary, AppProviders and AppRoutes. `src/app/router/routes.jsx` composes protected AppShell routes. M&A, Compliance, Funding and PMI providers are mounted across the protected shell; they are not strictly confined to their own pages. Compliance hydration can therefore write on other authenticated surfaces (A08).

`AppShell.jsx` provides global Topbar, workspace switcher, local Sidebar and page outlet. `workspaceConfig`, `routeConfig` and `workspaceNav.js` distribute workspace/navigation configuration; ShellNavContext and SidebarContent coordinate desktop/mobile navigation. Some active pieces are untracked. The shell imports M&A compact styles: domain-to-platform coupling remains.

The mental model is **WORKSPACE → PAGE → WORK**. The switcher selects the workspace; Sidebar presents its local navigation. Public landing/login/secure-share are separate boundaries. A ResetPasswordPage exists but its generated route is not mounted (A07).

### Eleven workspace boundaries

| Workspace | Source module | Current domain responsibility |
|---|---|---|
| Executive Overview | `ceo-overview` | Aggregates module summaries; executive-owned signals/views/snapshots, not operational module masters |
| M&A | `ma` | Cases, deals, valuation drafts, pipeline, reports, documents and shares |
| Compliance | `compliance` | Suppliers, evidence, alerts, reviews, audit runs and risk impacts |
| Funding | `funding` | Local scenarios plus persisted rounds, snapshots and board memos |
| Governance | `governance` | Decisions, committees, policies, controls and board preparation |
| PMI & Synergies | `pmi` | Case payloads plus enterprise integration/synergy records |
| Bridge | `bridge` | Cross-module signals, dependencies, conflicts and attention queue |
| Risk | `risk` | Register, controls, mitigations, incidents and indicators |
| Reporting | `reporting` | Report metadata, board packs and persisted review snapshots/workflow |
| Strategy | `strategy` | Objectives, initiatives, scenarios and metadata exports |
| Heritage | `heritage` | Assets, succession, protection and continuity preparation |

`ecosystem` is an additional internal source module. Bridge marketplace remains internal/unlisted demo, not a public network.

### Backend and platform primitives

`backend/server.js` bootstraps the process, initializes storage and serves `dist`. `backend/httpApp.js` composes request IDs, security headers, CORS, in-memory rate limits, JSON parsing, public/auth routes, protected business routers and final error handling. Audit inventory: 326 route definitions in 19 files; definitions are not proof of endpoint correctness.

Controllers/validators live under `backend/api/`; active domain services live under `backend/services/`. Several enterprise modules use a large domain service behind thin facade files. Old `backend/auth`, `backend/db`, job and integration files must not be mistaken for active authorities by name alone.

Shared primitives include authentication/permissions, tenant payload handling, SQLite entity stores, audit recording, HTTP response/error envelopes and frontend HTTP/report helpers. QueryProvider is a passthrough; empty store/observability scaffolds do not establish capabilities.

### Auth, RBAC, tenant and audit

Active auth is `services/auth/auth.service.js` plus `api/middlewares/auth.middleware.js`. Signed tokens reference persisted sessions; users are reloaded and organization/role derived server-side. Current role vocabulary is admin/user/viewer/board_member. Frontend mirrors support UI gating only.

Organization-scoped SQL is widespread, but no general organization/membership/policy master table exists. A01 VDR file binding and A02 Governance generic approval transitions prevent blanket claims of tenant/RBAC closure. Shared audit writes can fail silently after business mutation (A04); delete actor propagation is incomplete (A06).

### SQLite and files

Active authority: `backend/storage/sqliteStorage.js`, `databaseSchema.js`, `migrationRunner.js` and `migrations/`. The observed checkpoint has 93 tables, 91 organization-scoped tables and 22 migration records. WAL and foreign-key enforcement are configured, but current source constraints do not automatically retrofit existing tables (A28). See [data model](data-model.md).

VDR metadata resides in `ma_data_room_documents`; real file bytes reside under the configured VDR filesystem root. Report storage and secure-share tokens/records are separate. Global root containment is not sufficient ownership enforcement (A01).

### Reporting and calculations

Reporting persists Board Review snapshots and transition audit events, with a frontend HTML renderer. It owns snapshot/workflow records, not upstream module facts or board approval. Module exports are not consolidated into a universal document service.

M&A valuation executes in the frontend. Funding drafts differ from persisted rounds. PMI has case and enterprise layers. Executive backend summaries and frontend fallbacks can disagree. There is no universal implemented rule that the backend computes every metric. The [Source of Truth registry](architecture/SOURCE_OF_TRUTH_REGISTRY.md) records current owners and target contracts.

### Runtime, integrations and operational limits

Node/Express serves the generated frontend on canonical local port 4000. Docker/Postgres files describe a different scaffold (A43), not the observed SQLite runtime. AI is disabled/mock foundation; schedule/notification records do not prove execution workers (A36/A41). Backup scripts exist, but operational restore/monitoring evidence remains UNVERIFIED.

## TARGET — proposed boundaries, not implemented consolidation

Keep the existing modular platform. Establish explicit case/deal/version identity, server-owned file references, permission-aware transitions, durable audit policy, approved calculation/snapshot contracts, visible provenance/failure states and isolated validation. Reporting and Executive should consume module-owned contracts without inventing replacements.

Shared visual primitives should have one material/border/radius owner per visible surface, preserving the frozen M&A appearance. Consolidation, migrations, helper extraction, AI activation and infrastructure changes require their own phases; this baseline implements none.

Execution order and exit gates: [roadmap](roadmap.md). Product defects and evidence: [A01–A44 register](product/CODEBASE_ROBUSTNESS_AUDIT.md).


## Historical record — superseded for current status

The following text is preserved verbatim as a historical record (earlier two-workspace architecture; original date not recorded). Its PASS, CLOSED, READY, RESOLVED, source ownership and next-step statements apply only to their recorded phase, not to the 17 September 2026 working tree. The current sections above take precedence. No historical test result is current validation.

<details>
<summary>Historical content — not current release evidence</summary>

# Arquitectura del Proyecto

## Visión general
La plataforma se divide en dos workspaces de negocio sobre una carcasa común:

- **M&A**: valoración, waterfall, buyer matching, reporting.
- **Compliance**: proveedores, riesgos, alertas, evidencia, revisiones, reportes.

La arquitectura se organiza en capas:

1. **Frontend modular** (`src/`)
2. **Backend/API** (`backend/`)
3. **Testing** (`tests/`)
4. **Documentación** (`docs/`)
5. **Infraestructura** (`infra/`)

## Frontend
### app/
Carcasa global con layout, router, providers y store compartido.

### shared/
Componentes, utils y hooks reutilizables por cualquier workspace.

### modules/ma/
Workspace de valoración M&A.

### modules/compliance/
Workspace de Supply Chain Compliance.

## Backend
### api/
Rutas, controladores, middlewares y validadores.

### auth/
Autenticación, permisos y sesiones.

### domain/
Modelos de dominio separados en `ma/` y `compliance/`.

### services/
Lógica de negocio agrupada por módulo.

### jobs/
Procesos en background: rescans, traducciones, snapshots, reportes.

### integrations/
Conectores externos: RAG, traducción, noticias, geodata, OCR, notificaciones y email.

## Principios de diseño
- Separar carcasa, shared y módulos.
- No mezclar la lógica de M&A con Compliance.
- Mantener el backend como fuente de verdad.
- Dejar RAG y enriquecimiento desacoplados mediante integraciones y jobs.
- Diseñar con revisión humana para Compliance.

</details>
