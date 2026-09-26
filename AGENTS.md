# CEO's OS / The Sovereign OS — Agent Operating Contract

## MANDATORY BOOTSTRAP — STOP BEFORE WORK

Any material task must begin with this sequence. Do not inspect or modify implementation first.

1. Read this `AGENTS.md`.
2. Read ONLY `CURRENT_HANDOFF_STATE` from `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`.
3. Run `git rev-parse HEAD` and `git status --short`.
4. Compare actual Git state with the handoff.
5. Identify the requested task/finding.
6. Read only the relevant Source-of-Truth material.
7. Build the Task Capsule.
8. Only then inspect or modify implementation.

If HEAD or the working tree materially differs from the handoff: **STOP**. Do not normalize the repository. Do not reset, restore, clean, stash or absorb unrelated work.

Optional read-only helper: `node scripts/governance/ai-preflight.mjs`. A chat or tool without repository access cannot run this; it must request `AGENTS.md`, `CURRENT_HANDOFF_STATE` and the relevant task/finding from the human before proposing implementation.

## Product identity

CEO's OS is a private enterprise Decision Support System for executive preparation and execution tracking across Executive Overview, M&A, Compliance, Funding, Governance, PMI, Bridge, Risk, Reporting, Strategy and Heritage.

All decision-influencing output is indicative and requires human review. The product does not make autonomous decisions or provide legal, financial or investment advice, a fairness opinion, a certified compliance audit, or guaranteed business outcomes. `/bridge/marketplace` is an internal, unlisted demo surface.

## Instruction authority and precedence

1. The active user task and explicit authorization define the permitted work.
2. This `AGENTS.md` is the primary repository-wide operating contract.
3. Canonical project documents own state and domain truth; they are not parallel instruction manuals.
4. `.cursorrules` is a compatibility adapter for Cursor.
5. Applicable `.cursor/rules/*.mdc` files implement tool-specific behavior and must not override this contract.
6. The closest nested `AGENTS.md`, if one is added later, may narrow rules for its subtree but must not weaken repository safeguards.

Resolve contradictions in that order. Report material conflicts instead of silently selecting a convenient rule.

Current work is resumed from the repository, not from chat memory. State authority order:

1. actual code / Git
2. this `AGENTS.md`
3. `CURRENT_HANDOFF_STATE`
4. canonical Source-of-Truth documents
5. task evidence (Task Capsule, diffs, tests)
6. Cursor Project / chat memory (supplementary only)

Cursor Project memory is not a Source of Truth. Stale conversational memory never overrides repository evidence.

## Canonical project authorities

- `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`: current execution state, A01–A44, frozen areas and `CURRENT_HANDOFF_STATE`.
- `docs/product/CODEBASE_ROBUSTNESS_AUDIT.md`: finding evidence and closure criteria.
- `docs/product/CODEBASE_HARDENING_STATUS.md`: current technical posture.
- `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`: canonical ownership of concepts and data.
- `docs/architecture.md`: architecture.
- `docs/product/PLATFORM_PRODUCT_MATRIX.md`: workspace maturity.
- `docs/roadmap.md`: dependency-ordered phases.
- `docs/testing/TEST_STRATEGY.md`: validation and acceptance strategy.
- Specialized security, data, deployment, claims, AI, privacy, legal and visual documents own only their named domains.
- Dated audits and old PASS/readiness reports are historical evidence. They do not override verified current source, runtime evidence or the authorities above.

## Minimum sufficient context protocol

Every task begins at Context Level 0 and expands only when evidence establishes a dependency.

### Context Level 0 — operating state

Read:

1. This `AGENTS.md`.
2. Only `CURRENT_HANDOFF_STATE` from the Master Control.
3. Live `git rev-parse HEAD` and `git status --short`.

Establish current HEAD, phase, task/finding, frozen areas, dirty/untracked risk and exact next action. Do not read the complete Master by default.

Compare the live HEAD and working-tree state with `CURRENT_HANDOFF_STATE`. If a material mismatch affects task scope, authorized files, frozen areas, dirty/untracked ownership, current phase or expected baseline, **stop and report it before modifying files**. Do not guess which state is authoritative or normalize the repository; do not reset, restore, clean, stash or absorb unrelated work.

### Context Level 1 — task context

Read only the relevant:

- Axx finding and closure criteria;
- Source of Truth row;
- roadmap phase;
- target files;
- directly relevant tests.

Do not load unrelated workspace documentation.

### Context Level 2 — direct dependencies

Expand only to proven imports, called services, selectors/engines, schemas/tables and tests covering the same contract.

### Context Level 3 — domain context

Use when work crosses several files in one domain, such as M&A lifecycle, VDR security, Funding calculations or Governance workflow. Load only that domain's canonical documentation.

