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

## A.1.5 — Política `/bridge/marketplace`

**Fecha:** 17 mayo 2026  
**Estado:** Documentado. Sin cambios de código.

### Decisión

`/bridge/marketplace` queda congelado como estructura interna futura.

No forma parte del producto enterprise actual, no se muestra en la demo principal y no se desarrolla en esta fase.

### Estado actual

| Elemento | Estado |
|---|---|
| Ruta `/bridge/marketplace` | Activa por URL directa |
| Sidebar | No visible |
| Workspace rail | No visible |
| Navegación principal | No visible |
| Auth | Protegida |
| Producto actual | Fuera del MVP enterprise |
| Demo principal | No se enseña |
| Desarrollo activo | Congelado |
| Futuro posible | Bridge Network / Private Opportunity Layer |

### Interpretación

El Bridge oficial del producto actual es Bridge Enterprise:

- `/bridge/dashboard`
- `/bridge/signals`
- `/bridge/dependencies`
- `/bridge/conflicts`
- `/bridge/attention-queue`
- `/bridge/reports`
- `/bridge/snapshots`

`/bridge/marketplace` no debe interpretarse como una segunda rama Bridge activa.

Se considera una estructura futura para una posible capa posterior:

- Bridge Network
- Private Opportunity Layer
- Strategic Opportunity Desk
- Capital & Counterparty Network

### Qué se puede rescatar en el futuro

Antes de eliminar o desarrollar esta zona, hacer una auditoría de extracción para identificar funciones reutilizables:

- opportunities
- counterparties
- introductions
- documents
- reports
- matching
- controlled opportunity sharing
- audit trail

Solo deben migrarse al Bridge Enterprise si aportan valor como señales internas, trazabilidad, reports o decision support.

### Qué no debe trasladarse ahora

No trasladar ni promover conceptos como:

- Marketplace abierto
- success fee
- red de liquidez
- compraventa abierta
- deal marketplace
- matching externo como producto activo

### Política actual

**Decisión:** `INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK`

**Reglas:**

- No añadir a sidebar.
- No añadir al workspace rail.
- No añadir a navegación principal.
- No usar en demo externa.
- No vender como módulo activo.
- No desarrollar en esta fase.
- No borrar todavía.
- No tocar Bridge Enterprise.
- No tocar backend ni migraciones.
- Mantener como estructura interna futura hasta decisión posterior.

### Decisión futura

Cuando el producto core esté cerrado, se podrá decidir:

1. Migrar funciones útiles a Bridge Enterprise.
2. Convertirlo en Bridge Network / Private Opportunity Layer.
3. Protegerlo con flag, por ejemplo: `VITE_BRIDGE_MARKETPLACE_ENABLED=true`
4. Redirigir `/bridge/marketplace` a `/bridge/dashboard` para pilotos.
5. Eliminar `BridgeMarketplacePage.jsx` y `ecosystem/services/bridgeApi.js` si ya no aportan valor.

### Recomendación

No tocar código ahora.

**Siguiente acción recomendada:**

- continuar limpieza estructural controlada
- no abrir Marketplace
- no tocar CSS/configs todavía
- más adelante hacer "Feature Harvest Audit" de `/bridge/marketplace`

---

## A.1.6 — Tests / Gates / CI

**Fecha:** 18 mayo 2026  
**Estado:** Auditoría solo lectura completada.

### Objetivo

Definir qué validaciones son obligatorias antes de commit, push, deploy y demo, sin modificar todavía tests ni scripts.

### Scripts auditados

| Script | Uso recomendado | Estado |
|---|---|---|
| `npm run build` | build de producción local | Estable |
| `npm run test:unit` | gate pre-commit | Estable |
| `npm run test:integration` | gate pre-push/pre-deploy | Estable |
| `npm run quality` | gate pre-push oficial | Estable |
| `npm run test:e2e` | gate pre-deploy | Útil, pesado, riesgo puerto 4000 |
| `npm run test:e2e:online` | manual / legacy online | No gate automático |
| `npm run test:a11y` | CI / pre-deploy opcional | Estable |
| `npm run test:lighthouse` | CI | Medio/pesado |
| `npm run test:lighthouse:perf` | CI | Medio/pesado |
| `npm run check:bundle-budget` | dentro de quality | Estable |

### Gates oficiales recomendados

| Momento | Comando | Obligatorio | Motivo |
|---|---|---|---|
| Pre-commit | `npm run test:unit` | Sí | Rápido, sin puertos, alta señal |
| Pre-push | `npm run quality` | Sí | build + budget + unit + integration |
| Pre-deploy | `npm run quality && npm run test:e2e` | Sí | validación UI local completa |
| Pre-demo | smoke producción autenticado | Sí | valida app real antes de enseñar |
| CI remoto | GitHub Actions quality + e2e/a11y/lighthouse | Sí | control automático en main/PR |
| Semanal | `browser-smoke-weekly.yml` | Opcional | cobertura adicional browsers |

### Smoke producción autenticado

Antes de demo externa, revisar en producción:

- `/dashboard`
- `/pmi/dashboard`
- `/risk/register`
- `/reporting/library`
- `/ma/dashboard`
- `/heritage/dashboard`

