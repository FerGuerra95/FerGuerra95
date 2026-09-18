# CEO's OS / The Sovereign OS — Agent Operating Contract

## Product identity

CEO's OS is a private enterprise Decision Support System for corporate intelligence, decision preparation and execution tracking across Executive Overview, M&A, Compliance, Funding, Governance, PMI, Bridge, Risk, Reporting, Strategy and Heritage.

All decision-influencing output is indicative and requires human review. The product does not make autonomous decisions or provide legal, financial or investment advice, a fairness opinion, a certified compliance audit, or guaranteed business outcomes. `/bridge/marketplace` is an internal/unlisted demo surface, not a public marketplace.

## Technical baseline

- Frontend: React + Vite under `src/`.
- Backend: Node.js + Express under `backend/`.
- Database: SQLite / better-sqlite3; tenant scope comes from the authenticated backend context.
- Tests: Vitest and Playwright; approved Golden Datasets are business oracles where defined.
- Canonical local QA runtime: `http://127.0.0.1:4000`.
- Forensic baseline: `43e470f630b8b2b79cc5241aeac6279492108081` plus the dirty/untracked manifest recorded in the Master Control. Verify the live HEAD and worktree every session; do not assume they still match.
- Governance checkpoint: Phase 0 and Phase 0.5 are CLOSED by human acceptance. Active phase: 1 — Isolated Validation Foundation. A01 is OPEN; A02–A30 are OPEN; A31 remains IN PROGRESS because 33 documents still require human review. This checkpoint does not authorize product implementation.

## Permanent operating contract

### A. Mandatory resume protocol

Before modifying files:

1. Read `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`, including `CURRENT_HANDOFF_STATE`.
2. Read `docs/product/CODEBASE_HARDENING_STATUS.md`.
3. Read `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`.
4. Read `docs/roadmap.md`.
5. Read `docs/testing/TEST_STRATEGY.md`.
6. Read `.cursorrules`, applicable `.cursor/rules/*.mdc`, and task-specific authorities.
7. Run `git rev-parse HEAD` and `git status --short`.
8. State a PRE-FLIGHT CHECKLIST with:
   - CURRENT PHASE
   - LAST COMPLETED WORK PACKAGE
   - OPEN P0
   - RELEVANT OPEN P1
   - CANONICAL SOURCE OF TRUTH FOR THIS TASK
   - FROZEN AREAS
   - CURRENT DIRTY/UNTRACKED DEPENDENCIES
   - AUTHORIZED FILES
   - FORBIDDEN FILES
   - EXIT GATE
9. Search for existing and legacy implementations before creating anything.
10. If the verified HEAD or worktree differs materially from the Master handoff, stop and report the mismatch before implementing.

### B. Canonical documentation hierarchy

**Level 1 — active control**

1. `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md` — current execution state, A01–A44, phase, frozen areas and handoff.

**Level 2 — canonical domain authorities**

2. `docs/product/CODEBASE_HARDENING_STATUS.md` — current technical state.
3. `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md` — concept ownership.
4. `docs/architecture.md` — current and target architecture.
5. `docs/product/PLATFORM_PRODUCT_MATRIX.md` — workspace maturity.
6. `docs/roadmap.md` — dependency-ordered execution.
7. `docs/testing/TEST_STRATEGY.md` — validation and acceptance.

`docs/product/CODEBASE_ROBUSTNESS_AUDIT.md` is the canonical A01–A44 evidence and closure-criteria register, synchronized with the Master.

**Level 3 — specialized authorities**

Security, data model, deployment, M&A visual contract, AI, privacy, legal, reporting, claims and pilot documents own only their named domains and cannot override Levels 1–2.

**Level 4 — historical records**

Dated audits, closure reports, old readiness/PASS documents, phase status files and past roadmaps preserve provenance only. They never supersede current verified source/runtime evidence or Levels 1–2.

### C. Search before create

Before creating a document, component, hook, engine, helper, selector, service, endpoint, CSS system, token, formatter, status mapper or calculation, search the repository for the same or similar responsibility, the canonical owner, current Source of Truth and legacy implementations.

If equivalent ownership exists, update, extend or consolidate it. A new owner requires a documented architectural reason.

A new Markdown, status or architecture document is allowed only when no canonical document owns the responsibility, its purpose is materially distinct, it is added to the documentation index, and it does not silently supersede another document. If it supersedes one, mark the old file historical and link to the replacement.

### D. No parallel Source of Truth

