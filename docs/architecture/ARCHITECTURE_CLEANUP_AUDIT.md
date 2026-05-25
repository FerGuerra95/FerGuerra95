# C.14.9 - Architecture / Monolith / Duplication Audit

## Scope

READ ONLY architecture audit. No product code, backend code, frontend code, tests, migrations, package/config, Golden Dataset, Formula Registry, secrets, cleanup, deletion, refactor, route/auth/router changes, or AI implementation.

## Baseline

| Item | Value |
|---|---|
| Phase | C.14.9 - Architecture / Monolith / Duplication Audit |
| Expected HEAD | `56d8a0d` |
| Verified HEAD | `56d8a0d` |
| Verified origin/main | `56d8a0d` |
| Initial working tree | `?? backend-server.err` only |
| Validation context from C.14.8 | unit 439 passed, integration 74 passed, build PASS |
| Mode | READ ONLY / AUDIT / DOCS |

## Executive Summary

| Severity | Count | Summary |
|---|---:|---|
| P0 | 0 | None found. |
| P1 | 0 | None found for controlled pilot. |
| P2 | 12 | Monoliths, route/API consistency, SoT boundary risk, CSS global debt, test debt, and cleanup sequencing risks. |
| P3 | 8 | Naming, wrappers, placeholder components, broader e2e, visual polish, and later low-risk dead-code cleanup. |

**Recommended next phase:** C.14.10 Cleanup Batch A - dead/unused/legacy only, after this audit is reviewed and file allowlists are approved. If commercial demo timing wins, run C.15.0 Honest Demo/Sales Pack before cleanup.

## Architecture Map

### Frontend

| Area | Current structure | Notes |
|---|---|---|
| App shell | `src/app` | Router, layout, providers, landing/login. |
| Modules | `src/modules` | `bridge`, `ceo-overview`, `compliance`, `ecosystem`, `funding`, `governance`, `heritage`, `ma`, `pmi`, `reporting`, `risk`, `strategy`. |
| Shared | `src/shared` | Utilities, hooks, services, config, UI/brand components. |
| Global styles | `src/styles`, `src/styles.css` | Cross-module polish/accent CSS with many global selectors and `!important`. |

### Backend

| Area | Current structure | Notes |
|---|---|---|
| API layer | `backend/api/controllers`, `routes`, `validators`, `middlewares` | Domain triads exist for most modules. |
| Services | `backend/services` | Domain services mirror product modules plus `audit`, `auth`, `shared`, `executive`. |
| Storage | `backend/storage`, `backend/db`, `backend/data` | SQLite storage is active; `backend/db` remains a legacy-looking area to keep read-only unless specifically audited. |
| Utilities | `backend/utils`, `backend/lib` | OIDC, audit metadata, tenant payload, Redis fallback, etc. |

### Tests

| Area | Current structure | Notes |
|---|---|---|
| Unit | `tests/unit` | Formula, truthfulness, auth/security, module helpers. |
| Integration | `tests/integration` | API and services. |
| E2E | `tests/e2e` | Module flows, auth, smoke, a11y. |
| Root legacy e2e | `tests/ceos-*.spec.js` | Still present outside the main e2e subfolder pattern. |

### Docs

| Area | Current structure | Notes |
|---|---|---|
| Architecture | `docs/architecture` | Source-of-truth registry plus this audit. |
| Product inventory | `docs/product` | Historical cleanup and C.13/C.14 closure log. |
| Testing | `docs/testing` | Logic protocol, Formula Registry, Golden Dataset docs. |
| Pilot/security/privacy/ops | `docs/pilot`, `docs/security`, `docs/privacy`, `docs/operations` | Controlled pilot and procurement readiness docs. |

## Monolith Candidates

