# CEO's OS — Canonical Technical-Debt Register

**Current baseline:** 17 September 2026, Astra forensic audit; HEAD `43e470f630b8b2b79cc5241aeac6279492108081` plus audited dirty/untracked source. This register and the [master execution tracker](CEO_OS_MASTER_CONTROL_BASELINE.md) use the same immutable IDs A01–A44.

## Status and evidence rules

**Master synchronized:** the canonical undated tracker was created under explicit authorization; the dated source remains unchanged. Phase 0 and Phase 0.5 are CLOSED by human acceptance as of 18 September 2026. Phase 1 is VERIFIED CLOSED. Phase 2 — Security / access is ACTIVE. A01, A02, A03, A26 and A27 are VERIFIED CLOSED. A31 remains IN PROGRESS under the explicit 33-document review exception. The next product finding is A04, OPEN P1. The 17 September audit narrative below is historical evidence, not a claim that A01, A02, A03, A26 or A27 are still open.

- **OPEN:** no accepted remediation.
- **IN PROGRESS:** scoped work underway; not closed.
- **FIXED / NOT YET VERIFIED:** implementation changed but acceptance evidence pending.
- **VERIFIED CLOSED:** agreed isolated regression/runtime/operational evidence reviewed.
- **DEFERRED:** explicit decision with rationale; not equivalent to closure.
- **NOT A DEFECT:** disproven by recorded evidence.

VERIFIED FACT means inspected source/Git/schema/runtime evidence; INFERENCE is a conclusion requiring further validation; UNVERIFIED describes missing execution/operational proof. Static findings do not claim a successful exploit.

**Current totals:** zero P0 OPEN; 25 P1 OPEN (A04–A25 and A28–A30); A31 IN PROGRESS; A01, A02, A03, A26 and A27 VERIFIED CLOSED; 12 P2 OPEN (A32–A43); one P3 OPEN (A44). Residual non-register P2 notes are E2E fixture collisions and an unrendered `commandCalendar`. They remain separate from the A01, A02 and A03 closures.

## Current A01–A44 register

### A01 — VDR file ownership binding

**Priority:** P0 · **Status:** VERIFIED CLOSED · **Evidence:** independent review and post-merge validation.

- **Problem:** client-controlled storage reference is persisted; download containment is checked against the global VDR root but the physical file reference is not bound to the requesting organization/document.
- **Impact:** conditional cross-tenant file access path if another storage key is known.
- **Owner:** VDR / Security.
- **Required closure:** server-owned storage reference + tenant/document binding + negative cross-tenant tests.
- **Closure:** physical VDR file identity is server-generated and server-controlled. Tenant scope comes from the authenticated server context. Download requires the resolved file to sit in the tenant and document directory. Client `storage` and `versions` are rejected. A poisoned historical storage reference fails closed. Negative regressions cover cross-tenant reads, same-tenant wrong-document reads, forged storage keys, and an organization-directory case that fails when only organization binding is removed. Tests used the A27 temporary DB and VDR. Post-merge validation on `main` passed A01 8/8, maServices 10/10, VDR isolation 1/1, test isolation 10/10, and `npm run build`. Product commit `46932c22021be9c0baedd4754c108f6d74411225`. This closure is physical file ownership binding only. It does not close A33 content/ACL, A05, or the rest of Phase 2.

**Evidence anchors:** backend/api/validators/ma.validator.js; backend/services/ma/dataRoom.service.js — nested payload.storage; resolveStoragePath; create/download.

### A02 — Governance approval transition bypass

**Priority:** P1 · **Status:** VERIFIED CLOSED · **Evidence:** independent review and post-merge validation.

- Generic create/update can accept `status: approved` even though explicit approval requires a stronger permission.
- Closure: permission-aware state machine; generic CRUD cannot perform privileged transitions.
- **Closure evidence:** generic decision CRUD no longer owns workflow transitions. Generic create cannot create a privileged workflow state, and generic update cannot perform workflow transitions. A service-level backstop prevents a direct-call bypass. The validator rejects forbidden HTTP status writes visibly. Dedicated approve, reject and request-changes retain `APPROVE_GOVERNANCE_DECISION`. `under_review` to `draft` cannot emulate request-changes through generic update. A legitimate dedicated approval still writes `approvedAt`, `lockedAt`, history and the audit action. Board Pack and PMI/Ecosystem fixtures use the canonical approval workflow. Tenant isolation is preserved. Mutation sensitivity was independently reviewed. Post-merge validation passed A02 focused 13/13, governanceEnterprise 3/3, boardPackReporting 6/6, pmiEcosystemEnterprise 5/5, test isolation 10/10, combined 37/37, and `npm run build`. Product commit `cbc97d692021b5f03ce2549524bae46eaa76b5e4`. This closure is the generic Governance decision workflow-transition bypass only. It does not close A03, A04, A05, or the rest of Governance or Phase 2.

