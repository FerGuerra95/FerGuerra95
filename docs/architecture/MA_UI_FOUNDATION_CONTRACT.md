# CEO's OS — M&A UI Foundation Contract

**Status:** **M&A UI FOUNDATION V1 — FROZEN**; approved visual rules preserved. Historical freeze: 2026-09-03, C.MA-FOUNDATION-F4. Cross-workspace migration PENDING.  
**Historical freeze HEAD:** `4bbdf1eca8350ab26fbe4abf954c8190eaa1c240`  
**Current forensic HEAD:** `43e470f630b8b2b79cc5241aeac6279492108081` plus audited dirty/untracked files.  
**Last documentation reconciliation:** 2026-09-17; ownership/import references only. No CSS or visual implementation changed.  
**Scope:** Frontend architecture for M&A canonical workspace. Compliance/Funding/Governance migration is out of scope for this phase.

---

## 1. Architectural rule

**Foundation defines physics. Workspace defines identity. Page defines function.**

| Layer | Owns | Must NOT own |
|---|---|---|
| **Foundation** | Shell dimensions, page geometry, hero geometry, material physics, interaction primitives | Page effects, branch-specific visuals |
| **Workspace theme** | Accent color tokens (`--ws-*`) | Full component recipes |
| **M&A shared** | Reusable M&A patterns, surface tokens (`--ma-mna-*`) | Pipeline flow, vault, corridor |
| **Page-specific** | Unique visualization, layout composition | Global width, hero top, canonical glass |

---

## 2. Source of truth map

This map preserves intended semantic ownership. Current styles still compete in the cascade (A37); source order is verified, but authenticated computed-style/visual parity was not rerun during Astra. Frozen appearance is a product rule, not a current test PASS.

| Area | Canonical owner | Notes |
|---|---|---|
| **Shell** | `src/styles.css` (`--shell-*`), `AppShell.jsx`, `Topbar.jsx`, `Sidebar.jsx`, `WorkspaceSwitcher.jsx`, `MobileNavDrawer.jsx` | Runtime CSS for shell layout only |
| **Page geometry** | `src/styles.css` (`:root --ceos-page-*`), `src/styles/ceosPageGeometry.css` | Max-width 1480px, gutters, premium page `padding-top: 0` |
| **Hero geometry** | `src/styles.css` (`--ceos-hero-*`), `src/styles/ceosHeroGeometry.css`, `src/modules/ma/styles/maMnaHeroAlignment.css` | Title zone, copy slot, panel offset |
| **Material physics (M&A)** | `src/modules/ma/styles/maMnaSurfaceSystem.css` | Outer `--ma-mna-surface-*`, inner `--ma-mna-inset-*`, status glass |
| **Inner surfaces** | `maMnaSurfaceSystem.css`, `maReferenceSurfaces.css` | Valuation status list, dashboard panels |
| **Workspace accent** | `src/styles/workspaceAccent.css`, `useWorkspaceTheme.js` | `--ws-accent`, `--ws-accent-glow`, `--ws-accent-border` |
| **M&A branch theme** | `src/modules/ma/styles/maExecutiveTheme.css` | M&A workspace token reinforcement |
| **M&A shared alignment** | `maMnaBranchGeometry.css`, `maMnaInternalAlignment.css`, `maShellCompact.css` | Branch grid, table inset, compact page top |
| **Dashboard page** | `maDashboardMaterial.css` | Reference scene, stat slabs, intelligence field |
| **Valuation page** | `src/modules/ma/styles/maValuationMaterial.css` | Current `main.jsx` imports it last; `maValuationCanonicalParity.css` is deleted in the working tree and no longer imported. Shared material/alignment layers still apply. |
| **Pipeline page** | `maPipelineMaterial.css` + `DealPipelinePage.jsx` (layout-only runtime) | Materials in CSS; layout grid in runtime `<style>` |
| **Pipeline effect** | `maPipelineMaterial.css` (`.ma-pipeline-scene-atmo/glow`), `maPipelineOrchestrationEffect.css` | **Effect only — not canonical material** |
| **Repository page** | `maRepositoryMaterial.css` | Archive vault, KPI, records |
| **Repository effect** | `maRepositoryArchiveEffect.css` | Vault/archive visualization |
| **Data Room page** | `maDataRoomMaterial.css` | Metrics panel, controls |
| **Data Room effect** | `maDataRoomCorridorEffect.css` | Security/corridor field |
| **Buttons (M&A)** | `maButtonSystem.css` | Shared button recipes |
| **Polish / flatten guard** | `executivePolish.css` | Global flatten; pages opt out via `:not()` guards |
| **Legacy M&A flatten** | `maExecutivePremiumLegacy.css` | Non-premium routes only; excludes dashboard/pipeline/repository/data-room premium |

---

## 3. CSS import order (intentional cascade)

Verified static CSS declaration order in `src/main.jsx` on 2026-09-17 (source order alone does not determine every rendered winner):