| Area | File | Size / signal | Risk | Severity | Recommended action | Future phase |
|---|---|---:|---|---|---|---|
| CEO Overview | `src/modules/ceo-overview/pages/CEOOverviewPage.jsx` | 90,991 bytes / exported function near line 1571 | Aggregator page mixes module fetches, local helpers, routes, UI sections, and truthfulness display. High regression risk if changed casually. | P2 | Extract only after component/selector inventory; do not change SoT. | C.14.12 |
| PMI dashboard | `src/modules/pmi/pages/PMIDashboardPage.jsx` | 72,599 bytes / exported function near line 1274 | Dashboard, demo/fallback state, reporting copy, and operational views are dense. | P2 | Split visual panels after PMI truthfulness tests are mapped. | C.14.12 |
| M&A deal detail | `src/modules/ma/pages/DealDetailPage.jsx` | 72,431 bytes / exported function near line 463 | Deal scoring, memo generation, data-room readiness, labels, and UI live in one page. | P2 | Extract pure presentation/helpers only after M&A report/snapshot policy is reviewed. | C.14.12 |
| Funding dashboard | `src/modules/funding/pages/FundingDashboardPage.jsx` | 65,849 bytes / exported function near line 1443 | Draft workspace, persisted API summary, demo tools, export, and executive widgets meet in one page. | P2 | Preserve draft vs persisted labels; extract only low-risk UI panels. | C.14.12 |
| Bridge marketplace | `src/modules/ecosystem/pages/BridgeMarketplacePage.jsx` | 63,511 bytes / route `/bridge/marketplace` | Internal/unlisted quarantined surface with separate ecosystem bridge API client. | P2 | Keep quarantined; audit harvest/delete separately. | C.14.10 or C.14.13 |
| M&A valuation | `src/modules/ma/pages/ValuationPage.jsx` | 62,083 bytes | Valuation UX and DSS live engine surface are large. | P2 | Avoid formula changes; extract UI only if needed. | C.14.12 |
| Compliance report | `src/modules/compliance/pages/ComplianceReportPage.jsx` | 59,378 bytes | Report assembly, fallback items, export, and score precedence are complex. | P2 | Keep after Compliance scoring precedence and report truthfulness tests. | C.14.12 |
| M&A report HTML | `src/modules/ma/utils/buildMAReportHtml.js` | 56,003 bytes | HTML renderer is large and product-specific. | P2 | Do not generalize into PDF renderer without dedicated renderer phase. | C.15 / renderer phase |
| Compliance supplier detail | `src/modules/compliance/pages/SupplierDetailPage.jsx` | 54,994 bytes | Supplier view, demo evidence, alerts, and score display are dense. | P2 | Extract UI fragments only after route/API consistency audit. | C.14.12 |
| Frontend wrapper clusters | `ReportingEnterprisePages`, `StrategyEnterprisePages`, `RiskEnterprisePages`, `BridgeEnterprisePages` | Many route files re-export from aggregate page files | Helps avoid duplication but hides per-route ownership. | P3 | Keep until a module-specific split is authorized. | C.14.12 |

## Backend Monolith Candidates

| Area | File | Size / signal | Risk | Severity | Recommended action | Future phase |
|---|---|---:|---|---|---|---|
| PMI service | `backend/services/pmi/pmi.service.js` | 64,779 bytes | Large service owns cases, enterprise synergies, metrics, reports, and bridge signals. | P2 | Split only by tested boundaries; no formula changes. | C.14.12 |
| Bridge service | `backend/services/bridge/bridge.service.js` | 61,577 bytes | Enterprise signals plus marketplace/opportunity concepts share one service area. | P2 | Separate enterprise Bridge vs quarantined marketplace only after route/API audit. | C.14.13 |
| Governance service | `backend/services/governance/governance.service.js` | 43,625 bytes | Decisions, packs, committees, policies, actions, meetings, audit trail in one service. | P2 | Extract by entity after Golden/helper gaps are planned. | C.14.12 |
| Auth service | `backend/services/auth/auth.service.js` | 31,304 bytes | Security-sensitive login/logout/password/session/OIDC surface. | P2 | Do not refactor in cleanup batches unless explicit security phase. | Do not touch by default |
| Risk service | `backend/services/risk/risk.service.js` | 25,379 bytes | Operational risk scoring, dashboard, reports, bridge signals. | P2 | Preserve dual-layer Golden vs operational model. | C.14.12 |
| M&A data room | `backend/services/ma/dataRoom.service.js` | 25,167 bytes | Secure-share-adjacent document governance. | P2 | Do not touch without secure-share regression plan. | Do not touch by default |
| Heritage service | `backend/services/heritage/heritage.service.js` | 24,724 bytes | Preview/future module not fully C.13 audited. | P2 | Freeze or audit before cleanup. | C.14.10/C.14.13 |