**Evidence anchors:** backend/api/routes/governance.routes.js; backend/api/validators/governance.validator.js; backend/services/governance/governance.service.js — generic status vs approve.

### A03 — Security config captured before dotenv

**Priority:** P1 · **Status:** VERIFIED CLOSED · **Evidence:** independent review and post-merge validation.

- ESM module evaluation can capture auth/signing configuration before `dotenv.config()`.
- Closure: deterministic environment bootstrap before dependent config capture; startup tests.
- **Closure evidence:** On the clean baseline, isolated server startup captured the development AUTH_SECRET fallback, missed `NODE_ENV=production` from dotenv, and missed `CEOS_E2E=true` from dotenv. Focused baseline result: 3 failed / 1 passed. The fix is a structural bootstrap boundary: environment initialization, then runtime module evaluation, then application construction, then database initialization and listen. Supported product entrypoints (`package.json` `server`, `server:dev`, `start` and `prod`, and `render.yaml` through `npm start`) enter through `backend/server.js`. A login token matched the dotenv-loaded synthetic AUTH_SECRET. Production health omitted the development environment field when `NODE_ENV=production` came only from dotenv. The login limiter followed `CEOS_E2E=true` from dotenv. Pre-existing `process.env` values still take precedence. The development AUTH_SECRET fallback remains. Independent review verdict: VERIFIED. Post-merge validation passed A03 focused 4/4, auth/health/unit-auth/isolation regression 36/36, A27 isolation, and `npm run build`. Canonical DB and VDR were not mutated. Port 4000 was not used. Product commit `46348857294d41a1c1feb995d9c65032f08bf1ed`. This closure is deterministic environment bootstrap ordering for supported product runtime startup only. It does not close the development AUTH_SECRET fallback, A42, Render or deployment, A43, general configuration architecture, or unrelated auth or security findings.

**Evidence anchors:** backend/server.js; backend/bootstrap/loadEnvironment.js; backend/bootstrap/loadRuntime.js; backend/httpApp.js; backend/services/auth/auth.service.js.

### A04 — Audit persistence failures swallowed

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Mutations may succeed without durable audit event.
- Closure: explicit failure policy; transactional/outbox or documented durable alternative.

**Evidence anchors:** backend/services/audit/auditLog.service.js — recordAuditLog catch/return; domain mutation-before-audit callers.

### A05 — Secure-share query token can enter URL/error logs

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: remove/limit legacy query-token path and redact sensitive URL/token data.

**Evidence anchors:** backend/api/controllers/ma.controller.js; backend/api/middlewares/error.middleware.js — query token and originalUrl.

### A06 — Compliance delete actor can become original creator

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: authenticated actor propagated correctly into delete audit.

**Evidence anchors:** backend/api/controllers/suppliers.controller.js; backend/services/compliance — delete actor fallback; related evidence/review/report paths.

### A07 — Password reset route missing

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Backend generates `/reset-password?token=...`; component exists; route not mounted.
- Closure: route + guarded reset flow tests.

**Evidence anchors:** src/app/router/routes.jsx; backend/services/auth/auth.service.js — reset URL; audit browser redirect.

### A08 — Compliance mount can auto-persist defaults/cache

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Empty reads can seed/synchronize values during hydration.
- Closure: explicit user/demo action required for persistence; empty read remains empty.

**Evidence anchors:** src/modules/compliance/store — mount hydration, empty/default fallback and remote synchronization.

### A09 — M&A reports successful sync before remote persistence resolves

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: success acknowledgement only after confirmed backend result; failure visible and recoverable.

**Evidence anchors:** src/modules/ma/pages/ValuationPage.jsx; src/modules/ma/store/maStore.jsx; src/modules/ma/services/maCasesApi.js — early success and fire-and-forget remote save.

### A10 — M&A identity inferred from metrics/global active alias

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Equal-valued unrelated records may merge.
- Closure: identity must use stable IDs only.