1. `styles.css`
2. `maExecutiveTheme.css`
3. `maExecutivePremiumLegacy.css`
4. `executivePolish.css`
5. `workspaceAccent.css`
6. `maDashboardMaterial.css`
7. `maReferenceSurfaces.css`
8. `maButtonSystem.css`
9. `maMnaSurfaceSystem.css`
10. `maPipelineMaterial.css`
11. `maPipelineOrchestrationEffect.css`
12. `maRepositoryMaterial.css`
13. `maRepositoryArchiveEffect.css`
14. `maScoreRing.css`
15. `maDataRoomMaterial.css`
16. `maDataRoomCorridorEffect.css`
17. `maMnaBranchGeometry.css`
18. `maMnaInternalAlignment.css`
19. `maMnaHeroAlignment.css`
20. `ceosPageGeometry.css`
21. `ceosHeroGeometry.css`
22. `maValuationMaterial.css`

`maValuationMaterial.css` is the last declared static CSS import; retired `maValuationCanonicalParity.css` is absent. `AppShell.jsx` additionally imports `maShellCompact.css`; this is a separate import edge, not proof that it loads “after bundle”.

**Runtime styles:** `ExecutivePremiumStyle.jsx` is deleted, but AppShell and page components still contain runtime `<style>` blocks. Deletion of that component does not establish zero runtime CSS injection. The rule below against new static geometry/material injection remains unchanged.

---

## 4. Material role model

```
PAGE CANVAS (approved black canvas; current global #000)
  └─ PRIMARY SURFACE (--ma-mna-surface-* / hero panels)
       └─ INNER SURFACE (--ma-mna-inset-* / tables, lists, embeds)
            └─ SIGNAL SURFACE (status glass — Valuation Ready recipe)
```

- Preserve the black canvas. Workspace identity belongs in accent, hero and surfaces, not the page background.
- One visible surface has one intended material owner, one border owner, one radius owner and only its required clipping boundary. A37 records current competing ownership; this pass does not fix it.
- Frozen reference surfaces: Dashboard, Valuation, Pipeline, Repository and Data Room. No broad redesign during functional remediation.
- **Global material ≠ global effect.** Pipeline glow, Repository vault, Data Room corridor are page effects scoped to hero/section containers.
- Workspace accent tints borders/glow via `--ws-accent-*`; M&A teal also uses `--ma-ref-teal*` in page materials.

---

## 5. Geometry rules

| Token / rule | Value / owner |
|---|---|
| Sidebar width | `--shell-sidebar-width: 220px` (`styles.css`) |
| Topbar height | `--shell-topbar-height: 60px` |
| Page max-width | `--ceos-page-max-width: 1480px` |
| Page gutter | `--ceos-page-gutter-x: clamp(26px, 2.6vw, 36px)` |
| M&A premium page top | `padding-top: 0` via `ceosPageGeometry.css` only |
| Hero top gap | `--ceos-hero-top-gap: 6px` + `maMnaHeroAlignment.css` |
| Title zone | Shared min-height + margins in `maMnaHeroAlignment.css` |

**Do not** redefine page width or hero top in page CSS files.

---

## 6. Page-specific CSS allowed content

**YES:** execution visualization, vault/archive effect, corridor field, page layout grid, unique composition.

**NO:** `--ceos-content-max`, `padding-top: 0` on `.page`, canonical glass recipe copy, shell dimensions.

**Pipeline runtime CSS (`DealPipelinePage.jsx`):** layout-only (grid, gaps). Materials stay in `maPipelineMaterial.css`.

---

## 7. `!important` policy

- **Forbidden:** new page-level `--ceos-content-max` overrides; runtime CSS injection for static geometry/material.
- **Historical F3 geometry enforcement (pre-2026-09-17):** rendered outer frame recorded as verified via `.local/ma-f3-geometry-audit.mjs` — all M&A premium pages share shell left/right at ±0px delta @1440/1920.
- **F4 valuation retirement (2026-09-03):** Removed import-order duplicate block `maValuationMaterial.css` lines C.24.15B–C.24.50 (~10,067 lines, ~4,491 `!important`). Historical cascade owner at F4: `maValuationCanonicalParity.css` C.MA-F3; this owner is retired in the current working tree. Visual oracle historically verified via `.local/ma-f4-valuation-oracle-compare.mjs` + `.local/ma-visual-regression-sweep-02.mjs`.
- **Goal:** Post-v1 targeted retirement of remaining material/cascade shields as upstream conflicts are eliminated (not file-splitting override layers).

### Visual freeze precedes cascade cleanup

**Rule:** Approved visual output is part of the product contract. A style rule may not be removed merely because it is legacy until its contribution to approved visual output is proven absent or migrated to its canonical owner.

**Migration order:**

1. Identify the exact visual declaration that produced the approved result (screenshots, git history, computed styles).
2. Move only that declaration to the permanent semantic owner (`maMnaSurfaceSystem.css`, page material, or page effect CSS).
3. Verify visual equivalence at 1440 (and 1920 where applicable).
4. Remove the duplicate/legacy authority — not before step 3 passes human or oracle QA.

**Do not** use import-order wins, new override files, or net-new `!important` to substitute for ownership fixes.

