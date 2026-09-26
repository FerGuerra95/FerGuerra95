# CEO's OS / The Sovereign OS

CEO's OS is a private enterprise Decision Support System (DSS) for corporate intelligence, decision preparation and execution tracking. Material outputs require human review. It does not make autonomous decisions or provide certified valuations, compliance audits, legal or investment advice, or guaranteed business outcomes.

## Current baseline and release posture

**Documentation governance baseline: 18 September 2026. Phase 0, Phase 0.5, Phase 0.6 and Phase 0.7 are CLOSED by human acceptance. The Phase 0.7 AI Delivery Safety Harness is FROZEN. The active technical phase remains 1 — Isolated Validation Foundation; its preserved uncommitted work is outside this governance package. Release posture: BLOCKED for multinational production. Sensitive external-data pilot: NOT YET CLEARED; gate reopened.**

The Astra forensic audit identified **A01 (P0)** and **A02–A31 (P1)**. Documentation work does not fix or close them. A31 remains IN PROGRESS because 33 documentation files still require human review, especially commercial claims/offers and infrastructure scaffolds; no P0/P1 was closed.

Forensic HEAD: `43e470f630b8b2b79cc5241aeac6279492108081`. The audit included 58 changed tracked entries and 83 untracked files; HEAD alone does not reproduce that product. The documentation pass began with the same HEAD and 58 tracked changes, plus 84 untracked files after addition of the dated master tracker. See the execution tracker for phase-specific counts.

Canonical local QA runtime: [http://127.0.0.1:4000](http://127.0.0.1:4000). Express serves the generated `dist` frontend. Public landing/login, health and unauthenticated guards were observed during the audit; authenticated business flows and current unit/integration/E2E results remain **UNVERIFIED**.

## Eleven principal workspaces

- Executive Overview: aggregated module signals and executive preparation.
- M&A: indicative valuation, pipeline, repository, reports and data room.
- Compliance: suppliers, evidence, reviews, risk and audit runs.
- Funding: draft scenarios, rounds, runway and dilution.
- Governance: decisions, committees, policies and board preparation.
- PMI & Synergies: integration cases, milestones and synergy tracking.
- Bridge: internal cross-module signals, dependencies and conflicts.
- Risk: register, controls, mitigations and operational risk indicators.
- Reporting: metadata, Board Review Draft snapshots and review workflow.
- Strategy: objectives, initiatives and scenarios.
- Heritage: assets, succession and continuity preparation.

The additional `ecosystem` source module supports internal surfaces; it is not a twelfth principal workspace. `/bridge/marketplace` remains internal/unlisted demo only.

## Architecture entry points

- Frontend: [src/main.jsx](src/main.jsx), [providers](src/app/providers/AppProviders.jsx), [routes](src/app/router/routes.jsx), [AppShell](src/app/layout/AppShell.jsx), workspace modules under `src/modules/`.
- Backend: [server bootstrap](backend/server.js), [HTTP composition](backend/httpApp.js), routes/controllers/validators under `backend/api/`, domain services under `backend/services/`.
- Persistence: [SQLite adapter](backend/storage/sqliteStorage.js), [schema](backend/storage/databaseSchema.js), [migration runner](backend/storage/migrationRunner.js), SQL migrations under `backend/storage/migrations/`.
- Auth/RBAC: [authentication service](backend/services/auth/auth.service.js), [server permission middleware](backend/api/middlewares/auth.middleware.js). Frontend visibility is not an authorization boundary.
- VDR: [data room service](backend/services/ma/dataRoom.service.js) combines database metadata and filesystem objects.

## BEFORE WORKING ON CEO’S OS

If this session has repository access:

1. Read [AGENTS.md](AGENTS.md).
2. Read only `CURRENT_HANDOFF_STATE` in the [Master Control](docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md).
3. Verify live `git rev-parse HEAD` and `git status --short` against that handoff. Optional: `node scripts/governance/ai-preflight.mjs`.
4. Do not preload all documentation.
5. Create the Task Capsule from `AGENTS.md`.
6. Expand context only through demonstrated dependencies.

If this chat or tool has **no repository access**, request from the human before proposing implementation:

1. current `AGENTS.md`
2. `CURRENT_HANDOFF_STATE`
3. the relevant finding/task
4. the relevant diff when reviewing implementation

A standalone chat cannot automatically read Git state, the working tree or the Master. Do not assume conversational memory represents current Git state. After a long pause, never continue from remembered chat context: `AGENTS.md` → handoff → HEAD/status → Task Capsule → work. STOP if HEAD or the worktree materially differs from the handoff; do not normalize the repository.

Specialized authorities such as the [technical-debt register](docs/product/CODEBASE_ROBUSTNESS_AUDIT.md), [Current Technical State](docs/product/CODEBASE_HARDENING_STATUS.md), [Source of Truth Registry](docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md), [Architecture](docs/architecture.md), [Platform Product Matrix](docs/product/PLATFORM_PRODUCT_MATRIX.md), [Roadmap](docs/roadmap.md) and [Test Strategy](docs/testing/TEST_STRATEGY.md) are loaded only when the Task Capsule establishes their relevance.

## SPECIALIZED DOCUMENTATION

- Security: [review checklist](docs/security/SECURITY_REVIEW_CHECKLIST.md), credential hygiene and secure-share guidance under `docs/security/`.
- Data model: [current SQLite model](docs/data-model.md).
- Deployment and operations: [deployment baseline](docs/deployment.md) and runbooks under `docs/operations/`.
- Visual: [M&A UI foundation contract](docs/architecture/MA_UI_FOUNDATION_CONTRACT.md) and academy capture/recording guidance.
- AI: operating, guardrail, boundary and provider documents under `docs/ai/`.
- Privacy and legal: `docs/privacy/` and `docs/legal/`.
- Reporting: active specifications under `docs/reporting/`.
- Commercial and pilot: [claims policy](docs/commercial/WHAT_WE_CAN_AND_CANNOT_SAY.md), [pilot readiness](docs/pilot/PILOT_READINESS_PACK.md) and supporting pilot material.
- Validation references: Formula Registry, Golden Datasets, Logic Integrity Protocol and Release Checklist.

Specialized documents own only their named domain. The Master contains the complete documentation inventory and human-review classifications.

## HISTORICAL RECORDS

Dated audits, closure reports, old MVP/enterprise-ready files, visual PASS reports, past roadmaps and phase status documents preserve decisions and provenance. **Historical PASS/CLOSED/READY documents do not supersede the current Master Control or verified current source/runtime evidence.** The dated master source remains unchanged as history.

**Evidence labels:** VERIFIED FACT describes inspected evidence; INFERENCE describes a conclusion drawn from it; UNVERIFIED requires execution or operational proof. None means external certification.

Governance checkpoint: **Phase 0.7 — AI Delivery Safety Harness: CLOSED and FROZEN**. Active technical phase: **1 — Isolated Validation Foundation**. Preserved Phase-1 work remains uncommitted and outside the Phase-0.7 scope. Do not run mutating suites against canonical data or bulk-stage the existing working tree.
