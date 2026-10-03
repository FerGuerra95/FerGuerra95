# CEO's OS — Audited Execution Roadmap

**Baseline:** 17 September 2026 · forensic HEAD `43e470f630b8b2b79cc5241aeac6279492108081`. This is the dependency order from Astra. It authorizes no implementation, infrastructure change, AI activation or release.

**Governance checkpoint:** Phase 0.7 — AI Delivery Safety Harness is CLOSED by human approval and FROZEN. **Active technical phase:** Phase 2 — Security / access is ACTIVE. Phase 1 is VERIFIED CLOSED. Phase 0, Phase 0.5, Phase 0.6 and Phase 0.7 are CLOSED by human acceptance; 0.5, 0.6 and 0.7 do not add a fifteenth roadmap phase. A01, A02 and A03 are VERIFIED CLOSED. A04 is the next OPEN product finding. A04–A25 and A28–A30 remain OPEN. A26 and A27 are VERIFIED CLOSED. A31 remains IN PROGRESS under the explicit 33-document review exception. The Phase 2 exit gate is not passed.

Each phase needs an explicit file whitelist and its own evidence. Exit gates describe future requirements. Preserve the M&A black canvas, workspace accent, page/hero geometry and approved surfaces throughout functional remediation.

GOV-ASSURANCE-01 adds transversal gates and phase assurance gates inside these fourteen phases. It does not add Phase 14. The canonical policy is section 21 of the [master control](product/CEO_OS_MASTER_CONTROL_BASELINE.md). Evidence obligations are in the [test strategy](testing/TEST_STRATEGY.md). From Phase 2 onward, every phase closure includes lightweight Architecture Health and Security Regression, plus a mini-UAT when the phase exposes a meaningful usable workflow. The deep architecture audit sits between Phase 5 and Phase 6 and is not itself a phase. None of these gates is passed by recording them. Phase 2 remains ACTIVE and its exit gate is not passed.

## Phase 0 — Documentation / baseline

**OBJECTIVE:** Reconcile canonical docs, claims and accepted source manifest; complete the Phase 0.5 authority hierarchy, continuity protocol and legacy classification.

**DEPENDENCIES:** Forensic audit + human review of current baseline.

**P0/P1 COVERAGE:** A30 manifest/reproducibility definition; A31 documentation reconciliation.

**EXIT GATE:** PASSED by human acceptance for Phase 0/0.5. A31 is explicitly carried forward IN PROGRESS because 33 documentation files still require human review; phase closure is not finding closure.

**DO NOT DO YET:** Do not stage broadly, fix product, delete experiments or declare release readiness.

## Phase 1 — Isolated Validation Foundation

**OBJECTIVE:** Correct discovery/placeholders; isolate DB/VDR, fixtures and run provenance.

**DEPENDENCIES:** Phase 0 review + explicit implementation whitelist.

**P0/P1 COVERAGE:** A26, A27; foundations for A29/A30.

**EXIT GATE:** PASSED. Phase 1 is VERIFIED CLOSED. JSX discovery, real integration assertions, canonical-data rejection and recorded current-source runs are in place.

**DO NOT DO YET:** Do not start A01 from this closure. Do not run mutating tests on canonical DB or weaken oracles.

## Phase 2 — Security/access

**CURRENT STATUS:** ACTIVE. A01, A02 and A03 are VERIFIED CLOSED. A04 is the next OPEN product finding. This phase exit gate is not passed.

**OBJECTIVE:** Close VDR ownership, approvals, env bootstrap, reset route, token path; validate upload/OIDC policy.

**DEPENDENCIES:** Phase 1 isolated harness and reproducible negative fixtures.

**P0/P1 COVERAGE:** A01, A02, A03, A05, A07; supporting A33/A42.

**EXIT GATE:** Tenant/file/role negative tests pass, generic approval bypass blocked, deterministic startup/reset and redaction evidenced; provider-specific findings dispositioned.

**ASSURANCE GATE:** Client Security Gate. Phase 2 establishes the security baseline. Phases 3–13 continue Security Regression. Criteria are in Master Control section 21.

**DO NOT DO YET:** Do not open external-data pilots, enable AI or infer platform security from one test.

## Phase 3 — Persistence/audit/data integrity

**OBJECTIVE:** Durable audit, correct actors, explicit hydration writes, schema parity and relationships/archive contract.

**DEPENDENCIES:** Phase 2 access boundaries and Phase 1 storage harness.

**P0/P1 COVERAGE:** A04, A06, A08, A28; supporting A35/A32.

**EXIT GATE:** Fresh/upgraded schema and ownership checks proven; failed audit policy tested; reads do not seed records; archive/delete graph documented.

**ASSURANCE GATE:** Data Integrity / Migration / Recovery Gate, including an actual restore. A backup that has never been restored is not recoverability evidence. Also complete the Phase 2 onward Architecture Health and Security Regression checks.