### Context Level 4 — platform context

Reserve for architecture, security, multi-tenancy, global Source of Truth, shared shell, cross-workspace primitives, instruction governance and release readiness.

### Evidence-driven expansion

Before reading another area, state why it is needed. Valid reasons are a direct import, API/service dependency, persisted relationship, shared canonical owner, test contract, security boundary or verified Source of Truth relationship.

“Might be useful,” “for completeness,” visual similarity and matching names are not dependencies. Once the canonical owner is found, do not continue a broad repository scan for a local task.

For ordinary local work, target 3–8 implementation files plus directly relevant tests/config. This is a guideline. If work reaches another workspace, several Source of Truth domains or more than 12 meaningful product files, stop and reassess scope, the missing platform primitive or an atomic split.

A local task starts small. A platform-wide audit may expand intentionally. A repository-wide audit is never the default coding workflow.

Prefer symbol/reference navigation (LSP / code-navigation) before broad text search when resolving definitions or references. Text search remains valid when navigation cannot answer the question.

## Task Capsule

Before material implementation, output this concise preflight in the task conversation; do not create a new document:

```text
TASK:
PHASE:
FINDING(S):
OBJECTIVE:
CANONICAL OWNER:
SOURCE OF TRUTH:
TARGET FILES:
DIRECT DEPENDENCIES:
AUTHORIZED FILES:
FORBIDDEN FILES:
FROZEN AREAS:
TESTS REQUIRED:
EXIT GATE:
CONTEXT LEVEL: 0 / 1 / 2 / 3 / 4
EXISTING OWNER FOUND: YES / NO
```

Do not implement until these fields are clear. If no existing owner exists, justify why a new owner is necessary.

## Proportional spec

- Small, local, deterministic change: the Task Capsule is sufficient.
- Material multi-file or multi-domain change: Task Capsule plus an implementation plan.
- Security, tenant, persistence, financial formulas, Source of Truth, migration or cross-workspace architecture: explicit spec/contract, plan, and human-reviewed authority where this contract already requires it.

Do not write a giant spec for a trivial change. Do not code a complex cross-domain feature from a vague prompt.

## Search before create

Before creating a component, hook, helper, selector, engine, mapper, formatter, API client, service, endpoint, schema concept, CSS recipe, token, document or calculation:

1. Search for the current owner and legacy implementations.
2. Decide `EXISTING OWNER FOUND: YES / NO`.
3. If yes, extend, fix or consolidate that owner.
4. If no, record the architectural reason for a new owner.

Do not create parallel owners for convenience. A new governance, status or architecture document is allowed only when no canonical document owns the responsibility and the task explicitly authorizes it.

## Two-pass execution

Material code work uses two distinct passes.

**Pass A — inspect and plan**

- establish the Task Capsule;
- identify the canonical owner;
- trace direct dependencies and expected behavior;
- define the regression strategy and exact file scope.

**Pass B — implement and verify**

- modify only the authorized scope;
- run proportional validation in dependency order;
- inspect the final diff and answer the quality gate.

Do not mix open-ended discovery with continuous implementation.

When implementation discovers another problem, do not silently absorb it. Classify it as a same-task necessary dependency, an existing known finding, a new defect candidate, or an unrelated issue. Only same-task necessary dependencies may expand current scope. Record the others and handle them separately.

## Code quality contract

1. Business rules live in the canonical domain owner, not pages or display components.
2. Inputs, outputs, null states, errors and provenance must be explicit.
3. Use stable IDs for identity; never infer identity from names, labels or amounts when an ID exists.
4. Treat null, unavailable, zero and empty as distinct states.
5. Keep persisted, draft, demo and fallback provenance visible.
6. Frontend gating never replaces backend authorization.
7. Tenant ownership comes from authenticated server context, never a client-provided organization.
8. Persistence succeeds only after confirmed completion.
9. Do not hide failures through catch-to-empty, optimistic success or silent fallback.
10. Each business calculation has one named, versioned, testable owner.
11. Keep domain calculations and mappings pure where practical.
12. Validate boundaries at APIs, persistence and domain transitions.
13. Add a shared abstraction only after a real repeated responsibility is proven.
14. Fix the canonical owner before generalizing.
15. Do not perform broad refactors during focused defect work.
16. Never weaken tests, tolerances, fixtures or expected outputs to obtain green.
17. Add a regression that fails before the fix when practical.
18. Product behavior, tests and documentation must describe the same contract.
19. Prefer readable, explicit implementation over cleverness.
20. Preserve public contracts unless a change is explicitly authorized.

Golden Dataset expected outputs require a separate authorized task and manual calculation evidence. Passing build, render or smoke checks alone does not establish business correctness.