Comprobar:

- login correcto
- rail 11 workspaces
- Heritage visible
- sidebar scroll
- PMI sin tablas pisadas
- Risk/Reporting con Limpiar filtros
- sin errores JS críticos
- sin 500
- sin NaN / undefined / Infinity

### Riesgos detectados

- EADDRINUSE en puerto 4000 si hay procesos node/Playwright activos.
- `tests/ceos-*.spec.js` están fuera del gate principal.
- `test:e2e:online` no debe usarse como gate automático.
- CI e2e/a11y/lighthouse puede fallar por entorno o thresholds.
- No existe lint script.
- Smoke hubs local no cubre todas las ramas enterprise.
- `/bridge/marketplace` queda fuera de tests por política `INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK`.

### Mejoras futuras A.1.6b+

No aplicar todavía. Solo planificar:

1. Crear script `test:smoke` para smoke local ligero.
2. Crear script prod smoke opt-in con `CEOS_BASE_URL`.
3. Documentar cómo liberar puerto 4000.
4. Unificar o archivar `tests/ceos-*.spec.js`.
5. Renombrar `compilanceFlow.spec.js`.
6. Extender authenticated-hubs a Governance, Heritage, Bridge, Risk, Reporting y Strategy.
7. Evaluar ESLint como gate futuro.
8. No añadir tests de `/bridge/marketplace` hasta decidir harvest/futuro.

### Decisión

A.1.6 queda como auditoría de gates.

No se modifican tests ni scripts en esta subfase.

La prioridad siguiente será decidir si se implementa A.1.6b o si se pasa a A.1.3 configs duplicadas.

---

## A.1.3 — Configs duplicadas / navegación / metadatos

**Fecha:** 18 mayo 2026  
**Estado:** Auditoría solo lectura completada.

### Objetivo

Revisar duplicidades e incoherencias entre navegación, workspaces, títulos, temas y metadatos sin modificar código.

### Archivos auditados

| Archivo | Responsabilidad |
|---|---|
| `src/app/router/workspaceConfig.jsx` | Catálogo de workspaces, orden del rail, rutas principales, resolución por pathname |
| `src/app/router/routeConfig.jsx` | Sidebar, routeGroups y pageMetaMap |
| `src/app/layout/shellMeta.js` | Títulos y descripción del Topbar |
| `src/shared/config/workspaceTheme.js` | Colores/acento por workspace |
| `src/shared/hooks/useWorkspaceTheme.js` | Puente pathname → tema |
| `src/app/layout/Sidebar.jsx` | Render del sidebar, orden, scroll |
| `src/app/layout/WorkspaceSwitcher.jsx` | Rail horizontal de 11 workspaces |
| `src/app/layout/Topbar.jsx` | Presentación de título/descripcion |
| `src/app/layout/AppShell.jsx` | Orquestación layout/theme/meta |

### Resultado

Los 11 workspaces están alineados entre:

- `WORKSPACES`
- `routeGroups`
- `WORKSPACE_THEMES`
- `WORKSPACE_SHELL_TITLES`

No se detectaron workspaces huérfanos ni workspaces sin theme.

Heritage está correctamente visible.

`/bridge/marketplace` sigue fuera del sidebar/rail/nav, coherente con A.1.5.

### Duplicidades detectadas

| Dato | Aparece en | Riesgo |
|---|---|---|
| Orden de workspaces | `WORKSPACE_ORDER` y `SIDEBAR_GROUP_ORDER` | Drift si se edita uno solo |
| Keys de workspaces | `WORKSPACES`, `routeGroups`, `WORKSPACE_THEMES`, `WORKSPACE_SHELL_TITLES` | Requiere test de paridad |
| Título de rama | workspace label/title/sidebarLabel y shellMeta | Diferencias de copy visibles |
| Iconos | `WORKSPACES.icon` y `routeGroups.items.icon` | Duplicidad visual |
| Rutas principales | `workspace.path` y primer item routeGroups | Riesgo bajo |
| Metadata de rutas | pageMetaMap parcial | Algunas rutas profundas caen a descripción del workspace |

### Rutas sin navegación principal

Rutas activas sin nav visible:

- `/bridge/marketplace`
- `/bridge/snapshots`
- `/governance/security-audit`
- `/pmi/day1`
- `/pmi/transition-services`
- `/pmi/operating-model`
- `/pmi/people-culture`
- `/pmi/technology`
- `/ma/deal/:dealId`
- aliases overview: `/overview` y `/ceo/overview`

**Interpretación:**

- `/bridge/marketplace`: correcto por política A.1.5.
- aliases overview: correcto.
- rutas `:id`: correcto como deep links.
- PMI extendidas y `governance/security-audit`: documentar, no tocar todavía.

### Rutas sin pageMeta exacta

- `/bridge/snapshots`
- `/bridge/marketplace`
- `/pmi/day1`
- rutas PMI extendidas
- `/ma/deal/:dealId`

**Impacto:**

Bajo. Topbar cae a descripción del workspace.

### Riesgos

**P0 — No tocar ahora:**

