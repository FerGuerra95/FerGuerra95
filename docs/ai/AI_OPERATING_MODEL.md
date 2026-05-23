# CEO's OS / The Sovereign OS — AI Operating Model

## Purpose

Governance framework for AI-assisted engineering on CEO's OS / The Sovereign OS.

This model configures how AI may work. It does not certify that current product code is correct.

## Product Identity (Non-Negotiable)

CEO's OS is an Enterprise Decision Support System (DSS).

It is human-reviewed, private, and supports executive intelligence across M&A, Compliance, Funding, Governance, PMI, Bridge, Risk, Reporting, Strategy, Heritage, and Executive Overview.

CEO's OS is not:

- legal advice
- financial advice
- investment advice
- fairness opinion
- certified compliance audit
- autonomous decision system
- guarantee of synergies, funding outcomes, or deal matching
- public deal marketplace

## AI Can

- Audit code in read-only mode
- Propose scoped changes with evidence
- Implement patches when explicitly authorized
- Document architecture, risks, and handoffs
- Compare outputs against Golden Datasets
- Generate tests when explicitly authorized
- Identify duplicates, legacy, and demo/fallback contamination
- Identify source-of-truth gaps
- Produce HANDOFF_STATE for phase transitions
- Run validation commands on host-native shell

## AI Cannot

- Certify regulatory compliance
- Provide legal, financial, or investment advice
- Produce fairness opinions
- Make autonomous business decisions
- Weaken tests or widen tolerances to pass code
- Modify Golden Dataset expected values to hide mismatches
- Change auth, permissions, or migrations without explicit authorization
- Expose secrets, tokens, passwords, or production data
- Treat demo/fallback/localStorage as real persisted enterprise truth
- Promote `/bridge/marketplace` as a live public marketplace
- Mark pending source-of-truth as Confirmed without C.13 audit evidence
- Use `git add .`
- Commit `backend-server.err`
- Refactor broadly outside scope

## Human Review Required

Human review is mandatory before treating output as client-ready or pilot-ready for:

- legal/compliance positioning
- financial/investment logic and disclaimers
- multi-tenant ownership and organizationId sourcing
- auth/permissions model changes
- database migrations
- production or customer data handling
- security-sensitive endpoints and exports
- Golden Dataset mismatch resolution
- destructive or cross-module changes
- external-facing reports and board packs

## Operating Sequence

1. Configure AI rules (blindaje v1 + IA-2 operating model + C.14 modes).
2. Declare operating mode: READ-ONLY AUDIT, WRITE/FIX, PROPOSE ONLY, or QUARANTINE BEFORE DELETE.
3. Read-only audit with PRE-FLIGHT checklist (when audit mode).
4. Classify findings P0 / P1 / P2 / P3 — do not stop READ-ONLY for debt alone.
5. Human decision on scope and priority.
6. Scoped correction with minimal diff (WRITE/FIX only).
7. Validation (build, tests, golden, security).
8. Reconciliation pass — update only affected docs/registries.
9. Atomic commit with selective staging.
10. HANDOFF_STATE for next phase.

## AI Operating Modes

Every phase must declare one primary mode.

### 1. READ-ONLY AUDIT

**Use for:** audits, inventories, debt detection, import mapping, modular review, sanitized log analysis, source-of-truth review.

**Rules:**

- May read and map; must not modify files, commit, or push.
- Must not stop for every inconsistency — classify P0–P3 and continue.
- Must deliver whitelist/blacklist for a future WRITE/FIX phase.

**Stop conditions (hard only):** HEAD != origin/main; unexpected dirty working tree; attempted modify/delete; attempted commit/push; real secret exposure.

**Do not stop for:** cross-imports, duplicates, legacy functions, Pending documentation, suspected dead code.

### 2. WRITE/FIX

**Use for:** controlled fixes, tests, labels/copy, concrete bugs, authorized helpers, authorized documentation.

**Rules:** closed whitelist; strict stop conditions; tests/build when code touched; selective `git add`; no `git add .`; small traceable commits; no scope expansion.

### 3. PROPOSE ONLY

**Use for:** refactors, duplicate cleanup, suspected dead code, modular reorganization, potential deletions, architecture changes.

**Rules:** must not modify or delete files; deliver proposed diff or change list; justify risk; list required tests; wait for human authorization before WRITE/FIX.

### 4. QUARANTINE BEFORE DELETE

**Use for:** removing code, routes, legacy pages, unused services, marketplace/demo internals.

**Rules:** never delete directly in first pass; mark candidate; confirm imports/routes/tests/consumers; document deprecation; run build/tests; quarantine one phase; delete only in a later explicit WRITE/FIX phase.

## Stop Conditions — Mode-Aware Policy

### A) Hard stops in WRITE/FIX

- File outside whitelist
- Unauthorized backend, Golden, or expected-output changes
- Cross-module change without authorization
- `git add .`
- Required tests or build fail
- `backend-server.err` staged

### B) Relaxed behavior in READ-ONLY AUDIT

