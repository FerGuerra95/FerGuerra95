# Task Capsule template

Exists because `AGENTS.md` defines the product capsule and parallel work also needs role, branch, worktree, and merge fields. Copy this into the task conversation. Do not store a filled capsule as a second roadmap.

A capsule exists before material edits. The agent does not expand it after implementation starts except for a same-task dependency classified in `AGENTS.md`.

```text
TASK_ID:
AGENT_ROLE:
MODE:
BASELINE_SHA:
BRANCH:
WORKTREE:
OBJECTIVE:
BUSINESS_CONTEXT:
SOURCE_OF_TRUTH:
ALLOWED_FILES:
FORBIDDEN_FILES:
DEPENDENCIES:
TESTS_REQUIRED:
NEGATIVE_TESTS_REQUIRED:
RISK_LEVEL:
STOP_CONDITIONS:
EXPECTED_DELIVERABLE:
COMMIT_POLICY:
REVIEW_REQUIREMENT:
MERGE_GATE:
```

Also include the `AGENTS.md` capsule fields when they are not already covered: phase, findings, canonical owner, frozen areas, exit gate, context level, and `EXISTING OWNER FOUND`.

`COMMIT_POLICY` is one of: no commit, commit on the task branch only, or commit and push the task branch. Merge to `main` is never implied.

`REVIEW_REQUIREMENT` for material security, persistence, calculation, tenant, or infrastructure work is a different agent. The builder cannot satisfy it.