- orden del rail
- rutas principales
- AppShell / Topbar / Sidebar / WorkspaceSwitcher
- workspaceTheme colors
- `/dashboard` y aliases
- `/bridge/marketplace`
- Heritage visible

**P1 — Consolidación posible:**

- derivar `SIDEBAR_GROUP_ORDER` desde `WORKSPACE_ORDER`
- añadir tests unitarios de paridad entre configs
- documentar mapping de shellTitle / title / label

**P2 — Posponer:**

- derivar shell titles desde workspaceConfig
- unificar iconos
- añadir pageMeta a rutas profundas
- refactor routeGroups

### Propuesta A.1.3b

Consolidación mínima segura, solo si Fernando autoriza:

1. Importar `WORKSPACE_ORDER` en `Sidebar.jsx` y usarlo como base de `SIDEBAR_GROUP_ORDER`.
2. Añadir test unitario de paridad:
   - `WORKSPACES` keys
   - `routeGroups` keys
   - `WORKSPACE_THEMES` keys
   - `WORKSPACE_SHELL_TITLES` keys
   - `workspace.path` existe en `routeGroups[key].items`
3. No cambiar labels.
4. No cambiar orden.
5. No cambiar rutas.
6. No cambiar CSS.
7. No tocar `/bridge/marketplace`.

**Validación necesaria si se aplica:**

- `npm run test:unit`
- `npm run build`
- workspace-switcher e2e
- smoke visual sidebar/rail

### Decisión

A.1.3 queda como auditoría documentada.

No se modifica código en esta subfase.

### A.1.3b — Cierre de consolidación mínima

**Fecha:** 18 mayo 2026  
**Estado:** Cerrado en remoto.

**Commit:** `4a9a9df` — chore: derive sidebar group order from workspace order

### Cambios aplicados

| Archivo | Cambio |
|---|---|
| `src/app/layout/Sidebar.jsx` | `SIDEBAR_GROUP_ORDER` deriva desde `WORKSPACE_ORDER`; eliminado array literal duplicado |
| `tests/unit/app/workspaceConfigParity.test.js` | Nuevo test de paridad entre workspaces, routeGroups, themes y shell titles |

### Validación

- `npm rebuild better-sqlite3` PASS.
- `npm run quality` PASS.
- build OK.
- bundle budget OK.
- unit PASS — 30 archivos / 113 tests.
- integration PASS — 19 archivos / 53 tests.

### Decisión

A.1.3b queda cerrado.

La fuente de verdad del orden del rail y sidebar pasa a ser `WORKSPACE_ORDER`.

No hubo cambios visuales, rutas, labels, títulos, CSS ni backend.

### Pendientes relacionados

- No derivar todavía shell titles desde workspaceConfig.
- No unificar iconos de routeGroups.
- No tocar pageMetaMap de rutas profundas.
- No tocar CSS.
- No tocar `/bridge/marketplace`.

### Siguiente foco recomendado

A.1.4 — Auditoría CSS legacy solo lectura (completada; ver sección A.1.4).

---

## A.1.4 — Auditoría CSS legacy / design system

**Fecha:** 18 mayo 2026  
**Estado:** Auditoría solo lectura completada.

### Objetivo

Auditar el sistema CSS actual para detectar riesgos visuales, duplicidades, selectores globales peligrosos, uso de `!important`, CSS embebido y posibles zonas que no deben tocarse antes de demo.

### Mapa de capas CSS

Orden de carga global en `src/main.jsx`: `styles.css` → `maExecutiveTheme.css` → `executivePolish.css` → `workspaceAccent.css`.

| Capa | Archivo / origen | Propósito | Riesgo |
|---|---|---|---|
| L0 | `src/styles.css` | Tokens, reset, base global, `.page`, `.card`, `.table` | Medio |
| L1 | `src/modules/ma/styles/maExecutiveTheme.css` | Tema M&A acotado por clases M&A | Medio-bajo |
| L2 | `src/styles/executivePolish.css` | Polish enterprise global, flatten visual, cards/panels/heroes | P0 |
| L3 | `src/styles/workspaceAccent.css` | Acentos por workspace, shell, tablas, heroes | P0–P1 |
| L4 | `AppShell` / `Sidebar` / `Topbar` / `WorkspaceSwitcher` runtime styles | Layout shell, scroll, overflow | P0 |
| L5 | `ExecutivePremiumStyle.jsx` | Premium M&A runtime layer (inyectado en AppShell) | P0 |
| L6 | `*EnterpriseComponents.jsx` | CSS por módulo para heroes, panels, toolbars y tablas | P2 |
| L7 | CSS embebido en páginas | Layout fino por dashboard/página | P1–P2 |

**Conteo aproximado:** ~725 usos de `!important` en `src/`. Principales fuentes: `executivePolish.css` (~187), `ExecutivePremiumStyle.jsx` (~118), `workspaceAccent.css` (~108).

**Bloques embebidos grandes (sin cambiar en demo):** `FundingDashboardPage` (~785 líneas), `PMIDashboardPage` (~753 líneas), más CSS embebido M&A y Compliance con muchos `!important`.

### Hallazgo principal

El sistema visual actual funciona, pero es frágil. Está compuesto por varias capas globales y muchas reglas con `!important`. Cambiar CSS global antes de demo puede romper visualmente workspaces ya validados.