Every business value and responsibility has one official owner. Frontend display state, local storage, demo fixtures, Golden Datasets and persisted records are not interchangeable. Do not introduce or build on a parallel owner without an explicit documented decision.

### E. Atomic scoped changes

Inspect before editing. Keep changes small, traceable and within the explicit task. Do not refactor, rename, reorganize or perform broad cleanup as part of a focused fix. Apply the three-attempt circuit breaker and stop before a fourth unsuccessful attempt.

### F. Allowed and forbidden files

Declare an exact file whitelist and forbidden areas before modification. Do not touch files outside the whitelist. Cross-module, auth, router, migration, shell, database, environment, dependency or Golden Dataset changes require explicit authorization.

Never manually edit `dist/**`. Never weaken tests or alter expected Golden outputs to make a failure pass. Golden changes require a separate authorized task with manual calculation evidence.

### G. Frozen-area protection

Preserve approved visual and functional work unless the active task explicitly targets it or a proven P0/P1 requires reopening it. Executive Overview, M&A, Compliance, Funding, Governance, PMI and Bridge remain frozen by default outside authorized scope. Preserve the M&A visual contract and the global shell/navigation decisions recorded in the Master.

### H. Git and worktree safety

- Inspect HEAD and `git status --short` before and after work.
- Never use `git add .`.
- Stage only explicitly authorized files when staging is authorized.
- Never commit `backend-server.err`.
- Do not reset, clean, delete, overwrite or absorb pre-existing dirty/untracked work.
- Do not commit or push unless explicitly authorized.
- Treat HEAD alone as insufficient when the Master records dirty/untracked dependencies.

### I. Test, build and runtime QA

Validation must be proportional to the change and use the documented test hierarchy. Source changes require relevant unit/business-oracle checks, integration checks where applicable, build provenance and runtime QA. Runtime QA uses port 4000. Mutating tests must use isolated DB/VDR roots and must never target canonical data. Passing build/render/smoke checks alone does not prove business logic.

### J. Documentation update check

After a material verified change, update only the affected canonical state, Source of Truth, roadmap/test gate and Master finding/handoff records. Do not mark Pending systems Confirmed or historical PASS output current. Documentation work does not close a finding without its agreed evidence.

### K. End-of-session handoff

At the end of every material work package, update the single `CURRENT_HANDOFF_STATE` section inside `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`. Do not create a new handoff, latest, final, v2, current or status document.

The in-place handoff must record:

- DATE/TIME
- CURRENT HEAD
- ACTIVE PHASE
- WORK PACKAGE COMPLETED
- FINDINGS ADDRESSED
- FILES MODIFIED
- FILES CREATED
- FILES DELETED
- TESTS RUN
- BUILD
- RUNTIME 4000
- DATABASE USED: CANONICAL / ISOLATED / NONE
- VISUAL QA
- COMMIT
- FINDINGS VERIFIED CLOSED
- FINDINGS STILL OPEN
- NEW FINDINGS
- FROZEN AREAS
- EXACT NEXT ACTION
- AUTHORIZED NEXT SCOPE
- KNOWN RISKS / UNVERIFIED

Update this section in place. Never create `HANDOFF_2.md`, `LATEST_STATUS.md`, `NEW_MASTER.md`, `ROADMAP_V2.md`, `FINAL_STATUS_NEW.md` or an equivalent parallel authority.

### L. Evidence over history

Verified current source, schema, isolated test and runtime evidence wins when it conflicts with historical documentation. Report the conflict and update documentation only within authorized scope. Preserve the superseded record as dated history unless it meets the documented safe-delete criteria.

## Protected reference files

These remain read-only unless a separate task explicitly authorizes them:

- `.cursorrules`
- `.cursor/rules/ceos-os-enterprise-guardrails.mdc`
- `.cursor/rules/ceos-os-golden-datasets.mdc`
- `docs/testing/golden_inputs.json`
- `docs/testing/GOLDEN_DATASETS.md`
- `docs/testing/LOGIC_INTEGRITY_PROTOCOL.md`

## Non-negotiable product safeguards

1. Server-side authentication, authorization and tenant scope are the security boundary; frontend visibility is never authorization.
2. Do not hide API or persistence failures with silent fallback, optimistic success or demo data in executive metrics.
3. Trace material calculations from input through calculation, persistence/output, UI and test oracle.
4. Preserve audit actor, organization, action, time and sanitized metadata for enterprise state changes.
5. Do not use a legacy function as Source of Truth without verifying all callers, routes, tests and dynamic references.
6. Report files changed, validation run, residual risk, Git state and untouched protected areas at completion.
