# A-MULTI-02A orchestration core

This contract answers task identity, baseline, acting role, allowed paths, protected paths, current phase, transition legality, human gates, and ownership overlap. `AGENTS.md` remains the higher authority. `.agents/ORCHESTRATOR.md` remains the role boundary for Technical Direction.

The task capsule is the only authority for `baseline`, `allowed_files`, `forbidden_files`, and `protected_authorization`. `STATE.json` mirrors those fields and stores `capsule_fingerprint`. `capsule_fingerprint` is a SHA-256 of the canonical capsule fields `task`, `baseline`, `allowed_files`, `forbidden_files`, `protected_authorization`, and `human_gates`. Paths are canonicalized before the hash. Key order is fixed. This fingerprint is deterministic configuration identity. It is not cryptographic human attestation, trusted evidence, or a signature.

Task id alone is not identity. After `init`, `validate-state`, `transition`, `check-paths`, and `check-overlap` require the bound capsule. If the current capsule fingerprint differs from `STATE.json` `capsule_fingerprint`, the command fails closed. A second valid capsule with the same task id and wider permissions cannot be used against the existing state. `init` refuses to overwrite an existing state file. This package does not provide recovery or reset.

`check-paths` is not an authorization decision from an arbitrary capsule file. It requires the capsule and the bound `STATE.json`, and it proves the fingerprint matches before it checks files.

Repository paths use one lexical canonical file path. Backslashes become `/`. Duplicate separators collapse. `.` and `..` resolve lexically. Comparison is case-insensitive. Absolute paths, drive-qualified paths, UNC paths, and traversal above the repository root are rejected. No filesystem lookup is performed. A trailing separator is a directory entry, and directory entries are not grants. `backend/services/` does not authorize `backend/services/auth/auth.service.js`. Extensionless paths remain exact lexical paths. They do not imply directory ownership. Lexical path normalization does not prove filesystem target identity. Symlinks, junctions, and reparse points require execution-layer validation before real filesystem mutation. Ownership collision compares canonical files. A sibling prefix is a different file.

`.env` is a protected `secrets` path, not an absolute deny. `forbidden_files` always wins over allowed files and protected authorization.

Protected scope is not human approval. `allowed_files` and `protected_authorization` answer whether a path or class is inside the task scope. They do not grant the human decision. The capsule must declare all seven human-gate classes: `scope_expansion`, `source_of_truth_change`, `golden_change`, `governance_change`, `merge`, `production`, and `destructive_real_data_action`. Each value is an explicit `true` or `false` requirement. A missing gate is rejected. An unknown gate name is rejected. A missing gate is not treated as authorized.

`true` means the corresponding action requires a human-authorization record before it proceeds. `false` means this capsule does not declare that requirement. Source of Truth scope requires `source_of_truth_change`. Golden scope requires `golden_change`. Governance scope requires `governance_change`. A merge action requires `merge`. A production action requires `production`. A destructive real-data action requires `destructive_real_data_action`. Scope expansion requires `scope_expansion`. Destructive real-data is an explicit operational declaration. It is not inferred from a file path.

02A records authorization state. It does not prove human identity. Human authorization is recorded only by `authorize-gate`. A lifecycle `transition` cannot modify `human_authorizations`. The flag `--authorize` is not an authorization mechanism. `authorize-gate --gate <gate> --role <role>` is the only grant path. It is not cryptographic proof of human identity. A grant is a deterministic representation that a higher execution layer has already received that human decision. `builder`, `engineering`, and `reviewer` cannot represent any human gate. `human` and `technical_direction` may represent `scope_expansion`, `source_of_truth_change`, `golden_change`, `governance_change`, `production`, and `destructive_real_data_action`. `merge` uses the existing merge roles only. A grant is rejected when `human_gates[gate]` is `false`. Grants are monotonic inside one bound capsule: 02A records `false` to `true` and does not revoke a grant. `human_gate` is only a lifecycle phase label. It does not mean the approval is still missing. A phase may name a gate that `human_authorizations` already records as granted. `human_authorizations` is the authorization record. Multiple gate approvals may exist during one task, and a later gate does not erase an earlier one. Merge approval does not imply Source of Truth approval. Source of Truth approval does not imply merge approval. A grant does not change allowed files, the capsule fingerprint, or the lifecycle phase.

