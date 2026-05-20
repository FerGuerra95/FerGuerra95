# CEO's OS / The Sovereign OS — Agent Operating Manual

## Product Identity

CEO's OS is an Enterprise Decision Support System (DSS) for corporate intelligence across M&A, Compliance, Funding, Governance, PMI, Bridge, Risk, Reporting, Strategy, Heritage, and Executive Overview.

CEO's OS is:

- A decision-support and execution-tracking workspace
- Human-reviewed by design
- Intended for executive, board, and operating-team preparation
- Private enterprise software, not a public marketplace

CEO's OS is not:

- Autonomous decision-making software
- Legal advice or legal certification
- Financial advice or investment advice
- A fairness opinion engine
- A certified compliance audit system
- A guarantee of synergies, funding outcomes, risk elimination, or deal matching
- A public deal marketplace (`/bridge/marketplace` is internal/unlisted demo only)

All outputs that influence decisions must be treated as indicative DSS material requiring human review.

## Technical Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React + Vite | Module-based under `src/modules/` |
| Backend | Node.js + Express | API under `backend/api/` |
| Database | SQLite / better-sqlite3 | Tenant-scoped tables with `organization_id` |
| Auth | Token/session backend | Permissions enforced server-side |
| Multi-tenant | organizationId from backend/session | Frontend must not decide tenant ownership |
| Deploy | Render + GitHub `main` | Production smoke documented in phase B.1 |
| Tests | Vitest unit/integration, Playwright e2e | Business oracles via Golden Datasets where defined |

Status: Stack description Confirmed at architecture level. Per-endpoint behavior Pending C.13 validation.

## Current Baseline

| Item | Value |
|---|---|
| HEAD | `997d79f` |
| origin/main | `997d79f` (expected after IA-2 doc phase; verify before commit) |
| IA guardrails v1 | `.cursorrules`, enterprise guardrails, golden datasets (6 files) — Confirmed created |
| IA-2 | Cursor Enterprise Operating Model (12 files) — this manual and related docs |
| Next recommended phase | C.13.0 global read-only Logic Integrity audit |

## Core Modules

| Module | Primary function | Source-of-truth note |
|---|---|---|
| Executive Overview | DSS command center, aggregator of module signals | Aggregator only; not master operational store — Pending C.13 validation |
| M&A | Valuation, waterfall, buyer matching, CIM, reports, data room | Pending C.13 source-of-truth audit |
| Compliance | Suppliers, risk, evidence, reviews, reports | Known duplicate risk: client score vs persisted riskScore |
| Funding | Rounds, runway, dilution, scenarios, readiness | Known duplicate risk: localStorage vs backend |
| Governance | Decisions, board packs, committees, audit trail | Backend-strong; full workflow Pending C.13 validation |
| PMI | Synergies, milestones, integration, Day 1/100 | Known demo merge risk: mergeWithDemo |
| Bridge | Cross-module signals, dependencies, conflicts | Marketplace unlisted; signals heuristic — human review required |
| Risk | Register, heatmap, controls, likelihood/impact | Golden Dataset exists for basic score |
| Reporting | KPIs, board packs, library | Pending C.13 validation |
| Strategy | Initiatives, scenarios, priorities | Pending C.13 validation |
| Heritage | Continuity, assets, succession | Pending C.13 validation |

## Mandatory Rules

1. Never use `git add .` — stage only explicitly allowed files.
2. Never commit `backend-server.err`.
3. No code changes outside explicit task scope.
4. No test weakening to pass failing logic.
5. No Golden Dataset expected output changes without separate authorized task with manual calculation.
6. No silent fallback that hides API failures or contaminates executive metrics.
7. No legacy function as source-of-truth without verification search.
8. No duplicate source-of-truth between frontend and backend without documentation.
9. No cross-module changes without explicit authorization.
10. No auth/router/migration/shell changes without explicit authorization.
11. Apply 3-attempt Infinite Loop Circuit Breaker — stop on 4th attempt.
12. Output PRE-FLIGHT CHECKLIST before modifications.
13. Generate HANDOFF_STATE after phase closure or long sessions.
14. Documentation Truthfulness: do not mark Pending systems as Confirmed.
15. Use host-native terminal commands (PowerShell on Windows, Bash/Zsh on macOS/Linux).

## Protected Files (Blindaje v1 — do not modify in IA-2)

- `.cursorrules`
- `.cursor/rules/ceos-os-enterprise-guardrails.mdc`
- `.cursor/rules/ceos-os-golden-datasets.mdc`
- `docs/testing/golden_inputs.json`
- `docs/testing/GOLDEN_DATASETS.md`
- `docs/testing/LOGIC_INTEGRITY_PROTOCOL.md`

Reference only. Changes require separate explicit authorization.

## How To Work

1. Read `.cursorrules`, `.cursor/rules/*.mdc`, and this manual.
2. Read task-specific docs (`AI_OPERATING_MODEL.md`, `PROMPT_LIBRARY.md` if applicable).
3. Output PRE-FLIGHT CHECKLIST.
4. Verify git baseline (`HEAD`, `origin/main`, clean scope).
5. Define files allowed and forbidden.
6. Identify source-of-truth (registry, API, table, golden file).
7. Search duplicates and legacy implementations.
8. Propose minimal plan.
9. Execute only if authorized (IA-2 doc phases are create-only).
10. Validate with phase-appropriate matrix (see RELEASE_CHECKLIST.md).
11. Report final summary and HANDOFF_STATE if phase closes.

## Handoff Protocol

When closing a phase or when context is saturated, generate:

# HANDOFF_STATE

| Field | Required content |
|---|---|
| Current Phase/Subphase | e.g. IA-2 complete, next C.13.0 |
| Last File Audited | Path or "N/A — doc-only phase" |
| Verified Baseline Commit/HEAD | e.g. 997d79f |
| Working Tree Status | e.g. only ?? backend-server.err |
| Summary of Discoveries/Bugs | Max 3 bullets |
| Decisions Made | What was decided and why |
| Exact Next Step | One clear next action |
| Files Allowed To Touch Next | Explicit list |
| Files Forbidden To Touch Next | Explicit list |
| Active Stop Conditions or Blocks | None or describe |
| Pending Commit / Push Status | e.g. IA-2 docs unstaged |
| Recommended Prompt To Run Next | e.g. C.13.0 global read-only |

## Reference Documents (IA-2)

- `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`
- `docs/testing/FORMULA_REGISTRY.md`
- `docs/release/RELEASE_CHECKLIST.md`
- `docs/ai/PROMPT_LIBRARY.md`
- `docs/ai/AI_OPERATING_MODEL.md`
- `docs/security/SECURITY_REVIEW_CHECKLIST.md`

## Audited Branches — Frozen by Default

Unless explicitly targeted: Executive Overview, M&A, Compliance, Funding, Governance, PMI, Bridge.

Functional audits C.1–C.7 are closed. Logic Integrity reaudit is C.13.x. Do not reopen functional UI/routes without P0/P1 cause.