## Duplication Candidates

| Pattern | Locations | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| Number parsing / safe numeric fallback | `src/shared/utils/parseNumber.js`, `src/shared/utils/formatMetric.js`, many `getSafeNumber`/`toNumber` helpers in module pages/services, backend services | Silent `0` fallback can conflict with C.13 null/insufficient-data truthfulness. | P2 | Inventory before consolidating; preserve null semantics. | C.14.11 |
| Text normalization | Backend validators, `ma` services, `strategy.service.js`, `buildMAReportHtml.js`, frontend report/export helpers | Similar helper names with domain-specific behavior. | P3 | Consolidate only where behavior is identical. | C.14.11 |
| Truthfulness copy | `Board Review Draft`, `human review`, `insufficient_data`, `N/A` across CEO, Reporting, Risk, PMI, Compliance | Copy drift can create false claims or inconsistent executive language. | P2 | Create copy registry later; no runtime change now. | C.15 |
| Demo/fallback controls | `src/shared/config/demoData.js`, `demoMode.js`, PMI store, Compliance pages, Funding dashboard, M&A local fallback flag | Demo/fallback is legitimate but must remain labelled and gated. | P2 | Keep C.13/C.14 truthfulness tests; audit before cleanup. | C.14.10/C.14.13 |
| Bridge API clients | `src/modules/bridge/services/bridgeApi.js` and `src/modules/ecosystem/services/bridgeApi.js` | Enterprise Bridge and marketplace/network concepts share `/bridge/*` naming. | P2 | Keep separate until marketplace harvest/quarantine decision. | C.14.13 |
| Route metadata | `workspaceConfig.jsx`, `routeConfig.jsx`, `shellMeta.js`, `Sidebar.jsx`, `routes.jsx` | Labels/routes can drift; prior docs already flagged config duplication. | P2 | Consolidate only after route parity tests are expanded. | C.14.11/C.14.13 |
| Placeholder components | Several `src/modules/compliance/components/*` one-line placeholder cards | Probable legacy/unused or pre-enterprise fragments. | P3 | Import audit before delete. | C.14.10 |

## Legacy / Dead Code Candidates

| Candidate | Evidence | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| `src/modules/pmi/pages/PMIEnterprisePages.jsx` duplicate `PMIDashboardPage` export | Search shows a second `PMIDashboardPage` export; route uses `src/modules/pmi/pages/PMIDashboardPage.jsx`. | Duplicate page identity can confuse future edits. | P2 | Import/route/test audit before deprecating or renaming. | C.14.10 |
| Compliance placeholder components | `AlertCard`, `EvidenceTimeline`, `GeopoliticalContextCard`, `ReviewQueue`, `ROIWidget`, `SourceCitationList`, `SupplierRiskCard` contain placeholder copy. | Low runtime risk if unused; confusing if imported later. | P3 | Confirm imports, then delete or archive in batch A. | C.14.10 |
| Root `tests/ceos-*.spec.js` | Existing root-level specs outside `tests/e2e` folder conventions. | Gate ambiguity and duplicated smoke behavior. | P3 | Decide keep/archive/migrate after CI gate review. | C.14.14 |
| `src/index.css` | 0 bytes | Harmless but noisy. | P3 | Delete only if import audit confirms safe and phase allows deletion. | C.14.10 |
| `.pw-artifacts-ma-commit8`, `playwright-report`, `test-results`, `dist` | Generated/artifact directories present in working tree structure. | Do not edit; cleanup depends on repo policy. | P3 | Review ignore/artifact policy separately. | C.14.14 |
| `backend/db` | Legacy-looking backend directory alongside active `backend/storage`. | Possible legacy confusion; do not classify dead without import audit. | P3 | Read-only import audit first. | C.14.10 |

## Source-of-Truth Risks