### Riesgos P0 — No tocar ahora

- `executivePolish.css` con selectores globales:
  - `.card`
  - `[class*="card"]`
  - `[class*="panel"]`
  - `[class*="hero"]`
  - `[class*="kpi"]`
- `workspaceAccent.css` en acentos shell y variables `--ws-*`.
- `ExecutivePremiumStyle.jsx` y stack M&A.
- `AppShell`, `Topbar`, `Sidebar`, `WorkspaceSwitcher`.
- `CEOOverviewPage.jsx` y reglas `data-workspace='overview'`.
- Orden de imports en `src/main.jsx`.
- Reglas PMI de tablas/overflow.
- Risk/Reporting filtros validados.
- Heritage visible y estable.
- `/bridge/marketplace` congelado (A.1.5).

### Riesgos P1 — Mejoras con cuidado

- Triple/cuádruple stack M&A:
  - `maExecutiveTheme`
  - `executivePolish`
  - `ExecutivePremiumStyle`
  - CSS embebido por página
- Doble sistema de tablas:
  - `.table` legacy
  - `ceos-enterprise-table`
  - tablas nativas por módulo
- Bloques CSS embebidos grandes:
  - Funding dashboard
  - PMI dashboard
  - DealPipeline
  - Compliance Suppliers
- `.page { gap: ... !important }`
- Sticky headers de tablas legacy

### Deuda P2 / P3

- `*EnterpriseComponents` con patrones CSS parecidos (Bridge, Governance, PMI, Risk, Reporting, Heritage, Strategy).
- Empty states, badges y panels duplicados.
- CSS de exports HTML (`fundingExportApi`, `complianceReportsApi`).
- Landing pública aislada (`LandingPage.jsx`).
- `styles.css` con primitivas legacy todavía activas (solo 2 `!important`; bajo riesgo de override).

### Política CSS desde esta auditoría

No tocar CSS global antes de demo salvo fallo crítico.

Cualquier limpieza futura debe cumplir:

1. Ser por módulo.
2. No cambiar visual intencionadamente.
3. No cambiar tokens `--ws-*`.
4. No tocar shell.
5. No tocar Executive Overview.
6. No tocar M&A global.
7. No tocar Risk/Reporting filtros.
8. No tocar PMI tablas sin smoke específico.
9. Requiere `npm run quality`.
10. Requiere smoke visual por workspace afectado.

### Candidatos futuros post-demo

- Extraer `fundingDashboardCss` a archivo CSS del módulo.
- Extraer `pmiDashboardCss` a archivo CSS del módulo.
- Extraer CSS embebido M&A por página a archivos scoped.
- Crear contrato visual `ceos-enterprise-table`.
- Documentar cuándo usar `.table` legacy vs `ceos-enterprise-table`.
- Crear componente shared `EnterpriseEmpty`.
- Crear tokens de design system, sin cambiar valores iniciales.
- Evaluar reducción gradual de `executivePolish.css` (scope bajo `.ceos-authenticated`, no global).

### Propuesta A.1.4b futura

**No hacer ahora.**

Si se autoriza después de demo:

**A.1.4b — CSS cleanup mínimo seguro**

Reglas:

- mover CSS embebido a archivos por módulo sin cambiar selectores ni valores
- un workspace por commit
- no tocar shell
- no tocar Overview
- no tocar M&A global
- no tocar variables de workspace
- smoke visual obligatorio

### Validación necesaria si se toca CSS

- `npm run quality`
- e2e workspace-switcher
- smoke manual:
  - `/dashboard`
  - `/ma/dashboard`
  - `/funding/dashboard`
  - `/pmi/dashboard`
  - `/risk/register`
  - `/reporting/library`
  - `/heritage/dashboard`
- verificar sin NaN / undefined / Infinity
- verificar sin scroll horizontal global
- verificar que rail/sidebar/topbar no cambian

### Decisión

A.1.4 queda como auditoría documentada.

No se modifica CSS en esta subfase.

El sistema visual queda congelado hasta que se decida una limpieza modular posterior (A.1.4b, solo post-demo y con autorización explícita).

---

## 12. Próximo paso recomendado

Después de A.1.1 y A.1.2:

1. Commit documental de esta sección (A.1.2b).
2. Esperar autorización para A.1.2c (archivar o eliminar huérfanos).
3. No borrar todavía sin commit atómico + build.
4. Continuar A.1.5 (marketplace policy) en paralelo si hace falta antes de limpieza física.

---

## B.1 — Smoke producción / demo readiness

**Fecha:** 18 mayo 2026  
**Estado:** Cerrado.

### Objetivo

Validar producción real antes de abrir nuevas fases de refactor, CSS o funcionalidad.

### Baseline validado

- `HEAD = origin/main = 2924a0d`
- Target: `https://app.theceosos.com`
- Health app: PASS
- Health theceosos: PASS
- Health Render: PASS
- Smoke autenticado: PASS

### Rutas críticas validadas

