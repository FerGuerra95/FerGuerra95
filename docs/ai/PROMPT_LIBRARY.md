# CEO's OS / The Sovereign OS — Prompt Library

## Purpose

Official library of repeatable prompts for audits, fixes, validation, and handoffs.

Copy a template verbatim into Cursor. Replace bracketed placeholders.

## Rules For All Prompts

1. Start with PRE-FLIGHT CHECKLIST (verifiable summary, no private chain-of-thought).
2. Define allowed and forbidden files explicitly.
3. No `git add .`
4. No `backend-server.err` in commits
5. No placeholders in deliverables
6. No test weakening
7. No Golden Dataset weakening
8. No broad refactor
9. Provide validation evidence and HANDOFF_STATE when phase closes
10. Apply Documentation Truthfulness: Confirmed vs Assumed / Pending C.13 validation
11. Use host-native terminal (PowerShell on Windows, Bash/Zsh on macOS/Linux)
12. Write repository files as plain text (no wrapping whole .mdc/.md in Markdown code fences)

---

## Prompt Template — No Fix Mode / Read-Only Audit

```text
Act as Principal Enterprise Architect and Logic Integrity Auditor for CEO's OS.

MODE: READ-ONLY — NO FIX MODE

PRE-FLIGHT CHECKLIST (fill before work):
- task scope: [describe audit scope]
- baseline HEAD: [commit]
- files allowed: read-only access to [list paths]
- files forbidden: all writes; src/backend/tests/CSS/package.json unless later authorized
- module in scope: [module]
- stop conditions: any write attempt, secret exposure, scope creep

OBJECTIVE:
Inventory only. Do not modify any file. Do not commit. Do not push.

TASKS:
1. Map routes, services, stores, and calculation engines in scope.
2. Identify duplicates (frontend vs backend, multiple helpers).
3. Identify legacy/dead code paths.
4. Identify demo/fallback/localStorage contamination risks.
5. Classify findings P0/P1/P2/P3 with evidence (file paths, line references).
6. Propose correction sequence without applying patches.

FORBIDDEN:
- No file edits
- No test changes
- No golden expected value changes
- No git add, commit, push

DELIVERABLE:
- Findings table P0-P3
- Source-of-truth notes (Assumed / Pending C.13 validation where not proven)
- Recommended next prompt (scoped fix or C.13 subphase)
- HANDOFF_STATE

STOP CONDITIONS:
- Attempted write to repo
- Cannot verify tenant/auth on sensitive endpoint
- Three failed analysis passes on same blocker
```

---

## Prompt Template — C.13.0 Global Read-Only Audit

```text
Act as Logic Integrity Auditor for CEO's OS — Phase C.13.0.

MODE: READ-ONLY GLOBAL AUDIT

PRE-FLIGHT CHECKLIST:
- task scope: C.13.0 global logic integrity across C.1–C.7 domains
- baseline HEAD: [commit]
- files allowed: read entire repo; write only if explicitly authorized to docs inventory
- files forbidden: code changes, tests, golden outputs, blindaje v1 six files
- references: docs/testing/golden_inputs.json, FORMULA_REGISTRY.md, SOURCE_OF_TRUTH_REGISTRY.md

OBJECTIVE:
Audit structure, duplicates, legacy, source-of-truth, calculations vs Golden Datasets, tests/oracles, demo/fallback, security/multi-tenant.

TASKS:
1. Modular boundary review (cross-module imports, shared helpers).
2. Duplicate calculation paths (FE/BE).
3. Legacy and frozen areas (marketplace, shell).
4. Source-of-truth vs SOURCE_OF_TRUTH_REGISTRY.md.
5. Formula implementation vs FORMULA_REGISTRY.md and golden_inputs.json.
6. Test oracle integrity (no weakening patterns).
7. Demo/fallback/mergeWithDemo/localStorage risks.
8. Auth, organizationId, permissions per sensitive route.
9. Classify all findings P0/P1/P2/P3.
10. Deliver remediation plan WITHOUT applying fixes.

FORBIDDEN:
- No code/test/golden edits
- No commit/push unless user authorizes docs-only inventory update

DOCUMENTATION TRUTHFULNESS:
Mark Confirmed only with file evidence. Otherwise Assumed / Pending C.13 validation.

DELIVERABLE:
- Executive summary (max 10 lines)
- P0/P1/P2/P3 tables with evidence
- Per-module mini-report
- Pilot-ready verdict: not ready / partial / ready with conditions
- HANDOFF_STATE
- Recommended next prompt per P0/P1 cluster

STOP CONDITIONS:
- Required write to fix during audit
- Secret found in repo output
- Golden mismatch requires changing expected values to proceed
```

---

## Prompt Template — Module Logic Integrity Audit

```text
Act as Module Logic Integrity Auditor for CEO's OS.

MODULE: [M&A | Compliance | Funding | Governance | PMI | Bridge | Risk | Reporting | Strategy | Heritage | Executive Overview]

MODE: READ-ONLY

PRE-FLIGHT:
- scope: module [X] only
- allowed: read module paths + shared auth references
- forbidden: other modules, shell, marketplace unless Bridge

TASKS:
1. List calculation engines and formulas used.
2. Map each formula to FORMULA_REGISTRY row and Golden Dataset ID if any.
3. Find duplicate implementations.
4. Find demo/fallback/localStorage usage.
5. Verify organizationId scoping on module APIs (assumed until proven).
6. Classify P0-P3.

DELIVERABLE:
- Module findings
- Golden mapping table (match / mismatch / no golden)
- Safe fix sequence (no patches applied)

STOP CONDITIONS:
- Cross-module code change required without authorization
- Marketplace promotion requested (Bridge)
```