**DO NOT DO YET:** Do not edit applied migrations, mutate canonical DB, bulk delete archived fixtures or redesign UI.

## Phase 4 — M&A functional continuity

**OBJECTIVE:** Stable IDs, acknowledged saves, lifecycle precedence, risk enum, portfolio provenance and report/VDR/share linkage.

**DEPENDENCIES:** Phases 2–3 security/persistence; isolated flows from Phase 1.

**P0/P1 COVERAGE:** A09–A15, A18, A19.

**EXIT GATE:** Save→reload→pipeline→detail→report/share→archive keeps identity/version/provenance; errors remain visible; documentary readiness uses evidence.

**ASSURANCE GATE:** Workflow Integrity Gate, including negative paths, role transitions, persistence continuity, a realistic mini-UAT, and no silent fall-through across UI, API, service, and persistence. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not redesign frozen M&A surfaces or persist demo rows as operational facts.

## Phase 5 — Calculation/oracle closure

**OBJECTIVE:** Approve composed valuation/null/range/currency and Funding/PMI/Heritage expected outputs.

**DEPENDENCIES:** Phase 4 identity/snapshots; Phase 3 persisted contracts; Phase 1 test harness.

**P0/P1 COVERAGE:** A16, A17, A20–A23, A29; buyer semantics A39.

**EXIT GATE:** Manual approved oracles and production-path tests cover invalid DCF, ranges, currencies, null dilution, source pairs and empty data.

**ASSURANCE GATE:** Business Correctness Gate. Implementation stays separate from the business oracle and Golden truth. Tests generated only from the implementation are insufficient. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not change expected values to fit defects or conflate simple Golden benchmarks with product formulas.

## Gate between Phase 5 and Phase 6 — 360° Architecture & Codebase Integrity Audit

This is not a phase and does not change the fourteen-phase count. It is mandatory before Phase 6. The twenty assessment areas, the refactor-only-on-evidence rule, and the Astra classification used later at Release Candidate are defined in Master Control section 21.

## Phase 6 — Executive/reporting convergence

**OBJECTIVE:** Converge source/freshness/aggregation, review flags and immutable report inputs.

**DEPENDENCIES:** Phases 3–5 module contracts and approved calculations.

**P0/P1 COVERAGE:** A24, A25; A19 cross-module completion; A38/A40.

**EXIT GATE:** Executive/Reporting preserve module values, missing/error state, review requirement and snapshots through reload/export.

**ASSURANCE GATE:** Reporting consumes canonical data, canonical business rules, and canonical calculations. It must not become another business-calculation Source of Truth. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not invent fallback scores, recalculate module truth in renderers or imply board approval.

## Phase 7 — Operational reliability

**OBJECTIVE:** Verify deployment/env, DB+VDR restore, monitoring, rate limits, retention/access operations.

**DEPENDENCIES:** Phases 2–6 stable security/data/report behavior.

**P0/P1 COVERAGE:** Operational closure evidence for prior P0/P1; A30 provenance; A32/A34/A43.

**EXIT GATE:** Known-source build served on canonical QA runtime; coordinated restore drill and operational controls evidenced.

**ASSURANCE GATE:** Operability / Recovery Gate, covering structured errors, sensitive-data logging, failed-job recovery, retry safety, idempotency where relevant, degraded operation, rollback, restore, incident diagnosis, and recovery procedure. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not assume Docker/Postgres scaffold is current production or deploy without scoped authorization.

## Phase 8 — Remaining workspaces

**OBJECTIVE:** Close advertised Funding, Governance, Compliance, PMI, Bridge, Risk, Reporting, Strategy and Heritage workflows.

**DEPENDENCIES:** Phases 1–7 shared contracts and operational foundation.

**P0/P1 COVERAGE:** Remaining scoped P1 validation; A35/A36/A38/A39.

**EXIT GATE:** Advertised actions, roles, evidence links, schedules/notifications or explicit non-execution labels match tested reality.

**ASSURANCE GATE:** Cross-module Integrity Gate, covering duplicated domain logic, competing Source of Truth, shared-module misuse, unauthorized cross-workspace dependency, contract divergence, and configuration or security drift. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not promote internal marketplace or add features to hide unfinished workflows.

## Phase 9 — Frontend/visual convergence

**OBJECTIVE:** Consolidate loading/error/form primitives and material ownership; quarantine verified dead scaffolds.

**DEPENDENCIES:** Phase 8 functional stability and prior P0/P1 closure gates.

**P0/P1 COVERAGE:** Regression protection for closed P1 paths; A37/A44.

**EXIT GATE:** Computed-style and visual equivalence at approved sizes; one material/border/radius owner; reviewed quarantine before deletion.

**ASSURANCE GATE:** Preserve visual convergence. Add accessibility, visual consistency, interaction consistency, a mini-UAT, and responsive behavior where required. Visual refactoring must not alter business authority. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not broad-redesign frozen surfaces, add patch layers by default or delete by intuition.

## Phase 10 — AI governance

