# Merge policy

Exists because the path from a builder branch to `main` needs an explicit human gate. Release checks stay in `docs/release/RELEASE_CHECKLIST.md`. Review verdicts stay in `AGENTS.md`.

## Sequence

`IMPLEMENTED` → `READY_FOR_REVIEW` → `INDEPENDENT REVIEW` → `VERIFIED` → `HUMAN APPROVAL` → `MERGE` → `POST-MERGE VALIDATION`

The builder may stop at `READY_FOR_REVIEW`. Only the reviewer may say `VERIFIED`. Only a human, through Technical Direction, may say `MERGE AUTHORIZED`.

## Branch names

- `agent/engineering/<task-id>`
- `agent/visual/<workspace-or-task>`
- `agent/review/<task-id>`

Do not work on `main`. Do not force-push. Do not reuse one branch across unrelated phases. One logical concern per branch. Record the baseline in the Task Capsule. No automatic merge.

## Do not merge when

- A required test fails.
- The diff contains a file outside the capsule.
- A P0 or P1 inside the task scope is still open.
- The reviewer verdict is `NOT VERIFIED`.
- Source of Truth ownership is ambiguous.
- A Golden comparison disagrees and no authorized oracle change exists.
- The branch base is stale or incompatible with current `main`.
- Conflict resolution changes behavior and has not been reviewed again.

After merge, run the post-merge check named in the capsule and update `CURRENT_HANDOFF_STATE` only if that package is the validated checkpoint.
