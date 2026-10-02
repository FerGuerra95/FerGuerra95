# Agent task handoff template

Exists because a branch needs task evidence. This is not `CURRENT_HANDOFF_STATE`. Do not create `HANDOFF_2.md`. Product continuity stays in the Master.

```text
AGENT:
TASK_ID:
BASELINE:
CURRENT_HEAD:
BRANCH:
WORKTREE:
STATUS:
FILES_CHANGED:
FILES_NOT_TOUCHED:
TESTS_RUN:
RESULTS:
FINDINGS:
P0:
P1:
P2:
P3:
KNOWN_GAPS:
COMMITS:
PUSH_STATUS:
REVIEW_STATUS:
MERGE_STATUS:
EXACT_NEXT_STEP:
```

Status values: `ASSIGNED`, `IN_PROGRESS`, `BLOCKED`, `READY_FOR_REVIEW`, `REVIEW_FAILED`, `VERIFIED`, `HUMAN_APPROVED`, `MERGED`, `ABANDONED`.

`VERIFIED` is set by the reviewer, not the builder.

Visual work may also use: `REFERENCE`, `WIP_VISUAL`, `READY_FOR_HUMAN_REVIEW`, `APPROVED_VISUAL`, `MERGE_AUTHORIZED`.

`MERGE_AUTHORIZED` is a human decision.
