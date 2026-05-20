# CEO's OS / The Sovereign OS — Logic Integrity Protocol
## Purpose
This protocol defines how CEO's OS audits business logic, calculations, legacy functions, duplicate sources of truth, Golden Datasets and test oracles.
The goal is to reduce AI-generated code risk and make every critical calculation explainable, testable and auditable.
## Core principle
A module is not safe just because:
- it compiles
- tests pass
- pages render
- no NaN is visible
- smoke tests pass
A module becomes safer when:
- inputs are known
- formulas are documented
- outputs are expected
- source-of-truth is clear
- tests validate business results
- demo/fallback data is labelled
- human review boundaries are explicit
## Required audit table
Every logic integrity audit must include:
| Metric / function | File | Inputs | Output | Formula / logic | Source-of-truth | Frontend/backend | Golden Dataset | Test real | Legacy/duplicated | Risk | Tutor explanation |
|---|---|---|---|---|---|---|---|---|---|---|---|
## No Legacy / No Duplicates
Before creating or modifying a function, service, endpoint, component, store or helper, verify:
- Does current functionality already exist?
- Is there a legacy version still imported?
- Is there a duplicate frontend/backend calculation?
- Is localStorage competing with backend?
- Is there a dead page or endpoint?
- Is there a placeholder test?
- Is there a demo/default value contaminating real output?
## Scope Lock
Before touching anything, define:
- files allowed
- files forbidden
- modules in scope
- modules out of scope
If the task requires touching forbidden files, stop and request explicit approval.
## Source-of-Truth Lock
Every business value must have one official source-of-truth.
If two sources disagree, mark P1 or P0 depending on impact.
## Multi-tenant Gate
Every business data read/write/update/delete must be scoped by backend-injected organizationId.
Frontend must never decide organization ownership.
## Migration Safety
Never edit already-applied migrations without explicit approval.
Destructive schema/data changes require explicit approval and backup/restore awareness.
## Secrets Guard
Never expose secrets, tokens, passwords, private keys, production .env values or customer data.
## Demo/Fallback Guard
Demo, fallback, seed, mock or localStorage recovery must be labelled or gated.
Demo/fallback data must not appear as real enterprise data.
## Auditability Rule
Enterprise state-changing actions should preserve auditability:
- actor
- organizationId
- action
- timestamp
- safe metadata
## Anti-Laziness
Do not output incomplete code patches with placeholders.
Forbidden examples:
- // ... existing code ...
- /* rest of function */
- // unchanged
- omitted for brevity
If the change is too large, split it into a smaller patch.
## Structured Verification
Before proposing a report or code change, produce a visible PRE-FLIGHT CHECKLIST:
- task scope
- files allowed
- files forbidden
- source-of-truth
- Golden Dataset requirement
- legacy/duplicate check
- test oracle check
- stop conditions
- why this is safe
Do not expose private chain-of-thought.
## Test Shielding
Do not edit tests, fixtures, snapshots, expected values or Golden Datasets to hide a business logic failure.
Fix the logic or trigger Stop Condition.
## Advanced Stability & Execution Guardrails
### Infinite Loop Circuit Breaker
If you fail to resolve a bug, lint error, compile failure, test failure, Golden Dataset mismatch, or runtime issue after 3 consecutive attempts, you MUST immediately stop.
Do not attempt a 4th modification.
When this circuit breaker triggers, report:
- exact command executed
- exact error log
- the 3 attempted fixes
- the 3 hypotheses tested
- what each attempt changed
- what each attempt proved or disproved
- current repo status
- files modified during the attempts
- safest recommended next action
This prevents blind patching, AI drift, accidental rewrites and cascading regressions.
### Strict Type Lock / Zero-Bypass Policy
Do not introduce weak typing or compiler bypasses.
If touching or creating TypeScript / TSX files, do not introduce:
- any
- unnecessary unknown
- // @ts-ignore
- // @ts-expect-error without written justification
- broad object types when precise domain types are possible
- unsafe casts to silence compiler errors
For JS/JSX files, do not weaken validation, guards, permissions, organizationId checks, expected object shape checks, parsing or fallback labelling.
Never convert a file to TypeScript or introduce new type tooling unless explicitly requested.
If precise typing requires a wider refactor, stop and report instead of bypassing safety.
### Lint & Style Alignment
Generated code must follow existing repository style.
Before modifying code, inspect nearby files and mimic:
- import ordering
- quote style
- semicolon usage
- spacing
- component structure
- helper naming
- error handling style
- test style
- formatting conventions
Do not add a new formatter, linter, dependency, config or style rule unless explicitly requested.
### Regression Shield & Idempotency
Do not refactor, simplify, rename, reorganize or clean up working historical code outside the explicit task scope.
Any change must be:
- minimal
- scoped
- reversible
- explainable
- idempotent where applicable
- isolated to approved files
Do not modify adjacent modules because they seem related.
Do not change public contracts, route names, API response shapes, storage keys, CSS selectors, migration behavior, or test oracles unless explicitly authorized.
If the same prompt is run twice, it must not duplicate rules, files, sections, datasets or checklist blocks.
### Three-Layer Validation Rule
For any non-documentation change, validation must cover three layers where applicable:
1. Static validation:
   - lint
   - type safety where relevant
   - build