---

## 8. New page checklist (M&A)

A new M&A page should only add:

1. Page-specific effect/visualization CSS (if any)
2. Layout composition (prefer static CSS file over runtime unless dynamic)
3. JSX using existing classes: `ma-valuation-surface`, `ma-mna-inner-surface`, hero alignment classes

It automatically inherits: shell, width, gutters, hero alignment, materials, accent, nav.

---

## 9. Future workspace migration (not this phase)

Compliance/Funding/Governance will later:

- Consume `--ceos-page-*`, `--ceos-hero-*`, material role model
- Supply only `--ws-accent-*` + page-specific effects
- Remove duplicated hero glass from inline JSX CSS incrementally

---

## 10. Audit tooling

| Script | Purpose |
|---|---|
| `.local/ma-foundation-audit.mjs` | CSS line counts, duplicate selectors, `!important`, tokens |
| `.local/ma-foundation-screenshots.mjs` | Visual baseline @ 1440 |
| `.local/ma-hero-alignment-audit.mjs` | Title/hero Y coordinates |
| `.local/ma-f3-geometry-audit.mjs` | Rendered geometry matrix (page/hero/lower bounding boxes) |
| `.local/ma-f4-cascade-audit.mjs` | Valuation cascade map, duplicate block classification |
| `.local/ma-f4-valuation-oracle-baseline.mjs` | Pre-retirement computed-style oracle |
| `.local/ma-f4-valuation-oracle-compare.mjs` | Post-retirement visual equivalence check |
| `.local/ma-f4-foundation-qa.mjs` | F4 combined geometry/visual/responsive QA |
| `.local/ma-visual-regression-sweep-02.mjs` | M&A premium visual probes @1440 |

---

## 11. Historical F3/F4 debt record — 2026-09-03

The following severities/closures belong to the historical visual phase and are not current A01–A44 statuses. Current ownership debt is A37 OPEN: Valuation material loads last, parity is deleted, and shared/page/runtime layers still overlap. Historical line counts below are not current measurements.

| Severity | Item | Why not removed |
|---|---|---|
| P0 | ~~Repository/Data Room narrower outer frame~~ | **RESOLVED C.MA-F3** — nested hero gutter removed; duplicate width tokens stripped |
| P0 | ~~`ExecutivePremiumStyle.jsx` runtime stub~~ | **DELETED C.MA-F3** |
| P0 | ~~`maValuationEpsMigrated.css` migration graveyard~~ | **DELETED C.MA-F3** — merged into `maValuationCanonicalParity.css` |
| P0 | ~~`maValuationMaterial.css` C.24.15B–C.24.50 duplicate cascade~~ | **RESOLVED C.MA-F4** — ~4,491 `!important` retired; parity C.MA-F3 is winning owner |
| P1 | `maValuationMaterial.css` (~9,765 lines post-F4, ~1,826 `!important`) | C.24.14D base + C.24.51+ tail; further retirement requires per-rule oracle migration |
| P1 | `maValuationCanonicalParity.css` (~3,805 lines, ~1,208 `!important`) | Rhythm (L1–1409) + C.MA-F3 cascade shields; reduce by retiring upstream conflicts, not import-order wins |
| P2 | `executivePolish.css` attribute flatten | Protected; restoration via workspaceAccent `:not()` guards |
| P2 | `maExecutivePremiumLegacy.css` (~100 `!important`) | Still required for waterfall/cim/buyer/deal-detail non-premium routes |
| P3 | Teal hardcoded in SVG/effects | Valid visualization colors; not theme tokens |

---

## 12. Related documents

- `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md` — business logic source of truth
- `docs/architecture/VISUAL_SYSTEM_CSS_AUDIT.md` — C.24.4 historical audit (superseded for import order by this contract)

---

## 13. Historical foundation v1 freeze evidence (C.MA-FOUNDATION-F4)

**Decision:** `M&A UI FOUNDATION V1 — FROZEN` as of 2026-09-03.

**Recorded freeze gates passed on 2026-09-03:** historical evidence only; not rerun for the current forensic working tree. The visual freeze remains a preservation decision, not functional/security release clearance.

| Gate | Result |
|---|---|
| Desktop geometry @1440/1920 | PASS (256→1404 / 366→1774, width ±0px) |
| Approved visual baseline | PASS (oracle compare + visual sweep — no regressions) |
| Valuation cascade debt reduced | PASS (~7,525 → ~3,034 `!important`, −59.7%) |
| No runtime EPS injection | PASS (`ExecutivePremiumStyle.jsx` deleted) |
| No dead migration CSS files | PASS |
| Build + M&A tests | PASS |
| Tablet/mobile shell | PASS (`.local/shell-responsive-after.json`; no horizontal overflow in F4 QA) |

**Historical post-v1 debt:** F4 recorded the material tail and parity shields. Current parity ownership is retired; remaining material competition is A37. Any future retirement still requires per-rule oracle migration and visual equivalence.

**Do not** reopen foundation for visual redesign; functional M&A work proceeds on frozen physics.
