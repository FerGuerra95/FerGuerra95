# CEO's OS / The Sovereign OS — Release Checklist

## Purpose

Mandatory checklist before closing a phase, staging a commit, recommending push, or declaring demo/pilot readiness.

Adapt validation commands to host OS (PowerShell on Windows, Bash/Zsh on macOS/Linux).

## Git Hygiene

| Check | Command / action | Pass |
|---|---|---|
| Confirm branch | `git branch --show-current` | main or authorized feature branch |
| Confirm HEAD | `git rev-parse HEAD` | Matches expected baseline |
| Confirm origin/main | `git rev-parse origin/main` | Aligned or ahead with reason |
| Working tree | `git status --short` | Only expected noise (e.g. backend-server.err) |
| Diff summary | `git diff --stat` | Scope matches phase |
| Changed files | `git diff --name-only` | Whitelist only |
| Untracked | `git ls-files --others --exclude-standard` | Whitelist only |
| No git add . | Manual staging per file | Required |
| No backend-server.err in commit | Verify not staged | Required |
| Commits atomic | One concern per commit | Required |
| No mixed concerns | Docs separate from code unless justified | Required |
| Push readiness | `git log origin/main..HEAD` reviewed | Before push |

## Scope Validation

| Check | Pass criteria |
|---|---|
| files allowed | Listed in PRE-FLIGHT and matched in diff |
| files forbidden | src, backend, tests, CSS, package.json, workflows untouched unless authorized |
| module in scope | Single module or doc-only |
| modules out of scope | No collateral edits |
| no adjacent cleanup | No "while here" refactors |
| no hidden cross-module | Report if imports/API span modules |

## Validation Matrix

### Document-only phase

- No code touched
- Markdown/MDC/plain text real (no wrapping fences on whole file)
- No duplicate sections on idempotent re-run
- No extra files outside whitelist
- First blindaje 6 files untouched (`git diff` empty on those paths)

### JSON

- `JSON.parse` validation passes
- Schema keys stable on re-run

### Frontend code

- `npm run build`
- Relevant unit tests
- E2E if critical route/auth
- Visual smoke if UI
- No NaN/Infinity in financial UI

### Backend/API

- Integration tests for touched services
- Permission check
- organizationId check
- Audit event review for mutations

### Calculation change

- Golden Dataset comparison
- FORMULA_REGISTRY row updated
- No tolerance widening
- No test weakening
- Human review for DSS positioning

### Security-sensitive change

- SECURITY_REVIEW_CHECKLIST.md walkthrough
- auth.middleware verification
- No secrets in diff

## Phase Closure Deliverables

- Summary of work
- Files changed / not changed
- Tests run with commands
- Risks P0/P1/P2/P3
- Known gaps
- HANDOFF_STATE if phase closes
- Next step and recommended prompt
- demo-ready / pilot-ready / partial verdict

## Stop Conditions Before Closure

Do not close phase if:

- unexpected files in diff
- golden mismatch open
- permission/tenant ambiguity open
- high-risk diff without approval
- documentation claims Confirmed without evidence

## Related Documents

- `docs/ai/AI_OPERATING_MODEL.md`
- `docs/security/SECURITY_REVIEW_CHECKLIST.md`
- `docs/testing/GOLDEN_DATASETS.md`
- `docs/testing/LOGIC_INTEGRITY_PROTOCOL.md`