| Area | Finding | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| Funding | Draft localStorage workspace, FE engine, backend rounds/snapshots/summary all coexist. | Cleanup can accidentally blur draft vs persisted labels. | P2 | Preserve C.13.3G/H/J rules; add broader e2e before structural work. | C.14.13 |
| Compliance | Operational score, persisted `riskScore`, weighted Golden score, reports/export precedence coexist. | Helper consolidation can mix distinct scores. | P2 | Do not consolidate score helpers until scoring boundary is rechecked. | C.14.11/C.14.13 |
| Reporting | `reportingVarianceGolden` is oracle only; product variance deferred per module. | Generic variance helper could be wired accidentally during cleanup. | P2 | Keep product import prohibition. | C.14.11 |
| Governance / Strategy | Readiness is truthfulness-gated but Golden helpers/tests remain P2. | Future cleanup must not imply Golden closure. | P2 | Add helpers/tests in authorized logic phase, not cleanup. | Future C.14/C.16 |
| Heritage | Module exists but remains preview/future audit/freeze pending. | Demo/sales overclaim or cleanup of active preview surfaces. | P2 | Freeze or audit before promoting or deleting. | C.14.10/C.14.13 |
| Bridge | Enterprise Bridge and marketplace/network APIs share route namespace. | Public marketplace or transaction-layer implication can leak into sales narrative. | P2 | Keep marketplace internal/unlisted/quarantined. | C.14.13/C.15 |
| CEO Overview | Aggregates backend executive API plus local module adapters and fallbacks. | Refactor can reintroduce synthetic executive scores. | P2 | Keep CEO truthfulness tests and null semantics before extraction. | C.14.12 |

## Route/API Consistency Findings

| Area | Finding | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| Compliance reports | Frontend store uses `/reports/compliance`; module routes also include `/compliance/reports`. | Explains prior ad-hoc 404 risk and naming confusion. | P2 | Route/API map and smoke before changing endpoints. | C.14.13 |
| Bridge | Enterprise client uses `/bridge/dashboard`, `/bridge/signals`, etc.; ecosystem marketplace client uses `/bridge/opportunities`, `/bridge/counterparties`, `/bridge/introductions`, etc. | Namespace mixes enterprise signals and quarantined marketplace concepts. | P2 | Keep separation documented; no deletion without endpoint/UI import audit. | C.14.13 |
| Governance | `routeConfig` includes `/governance/security-audit`; `routes.jsx` visible list centers `/governance/audit-trail`. | Potential nav/deep-link mismatch. | P3 | Verify route registration and sidebar expectations. | C.14.13 |
| Reporting | Many thin route wrappers re-export from `ReportingEnterprisePages.jsx`. | Easy to miss per-route behavior in refactor. | P3 | Keep wrappers until module split plan exists. | C.14.12 |
| Strategy / Risk / Heritage | Similar enterprise page wrapper pattern. | Maintainability issue, not a current blocker. | P3 | Split only with route tests. | C.14.12 |

## CSS / Visual Debt

| Area | Finding | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| `src/styles/workspaceAccent.css` | 34,463 bytes; many `!important`, overflow, table, hero, card, and workspace selectors. | Cross-module visual regressions if touched casually. | P2 | Freeze except scoped fixes; visual smoke required. | C.14.12/C.15 |
| `src/styles/executivePolish.css` | 28,010 bytes; many `!important`, broad `.main-area` and MA/CEO polish selectors. | Global override risk and hard-to-debug layout changes. | P2 | Do not refactor before screenshots/smoke matrix. | C.14.12/C.15 |
| `src/styles.css` | 26,135 bytes; overflow, z-index, absolute positioning. | Base layout debt; hidden overflow risks. | P2 | Audit with visual regression plan. | C.14.12 |
| `src/modules/ma/styles/maExecutiveTheme.css` | 9,551 bytes; scoped but includes `!important`, absolute positioning, negative z-index. | Module-specific visual risk. | P3 | Keep scoped; review after M&A demo needs. | C.15 |

## Test Debt

