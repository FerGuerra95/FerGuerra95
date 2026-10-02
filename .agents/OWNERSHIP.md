# Ownership

Exists because default write boundaries must be visible before a capsule is written. The Task Capsule whitelist is the actual permission. It overrides convenience. It does not override `AGENTS.md`, security boundaries, or human approval.

## Classes

| Class | Meaning |
|---|---|
| EXCLUSIVE | The named role may write when the capsule lists the file. |
| SHARED | Touch only when the capsule lists the file. Default is one writer at a time. |
| LOCKED | Technical Direction must authorize the file inside the capsule. |
| PROTECTED | Security, Source of Truth, Golden, secrets, or canonical state. A capsule must name the file and the human authorization. |

## Defaults

Visual agent, when a later capsule allows it: workspace presentation and styles for that workspace only.

Engineering agent, when a capsule allows it: the product, backend, and test files named for that task.

Reviewer: read-only.

## SHARED or LOCKED

`src/main.jsx`, routers, `AppShell`, `Topbar`, `Sidebar`, shared components, global CSS, `package.json`, Playwright config, test infrastructure, `backend/server.js`, auth, tenant middleware, migrations.

Two agents do not refactor the same shared primitive.

## PROTECTED

Golden datasets, `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`, security contracts, production configuration, secrets, and `CURRENT_HANDOFF_STATE`.

There is no standing write right to a directory. An omitted path is forbidden.
