# CEO's OS / The Sovereign OS — Phase A.1 Cleanup Inventory

**Fecha:** 17 mayo 2026  
**Baseline:** `77965e5` — feat: add clear filters actions to Risk and Reporting enterprise views  
**Estado:** Producción validada. Fase A cerrada. Fase A.1 iniciada.

---

## 1. Estado Git

- `main` = `origin/main` = `77965e5`
- Sin commits pendientes
- Sin WIP
- Ruido local excluido: `backend-server.err`

**Clasificación:** BASELINE + LOCAL NOISE

---

## 2. Principios de limpieza

### No tocar

- auth
- migraciones
- secure share público
- `/dashboard`
- rail de 11 workspaces
- módulos validados en producción
- M&A maduro
- PMI ya validado
- Risk/Reporting filtros ya validados
- Heritage visible
- CSS visual antes de documentar

### Reglas

- no borrado masivo
- no refactor grande
- no CSS global agresivo
- no mover módulos sin grep/import audit
- no tocar migraciones históricas
- cada limpieza debe ser commit atómico
- cada commit debe tener build/test/smoke correspondiente

---

## 3. Hallazgos principales

### P0 — Antes de demo

- `/bridge/marketplace` existe como ruta marketplace/demo y contradice la regla de no abrir Marketplace.
- Debe documentarse como demo-only/internal hasta decidir ocultar, redirigir o aislar.

### P1 — Antes de piloto

- Duplicidad `workspaceConfig` / `routeConfig` / `shellMeta`.
- CSS con uso masivo de `!important` en `workspaceAccent.css` y `executivePolish.css`.
- Rutas sin nav o poco claras:
  - `/bridge/snapshots`
  - `/governance/security-audit`
- Ecosystem APIs paralelas a módulos enterprise.
- Tests raíz `ceos-*.spec.js` fuera del gate e2e principal.

### P2 — Deuda técnica controlada

- `src/modules/ecosystem/pages/EcosystemBranchPage.jsx` huérfano.
- `src/modules/ecosystem/pages/GovernanceESGPage.jsx` huérfano.
- `src/modules/ecosystem/pages/HeritageLegacyPage.jsx` huérfano.
- `CEOOverviewPage.jsx` y `BridgeMarketplacePage.jsx` son monolitos grandes.
- `backend/db/` parece legacy frente a `backend/storage/`.
- Patrón `EntityPage` duplicado en varios módulos.
- Config `constants.js` legacy.

### P3 — Limpieza futura

- scripts Python de marca.
- typo `compilanceFlow.spec.js`.
- consolidación de tablas/heroes CSS.
- limpieza documental histórica.

---

## 4. Ecosystem / Marketplace

**Estado:**

- `/api/ecosystem` sigue siendo útil para Executive Overview / board signals.
- `src/modules/ecosystem` contiene piezas legacy y demo.
- `/bridge/marketplace` debe tratarse como demo/internal, no como producto abierto.
- No eliminar todavía.

**Acciones futuras:**

1. Marcar marketplace como demo-only/internal.
2. Decidir si se oculta de navegación pública.
3. Revisar imports antes de eliminar páginas huérfanas.
4. Mantener `ecosystem_records` hasta definir reemplazo.

---

## 5. Configuración duplicada

**Archivos:**

- `src/app/router/workspaceConfig.jsx`
- `src/app/router/routeConfig.jsx`
- `src/app/layout/shellMeta.js`
- `src/shared/config/workspaceTheme.js`

**Problema:**

- labels, iconos, rutas, títulos y descripciones parcialmente duplicados.

**Acción futura:**

- consolidar gradualmente una fuente de verdad.
- no hacerlo antes de demo si no es necesario.

---

## 6. CSS / Design System

**Archivos:**

- `src/styles/workspaceAccent.css`
- `src/styles/executivePolish.css`
- `src/modules/ma/styles/maExecutiveTheme.css`
- CSS embebido en dashboards y EnterprisePages

**Problemas:**

- muchos `!important`.
- estilos globales que pueden pisar módulos.
- héroes/tablas/toolbars duplicados por rama.
- riesgo alto si se toca antes de demo.

**Regla:**

- no más contratos CSS globales agresivos.
- cambios CSS solo por rama y con smoke visual.

---

## 7. Componentes duplicados

**Candidatos:**

- Enterprise table.
- Filter toolbar.
- Hero.
- EntityPage.
- Empty state.
- Loading state.
- KPI cards.

**Acción futura:**

- documentar primero.
- extraer solo si no cambia visualmente.
- no consolidar antes de que demos estén estables.

---

## 8. Backend / API

**Riesgos:**

- ecosystem API paralela.
- bridge API enterprise vs ecosystem bridge API.
- reports/compliance/reporting con namespaces cercanos.
- controllers/validators requieren revisión posterior.

**No tocar:**

- auth
- multi-tenancy
- organizationId
- storage
- migrationRunner
- secure share

---

## 9. DB / Migraciones

**No tocar:**

- migraciones aplicadas
- tablas enterprise activas
- secure_share_links
- organization_id

**Documentar:**

- `backend/db/` legacy
- `ecosystem_records`
- `bridge_opportunities` marketplace/demo

---

## 10. Tests / Gates

**Gates recomendados:**

| Gate | Comando / checklist |
|------|---------------------|
| Pre-commit | `npm run test:unit` |
| Pre-push | `npm run quality` |
| Pre-deploy | `npm run ci` |
| Pre-demo | Smoke autenticado producción: `/dashboard`, `/pmi/dashboard`, `/risk/register`, `/reporting/library`, `/ma/dashboard`, `/heritage/dashboard` |

**Pendientes:**

- unificar tests `ceos-*` raíz.
- revisar e2e flaky por puerto 4000.
- añadir smoke prod opt-in con `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD`.

---

## 11. Subfases propuestas

### A.1.1 — Documentar inventario

**Estado:** En curso con este documento.  
**Cierre:** Documento creado y commitado.

### A.1.2 — Aislar huérfanos de bajo riesgo

**Candidatos:**

- `EcosystemBranchPage`
- `GovernanceESGPage`
- `HeritageLegacyPage`
- `constants.js` legacy

No borrar sin grep/import audit.

### A.1.3 — Consolidar navegación/meta

**Candidatos:**

- `workspaceConfig`
- `routeConfig`
- `shellMeta`

### A.1.4 — Aislar CSS legacy

No tocar visual validado. Solo análisis y cambios scoped.

### A.1.5 — Marketplace policy

Decidir:

- ocultar
- marcar demo-only
- redirigir
- dejar internal

### A.1.6 — Tests/gates

Normalizar gates y scripts.

### A.1.7 — QA final

Repetir smoke producción.

---

## 12. Próximo paso recomendado

Después de este documento:

1. Commit documental.
2. A.1.2: grep/import audit de páginas ecosystem huérfanas.
3. No borrar todavía.
4. Proponer commit de aislamiento si es seguro.