| Ruta | Resultado |
|---|---|
| `/dashboard` | PASS — Executive Command Center carga |
| `/pmi/dashboard` | PASS — PMI & Synergies Command Center carga |
| `/risk/register` | PASS — Enterprise risk register carga |
| `/reporting/library` | PASS — Report library carga |
| `/ma/dashboard` | PASS — Private M&A Intelligence carga |
| `/heritage/dashboard` | PASS — Owner continuity command center carga |

### Checks específicos

| Check | Resultado |
|---|---|
| Login producción | PASS |
| Rail 11 workspaces | PASS |
| Heritage visible en rail/sidebar | PASS |
| Sidebar scroll | PASS |
| PMI tablas / overflow | PASS |
| Risk “Limpiar filtros” | PASS |
| Reporting “Limpiar filtros” | PASS |
| Errores JS críticos | Ninguno |
| Errores 500 | Ninguno |
| 401 inesperados post-login | Ninguno |
| NaN / undefined / Infinity visibles | Ninguno |
| `/bridge/marketplace` fuera de nav | PASS |

### Nota sobre `/bridge/marketplace`

`/bridge/marketplace` sigue accesible por URL directa con sesión, pero no aparece en rail ni sidebar.

Esto es coherente con la política A.1.5:

`INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK`

No se validó ni se promocionó su contenido.

### Decisión

Producción queda validada para demo interna/externa en las 6 rutas críticas.

No se abre A.1.4b ni limpieza CSS pre-demo.

El sistema visual queda congelado según A.1.4.

### Siguiente fase recomendada

**Fase C — Auditoría funcional por ramas.**

Objetivo:

Determinar por cada workspace:

- qué funciona realmente
- qué es solo visual
- qué endpoints usa
- qué datos necesita
- qué tests tiene
- qué se puede enseñar
- qué se puede vender
- qué no debe entrar en demo

---

## C.1 — Auditoría funcional Executive Overview

**Fecha:** 18 mayo 2026  
**Estado:** Auditoría solo lectura completada.

### Veredicto

Executive Overview funciona y está demo-ready como Command Center.

Debe presentarse como:

- DSS
- decision-support
- capa ejecutiva de lectura transversal
- sistema con revisión humana

No debe venderse todavía como:

- tiempo real 100% unificado
- motor autónomo de decisión
- fuente única certificada de todos los módulos

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/dashboard` | Canónica, protegida, con navegación |
| `/overview` | Alias coherente |
| `/ceo/overview` | Alias coherente |

Workspace key:

`overview`

Topbar:

`Executive Command Center`

### Archivos principales auditados

| Área | Archivos |
|---|---|
| Página | `CEOOverviewPage.jsx`, `ExecutiveOverviewer.jsx` |
| Componentes | ReadinessIndexCard, ExecutiveModuleCard, ExecutiveSignalFeed, DecisionQueuePanel, BoardViewSnapshot, ExecutiveAlertsPanel, ExecutiveCalendarPanel, CorporateHealthRadar, BoardPackModal |
| Frontend services | `executiveApi.js`, `boardPackApi.js` |
| Backend | executive routes/controllers/services |
| Migración | `020_executive_command_center.sql` |
| Tests | e2e ceo overview, integration executive command center, unit executive metrics |

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | Validado en producción B.1 |
| Demo readiness | Cerrado | `/dashboard` validado |
| Datos reales | Parcial | Backend real + fallbacks/cálculos cliente |
| Backend | Parcial | Agregador executive existe, Heritage no entra completo |
| Multi-tenant | Parcial | APIs con organizationId, stores cliente pueden mezclar estado |
| Tests | Parcial | Buen backend; E2E UI limitado |
| Venta readiness | Parcial | Vendible como DSS con límites |
| Enterprise readiness | Parcial | Faltan veracidad y estados error/empty más explícitos |

### Fortalezas

- Buena puerta de entrada a los 11 workspaces.
- Backend enterprise real en `/api/executive/overview`.
- Servicios de readiness, signals, decision queue, board view, calendar y reports.
- Migración dedicada executive command center.
- Tests unitarios, integración y e2e existentes.
- Sin P0 detectados.
- Producción validada en B.1.

### Gaps P1

- Board packs aparecen como “Ready” sin verificar siempre generación real.
- Doble radar: hero cliente vs enterprise API.
- Reporting puede aparecer con fallback.
- Heritage visible en UI pero no está integrado en el agregador backend executive.
- Governance/Heritage dependen de ecosystem hub, no de módulos enterprise dedicados.
- Errores de API silenciados.
- Riesgo de narrativa “real time” si hay módulos sin datos reales.

### Gaps P2

- `CEOOverviewPage.jsx` es monolítico.
- KPIs estáticos como “Closing” / “7 + Overview”.
- No existe carpeta `utils/`; helpers están inline.
- `executiveApi.js` tiene endpoints expuestos no usados directamente en la página.
- Falta contrato claro de hub-brief por rama.

### Gaps P3

- Unificar fuentes de radar/scores.
- E2E de board pack generation.
- Tests de permisos viewer/admin/board_member.
- Datos demo transversales más sólidos.

### Decisión demo

Executive Overview se puede enseñar en demo.

Narrativa recomendada:

“Executive Overview es la capa de lectura ejecutiva que consolida señales del sistema y ayuda a priorizar decisiones. Es un DSS con revisión humana, no un motor autónomo ni una promesa de tiempo real absoluto.”

### No tocar ahora

- Visual de `/dashboard`
- CSS de Overview
- AppShell
- Topbar
- Sidebar
- workspace accents
- executivePolish
- rutas `/dashboard`, `/overview`, `/ceo/overview`

### Recomendación

Usar Overview como hub de demo.

Antes de piloto/venta enterprise:

1. Alinear Heritage en agregador backend executive.
2. Alinear Reporting sin fallback ambiguo.
3. Hacer estados error/empty más honestos.
4. Verificar board pack generation.
5. Añadir tests E2E de board pack y permisos.
6. Crear datos demo transversales reales.

### Próxima subfase

**C.2 — Auditoría funcional M&A.**

---

## C.2 — Auditoría funcional M&A

**Fecha:** 18 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

M&A sigue cerrada, intacta y demo-ready como rama premium.

Se puede presentar como:

- M&A Intelligence workspace
- Decision Support System
- workspace privado de análisis, valoración, pipeline, data room y reporting
- herramienta con revisión humana

No debe venderse todavía como:

- asesoramiento financiero
- asesoramiento legal
- fairness opinion
- valoración certificada
- SaaS enterprise M&A completo sin límites

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/ma/dashboard` | OK — validada en producción B.1 |
| `/ma/valuation` | OK |
| `/ma/pipeline` | OK |
| `/ma/waterfall` | OK |
| `/ma/matching` | OK |
| `/ma/cim` | OK |
| `/ma/deals` | OK |
| `/ma/data-room` | OK |
| `/ma/deal/:dealId` | OK como deep link |
| `/ma/secure-share` | OK como ruta pública tokenizada |

