# Agent role layer

This directory is a navigation pointer. It is not a second constitution, a second state machine, a second authorization source, or a competing Source of Truth.

Canonical governance owns authority. Start at `AGENTS.md`. Current product phase state lives only in `CURRENT_HANDOFF_STATE` inside `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`. 02A enforces scope, lifecycle, role boundaries, and named human gates. 02B records trusted local execution facts. Role cards here operate inside that precedence. They do not establish independent precedence.

| Role | Card | Writes product code | Reviews | Merges | Deploys |
|---|---|---|---|---|---|
| Technical Direction | `ORCHESTRATOR.md` | No, unless a capsule names files | Assigns review; does not self-verify | No | No |
| Engineering | `ENGINEERING_AGENT.md` | Only the capsule whitelist | No | No | No |
| Visual Convergence | `VISUAL_AGENT.md` | Presentation files named in the capsule | No | No | No |
| Independent Reviewer | `REVIEWER_AGENT.md` | No | Yes, read-only | No | No |

The builder of a material change is not its reviewer.

Operations: `WORKTREE_POLICY.md`, `MERGE_POLICY.md`, `OWNERSHIP.md`, `TASK_CAPSULE_TEMPLATE.md`, `HANDOFF_TEMPLATE.md`, `ACTIVE_TASKS.md`.

Product phase state stays in `CURRENT_HANDOFF_STATE`. Do not create `HANDOFF_2.md` or another roadmap here.
