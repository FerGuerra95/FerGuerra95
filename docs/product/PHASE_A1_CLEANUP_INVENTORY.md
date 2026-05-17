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

## A.1.2 — Grep / Import Audit de huérfanos legacy

**Fecha:** 17 mayo 2026  
**Estado:** Solo lectura. Sin cambios de código.

### Criterio de interpretación

Estos archivos no se consideran desarrollo pendiente. Se consideran duplicidad legacy/paralela sin uso activo.

No se deben desarrollar dentro de `src/modules/ecosystem/`.

Si alguna idea funcional de estas páginas se quiere recuperar, debe migrarse de forma controlada a la rama enterprise real correspondiente:

- Governance → `src/modules/governance/`
- Heritage → `src/modules/heritage/`
- Ecosystem genérico → revisar solo si aporta algo a Executive Overview o Bridge, no como rama nueva paralela.

### Resultado resumido

| Archivo | Estado | Referencias | Ruta activa | Interpretación | Recomendación |
|---|---|---|---|---|---|
| `src/modules/ecosystem/pages/EcosystemBranchPage.jsx` | Huérfano confirmado | Solo definición propia | No | Página genérica legacy del ecosistema | No desarrollar; archivar o eliminar en fase posterior |
| `src/modules/ecosystem/pages/GovernanceESGPage.jsx` | Huérfano confirmado | Solo definición propia; usa `ecosystem/services/governanceApi.js` | No | Versión legacy/paralela de Governance ESG | No desarrollar aquí; si aporta algo, migrar a `governance/` |
| `src/modules/ecosystem/pages/HeritageLegacyPage.jsx` | Huérfano confirmado | Solo definición propia; usa `ecosystem/services/heritageApi.js` | No | Versión legacy/paralela de Heritage | No desarrollar aquí; si aporta algo, migrar a `heritage/` |
| `src/shared/config/constants.js` | Dead file confirmado | 0 imports; `WORKSPACES` obsoleto; `APP_NAME` sin uso | N/A | Config antigua reemplazada por `workspaceConfig.jsx` | Eliminar en commit atómico posterior |

### Hallazgos

- Ninguno de los tres JSX aparece en `routes.jsx`.
- Ninguno aparece en `routeConfig.jsx`.
- Ninguno aparece en `workspaceConfig.jsx`.
- Ninguno tiene lazy import activo.
- Ninguno aparece en navegación.
- `constants.js` no tiene imports activos.
- `WORKSPACES` canónico vive en `workspaceConfig.jsx`.
- `Sidebar.jsx` y `WorkspaceSwitcher.jsx` usan `workspaceConfig.jsx`, no `constants.js`.
- `CEOOverviewPage.jsx` usa `ecosystemApi.js`, pero no estas páginas huérfanas.
- `BridgeMarketplacePage.jsx` sigue fuera del scope y **NO** debe tocarse todavía.
- `ecosystemApi.js` debe mantenerse porque alimenta Executive Overview / board signals.

### Decisión

No borrar todavía.

Estas páginas se documentan como legacy/huérfanas y se dejan para una fase posterior de limpieza controlada.

### Próxima acción posible

**A.1.2c** — preparar limpieza controlada de archivos huérfanos, solo si Fernando autoriza.

Opciones para A.1.2c:

1. Eliminar archivos huérfanos si no hay imports activos.
2. Moverlos a `_archive` si se quiere conservar histórico.
3. Mantenerlos con cabecera `@deprecated` si se prefiere no borrar todavía.

**Recomendación actual:** No desarrollarlos. Archivar o eliminar en commit separado cuando se apruebe.

### Reglas para A.1.2c

**No tocar:**

- `src/modules/ecosystem/pages/BridgeMarketplacePage.jsx`
- `src/modules/ecosystem/services/ecosystemApi.js`
- `/api/ecosystem`
- `/dashboard`
- `/bridge/marketplace` hasta A.1.5
- rutas enterprise de `governance/` / `heritage/`
- `backend/storage/migrations`
- auth
- secure share público
- rail de 11 workspaces

**Candidatos futuros:**

- `src/modules/ecosystem/pages/EcosystemBranchPage.jsx`
- `src/modules/ecosystem/pages/GovernanceESGPage.jsx`
- `src/modules/ecosystem/pages/HeritageLegacyPage.jsx`
- `src/shared/config/constants.js`
- `src/modules/ecosystem/services/governanceApi.js` solo si no tiene más usos
- `src/modules/ecosystem/services/heritageApi.js` solo si no tiene más usos

---

## A.1.2c–A.1.2e — Cierre de limpieza de huérfanos legacy

**Fecha:** 17 mayo 2026  
**Estado:** Cerrado en remoto.

**Commits:**

- `afe686b` — chore: remove confirmed orphan ecosystem pages and legacy constants
- `3fcace0` — chore: remove unused ecosystem governance and heritage api clients

### Eliminado

| Archivo | Motivo |
|---|---|
| `src/modules/ecosystem/pages/EcosystemBranchPage.jsx` | Página legacy sin ruta ni imports activos |
| `src/modules/ecosystem/pages/GovernanceESGPage.jsx` | Página legacy duplicada frente a governance enterprise |
| `src/modules/ecosystem/pages/HeritageLegacyPage.jsx` | Página legacy duplicada frente a heritage enterprise |
| `src/shared/config/constants.js` | Config antigua sin imports; WORKSPACES real vive en `workspaceConfig.jsx` |
| `src/modules/ecosystem/services/governanceApi.js` | Cliente legacy sin consumidores tras eliminar GovernanceESGPage |
| `src/modules/ecosystem/services/heritageApi.js` | Cliente legacy sin consumidores tras eliminar HeritageLegacyPage |

### Conservado explícitamente

| Archivo | Motivo |
|---|---|
| `src/modules/ecosystem/services/ecosystemApi.js` | Usado por Executive Overview / hub overview |
| `src/modules/ecosystem/services/bridgeApi.js` | Usado por BridgeMarketplacePage; pendiente política A.1.5 |
| `src/modules/ecosystem/pages/BridgeMarketplacePage.jsx` | Fuera de scope A.1.2; pendiente política A.1.5 |

### Validación

- A.1.2c: `npm run test:integration` PASS 53/53.
- A.1.2e: build PASS.
- A.1.2e: unit PASS 106/106.
- A.1.2e: integration PASS 53/53.
- Sin cambios en backend.
- Sin cambios en rutas.
- Sin cambios en CSS.
- Sin cambios en auth.
- Sin cambios en migraciones.
- Sin cambios en secure share.

### Decisión

Fase A.1.2 queda cerrada.

No quedan consumidores activos conocidos de las páginas y services eliminados.

### Siguiente foco recomendado

**A.1.5 — Política `/bridge/marketplace`:**

- mantener como internal
- ocultar
- redirigir
- dejar demo-only
- documentar límites

No tocar CSS ni configs todavía salvo necesidad.

---

## 12. Próximo paso recomendado

Después de A.1.1 y A.1.2:

1. Commit documental de esta sección (A.1.2b).
2. Esperar autorización para A.1.2c (archivar o eliminar huérfanos).
3. No borrar todavía sin commit atómico + build.
4. Continuar A.1.5 (marketplace policy) en paralelo si hace falta antes de limpieza física.
