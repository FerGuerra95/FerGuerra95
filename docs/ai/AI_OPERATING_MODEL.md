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

1. Configure AI rules (blindaje v1 + IA-2 operating model).
2. Read-only audit with PRE-FLIGHT checklist.
3. Classify findings P0 / P1 / P2 / P3.
4. Human decision on scope and priority.
5. Scoped correction with minimal diff.
6. Validation (build, tests, golden, security).
7. Atomic commit with selective staging.
8. HANDOFF_STATE for next phase.

## Documentation Truthfulness

Label all documented states honestly:

| Label | Use when |
|---|---|
| Confirmed | Audited with evidence |
| Assumed / Pending C.13 validation | Likely but not code-verified |
| Known duplicate risk | Two sources may disagree |
| Known demo/fallback contamination risk | Demo may appear as real |
| Source unclear | Cannot determine yet |
| Deprecated | Do not extend |
| Human review required | DSS/heuristic output |

IA-2 configures the operating system. IA-2 does not certify code correctness.

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
| Functional audit | Read-only inventory |
| Logic integrity (C.13) | Read-only findings |
| Scoped bugfix | Minimal code in whitelist |
| Release closure | Validation + handoff |

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

C.13.0 — Global Read-Only Logic Integrity Audit.

Use prompt template in `docs/ai/PROMPT_LIBRARY.md` section "C.13.0 Global Read-Only Audit".

No code changes during C.13.0 unless user explicitly authorizes a follow-up fix phase.