Material AI-written code must be suitable for long-term ownership, not merely appear to work. Prefer canonical ownership, explicit contracts, stable identity, visible provenance, deterministic calculations, testability and the simplest structure that meets the contract. Avoid speculative abstraction, duplicate responsibility and cleverness where simple code is sufficient.

## Anti-divergence rules

Do not:

- rewrite unrelated code;
- rename files for aesthetics;
- reformat broad files;
- introduce another state layer or Source of Truth;
- add fallback behavior without an explicit requirement and visible provenance;
- invent business semantics;
- treat demo data as operational data;
- change formulas without an approved oracle;
- change tests because implementation disagrees;
- redesign visual surfaces during backend/domain work;
- perform “while I am here” cleanup;
- alter auth, routers, migrations, shell, dependencies, database or Golden files without explicit authorization;
- manually edit `dist/**`;
- use placeholders such as “existing code,” “unchanged” or omitted blocks in an applied edit.

Apply the three-attempt circuit breaker. Stop before a fourth unsuccessful attempt on the same blocking condition.

## Human decision boundary

Resolve uncertainty about implementation by inspecting evidence and direct dependencies. When material ambiguity instead concerns product, business or security authority, stop and request a human decision rather than inventing semantics. This includes legal claims; financial or investment meaning; valuation, fairness-opinion or certification language; permissions; tenant ownership or security boundaries; Source of Truth ownership; destructive migrations; production exposure; release or security exceptions; formulas without an approved oracle; irreversible destructive actions; and conflicting canonical authorities.

Do not turn routine implementation questions into stop conditions. Escalate only when evidence cannot resolve who has authority to decide the material meaning or risk.

## Scope, frozen areas and Git safety

- Declare authorized and forbidden files in the Task Capsule.
- Do not modify a file outside the whitelist. Request scope expansion when necessary.
- Executive Overview, M&A, Compliance, Funding, Governance, PMI and Bridge are frozen outside explicit scope. Preserve the approved M&A visual contract and shell/navigation decisions.
- Inspect HEAD and status before and after work.
- Never use `git add .` or `git add -A`.
- Never stage `backend-server.err`.
- Never reset, clean, delete, overwrite or absorb pre-existing dirty/untracked work.
- Stage, commit or push only when explicitly authorized.
- Selective staging must name each permitted path.
- HEAD is insufficient provenance when the Master records dirty/untracked dependencies.
- Runtime QA uses the canonical port 4000 only when the task authorizes that environment.
- Mutating tests require isolated DB and VDR roots and must never target canonical data.

## Parallel agents and worktrees

Parallel material agents are allowed only when work can be safely partitioned. Default: one agent, one branch or worktree, own temp DB, own VDR/file root, own ports, own Task Capsule.

Parallelize independent tasks. Do not parallelize competing modifications to the same Source of Truth, lifecycle, formula owner, schema authority, shared security primitive or shared API contract unless that interface has first been explicitly frozen. A worktree does not replace DB, port or file isolation.

## Security and enterprise safeguards

- Enforce authentication, authorization and tenant scope on the server.
- Preserve organization, actor, action, time and sanitized metadata for material state changes.
- Never expose secrets, tokens, passwords, private customer data or production database contents.
- Treat demo, fallback, seed, mock and localStorage recovery as explicit provenance.
- Do not use a legacy function as Source of Truth without checking callers, routes, tests and dynamic references.
- Keep the Bridge marketplace unlisted and AI providers disabled unless an explicit phase opens them.

## Post-implementation quality gate

Before declaring completion, answer:

- DID I CREATE A SECOND OWNER? YES / NO
- DID I ADD A FALLBACK? YES / NO — if yes, why and how is provenance exposed?
- DID I CHANGE BUSINESS SEMANTICS? YES / NO
- DID I CHANGE A PUBLIC CONTRACT? YES / NO
- DID I MODIFY FILES OUTSIDE THE TASK CAPSULE? YES / NO
- DID I WEAKEN TESTS? YES / NO
- DID I PRESERVE FROZEN AREAS? YES / NO
- IS FAILURE VISIBLE? YES / NO
- ARE NULL/EMPTY/ZERO STATES EXPLICIT? YES / NO
- IS IDENTITY STABLE? YES / NO
- IS TENANT/AUTHORITY SERVER-ENFORCED WHERE REQUIRED? YES / NO
- DID I UPDATE THE EXISTING OWNER RATHER THAN ADD A PARALLEL OWNER? YES / NO

If an answer reveals drift, do not declare completion.

Validation must be proportional to the change. Run focused checks first, then broaden only when a failure, dependency or release gate requires it. Report changed files, commands, results, residual risk, Git state and protected areas.

## Independent senior review gate

Material changes follow this sequence:

IMPLEMENTATION → INDEPENDENT SENIOR REVIEW → VALIDATION → COMMIT

