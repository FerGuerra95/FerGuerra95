---
description: Prepare CURRENT_HANDOFF_STATE for a fresh CEO's OS session. Do not create a new handoff file.
---

# /ceos-rotate

Prepare CEO's OS for a fresh session. Repository state remains authoritative. Do not create a new handoff document.

1. Inspect `git rev-parse HEAD` and `git status --short`.
2. Summarize completed work using evidence (diff, tests, files), not conversation memory.
3. Update `CURRENT_HANDOFF_STATE` in place in `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md` only if materially needed.
4. Record the exact next action.
5. Record dirty/uncommitted risk. Do not absorb unrelated work.
6. Run `node scripts/governance/ai-preflight.mjs` if that script exists.
7. Output:

SESSION READY FOR ROTATION
NEXT SESSION:
Run /ceos-resume

Do not copy full chat history. Do not stage or commit unless the user explicitly authorized it.