**Workspace key:** `ma`

**Topbar:** `M&A`

### Fortalezas

- Rama visualmente cerrada y estable.
- Backend enterprise sólido en cases, deals, reports, data room, secure share y audit.
- Secure share público y autenticado bien separados.
- Data room con governance y audit.
- Reports/export con disclaimers DSS.
- Tests backend/integration fuertes.
- E2E cubre rutas principales y secure share público.
- No afectada por la limpieza A.1.2.
- Demo readiness cerrado.

### Backend / datos reales

M&A tiene backend real para:

- cases
- deals
- reports
- secure shares
- data room
- audit logs

También tiene motores cliente para:

- valuation
- waterfall
- matching
- scoring
- report building

### Demo / datos calculados

La rama mezcla:

- datos reales persistidos
- cálculos en cliente
- demo data explícita en valuation, pipeline y deal detail

Esto es aceptable para demo si se explica correctamente, pero debe limpiarse o etiquetarse mejor antes de piloto enterprise.

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | No tocar CSS M&A |
| Datos reales | Parcial | Backend real + engine cliente + demo data |
| Backend | Parcial / maduro | Cases, deals, VDR, reports, share sólidos |
| Multi-tenant | Parcial | Backend probado; revisar store/local edge cases |
| Permisos | Parcial | API granular; validar UX viewer |
| Secure share | Parcial / sólido | Público y autenticado separados |
| Reports / export | Parcial | HTML cliente + persistencia API |
| Data room | Parcial / sólido | Governance y audit |
| Tests | Parcial | Backend fuerte, E2E UI parcial |
| Demo readiness | Cerrado | Rama estrella de demo |
| Venta readiness | Parcial | Vendible como piloto DSS |
| Enterprise readiness | Parcial | Faltan P1/P2 |

### Gaps P0

Ninguno detectado.

### Gaps P1

- `demoData.js` aparece en valuation, pipeline y deal detail.
- Riesgo de mezcla demo/real en demo comercial.
- `maApi.test.js` es placeholder sin assertions reales.
- Viewer read-only debe validarse mejor en UI.
- Valoración se ejecuta principalmente en engine cliente frente a `POST /ma/valuation/run`.
- Reforzar narrativa: no advisory, no legal opinion, no fairness opinion.

### Gaps P2

- Páginas monolíticas y CSS embebido masivo.
- Pipeline dual: demo + backend.
- `/ma/deal/:dealId` sin pageMeta dedicado.
- Falta E2E completo de export/share/data room upload.
- Falta test UI de permisos viewer.

### Gaps P3

- Consolidar tests legacy `ceos-ma-*`.
- PDF/server-side export futuro.
- Mejorar deep link metadata.
- Datos demo org reales para reducir dependencia de seeds.

### Decisión demo

M&A se puede enseñar como rama premium.

**Recorrido recomendado:**

1. `/ma/dashboard`
2. `/ma/valuation`
3. `/ma/pipeline`
4. `/ma/cim`
5. `/ma/data-room`
6. secure share controlado si procede

**Narrativa recomendada:**

“M&A Intelligence es un workspace privado de soporte a la decisión. Consolida valoración, pipeline, data room, reporting y trazabilidad, siempre sujeto a revisión humana. No sustituye asesoramiento financiero, legal ni una fairness opinion.”

### Antes de piloto

**Prioridades:**