2. Logic validation:
   - expected input
   - expected output
   - Golden Dataset if applicable
   - source-of-truth confirmation
3. Product validation:
   - UI does not misrepresent demo/fallback as real
   - permissions are respected
   - organizationId is respected
   - disclaimers remain correct
   - no user-facing regression
### No Silent Fallback Rule
Do not hide failures behind silent fallbacks.
A fallback is allowed only if:
- it is already part of the project pattern or explicitly requested
- it is labelled as demo/fallback/estimated where user-facing
- it does not override real persisted data
- it does not hide API failures that should be visible
- it does not contaminate executive reports, board packs, scores or calculations
If a fallback is used, document why it exists, when it triggers, what data it returns, whether it is safe in production and whether it affects pilot readiness.
### No Test Weakening Rule
Do not weaken tests to make a change pass.
Forbidden unless explicitly requested as a separate test-maintenance task:
- deleting assertions
- reducing expected values
- widening tolerances
- replacing business assertions with smoke checks
- skipping tests
- using .only
- using .skip
- changing Golden Dataset expected outputs
- changing fixtures to match broken logic
- replacing deterministic tests with vague snapshots
If a test is genuinely wrong, stop and provide manual calculation, business explanation, before/after expected values, why the old test was wrong and reviewer note required.
### Current Function Verification Rule
Before using any function, service, hook, endpoint, route, store, engine, helper or config, verify it is the current active implementation.
Search for:
- duplicate names
- old wrappers
- deprecated versions
- unused files
- old localStorage stores
- dead routes
- old demo helpers
- frontend/backend duplicate logic
- current imports
- tests referencing it
Do not build on a legacy implementation unless the task is specifically to audit or remove it.
If current vs legacy cannot be determined, stop and report ambiguity.
### Repeatable Execution Rule
All instructions must be safe to re-run.
Before writing files:
- create folders only if missing
- create files only if missing, unless the prompt explicitly says replace
- avoid duplicate markdown sections
- avoid duplicate JSON keys
- avoid duplicate Cursor rules
- avoid duplicate examples
- avoid duplicated checklist blocks
If a rule already exists with equivalent meaning, do not add a second version.
Report whether each file was created, updated, unchanged because already compliant, or skipped because of a stop condition.
### Human Review Escalation Rule
Escalate to human review instead of guessing when there is ambiguity in:
- legal positioning
- financial logic
- investment language
- fairness opinion risk
- compliance certification language
- multi-tenant ownership
- permissions
- source-of-truth
- Golden Dataset mismatch
- destructive migration
- production data exposure
- security-sensitive behavior
When escalating, provide exact ambiguity, files involved, business risk, safest options and recommended next action.
## Chat Refresh / Handoff
After closing a phase/subphase, or when context becomes long, generate:
# HANDOFF_STATE
Include:
- Current Phase/Subphase
- Last File Audited
- Verified Baseline Commit/HEAD
- Working Tree Status
- Summary of Discoveries/Bugs, max 3 bullets
- Decisions Made
- Exact Next Step
- Files Allowed To Touch Next
- Files Forbidden To Touch Next
- Active Stop Conditions or Blocks
- Pending Commit / Push Status
- Recommended Prompt To Run Next
## Stop Conditions
Stop and report if you find:
- critical calculation without source
- Golden Dataset mismatch
- frontend/backend logic mismatch
- legacy function used as source-of-truth
- demo/fallback contaminating output
- cross-tenant risk
- permissions ambiguity
- test that validates the wrong thing
- output presented as legal/financial/certified advice
- destructive migration risk
- secret exposure risk
- more than 3 failed attempts to fix the same issue
- need to touch forbidden files
- unexpected git baseline
- unexpected working tree changes
## Tutor explanation
Every decision must explain:
- why this approach is used
- what alternative was avoided
- what risk it reduces
- what QA should validate
- what future maintainers must know
- what business users should not misunderstand
## C.13 relationship
C.13 is the formal phase for:
- Logic Integrity
- Calculation Audit
- Golden Dataset Audit
- Legacy Function Audit
- Duplicate Function Audit
- Test Oracle Review
- Cross-module Consistency Review
C.13 must review both future branches and already audited branches.