---

## Prompt Template — Controlled Bugfix

```text
Act as Scoped Bugfix Engineer for CEO's OS.

MODE: CONTROLLED BUGFIX — MINIMAL DIFF

PRE-FLIGHT:
- bug ID / description: [text]
- baseline HEAD: [commit]
- files allowed: [exact list]
- files forbidden: everything else; no shell; no auth unless listed
- golden impact: [yes/no — if yes, run golden check after fix]

OBJECTIVE:
Fix exactly one bug with smallest correct change.

RULES:
- No adjacent cleanup
- No refactor
- No test weakening
- No golden expected value changes unless human approved mismatch resolution
- No git add .
- Staging selective only

VALIDATION:
- [build / unit / integration / golden commands]

DELIVERABLE:
- Root cause
- Patch summary
- Tests run
- Risks remaining
- HANDOFF_STATE

STOP CONDITIONS:
- Fix requires forbidden files
- Fix requires golden change to hide bug
- Three failed fix attempts
```

---

## Prompt Template — Calculation Verification

```text
Act as Calculation Verification Auditor for CEO's OS.

FORMULA: [name from FORMULA_REGISTRY]
GOLDEN DATASET ID: [id from golden_inputs.json]

MODE: READ-ONLY unless user authorizes code fix

PRE-FLIGHT:
- formula row: [ID]
- implementation files to inspect: [paths if known]

TASKS:
1. Locate all implementations (FE, BE, shared).
2. Trace inputs and output rounding.
3. Compare against golden expected output within tolerance.
4. Document edge cases (zero divisor, null, clamp).
5. Status: Matches golden | Mismatch | Duplicate | Source unclear

FORBIDDEN:
- Changing golden to pass code without human approval

DELIVERABLE:
- Evidence table
- Recommendation: fix code | fix test | human review

STOP CONDITIONS:
- Multiple conflicting sources without documented precedence
```

---

## Prompt Template — Security Review

```text
Act as Security Reviewer for CEO's OS.

TARGET: [endpoint / feature / PR scope]

MODE: READ-ONLY first; code changes only if authorized

PRE-FLIGHT:
- endpoint(s): [list]
- mutation: [yes/no]
- files allowed: [list]

CHECKLIST (docs/security/SECURITY_REVIEW_CHECKLIST.md):
- Authentication
- Authorization / viewer cannot mutate
- organizationId server-side
- Input validation
- Secrets
- Logs/errors
- Auditability

DELIVERABLE:
- Pass/fail per gate
- P0/P1 security findings
- Required human review items

STOP CONDITIONS:
- organizationId ambiguous
- cross-tenant risk
- secret exposure
- auth change needed without authorization
```

---

## Prompt Template — Release Closure

```text
Act as Release Manager for CEO's OS.

PHASE: [name]

PRE-FLIGHT:
- HEAD: [commit]
- files changed: [list]
- authorized scope: [yes/no]

VALIDATION (docs/release/RELEASE_CHECKLIST.md):
- git status --short
- git diff --name-only
- no backend-server.err staged
- no git add .
- [build/tests/golden as applicable]

DELIVERABLE:
- Phase closure summary
- Tests run with commands
- Risks P0-P3 open
- What was not touched
- demo-ready / pilot-ready verdict
- Commit recommendation yes/no with exact git add list
- HANDOFF_STATE

STOP CONDITIONS:
- unexpected files in diff
- open P0 without acknowledgment
```

---

## Prompt Template — Handoff

```text
Generate HANDOFF_STATE for CEO's OS.

PRE-FLIGHT:
- current phase: [name]
- HEAD: [commit]
- working tree: [git status --short]

OUTPUT FORMAT (mandatory sections):

## HANDOFF_STATE

### Current Phase/Subphase
[text]

### Last File Audited
[path or N/A]

### Verified Baseline Commit/HEAD
[hash]

### Working Tree Status
[git status summary]

### Summary of Discoveries/Bugs (max 3 bullets)
- [bullet 1]
- [bullet 2]
- [bullet 3]

### Decisions Made
[text]

### Exact Next Step
[text]

### Files Allowed To Touch Next
[list]

### Files Forbidden To Touch Next
[list]

### Active Stop Conditions or Blocks
[list or none]

### Pending Commit / Push Status
[none / staged / committed / pushed]

### Recommended Prompt To Run Next
[reference PROMPT_LIBRARY template name]

STOP CONDITIONS:
- Missing any mandatory section
- Claims Confirmed without audit evidence
```

---

## Index of Templates

| Template | Use when |
|---|---|
| No Fix Mode | Inventory and classification only |
| C.13.0 Global Read-Only Audit | Full logic integrity pass |
| Module Logic Integrity Audit | Single module deep dive |
| Controlled Bugfix | Authorized minimal fix |
| Calculation Verification | One formula vs golden |
| Security Review | API/auth/tenant change |
| Release Closure | End of phase with evidence |
| Handoff | Transition between phases |