1. Poblar organización con 2–3 `ma_cases` reales.
2. Crear deals reales en pipeline.
3. Añadir 1 documento real en data room.
4. Generar 1 report exportado real.
5. Etiquetar claramente demo data.
6. Convertir `maApi.test.js` en test real.
7. Validar viewer UX.
8. Reforzar disclaimers de human review / DSS.

### No tocar ahora

- Visual M&A.
- `maExecutiveTheme.css`.
- `ExecutivePremiumStyle`.
- CSS embebido M&A.
- Rutas M&A.
- Shell / AppShell / Sidebar / Topbar.
- Orden workspace.
- Secure share si no hay P0.
- Data room si no hay P0.

### Recomendación

Mantener M&A congelada en código.

Usarla como rama principal de demo/piloto, pero con narrativa DSS y human review.

No abrir refactor M&A antes de completar la auditoría funcional del resto de ramas.

### Próxima subfase

Después de documentar C.2:

- actualizar Roadmap Enterprise de robustez/certificación
- o continuar **C.3 — Auditoría funcional Compliance**

---

## Roadmap enterprise — Organización, limpieza, robustez y certificación

**Fecha:** 18 mayo 2026

**Estado:** Roadmap actualizado tras A.1, B.1, C.1 y C.2.

### Objetivo

Convertir CEO's OS / The Sovereign OS desde una plataforma demo-ready en un producto enterprise robusto, coherente, auditable y vendible para pilotos con empresas grandes o multinacionales.

Esta fase no consiste en añadir más pantallas, sino en asegurar:

- coherencia funcional
- veracidad de datos
- seguridad
- multi-tenancy
- permisos
- trazabilidad
- QA estricto
- documentación legal/comercial
- preparación para vendor due diligence
- preparación para certificación futura

### Estado actual

| Área | Estado |
|---|---|
| Producción | Validada para demo en rutas críticas |
| Visual | Congelado pre-demo |
| Limpieza legacy | Cerrada en A.1.2 |
| Configs | Auditadas y consolidación mínima cerrada |
| CSS | Auditado, no tocar antes de demo |
| Tests/gates | Documentados |
| Executive Overview | Demo-ready, venta enterprise parcial |
| M&A | Demo-ready, piloto DSS parcial, sin P0 |
| Bridge Marketplace | Congelado como future private network |

### Principio rector

No abrir nuevas funcionalidades premium ni tocar CSS global hasta completar:

1. auditoría funcional por ramas
2. matriz real vs visual
3. datos demo enterprise reales
4. product truthfulness
5. hardening de seguridad y multi-tenant
6. QA enterprise
7. paquete legal/compliance
8. empaquetado de piloto enterprise

---

### FASE C — Auditoría funcional por ramas

**Objetivo:** Saber exactamente qué funciona realmente, qué es visual, qué es parcial y qué se puede vender.

**Estado:**

| Subfase | Rama | Estado | Objetivo |
|---|---|---|---|
| C.1 | Executive Overview | Cerrada | Demo hub DSS / human review |
| C.2 | M&A | Cerrada | M&A Intelligence / DSS, demo-ready sin P0 |
| C.3 | Compliance | Pendiente | Auditar suppliers, evidence, reviews, reports, alerts |
| C.4 | Funding | Pendiente | Auditar rounds, scenarios, data room, readiness, bridge |
| C.5 | Governance | Pendiente | Auditar decisions, board packs, audit trail |
| C.6 | PMI | Pendiente | Auditar synergies, milestones, risks, workstreams |
| C.7 | Bridge | Pendiente | Auditar signals, dependencies, conflicts, reports, snapshots |
| C.8 | Risk | Pendiente | Auditar register, scoring, filters, reports |
| C.9 | Reporting | Pendiente | Auditar library, templates, board pack, exports |
| C.10 | Strategy | Pendiente | Auditar objectives, initiatives, roadmap |
| C.11 | Heritage | Pendiente | Auditar continuity, assets, succession, governance familiar |
| C.12 | Informe global | Pendiente | Matriz real / parcial / visual / vendible / enterprise-ready |

**Por cada rama documentar:**

- rutas
- backend real
- endpoints
- datos
- fallbacks
- tests
- multi-tenant
- permisos
- demo readiness
- venta readiness
- enterprise readiness
- P0/P1/P2/P3

---

### FASE D — Datos demo enterprise reales

**Objetivo:** Crear una demo transversal coherente, no solo pantallas vacías.

**Casos demo recomendados:**

- empresa industrial rentable
- SaaS en crecimiento
- empresa familiar con sucesión
- proveedor crítico con riesgo compliance
- ronda funding con escenarios
- operación M&A con valuation y report
- PMI post-adquisición
- board/reporting pack
- risk register con riesgos reales
- strategy roadmap
- heritage continuity case

**Criterio:** Los datos deben alimentar varios módulos a la vez, no vivir aislados.

---

### FASE E — Product truthfulness / veracidad del producto

**Objetivo:** Eliminar o corregir todo lo que parezca más real de lo que es.

**Acciones:**