The reviewer should preferably operate from fresh context, remain read-only, inspect the actual Git diff, read the Task Capsule and current contract, inspect relevant tests, and attempt to REJECT the implementation. Do not trust the authoring agent's summary.

For material code changes, the implementation chat is not the review chat. Independent Senior Review should preferably start from `/ceos-resume`, then read the Task Capsule, the actual Git diff, the current contract and the relevant tests. Do not preload implementation-agent reasoning.

Allowed verdicts: `ACCEPT`, `ACCEPT WITH FOLLOW-UP`, `REJECT`. `REJECT` blocks commit. Review and remediation are separate passes.

Primary review evidence is the Task Capsule, the current contract / Source of Truth, the actual Git diff, and test results. The implementation summary is supporting information only. Never approve a change solely from its summary.

## Machine-enforceable rules

If an important invariant can be checked deterministically, prefer a script, test or CI guard over prompt memory. Examples: canonical DB/VDR rejection, protected-port rejection, forbidden fallback, test discovery, tenant boundary, formula oracle, detectable duplicate authority, and staged-file scope where practical. Do not attempt to automate subjective architecture judgment.

## End-of-work requirement

Before considering a material package complete: execute the required tests/validation; complete independent review where required; inspect the exact diff; confirm unauthorized changes are absent; stage selectively when commit is authorized; update `CURRENT_HANDOFF_STATE` only after a validated checkpoint. Do not create a second handoff file.

## Prompt design

Implementation prompts should define one closed objective, one phase/work package, finding IDs, canonical owner, allowed files, forbidden areas, exit gate and validation order. Keep audits separate from implementation. Do not ask an implementation agent to “improve everything.”

Do not run unconstrained autonomous loops such as “keep working until CEO's OS is finished” or equivalent open-ended work across domains. Autonomous execution requires a closed objective, file/scope boundaries, an exit gate, validation and stop conditions. Split long work into atomic packages.

## Current handoff discipline

At the end of a validated material package, update the one `CURRENT_HANDOFF_STATE` section in the Master Control. It is current state, not a history log. Keep only:

- CURRENT HEAD
- ACTIVE PHASE
- LAST COMPLETED PACKAGE
- OPEN BLOCKERS RELEVANT TO NEXT WORK
- FROZEN AREAS
- CURRENT DIRTY/UNTRACKED RISK
- EXACT NEXT ACTION
- NEXT AUTHORIZED SCOPE
- KNOWN UNVERIFIED ITEMS

Historical handoffs belong in Git history or the existing changelog. Do not create `HANDOFF_2.md`, `LATEST_STATUS.md`, `NEW_MASTER.md`, `ROADMAP_V2.md` or another competing authority.

## New chat or tool bootstrap

Follow **MANDATORY BOOTSTRAP — STOP BEFORE WORK**. In Cursor, `/ceos-resume` runs that sequence. Do not preload the full repository documentation unless the task is a genuine platform-wide audit.

A chat or tool without repository access must request from the human, before proposing implementation: `AGENTS.md`, `CURRENT_HANDOFF_STATE`, and the relevant task/finding. For an implementation review it must also request the relevant diff. It must not claim that it can automatically read Git state, the working tree or the Master, and must not assume conversational memory represents current Git state.

After days, weeks or months away, never continue from remembered conversation context. Always: `AGENTS.md` → `CURRENT_HANDOFF_STATE` → HEAD/status → Task Capsule → work.

## Session rotation

Use a fresh AI chat/session when:

- the task/finding materially changes;
- the active phase changes;
- implementation moves to Independent Senior Review;
- a previous session was interrupted or ran out of context;
- conversation summarization/compression occurred and important implementation details may have been compressed;
- scope expands into another Source-of-Truth domain;
- unrelated tasks have accumulated in the same session.

Do not rotate unnecessarily during one small coherent task. Cursor manages model context internally; do not invent a token counter.

If the agent becomes aware that conversation context has been summarized, compressed, interrupted or materially degraded: **STOP** broad implementation. Preserve state through `CURRENT_HANDOFF_STATE`. Recommend session rotation. Do not reconstruct missing details from guesses.

Before rotation (`/ceos-rotate` in Cursor):

1. Verify Git HEAD/status.
2. Update `CURRENT_HANDOFF_STATE` in place if materially needed.
3. Record the exact next action.
4. Record uncommitted/dirty risk.
5. Do not copy full chat history. Do not create a second handoff document.

After rotation, resume from repository authority (`/ceos-resume`), not conversation memory.

## Documentation truthfulness

Update only affected canonical documents after verified change. Do not mark Pending systems Confirmed, historical PASS output current, or a finding closed without its agreed evidence. Current verified source, schema, isolated tests and runtime evidence take precedence over historical prose; report the conflict and preserve history where required.