- Report debt, cross-imports, duplicates, legacy, Pending docs — continue audit
- Deliver findings table and recommended next phase

## Logs / SQLite / .cursorignore Policy

Do not permanently index: `*.sqlite`, `*.db`, `*.log`, `backend-server.err`, `.env`, secrets.

Controlled inspection is allowed via human-directed commands:

- Sanitized `sqlite .schema`
- `PRAGMA table_info(...)` on non-secret columns
- Bounded log excerpts without secrets

Never paste secrets into context or commits.

Do not delete backend functions for "no usage" without reviewing routes, services, tests, migrations, and dynamic references.

## Modular Sandbox (C.14 Audits)

Do not audit the entire repo as a first action unless explicitly global.

Recommended order:

1. Specific module
2. Limited shared code
3. Related backend
4. Related tests
5. Related docs
6. Cross-cutting audit only when authorized

Example **C.14.1 Funding modular audit:** `src/modules/funding/**`, `backend/services/funding/**`, `backend/api/*funding*`, `tests/unit/funding/**`, `tests/integration/api/fundingApi.test.js`.

## Refactor / Delete Safety

AI must not delete or move code by intuition.

Before any elimination, deliver: candidate file, reason, imports, routes, tests, commercial/demo risk, deprecation alternative, proposed follow-up phase.

Especially protected: `/bridge/marketplace`, internal demos, fallbacks, secure share, reports/export, routes, auth, storage/migrations, audit logs, data room, closed enterprise modules.

## Documentation Truthfulness — Reconciliation Pass

Label all documented states honestly:

| Label | Use when |
|---|---|
| CONFIRMED | Audited with evidence |
| IMPLEMENTED AND TESTED | Code + test evidence on record |
| PARTIALLY RESOLVED | Scope subset fixed; global issue remains open |
| PENDING VALIDATION | Exists; metadata/traceability incomplete |
| PENDING HUMAN APPROVAL | Awaiting reviewer sign-off |
| PENDING EXTERNAL VALIDATION | Depends on external input |
| DEPRECATED / DO NOT USE | Do not extend |
| UNKNOWN / NOT AUDITED | Not yet reviewed |
| Assumed / Pending C.13 validation | Likely but not code-verified |
| Known duplicate risk | Two sources may disagree |
| Known demo/fallback contamination risk | Demo may appear as real |
| Source unclear | Cannot determine yet |
| Human review required | DSS/heuristic output |

**Reconciliation pass rules:**

- When a phase changes code, tests, or source-of-truth, update **only** affected documents.
- Do not update a dozen docs by routine.
- Do not mark RESOLVED global for partial scope fixes.
- Every phase closure must report: what changed, what was verified, what remains pending, which docs/registries changed, which intentionally did not change.

IA-2 and C.14 configure the operating system; they do not certify code correctness.

## Product Output Truthfulness

Every user-visible or exportable value should be classifiable as:

- real persisted (backend/SQLite)
- calculated (deterministic formula)
- estimated (scenario/planning)
- demo (seed/demo dataset)
- fallback (error or empty-state substitute)
- localStorage draft (client-only, not authoritative)
- seed (bootstrap data)
- external input (user/import)
- pending validation (not yet audited)

Never present demo/fallback as audited enterprise truth.

## Layered Governance

| Layer | Files | Role |
|---|---|---|
| Blindaje v1 | .cursorrules, enterprise guardrails, golden datasets | Calculation integrity, no test weakening |
| IA-2 | AGENTS.md, module boundaries, security, release gates, prompt discipline, registries | Operating model, boundaries, handoff |
| C.13 | Read-only global audit | Code vs registry vs golden |

Do not modify blindaje v1 files during IA-2 or routine audits unless explicitly authorized.

## Phase Types

| Phase type | Allowed actions |
|---|---|
| IA config | Docs and rules only |
| Functional audit | Read-only inventory (READ-ONLY AUDIT mode) |
| Logic integrity (C.13) | Read-only findings (READ-ONLY AUDIT mode) |
| AI guardrails (C.14) | Docs/rules only; anti-paralysis modes |
| Scoped bugfix | Minimal code in whitelist (WRITE/FIX mode) |
| Proposed refactor | PROPOSE ONLY — no file changes |
| Deletion prep | QUARANTINE BEFORE DELETE — mark only |
| Release closure | Validation + handoff + reconciliation pass |

## Circuit Breaker

After three failed correction attempts on the same issue, stop and report:

- what was tried
- evidence of failure
- recommended human decision
- whether Stop Condition applies

## Multiplatform Execution

Validation commands must work on the host OS.

Shell syntax errors alone are not project failures; adapt commands and re-run for the same analytical result.

## Next Recommended Phase

C.13.3K — Document partial closure of C13-P1-03 (Funding draft vs persisted).

Then either:

- **C.14.1** — Modular Architecture Read-Only Audit by sandbox (e.g. Funding), or
- **C.13.4** — M&A valuation / waterfall integrity.

Use prompt templates in `docs/ai/PROMPT_LIBRARY.md`.