**Evidence anchors:** src/modules/ma/store/maStore.jsx; src/modules/ma/engine/maPipelineDataset.js — missing active case identity, active-deal alias, metric match.

### A11 — Persisted backend stage can be overwritten by saved overlay

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: explicit source precedence with persisted lifecycle authority.

**Evidence anchors:** src/modules/ma/engine/maPipelineDataset.js; src/modules/ma/pages/MADashboardPage.jsx — backend/live/saved merge precedence.

### A12 — Pipeline can aggregate/sync demo rows after empty/error response

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: demo fallback must be provenance-tagged and non-persistable/non-operational.

**Evidence anchors:** src/modules/ma/engine/maPipelineDataset.js; src/modules/ma/pages/DealPipelinePage.jsx — empty/error demo fallback and sync payload.

### A13 — Dashboard and Pipeline use different portfolios

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: shared operational portfolio selector and documented KPI semantics.

**Evidence anchors:** src/modules/ma/pages/MADashboardPage.jsx; src/modules/ma/engine/maPipelineDataset.js — different portfolio construction/counts.

### A14 — Case/deal/detail/report/document relationships incomplete

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: preserve identifiers through save/load/detail/report/share/VDR/archive.

**Evidence anchors:** src/modules/ma/pages/DealPipelinePage.jsx; DealDetailPage.jsx; MADataRoomPage.jsx; backend/services/ma/deals.service.js; maReportsApi.js — caseId/link propagation.

### A15 — Spanish M&A risk labels can serialize to `medium`

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: stable machine enum independent from localized display labels.

**Evidence anchors:** src/modules/ma/engine/riskScoring.js; src/modules/ma/pages/DealPipelinePage.jsx — Spanish risk labels vs English normalization.

### A16 — Invalid DCF `null` becomes numerical zero downstream

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: explicit null/unavailable semantics; blending only when valid.

**Evidence anchors:** src/modules/ma/engine/valuationFormulas.js; useValuationEngine.js; reportBuilder.js — Number(null) finite check.

### A17 — “Low” EV can exceed base EV

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: range invariant / approved business oracle; low ≤ base ≤ high when the contract requires it.

**Evidence anchors:** src/modules/ma/engine/useValuationEngine.js — base adjusted multiple and low-band floor; audited counterexample.

### A18 — Documentary readiness inferred from quality/stage

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: document readiness driven by linked evidence, not heuristic stage/quality proxy.

**Evidence anchors:** src/modules/ma/pages/DealDetailPage.jsx — quality/stage financial/commercial/legal readiness vs actual evidence.

### A19 — Snapshot/re-export version policy incomplete

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: immutable source snapshot, method/version/input bridge preserved.

**Evidence anchors:** src/modules/ma/pages/ValuationPage.jsx; src/modules/ma/utils/formatMAReportData.js; maStore.jsx — incomplete saved method/version/WC and reload reconstruction.

### A20 — Mixed-currency portfolio values summed without conversion

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: explicit currency contract and conversion/prohibition policy.

**Evidence anchors:** src/modules/ma/pages/MADashboardPage.jsx; DealPipelinePage.jsx — portfolio sums vs per-case/report currencies.

### A21 — Funding nullable dilution reaches `.toFixed()`

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: null-safe narrative/calculation path and tests.

**Evidence anchors:** src/modules/funding/engine/fundingFormulas.js; fundingNarrative.js; useFundingEngine.js — nullable dilution formatted unconditionally.

### A22 — PMI numerator/denominator can come from different sources

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: coherent metric source pair and counterexample tests.

**Evidence anchors:** backend/services/pmi/pmi.service.js — independent target/captured fallback; test-only operational mirror.

### A23 — Heritage empty organization emits numeric health/readiness

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: null/insufficient-data result rather than fabricated score.

**Evidence anchors:** backend/services/heritage/heritage.service.js — empty control defaults and numeric continuity/protection/readiness.

### A24 — Executive fallback changes metric authority/formula

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: source-labelled failure/fallback semantics; do not silently substitute another formula.

**Evidence anchors:** src/modules/ceo-overview/pages/CEOOverviewPage.jsx; backend/services/executive/readinessIndex.service.js — local fallback vs weighted backend aggregation.

### A25 — Human-review flag overwritten by absent summary flag

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: contract/object-key fix + regression test.