- diferenciar dato real, calculado, fallback y pendiente
- eliminar "Ready" si no hay generación real
- mostrar estados empty/error honestos
- evitar narrativa "real time" si no todo es backend real
- alinear Reporting y Heritage en agregador ejecutivo
- verificar board pack generation
- reducir fallbacks silenciosos
- documentar disclaimers de DSS y human review
- etiquetar demo data cuando no sea dato real de organización

**Regla:** No vender una señal, score, report o board pack como real si no está respaldado por datos y prueba.

---

### FASE F — Security, permisos y multi-tenant hardening

**Objetivo:** Preparar el producto para revisión enterprise y vendor due diligence.

**Acciones:**

- matriz de permisos por módulo
- tests admin / user / viewer / board_member
- tests de multi-tenant isolation por módulo
- audit logs visibles/exportables
- backup/restore probado
- secret management
- security headers
- rate limiting donde aplique
- revisión endpoints públicos
- revisión de errores sin stack traces
- evidencias de access control

**Criterio:** Ningún dato de negocio debe poder cruzar `organizationId`.

---

### FASE G — QA enterprise / test strictness

**Objetivo:** Elevar los gates actuales a nivel enterprise.

**Base actual:**

- pre-commit: `npm run test:unit`
- pre-push: `npm run quality`
- pre-deploy: `npm run quality && npm run test:e2e`
- pre-demo: smoke producción autenticado

**Mejoras futuras:**

- ESLint
- dependency audit formal
- smoke producción opt-in automatizado
- visual regression screenshots por workspace
- tests de deep links
- tests de board pack generation
- tests de exports/reports
- tests de permisos
- tests de multi-tenant
- resolver o archivar tests legacy `ceos-*`
- reducir flakiness puerto 4000

---

### FASE H — Legal, compliance, DPA, SLA y AI governance

**Objetivo:** Preparar paquete legal y de confianza para cliente enterprise.

**Documentos necesarios:**

- DPA
- privacy policy
- terms of service
- subprocessors list
- retention policy
- deletion policy
- incident response policy
- security overview
- SLA draft
- backup policy
- human review policy
- AI governance note
- AI system inventory
- output disclaimer
- data provenance policy

**AI governance:** CEO's OS debe posicionarse como:

- Decision Support System
- Human reviewed
- No autonomous decision-making

**No como:**

- IA que decide por la empresa
- fuente única certificada sin revisión
- scoring crítico opaco

---

### FASE I — Enterprise pilot packaging

**Objetivo:** Convertir la plataforma en oferta vendible para piloto 30-60-90.

**Paquetes necesarios:**

- enterprise sales deck
- trust & security pack
- architecture overview
- data flow diagram
- pilot plan 30-60-90
- demo script
- board pack sample
- M&A pilot sample
- Compliance/Risk sample
- Funding Readiness sample
- pricing / packaging
- onboarding checklist
- human review statement

**Criterio:** Vender primero piloto controlado, no SaaS enterprise completo.

---

### FASE J — Premium AI features

**Objetivo:** Incorporar funciones premium una por una, después de cerrar core, seguridad y veracidad.

**Funciones futuras ya identificadas:**

1. M&A Blind Teaser Generator
2. Compliance Whistleblowing Engine
3. Funding Liquidation Preference Stress Tester
4. Governance Minute Generator
5. PMI Key Talent Retention Map
6. Risk D&O Underwriting Pack
7. Strategy Competitor Regulatory Radar
8. Heritage Family Constitution Validator

**Regla:**

- No implementar las 8 juntas.
- No mezclar ramas.
- No abrir Whistleblowing sin seguridad/legal/rate limit.
- No vender IA como decisión autónoma.

---

### FASE K — Bridge Network / Private Opportunity Layer

**Objetivo:** Mantener Bridge Marketplace congelado como estructura futura.

**Estado actual:**

- `/bridge/marketplace` existe por URL directa
- no aparece en sidebar
- no aparece en rail
- no se enseña en demo principal
- no forma parte del MVP enterprise
- política: `INTERNAL_UNLISTED_DEMO` / `FUTURE_PRIVATE_NETWORK`

**Futuro posible:**

- Bridge Network
- Private Opportunity Layer
- Strategic Opportunity Desk
- Capital & Counterparty Network

**Regla:**

- No desarrollar ahora.
- No vender ahora.
- No mezclar con Bridge Enterprise principal.

---

### Criterio de vendibilidad a multinacional

**Para demo:**

- producción validada
- rutas críticas OK
- narrativa DSS / human review

**Para piloto:**

- Fase C completa
- Fase D datos demo reales
- Fase E product truthfulness
- legal mínimo
- security overview
- pilot plan 30-60-90

**Para venta enterprise formal:**

- Fase F security hardening
- Fase G QA enterprise
- Fase H legal/compliance
- audit logs/exportables
- backup/restore probado
- permisos y multi-tenant probados
- SLA/DPA/retention/incident response

**Para certificación:**

- SOC2/ISO readiness
- auditoría externa o checklist equivalente
- evidencias de controles
- observabilidad
- incident response
- documentación de cambios
- controles de IA

### Decisión

CEO's OS está actualmente en estado:

**Demo-ready y entrando en enterprise hardening.**

No debe considerarse todavía certificable completo.

El camino correcto es:

**C → D → E → F → G → H → I → J/K**