No human-gate record itself performs merge, deploy, or a destructive action. `production_authorized` remains false. Representing the production gate does not deploy, call Render, or open a production connection. Representing the destructive-real-data gate does not mutate data. 02A remains control primitives, not execution. Trusted identity and evidence belong to later architecture.

Phase labels are reported state:

- `MERGED` means the orchestration record reports that the merge occurred. 02A does not independently prove that Git main contains the candidate.
- `VALIDATED` means the orchestration record reports validation completion. 02A does not independently prove that tests or the build passed.
- `CLOSED` means the orchestration lifecycle records closure. It is not independent evidence of product correctness.

Trusted machine-generated evidence belongs to A-MULTI-02B. Execution and repository reconciliation belong to A-MULTI-02C.

A-MULTI-02A provides schemas, validation primitives, transition primitives, and authorization primitives. It does not provide cross-worktree shared-state transport, global task-state synchronization, multi-agent messaging, a canonical shared-state location, or multi-writer coordination. Builder and Reviewer worktrees can contain different filesystem copies. Until A-MULTI-02C owns execution, routing, and state transport, the execution layer must provide one authoritative state file and one writer at a time. 02A is not multi-writer safe. If two writers are permitted concurrently, correctness is not guaranteed.

`check-overlap` does not discover all active tasks. It only determines collisions within the complete set provided by the caller. A later orchestration runner must supply that canonical active set. Omitting an active task from the supplied set can hide a collision. 02A does not claim that it automatically prevents all active-task collisions.

Deferred on purpose:

- A-MULTI-02B owns trusted evidence manifests and candidate-SHA attestation.
- A-MULTI-02C owns worktree creation, automatic builder/reviewer routing, and state transport.
- A-MULTI-02D owns human preview, including ports 4000 and 4001.
- A-MULTI-02E owns architecture audit.

Persistence, when a run needs it, is a per-worktree filesystem copy at `.agents/tasks/<TASK_ID>/capsule.json` and `STATE.json`. That path is not a synchronized global record. State replacement writes a temporary file in the same directory, flushes it, and renames it onto the target. Do not store secrets. This package does not define an evidence manifest.

```text
node scripts/agents/orchestrate.mjs validate-capsule --file <capsule.json>
node scripts/agents/orchestrate.mjs validate-state --file <STATE.json> --capsule <capsule.json>
node scripts/agents/orchestrate.mjs init --capsule <capsule.json> --out <STATE.json>
node scripts/agents/orchestrate.mjs transition --state <STATE.json> --capsule <capsule.json> --to <PHASE> --role <role> [--blocker <text>]
node scripts/agents/orchestrate.mjs authorize-gate --state <STATE.json> --capsule <capsule.json> --gate <gate> --role <role>
node scripts/agents/orchestrate.mjs check-paths --file <paths.json>
node scripts/agents/orchestrate.mjs check-overlap --file <tasks.json>
node scripts/agents/orchestrate.mjs human-gate --to <PHASE>
```

`paths.json` contains `capsule`, `changedFiles`, and the bound `state`. `tasks.json` entries contain `capsule`, `phase`, and the bound `state`.

`npm run agents:orchestrate -- --help` exposes the same entry. Invalid transitions fail closed and do not rewrite state. `MERGED` requires `human_authorizations.merge` recorded by `authorize-gate` and a role in the existing merge roles. Engineering and builder implement and may execute authorized post-merge validation work. The reviewer sets `VERIFIED` and may record `VALIDATED` or `NOT_VERIFIED` for post-merge validation results. The reviewer does not merge and does not close governance. `human`, `technical_direction`, and `orchestrator` record `GOVERNANCE_CLOSURE` and `CLOSED`. Orchestrator and technical direction do not enter `IMPLEMENTING`. A reviewer `NOT_VERIFIED` does not start another agent; the next `IMPLEMENTING` transition is explicit. `BLOCKED` and `SCOPE_EXPANSION_REQUIRED` cannot claim `review_status` `VERIFIED`.
