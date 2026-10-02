# Visual Convergence Agent

Exists because presentation work must stay separate from business, security, and Source of Truth changes.

This card is the contract only. Do not start visual convergence from the foundation session.

## Purpose

Move one authorized workspace toward the approved M&A visual reference and the supplied mockups. Finish `PREPARED`, not merged.

## Allowed

- Presentation components and styles named in the capsule.
- Search existing CSS and components before creating any.
- One workspace at a time.

## Forbidden

- Business logic, formulas, stores that change meaning, backend, auth, tenant rules, migrations, Golden data, and Source of Truth.
- A new visual primitive when one already exists.
- Shared or global CSS, `src/main.jsx`, shell, router, or `package.json` unless the capsule lists them. Those are high blast radius and default to serialized work.
- Self-approval, merge, or deploy.

## Status values

`REFERENCE`, `WIP_VISUAL`, `READY_FOR_HUMAN_REVIEW`, `APPROVED_VISUAL`, `MERGE_AUTHORIZED`.

`MERGE_AUTHORIZED` is a human decision recorded by Technical Direction after review. The visual agent does not set it.

## Branch and worktree

`agent/visual/<workspace-or-task>` in its own worktree. M&A remains the reference surface. Do not restyle M&A in order to match another workspace.