**Evidence anchors:** src/modules/ceo-overview/pages/CEOOverviewPage.jsx — duplicate humanReviewRequired assignment in Funding summary bridge.

### A26 — Eight JSX suites excluded; three integration placeholders

**Priority:** P1 · **Status:** VERIFIED CLOSED · **Evidence:** VERIFIED FACT (isolated Vitest discovery and assertion review).

- Closure: test discovery corrected; placeholders replaced with meaningful assertions.

**Evidence anchors:** vite.config.js; eight tests/unit/**/*.test.jsx; three placeholder integration files enumerated in TEST_STRATEGY.md.

### A27 — E2E DB isolation not enforced

**Priority:** P1 · **Status:** VERIFIED CLOSED · **Evidence:** VERIFIED FACT (independent re-review, 2 October 2026: isolation guards, 15/15 focused tests, independent 26/26 E2E, canonical digest unchanged).

- Closure: unique isolated DB and file roots; tests cannot target canonical data accidentally.

**Evidence anchors:** playwright.config.js; scripts/run-e2e.mjs; tests/e2e — external app reuse and no enforced unique DB/VDR roots.

### A28 — Existing DB constraints differ from fresh schema

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: migration/schema reconciliation for existing databases; verify fresh + upgraded parity.

**Evidence anchors:** backend/storage/databaseSchema.js; migrationRunner.js; migrations; immutable checkpoint schema observation.

### A29 — Full product formulas lack approved end-to-end oracles

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: business-approved expected outputs for composed production paths.

**Evidence anchors:** docs/testing/FORMULA_REGISTRY.md; golden_inputs.json; production engines vs simple Golden helpers and mirror tests.

### A30 — HEAD does not reproduce current product

**Priority:** P1 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: accepted dirty/untracked manifest, validated commits, reproducible build provenance.

**Evidence anchors:** Git audit: 58 tracked changed, 83 untracked, three local commits ahead; active untracked imports; no clean rebuild proof.

**Required acceptance:** Accept/classify the source manifest, then validate scoped commits and a clean known-source build. Documentation alone cannot close reproducibility.

### A31 — Readiness/deployment/commercial claims are stale

**Priority:** P1 · **Status:** IN PROGRESS · **Evidence:** VERIFIED FACT (audit inspection).

- Closure: documentation baseline reflects current blockers and evidence.

**Evidence anchors:** Historical readiness/deploy/claims documents; reconciled current sections in this documentation pass; other historical assets remain outside scope.

**Required acceptance:** Phase 0/0.5 acceptance is recorded. Review and reconcile the 33 remaining UNKNOWN — HUMAN REVIEW files, especially commercial claims/offers and infrastructure scaffolds. A31 remains IN PROGRESS until that residual review is accepted.

### A32 — Retention/legal hold/watermark only partial

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- VDR-specific metadata exists; no unified enforcement; watermark is header-level, not embedded-file watermarking.

**Evidence anchors:** backend/services/ma/dataRoom.service.js; backend/api/controllers/ma.controller.js — retention/hold metadata, archive checks, watermark response header.

**Required acceptance:** Approve and test hold/release/archive/retention semantics and watermark claims; demonstrate the promised enforcement.

### A33 — Upload inspection/document ACL incomplete

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- No content-signature/malware inspection found; document ACL model requires consolidation.

**Evidence anchors:** backend/services/ma/dataRoom.service.js — extension/size/checksum controls, role list and download policy; no content scanner found.

**Required acceptance:** Approve and validate upload content/ACL contract, including board_member and list/download policy.

### A34 — Mounted rate limits are single-process memory

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** backend/httpApp.js and mounted rate-limit middleware — process-local Maps; unused Redis-capable alternative is not runtime evidence.

**Required acceptance:** Prove bounded/distributed enforcement appropriate to the deployment and approved load.

### A35 — Generic validators/links can allow inconsistent domain records

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Notably Risk/Reporting/Strategy relationship/domain validation.

**Evidence anchors:** Risk/Reporting/Strategy validators and domain services — broad payloads/linked-ID semantics; no SQL-injection claim.

**Required acceptance:** Validate linked IDs, tenant ownership and domain invariants with isolated negative tests.

### A36 — Report schedules / Risk notifications have no executor found

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** backend/services/reporting and risk — persisted schedules/notifications; executor not found in inspected consumers.

**Required acceptance:** Implement and validate promised executors or explicitly scope product claims to metadata-only records.

