# Agent role layer

Exists because parallel agents need a short index. This directory is not a second constitution.

Authority, highest first:

1. `AGENTS.md` and `.cursorrules`
2. Git, plus `CURRENT_HANDOFF_STATE` in `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`
3. Verified code and runtime, `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`, and approved oracles
4. The role card in this directory
5. The Task Capsule for the assigned task
6. Independent review evidence
7. Human approval before merge

No role card, capsule, or review note overrides a higher layer.

| Role | Card | Writes product code | Reviews | Merges | Deploys |
|---|---|---|---|---|---|
| Technical Direction | `ORCHESTRATOR.md` | No, unless a capsule names files | Assigns review; does not self-verify | No | No |
| Engineering | `ENGINEERING_AGENT.md` | Only the capsule whitelist | No | No | No |
| Visual Convergence | `VISUAL_AGENT.md` | Presentation files named in the capsule | No | No | No |
| Independent Reviewer | `REVIEWER_AGENT.md` | No | Yes, read-only | No | No |

The builder of a material change is not its reviewer.

Operations: `WORKTREE_POLICY.md`, `MERGE_POLICY.md`, `OWNERSHIP.md`, `TASK_CAPSULE_TEMPLATE.md`, `HANDOFF_TEMPLATE.md`, `ACTIVE_TASKS.md`.

Product phase state stays in `CURRENT_HANDOFF_STATE`. Do not create `HANDOFF_2.md` or another roadmap here.
