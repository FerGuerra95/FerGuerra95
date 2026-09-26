---
description: Resume CEO's OS from repository authority. Do not edit until preflight passes.
---

# /ceos-resume

Resume CEO's OS from the repository, not from conversation memory.

1. Read `AGENTS.md`, including **MANDATORY BOOTSTRAP — STOP BEFORE WORK**.
2. Read only `CURRENT_HANDOFF_STATE` from `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`.
3. Run `node scripts/governance/ai-preflight.mjs` if that script exists.
4. Verify `git rev-parse HEAD` and `git status --short` against the handoff.
5. STOP on a material HEAD/worktree mismatch. Do not normalize the repository.
6. Identify the requested task/finding.
7. Load only relevant Source-of-Truth context.
8. Produce the Task Capsule from `AGENTS.md`.
9. Do not inspect or edit implementation until preflight passes.

Do not preload the full Master. Do not reconstruct missing details from guesses. Cursor Project / chat memory is supplementary only.