| Area | Finding | Risk | Severity | Recommended action | Future phase |
|---|---|---|---|---|---|
| Root e2e specs | `tests/ceos-*.spec.js` remain outside main `tests/e2e` layout. | Gate ambiguity. | P3 | Decide migrate/archive/keep in CI gate phase. | C.14.14 |
| Typo | `tests/e2e/compliance/compilanceFlow.spec.js`. | Naming/polish only. | P3 | Rename only with Playwright config/import audit. | C.14.14 |
| Demo admin dependency | Many e2e specs use `loginAsDemoAdmin`. | Prod smoke depends on credential setup and test org boundaries. | P2 | Keep prod smoke opt-in and credentials outside repo. | C.14.13 |
| Marketplace tests | Unit quarantine guard exists for `BridgeMarketplacePage`. | Good guard; do not remove while route remains. | P2 | Preserve during marketplace cleanup. | C.14.13 |
| Flexible Funding copy | Authenticated-hubs test includes flexible heading matcher. | Correct P2-FIX-01, but still indicates copy brittleness. | P3 | Keep stable test IDs as preferred anchors. | C.14.14 |

## Do Not Touch List

Do not touch these areas in cleanup unless a future prompt explicitly authorizes them:

- `src/**` product code during docs/audit phases.
- `backend/**` runtime code during docs/audit phases.
- `tests/**` except in explicit test phases.
- `docs/testing/golden_inputs.json`.
- `docs/testing/FORMULA_REGISTRY.md`.
- `docs/testing/GOLDEN_DATASETS.md`.
- Auth middleware, auth service, OIDC verifier, session/token behavior.
- Router and route registration unless C.14.13 explicitly authorizes.
- Migrations, schema, DB files, backup files.
- Secure share runtime and M&A data-room security paths unless a secure-share phase authorizes.
- `backend-server.err`.
- Generated artifacts (`dist`, `playwright-report`, `test-results`) unless a cleanup/artifact policy phase authorizes.

## Cleanup Plan

### C.14.10 - Cleanup Batch A: dead/unused/legacy only

Allowed only after import/route/test audit. Candidate classes:

- Confirmed unused placeholder components.
- Empty or artifact-like files only if repo policy allows.
- Duplicate/legacy page exports not routed, only after import checks.
- No auth, router, migration, Formula Registry, Golden Dataset, or SoT changes.

### C.14.11 - Cleanup Batch B: duplicate helpers/shared utilities

Candidate classes:

- Repeated `normalizeText`, `safeNumber`, `parseNumber`, `formatPercent`, `N/A` mappers.
- Must preserve null vs zero semantics.
- Must not consolidate distinct business scores under shared helper names.

### C.14.12 - Cleanup Batch C: monolith extraction low-risk

Candidate classes:

- Pure presentation components from CEO, PMI, Funding, M&A, Compliance.
- No formula, source-of-truth, API, permission, route, or fallback behavior changes.
- Requires focused unit/build and module smoke.

### C.14.13 - Route/API consistency audit/fix if needed

Candidate classes:

- Compliance `/reports/compliance` vs `/compliance/reports` naming.
- Bridge enterprise vs marketplace route boundaries.
- Governance security-audit vs audit-trail navigation.
- Production authenticated smoke refresh.

### C.14.14 - Structure verification

Candidate classes:

- Test layout/gate clarity.
- Root `ceos-*.spec.js` decision.
- Generated artifact policy.
- Naming cleanup.

## AI Readiness Implications

AI must not be implemented before C.14.9 is reviewed and relevant cleanup gates are authorized. The architecture currently contains many duplicated truthfulness, fallback, score, demo, and route-boundary patterns. An AI layer could amplify these inconsistencies if it reads from the wrong source or summarizes demo/fallback material as real enterprise evidence.

Before AI:

1. Preserve registered source-of-truth boundaries.
2. Define tenant-isolated AI data access.
3. Define prompt-injection and evidence-boundary controls.
4. Plan AI audit logging.
5. Start with draft-only, human-reviewed outputs.
6. Do not let AI produce legal, financial, compliance, governance, valuation, board approval, procurement, or certification claims.

## C.14.9 Decision