**OBJECTIVE:** Evaluate provider boundary, data minimization, DPA/subprocessors, injection tests and human review.

**DEPENDENCIES:** Prior security/data/report/ops gates; Phase 9 stable product contracts; explicit AI scope.

**P0/P1 COVERAGE:** Prevent reopening security/SoT P1; A41.

**EXIT GATE:** Provider/legal/security/evaluation evidence before any activation; source values/workflow remain human governed.

**ASSURANCE GATE:** AI Authority / Tool / Data Security Gate. AI must not become canonical authority for permissions, tenant ownership, official stored facts, financial calculations, Source of Truth, human approvals, or irreversible or destructive action authorization. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not enable external providers or autonomous decisions through this roadmap.

## Phase 11 — Internationalization

**OBJECTIVE:** Validate currency, locale/date/time, language and jurisdiction semantics.

**DEPENDENCIES:** Phase 5 currency contract and Phases 6–10 stable output/governance boundaries.

**P0/P1 COVERAGE:** A20 cross-locale validation; other P1 regression coverage.

**EXIT GATE:** Approved multi-currency/locale cases preserve meaning and provenance across UI/reports.

**ASSURANCE GATE:** Locale, financial, date, and number formats stay correct. Locale and translation must not create a divergent business rule or change domain meaning. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not treat symbol switching or translation as multinational readiness.

## Phase 12 — Scale/performance

**OBJECTIVE:** Measure workload, JS/CSS delivery, SQLite concurrency, VDR and distributed limits.

**DEPENDENCIES:** Phases 7–11 operational and semantic stability.

**P0/P1 COVERAGE:** Performance-related P1 regressions if established; A34/A37/A43 follow-through.

**EXIT GATE:** Measured budgets/load and failure/recovery evidence meet approved workload requirements.

**ASSURANCE GATE:** Performance + Dependency Health Gate, including representative load, budgets, critical-path latency, query and resource behavior, vulnerability review, unnecessary dependencies, lockfile integrity, and supply-chain review. Earlier phases may already carry basic performance budgets. Also complete Architecture Health and Security Regression.

**DO NOT DO YET:** Do not replace SQLite or rewrite architecture without measured justification.

## Phase 13 — UAT / Release Candidate

**OBJECTIVE:** Validate advertised workflows, roles, tenants, restore, exports, archive and share lifecycle on exact release candidate.

**DEPENDENCIES:** All prior applicable exit gates, reviewed source/build/schema and human sign-off.

**P0/P1 COVERAGE:** No release-blocking A01 or A02–A31 may remain; explicit disposition of remaining P2/P3.

**EXIT GATE:** Known commit/build/schema; UAT evidence; no release-blocking P0/P1; pilot/release decision explicitly reopened and approved.

**ASSURANCE GATE:** Human Reviewability Gate, Completeness Gate, full Security Regression, Release Provenance Gate, and No Critical Unknown Gate. After Release Candidate, the independent Astra audit has a blind pass and a separate evidence-reconciliation pass. Criteria, classification labels, and the rule that Astra does not automatically rewrite the repository are in Master Control section 21. Release provenance and the final Astra audit are future requirements. Recording this gate does not claim they already exist.

**DO NOT DO YET:** Do not use historical PASS, polished visuals, green tests, or documentation closure as release authorization.

## Tracking rule

The [master control baseline](product/CEO_OS_MASTER_CONTROL_BASELINE.md) owns execution state. [A01–A44](product/CODEBASE_ROBUSTNESS_AUDIT.md) owns defect status and evidence. Update both after a separately scoped work package; no defect becomes VERIFIED CLOSED without its acceptance evidence. Dependencies may be refined only with recorded reasoning; documentation approval does not imply implementation approval.

## Future — CEO’S OS Agent Benchmark

Not required for Phase 1. A later authorized package may evaluate candidate coding models against real repository tasks using correctness, test success, diff quality, security, architecture, maintainability and human/senior-review acceptance. Do not create a separate benchmark document now.

## Historical roadmap — superseded

The following earlier MVP order is retained for context only. It is not the current execution plan.

<details>
<summary>Earlier roadmap; original date not recorded</summary>

# Roadmap

## Fase 1 · MVP M&A
- Corregir y modularizar frontend actual.
- Implementar `useValuationEngine`.
- Construir dashboard, waterfall, CIM, matching y repositorio.
- Añadir exportación HTML/PDF.

## Fase 2 · Backend base
- Levantar API.
- Persistencia de casos y reportes M&A.
- Auth básica.

## Fase 3 · Compliance MVP
- Dashboard de compliance.
- Suppliers, alerts, evidence y reviews.
- Placeholder de reportes.

## Fase 4 · RAG y evidencia
- Retrieval y chunking.
- Citas.
- Traducción.
- Snapshots de evidencia.

## Fase 5 · Escalado
- Jobs automáticos.
- Canal legal / consultoras.
- ROI dashboard.
- Integraciones avanzadas.

</details>
