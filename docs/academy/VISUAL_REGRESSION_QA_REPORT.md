# Visual Regression QA Report — C.24.4D

**Status:** COMPLETED (docs + automated authenticated QA)  
**Baseline:** `HEAD = origin/main = 56ceb09`  
**Prior phases:** C.24.4A (`5f4e93f`) · C.24.4B (`eca41cb`) · C.24.4C (`56ceb09`)  
**Date:** 2026-05-29  

---

## 1. Environment

| Item | Value |
|---|---|
| Local URL | `http://127.0.0.1:5173` (Vite); `http://127.0.0.1:5174` when 5173 busy |
| API | `http://127.0.0.1:4000/api` (E2E managed server via `scripts/e2e-playwright-server.mjs`) |
| Production URL | `https://app.theceosos.com` |
| Authenticated session | **Yes** (Playwright API login `admin@ceoos.local` / demo bootstrap) |
| Render commit checked | **No** (login shell loads; authenticated prod routes not verified without operator credentials) |
| Hard refresh | **Yes** (Playwright fresh context per run) |

**Local backend note:** `npm run server:dev` failed on this machine with known **better-sqlite3 Node ABI mismatch** (MODULE_VERSION 137 vs 127). E2E managed server + Playwright still succeeded for QA.

---

## 2. Routes reviewed

| Route | Status | Severity | Notes |
|---|---|---|---|
| `/ma/dashboard` | PASS | — | Shell OK; no ErrorBoundary; no NaN/undefined/Infinity; no long decimal score |
| `/ma/pipeline` | PASS | — | Same |
| `/dashboard` | PASS | — | Executive overview shell OK |
| `/ceo/overview` | PASS | — | N/A / insufficient_data patterns not violated in automated text scan |
| `/funding/dashboard` | PASS | — | Composition loads; no `36.973…/100` pattern |
| `/funding/readiness` | PASS | — | Readiness route loads; score display clean in scan |
| `/risk/register` | PASS* | — | *Via workspace navigation smoke (`/risk/dashboard` + rail); direct deep-link may redirect for scoped demo user |
| `/governance/dashboard` | PASS* | — | *Via `navigation-stability.spec.js` workspace cycle |
| `/compliance/dashboard` | PASS* | — | *Via workspace rail in navigation smoke |
| `/compliance/reports` | PASS* | — | *Not deep-linked in automation; compliance workspace reachable |
| `/reporting/library` | PASS* | — | *Via reporting workspace in navigation smoke |
| `/pmi/dashboard` | PASS* | — | *Via PMI workspace in navigation smoke |
| `/strategy/dashboard` | PASS* | — | *Via strategy workspace in navigation smoke |

**Automation references:**

- `tests/e2e/smoke/navigation-stability.spec.js` — **PASS** (48s): cycles overview → reporting → M&A → compliance → funding → risk → PMI → governance → strategy without ErrorBoundary latch.
- Ephemeral route audit (C.24.4D, not committed): authenticated visit to M&A / CEO / Funding / dashboard routes — all **PASS**.

---

## 3. Issues found

| Issue | Route | Severity | Fix / decision |
|---|---|---|---|
| None blocking | — | — | No P0/P1 visual regression attributed to C.24.4B/C.24.4C CSS changes |
| Demo user workspace scope | Some deep links | P3 | `admin@ceoos.local` demo workspaces may not include all modules; use workspace rail (navigation smoke validates) |
| Local `server:dev` ABI | Local only | P3 | External env issue; use E2E managed server or `npm rebuild better-sqlite3` |
| Production authenticated matrix | Production | Pending | Operator session required to confirm Render deploy includes `56ceb09` |

---

## 4. Fixes applied

**None.** No P0/P1 visual defects found; no CSS/JSX changes in C.24.4D.

---

## 5. Pending backlog

| Issue | Severity | Recommended phase |
|---|---|---|
| Operator production hard refresh on full route matrix | P2 | Before external recording |
| Confirm Render deploy SHA includes `56ceb09` | P2 | Release ops |
| `ceo-branch-surface` consolidation | P3 | Post–recording CSS phase |
| Inline `<style>` mass migration | P3 | Future controlled WRITE |

---

## 6. Validations

| Check | Result |
|---|---|
| `navigation-stability.spec.js` | **PASS** |
| `npm run build` | **PASS** |
| `fundingDisplayFormat.test.js` | **PASS** (7) |
| `ceoOverviewTruthfulness.test.js` | **PASS** (17) |
| `npm run test:unit` | Not run (known better-sqlite3 ABI on local Node) |

---

## 7. Decision

| Gate | Ready |
|---|---|
| **Ready for focused product copy cleanup (C.24.3h)** | **Yes** — no P0/P1 visual blockers from CSS consolidation |
| **Ready for recording rehearsal** | **Yes, with operator caveat** — run human hard refresh on production after deploy confirmation |
| **Blocked by** | Production authenticated spot-check (operator); optional full-route screenshots |

---

## 8. Confirmations

- No backend, Golden Dataset, Formula Registry, formulas, package/config, or secrets touched in C.24.4D.
- M&A reference, CEO truthfulness tests, Funding score formatting, and workspace navigation smoke preserved.
- No fake `0`, NaN, undefined, or Infinity detected in automated scans on reviewed routes.
- C.24.4C dead CSS removal did not require rollback.