No P0 or P1 findings were identified. This audit creates a cleanup map only. It does not authorize deletion, refactor, AI implementation, route/API changes, auth/security changes, formula changes, or visual cleanup.

## C.14.10 - Cleanup Batch A Results

**Status:** COMPLETED / SAFE CLEANUP.

Batch A applied only deletions with direct import/name evidence and stayed below the five-file cap. No auth, router, storage, Formula Registry, Golden Dataset, source-of-truth, migration, package/config, secret, CSS global, or runtime business logic changes were made.

`npx eslint . --no-fix` was attempted before implementation. The command did not run because `npx` tried to fetch ESLint from npm and the environment returned `EACCES`; no autofix or code modification was performed by ESLint.

| Candidate | Decision | Evidence | Action | Risk | Follow-up |
|---|---|---|---|---|---|
| `src/modules/compliance/components/GeopoliticalContextCard.jsx` | SAFE_DELETE | Placeholder component; search found no imports/routes/tests outside the file itself. | Deleted. | Low; unreferenced UI placeholder only. | Recreate intentionally if a future Compliance UI phase needs it. |
| `src/modules/compliance/components/ROIWidget.jsx` | SAFE_DELETE | Placeholder component; search found no imports/routes/tests outside the file itself. | Deleted. | Low; unreferenced UI placeholder only. | Recreate intentionally if a future Compliance UI phase needs it. |
| `src/modules/compliance/components/EvidenceTimeline.jsx` | SAFE_DELETE | Placeholder component; exact component file was not imported. Remaining matches are engine helpers such as `assembleEvidenceTimeline`, not component imports. | Deleted. | Low; unreferenced UI placeholder only. | Preserve engine evidence timeline helpers as active logic. |
| `src/modules/compliance/components/ReviewQueue.jsx` | SAFE_DELETE | Placeholder component; exact component file was not imported. Remaining matches are engine helpers such as `calculateReviewQueueStats`, not component imports. | Deleted. | Low; unreferenced UI placeholder only. | Preserve engine review queue helpers as active logic. |
| `src/modules/compliance/components/SourceCitationList.jsx` | SAFE_DELETE | Placeholder component; exact component file was not imported. Remaining matches are engine helpers such as `buildSourceCitationList`, not component imports. | Deleted. | Low; unreferenced UI placeholder only. | Preserve engine source citation helpers as active logic. |
| `src/modules/compliance/components/AlertCard.jsx` | DEFER | File appears unreferenced, but active local `AlertCard` components exist in Compliance pages. | No deletion. | Low to medium naming ambiguity. | Reassess in a later UI/component cleanup batch. |
| `src/modules/compliance/components/SupplierRiskCard.jsx` | DEFER | File appears unreferenced, but active local `SupplierRiskCard` components exist in Compliance pages. | No deletion. | Low to medium naming ambiguity. | Reassess in a later UI/component cleanup batch. |
| `src/index.css` | DEFER | Empty/unreferenced candidate, but harmless and outside the five-file deletion cap. | No deletion. | Low. | Reassess with artifact/empty-file policy. |
| `tests/ceos-*.spec.js` root tests | DEFER | Root tests may still provide coverage value even if layout is nonstandard. | No deletion. | Medium if removed without gate review. | Decide in C.14.14 structure verification or a test-layout phase. |
| `tests/e2e/compliance/compilanceFlow.spec.js` | DEFER | Typo is documented, but rename would change test path and may affect e2e invocation patterns. | No rename. | Low to medium. | Rename only in a test-layout phase with targeted e2e validation. |
| `.local/backups`, `.tools`, `node_modules`, `dist`, generated artifacts | DO_NOT_TOUCH | Matches are generated, dependency, protected, or artifact paths. | No deletion. | High if touched casually. | Handle only with explicit artifact/dependency cleanup policy. |

### C.14.10 Decision

Batch A removed five unreferenced Compliance placeholder components. It intentionally did not rename tests, touch active wrappers, remove generated artifacts, clean CSS globals, or alter any source-of-truth/runtime logic. The next cleanup step remains C.14.11 for duplicate helpers/shared utilities, or C.15.0 if demo/sales readiness takes priority.
