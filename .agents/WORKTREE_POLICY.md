# Worktree policy

Exists because `AGENTS.md` states the isolation rule and does not name checkout layout, stale trees, or who may write.

## Layout

The main checkout is reserved for integration and Technical Direction. Do not implement a material task there.

Each writing agent gets its own worktree and branch beside the main checkout. Do not hardcode a machine path. Name the directory for the role and task, for example `ceos-os-wt-engineering-<task-id>`.

Suggested separation:

- engineering worktree
- visual worktree
- review worktree, read-only

## Rules

- One material task per worktree and branch.
- Two writing agents do not share a worktree.
- No direct commits on `main` for agent implementation.
- The reviewer does not modify the builder branch.
- Record `BASELINE_SHA` in the Task Capsule. Start the worktree from that commit.
- A worktree does not replace database, VDR, or port isolation. Use the A27 harness.
- A stale or detached worktree is not a new baseline.
- Before two tasks run together, compare their `ALLOWED_FILES` sets. Overlap means they run in sequence unless Technical Direction writes the overlap into both capsules. Shared and locked files default to one writer.

## Observed at foundation time

These checkouts exist and are not baselines. Do not resume them and do not delete them in this phase:

- `ceos-os-clean-qa` detached, prunable
- `ceos-os-clean-qa-3` detached, prunable
- `ceos-os-clean-qa-4` detached

This phase does not create new worktrees.