### A37 — CSS/material ownership competes

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Do not fix by redesign. Resolve only after functional closure with computed-style evidence.

**Evidence anchors:** src/main.jsx; src/styles.css; src/styles/executivePolish.css; M&A page/shared CSS and runtime style blocks.

**Required acceptance:** Establish computed-style ownership and equivalent frozen visuals before retiring overlapping rules.

### A38 — Error-to-empty / error-to-success handling hides failures

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** maCasesApi.js; maStore.jsx; Repository sync labels; enterprise page catch-to-empty paths.

**Required acceptance:** Preserve visible failure/provenance; success only after actual confirmed operation.

### A39 — Buyer categories/top-selection inconsistent

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** src/modules/ma/engine/reportBuilder.js; src/modules/ma/pages/ValuationPage.jsx — category labels/filter and first-item top selection.

**Required acceptance:** Use agreed category keys and correct ranked top-selection with production-path tests.

### A40 — Secure-share “active” display can outlive expiry until refresh

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** src/modules/ma/engine/maRepositoryCoherence.js; MADataRoomPage.jsx — early isActive return and no expiry-driven refresh.

**Required acceptance:** Derive active UI state from expiry/revocation and validate time/refresh behavior; backend enforcement already exists.

### A41 — AI/integration presentation exceeds connected-runtime evidence

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Keep product claims aligned with disabled/mock/stub reality until activated and verified.

**Evidence anchors:** backend/services/ai; backend/integrations; landing/dashboard presentation — disabled/mock/stub vs connected runtime claims.

**Required acceptance:** Align claims with disabled/mock capability; any provider activation needs a separate governance phase.

### A42 — OIDC identity binding needs provider-specific validation

**Priority:** P2 · **Status:** OPEN · **Evidence:** INFERENCE / provider-specific validation UNVERIFIED.

- Requires targeted tests; audit did not establish an exploit.

**Evidence anchors:** backend/services/auth/oidcAuth.service.js; auth.service.js — email account linking, userinfo/subject and flow binding review.

**Required acceptance:** Provider-specific identity/subject/email/flow-binding tests; record exploitability or disproof without assuming either.

### A43 — Docker/Postgres scaffold differs from operational Node/SQLite setup

**Priority:** P2 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).



**Evidence anchors:** infra Docker/compose files; render.yaml; backend/server.js; backend/storage/sqliteStorage.js — development/Postgres scaffold vs Node/SQLite.

**Required acceptance:** Reconcile deploy artifacts only in a later authorized infrastructure task and validate the actual persistent runtime.

### A44 — Empty/orphan/scaffold files increase ambiguity

**Priority:** P3 · **Status:** OPEN · **Evidence:** VERIFIED FACT (audit inspection).

- Cleanup only after higher-priority correctness work.

**Evidence anchors:** Static import/route consumer audit: empty/orphan/scaffold candidates; dynamic use still requires quarantine review.

**Required acceptance:** Verify imports/routes/dynamic consumers/tests, document candidates, quarantine before any later authorized deletion.

## Interpretation and closure limits

A01 is a conditional cross-tenant physical-file path if another storage key is known; no exploit was attempted. A03 deterministic bootstrap ordering is VERIFIED CLOSED for supported product startup. The original inspection did not expose a live production configuration, and the development AUTH_SECRET fallback remains. A05 describes possible URL/token leakage, not an observed leaked token. A10 collision consequences are inferred from inspected identity matching. A42 is an inference requiring provider-specific tests.

Missing FKs alone do not prove tenant leakage. Basic Golden helpers do not validate the full productive formula. Intentional Risk/Bridge benchmark separation and removed PMI demo merge are not reopened as defects by this register.

Every closure must record exact files, source/tree/build/schema, isolated tests, manual business oracle where needed, runtime/operational evidence, reviewer and residual risk. Use [test strategy](../testing/TEST_STRATEGY.md) and dependency-ordered [roadmap](../roadmap.md). This register authorizes no product fix.

## Historical findings — retained, not reclassified as current

The original 7 May 2026 audit and its later closure annotations are preserved verbatim below. Old numbered findings are a separate historical namespace; “Cerrado Fase 4” and earlier recommendations are not A01–A44 closures or current instructions. Current implementation includes scrypt, sessions, validators, audit tables, real migrations and Reporting persistence; historical absence statements must not be presented as current facts.

<details>
<summary>7 May 2026 audit and historical closure notes</summary>

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

</details>
