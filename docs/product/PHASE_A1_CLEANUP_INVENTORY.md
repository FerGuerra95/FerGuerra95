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
| C.1 | Executive Overview | Cerrada funcional | Demo hub DSS / human review |
| C.2 | M&A | Cerrada funcional | M&A Intelligence / DSS, demo-ready sin P0 |
| C.3 | Compliance | Cerrada funcional | Third-Party Risk / Compliance Intelligence DSS |
| C.4 | Funding | Cerrada funcional | Funding Command Center / bridge snapshots |
| C.5 | Governance | Cerrada funcional | Governance workflow, board packs, audit trail |
| C.6 | PMI | Cerrada funcional | PMI Execution / DSS, demo-ready sin P0 |
| C.7 | Bridge | Cerrada funcional | Cross-Module Intelligence / DSS; marketplace congelado A.1.5 |
| C.8 | Risk | Pendiente | Auditar register, scoring, filters, reports (Prompt Maestro nuevo) |
| C.9 | Reporting | Pendiente | Auditar library, templates, board pack, exports (Prompt Maestro nuevo) |
| C.10 | Strategy | Pendiente | Auditar objectives, initiatives, roadmap (Prompt Maestro nuevo) |
| C.11 | Heritage | Pendiente | Auditar continuity, assets, succession, governance familiar (Prompt Maestro nuevo) |
| C.12 | Informe global | Pendiente | Matriz real / parcial / visual / vendible / enterprise-ready |
| C.13 | Logic Integrity C.1–C.7 | Pendiente | Reauditoría Logic Integrity / No Legacy / No Duplicidades |
| C.14 | Informe Logic Integrity global | Pendiente | Consolidar hallazgos legacy, duplicidades, source-of-truth |

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

## Actualización de Fase C — Reauditoría Logic Integrity de ramas C.1–C.7

**Fecha:** 20 mayo 2026

**Estado:** Roadmap actualizado.

### Decisión

Las ramas C.1–C.7 ya fueron auditadas funcionalmente y documentadas, pero deberán pasar una segunda revisión con el nuevo Prompt Maestro de Logic Integrity / No Legacy / No Duplicidades.

Esta reauditoría no invalida las auditorías anteriores.

Las auditorías C.1–C.7 siguen cerradas como auditorías funcionales.

La nueva revisión añade una capa superior de control:

- integridad lógica
- cálculo correcto
- source-of-truth
- funciones actuales
- eliminación o documentación de duplicidades
- trazabilidad input → cálculo → output
- tests con resultado esperado
- documentación técnica tipo tutor

### Motivo

El proyecto contiene muchas ramas con cálculos, scoring, engines, bridges, reports y señales ejecutivas.

No basta con validar que:

- la ruta carga
- el test pasa
- no hay NaN visible
- la pantalla se ve bien

También hay que validar que:

- la lógica de negocio tiene sentido
- los cálculos son correctos
- la función usada sigue vigente
- no hay funciones antiguas contaminando outputs
- no hay dos fuentes de verdad
- los tests prueban resultados esperados
- los datos demo/fallback no se confunden con datos reales

### Evidencias ya detectadas

**PMI:**

- `mergeWithDemo()` fusiona siempre `DEMO_PMI_CASE` con datos guardados.
- Esto exige revisión de truthfulness antes de piloto.

**Bridge:**

- Las señales recalculadas son heurísticas.
- Marketplace está congelado y no debe venderse ni promocionarse.
- Hay doble API Bridge: enterprise bridge y ecosystem marketplace.

**Funding:**

- Inputs/scenarios viven en localStorage, mientras rounds/summary viven en backend.

**Compliance:**

- Scores cliente pueden divergir de `riskScore` persistido.

**Governance:**

- Backend real fuerte, pero algunos workflows/UI/permisos requieren validación más profunda.

**M&A:**

- Valuation, waterfall, matching y scoring requieren source-of-truth y test oracle.

**Executive Overview:**

- Radar, board packs y signals requieren verificación de fuentes reales vs fallback.

### Nuevo orden de Fase C

| Fase | Estado | Descripción |
|---|---|---|
| C.1 | Cerrada funcional | Executive Overview |
| C.2 | Cerrada funcional | M&A |
| C.3 | Cerrada funcional | Compliance |
| C.4 | Cerrada funcional | Funding |
| C.5 | Cerrada funcional | Governance |
| C.6 | Cerrada funcional | PMI |
| C.7 | Cerrada funcional | Bridge |
| C.8 | Pendiente | Risk con Prompt Maestro nuevo |
| C.9 | Pendiente | Reporting con Prompt Maestro nuevo |
| C.10 | Pendiente | Strategy con Prompt Maestro nuevo |
| C.11 | Pendiente | Heritage con Prompt Maestro nuevo |
| C.12 | Pendiente | Informe global funcional real/parcial/visual/vendible |
| C.13.0 | Cerrada (solo lectura) | Global Read-Only Audit — hallazgos documentados |
| C.13.1A | Cerrada | Golden schema harness (`9916fe2`) |
| C.13.1B | Cerrada / RESOLVED | Funding zero-burn fix (`e0054e8`) — C13-P1-02 |
| C.13.1C | Cerrada (solo lectura) | Compliance scoring audit — C13-P1-04/05/06 documentados |
| C.13.1C-f1B | Cerrada (docs only) | Compliance scoring SoT — Option C híbrida adoptada |
| C.13.1C-f2A | Cerrada | weightedRiskScore helper + golden test (`adcdf77`) |
| C.13.1C-f2B | Cerrada (docs only) | Inventario cierre parcial C13-P1-04 |
| C.13.1C-f3A | Cerrada (solo lectura) | Auditoría integración weightedRiskScore |
| C.13.1C-f3B | Cerrada (docs only) | Decisión integración reports/export primero |
| C.13.1C-f4A | Cerrada | weightedRiskScore en reports/export (`c7c567b`) |
| C.13.1C-f4B | Cerrada (docs only) | Inventario cierre integración reports/export |
| C.13.1C-f5A | Cerrada (solo lectura) | Auditoría C13-P1-06 FE/BE precedence |
| C.13.1C-f5B | Cerrada (docs only) | Decisión naming/precedence Option E |
| C.13.1C-f6A | Cerrada | Tests precedencia Compliance scoring (`1580d6f`) |
| C.13.1C-f6B | Cerrada | Labels/precedence operational risk score (`1e82980`) |
| C.13.1C-f6C | Cerrada (docs only) | Inventario cierre parcial C13-P1-06 |
| C.13.1C-f7A | Cerrada (solo lectura) | Auditoría C13-P1-05 resilienceScore |
| C.13.1C-f7B | Cerrada (docs only) | Decisión resilienceScore Option C híbrido |
| C.13.1C-f8A | Cerrada | Golden resilience helper + test (`4414208`) |
| C.13.1C-f8B | Cerrada | Labels/re-export operational resilience (`eb48db6`) |
| C.13.1C-f8C | Cerrada (docs only) | Inventario cierre parcial C13-P1-05 |
| C.13.1C-f9A | Cerrada (docs only) | Cierre global Compliance scoring chain |
| C.13.1C | Cerrada (cadena scoring) | C13-P1-04/05/06 — reports/export/labels/tests/docs |
| C.13.2A | Cerrada | Formula Approval Gate foundation — registry + protocol + coverage test |
| C.13.2B | Cerrada (docs only) | Formula Approval Gate expansion / inventory por módulo |
| C.13.2C | Cerrada | Formula Approval Gate enforcement / CI hardening (coverage test) |
| C.13.3A | Cerrada (solo lectura) | Auditoría Funding formulas + persistence |
| C.13.3B | Cerrada (docs only) | Decisiones SoT Funding formulas + naming |
| C.13.3C | Cerrada | Golden tests Funding (`e0e200b`) |
| C.13.3D | Cerrada | Controlled fix FE/dashboard (`eb97064`) |
| C.13.3E | Cerrada (docs only) | Cierre documental Funding formulas |
| C.13.3F | Cerrada (solo lectura) | Auditoría C13-P1-03 localStorage vs API |
| C.13.3G | Cerrada (docs only) | Decisión SoT persistencia Funding (Option C híbrido) |
| C.13.3H | Cerrada | Labels/copy draft vs persisted (`e803813`) |
| C.13.3I | Cerrada | Tests store/localStorage/legacy risk (`25e4ff4`) |
| C.13.3J | Cerrada | Fix legacy migration consume-on-migrate (`55a088a`) |
| C.13.3K | Cerrada (docs only) | Cierre parcial documental C13-P1-03 |
| C.14.0 | Cerrada (docs only) | AI guardrails anti-parálisis (`05b3520`) |
| C.13.4A | Cerrada (solo lectura) | Auditoría M&A valuation / waterfall |
| C.13.4B | Cerrada (docs only) | Decisión SoT fórmulas M&A |
| C.13.4C | Cerrada | Golden benchmark tests (`maGoldenFormulas`) |
| C.13.4D | Cerrada (solo lectura) | Alignment audit product truthfulness |
| C.13.4E | Cerrada | Labels/copy DSS M&A UI |
| C.13.4F | Cerrada | Report alignment tests (`maProductReportAlignment`) |
| C.13.4G | Cerrada (docs only) | Docs closure snapshot policy / C13-P1-11 partial |
| C.13.4H | Cerrada | Fix controlado netProceeds fallback (`cc6a52a`) |
| C.13.4I | Cerrada (docs only) | Docs closure netProceeds fallback fix |
| C.13.5A | Cerrada (solo lectura) | Bridge / marketplace signals audit |
| C.13.5B | Cerrada | Bridge SoT docs + marketplace quarantine labels |
| C.14 | Pendiente | C.14.1 modular sandbox audit (opcional) |

### Subfases C.13

| Subfase | Rama | Objetivo |
|---|---|---|
| C.13.1 | Executive Overview | Radar, module health, board packs, signals, fallbacks |
| C.13.2 | M&A | Valuation, waterfall, matching, scoring, reports |
| C.13.3 | Compliance | Risk score, resilience, jurisdiction exposure, evidence pack |
| C.13.4 | Funding | Runway, dilution, post-money, scenarios, readiness |
| C.13.5 | Governance | Decision workflow, readiness, board packs, audit trail |
| C.13.6 | PMI | Synergies, milestones, dependencies, mergeWithDemo, dual model |
| C.13.7 | Bridge | Recalculate engine, signals, dependencies, marketplace boundary |
| C.13.8 | Transversal | Duplicidades, legacy, source-of-truth, golden datasets |

### C.13 debe revisar

Para cada rama ya auditada:

- cálculos visibles
- fórmulas
- engines
- inputs
- outputs
- funciones actuales
- funciones legacy
- helpers duplicados
- frontend vs backend source-of-truth
- demo/fallback
- tests placeholder
- tests con expected results
- documentación técnica
- disclaimers
- explicación tutor

### Tabla obligatoria C.13

Cada subfase C.13 debe entregar:

| Métrica / función | Archivo | Inputs | Output | Fórmula / lógica | Source-of-truth | Frontend/backend | Test real | Legacy/duplicado | Riesgo | Explicación tutor |
|---|---|---|---|---|---|---|---|---|---|---|

### Stop conditions

La subfase debe parar y reportar si detecta:

- cálculo crítico incorrecto
- función obsoleta usada como source-of-truth
- dos fuentes de verdad contradictorias
- demo/fallback contaminando output real
- test que pasa pero valida la función equivocada
- score visible sin fuente
- output vendible sin disclaimer
- duplicidad crítica entre frontend y backend

### Criterio pilot-ready actualizado

CEO's OS no se considera pilot-ready hasta cerrar:

1. C.8–C.11
2. C.12 Informe global funcional
3. C.13 Reauditoría Logic Integrity C.1–C.7
4. C.14 Informe final Logic Integrity / Legacy / Duplicidades

Después de eso se podrá pasar a:

- D Datos demo enterprise reales
- E Product truthfulness
- F Security / multi-tenant
- G QA enterprise
- H Legal / AI governance
- I Pilot packaging

### Decisión

A partir de C.8, todos los prompts usarán el Prompt Maestro.

Las ramas C.1–C.7 no se reabren funcionalmente salvo P0/P1 real.

Se reauditan con foco en lógica, cálculos, legacy y duplicidades.

---

## C.13.0 — Global Read-Only Audit

**Fecha:** 20 mayo 2026  
**Baseline:** `eae9048` — `chore: add cursor enterprise operating model`  
**Modo:** Solo lectura — docs-only en C.13.0f (esta sección documenta la auditoría; no se modificó código en C.13.0).

### 1. Estado

| Item | Valor |
|---|---|
| Subfase | C.13.0 cerrada en modo solo lectura |
| Archivos modificados en C.13.0 | Ninguno |
| Commit C.13.0 | No |
| Push C.13.0 | No |
| Working tree al cerrar C.13.0 | Solo `?? backend-server.err` |
| Referencias usadas | `docs/testing/golden_inputs.json`, `docs/testing/FORMULA_REGISTRY.md`, `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md`, blindaje v1 + IA-2 (solo lectura) |

### 2. Veredicto

| Veredicto | **NOT READY** (pilot-ready) |
|---|---|
| Motivo | P1 pendientes en Golden tests, fórmulas/source-of-truth y demo/fallback |
| Condición para PARTIAL | C.13.1A harness golden + cierre cluster P1 Funding/Compliance/Bridge/Risk/PMI/M&A |
| Condición para READY | C.13.1B–C.13.8 + C.14 sin P1 abiertos en cálculos críticos |

### 3. Executive summary

- Blindaje IA v1 (`997d79f`) e IA-2 Cursor Enterprise Operating Model (`eae9048`) publicados en `main`.
- Gobernanza documental sólida: reglas, registries, prompt library y checklists operativos.
- Los 14 Golden Datasets en `docs/testing/golden_inputs.json` **no están conectados a tests** en CI (búsqueda en `tests/` sin referencias).
- Varias fórmulas del `FORMULA_REGISTRY.md` **no coinciden** con la implementación vigente o no tienen ancla de código localizada.
- Funding, Compliance, Bridge, Risk, PMI y M&A concentran gaps **P1** de logic integrity.
- **Ningún P0 cross-tenant confirmado** en este barrido global (middleware asigna `organizationId` desde token; validación por endpoint = Pending C.13.8).
- Permisos por endpoint y viewer-mutation quedan **Pending C.13 validation** (no elevar a P0 sin auditoría endpoint-by-endpoint).

### 4. P0

| ID | Hallazgo | Estado |
|---|---|---|
| — | Ningún P0 confirmado en C.13.0 | Cerrado sin P0 |
| Nota | No elevar seguridad/multi-tenant a P0 sin C.13.8 endpoint sweep | Regla activa |

### 5. P1

| ID | Hallazgo | Evidencia (lectura) | Riesgo |
|---|---|---|---|
| C13-P1-01 | Golden datasets sin tests oráculo | `grep golden_inputs` en `tests/` → 0 matches | CI no detecta drift código vs golden |
| C13-P1-02 | Funding zero burn: FE usaba `999`, golden exige `null`; BE devolvía `null` | **RESOLVED** en `e0054e8` — ver sección C.13.1B | Cerrado |
| C13-P1-03 | Funding FE `localStorage` vs backend API | `fundingStore.jsx`, `fundingApi.js`, `FUNDING_STORAGE_KEYS` | **PARTIALLY RESOLVED** — SoT + labels + tests + legacy migration fix (C.13.3G–J); dashboard runtime/e2e optional pending |
| C13-P1-04 | Compliance weighted risk — reports/export done | Helper `adcdf77` + integración `c7c567b`; ver C.13.1C-f4A/f4B | **PARTIALLY RESOLVED** — reports/export complete; model-data adoption pending |
| C13-P1-05 | Compliance resilience — golden + labels/re-export | f7B + f8A `4414208` + f8B `eb48db6`; ver f8A/f8B/f8C | **PARTIALLY RESOLVED** — golden helper/test + operational labels/re-export; backend/API/model rename pending |
| C13-P1-06 | FE/BE precedence — labels/precedence fix done | f5B + f6A + f6B (`1e82980`); ver C.13.1C-f6A/f6B/f6C | **PARTIALLY RESOLVED** — labels/precedence + re-export + CEO; backend/model rename pending |
| C13-P1-07 | Bridge priority mismatch | Golden `bridge_priority_score_basic`; `calculateSignalPriority` en `bridge.service.js` | **PARTIALLY RESOLVED** — Option C dual-layer (C.13.5E); Golden tests (C.13.5D); operational heuristic tests (C.13.5F); product formula unchanged; **no RESOLVED global** |
| C13-P1-08 | Risk score mismatch | Golden `risk_score_likelihood_impact_basic` (likelihood×impact); `riskScoreFrom` en `risk.service.js` | **RESOLVED / DUAL-LAYER RISK MODEL CLOSED** — Option C (C.13.6B); Golden tests (C.13.6C); operational tests (C.13.6D); UI (C.13.6E); report/export truthfulness (C.13.6F); dual-layer divergence by design |
| C13-P1-09 | PMI `mergeWithDemo` mezcla demo siempre | `pmiStore.jsx` `mergeWithDemo` + `DEMO_PMI_CASE` | Demo contamina casos reales |
| C13-P1-10 | PMI zero forecast devuelve `0` vs golden `null` | `pmi.service.js` `synergyCaptureRatio` cuando target≤0 | Edge case golden `pmi_synergy_zero_forecast` |
| C13-P1-11 | M&A EV simple vs adjusted engine | Golden `ma_valuation_*`; FE `useValuationEngine` adjusted EV; report alignment tests | **PARTIALLY RESOLVED** — SoT + Golden tests + labels/copy + report alignment + netProceeds fallback fixed (C.13.4A–I); backend snapshot/re-export policy pending |
| C13-P1-12 | M&A waterfall simple source unclear | Golden `ma_waterfall_simple_distribution`; sin helper `netCashToSeller` localizado en `src/modules/ma` | Proceeds seller no verificables vs golden |

### 6. P2

| ID | Hallazgo | Nota |
|---|---|---|
| C13-P2-01 | Bridge marketplace ruta viva demo unlisted | `/bridge/marketplace` en `routes.jsx`; no en sidebar; `DEMO_BRIDGE_*` fallback |
| C13-P2-02 | Bridge service acoplado a 8+ módulos | `bridge.service.js` imports cross-module summaries |
| C13-P2-03 | Executive Overview aggregator, no master SoT | `executiveOverview.service.js`, `readinessIndex.service.js` |
| C13-P2-04 | Reporting variance source unclear | **RESOLVED AS GOLDEN BENCHMARK / PRODUCT DEFERRED (C.13.8F)** — logic baseline + e2e pass | C.13.9+ |
| C13-P2-05 | M&A localStorage cases | `valuationFormulas.js` `STORAGE_KEYS` |
| C13-P2-06 | Compliance demo tools | `SHOW_DEMO_TOOLS` en `SuppliersPage.jsx` |
| C13-P2-07 | AppShell outlet fallback (no lógica negocio) | `AppShell.jsx` loading panel |
| C13-P2-08 | Duplicidad `workspaceConfig` / `routeConfig` / `shellMeta` | Ya documentada históricamente en §3 inventario |

### 7. P3

| ID | Hallazgo |
|---|---|
| C13-P3-01 | Monolitos `CEOOverviewPage.jsx` / `BridgeMarketplacePage.jsx` |
| C13-P3-02 | Ecosystem huérfano histórico (`EcosystemBranchPage`, etc.) |
| C13-P3-03 | CSS `!important` masivo histórico (`workspaceAccent.css`, `executivePolish.css`) |
| C13-P3-04 | `backend/db/` vs `backend/storage/` legacy |

### 8. Mini-informe por módulo

| Módulo | SoT | Golden mapping | Demo/fallback | Tests | Estado C.13.0 |
|---|---|---|---|---|---|
| M&A | DCF + normalized EBITDA; localStorage cases | Parcial / **source unclear** (EV simple, waterfall) | localStorage, local fallback deals | `valuationFormulas.test.js` (sin golden) | Gaps P1 |
| Compliance | BE persist + FE engine recalc | **Mismatch** weighted + resilience | `DEMO_COMPLIANCE_*`, report fallback | `useComplianceEngine.test.js` | Gaps P1 |
| Funding | BE API + FE localStorage draft | **Mismatch** runway FE; BE OK zero burn | `DEMO_FUNDING_*` | Sin golden | Gaps P1 |
| Governance | Backend services | Sin golden dedicado | Assumed OK funcional C.5 | Integration parcial | Pending subfase C.13.5 |
| PMI | Dual: `pmi_cases` + enterprise tables | **Mismatch** zero forecast | **mergeWithDemo** | Sin golden | Gaps P1 |
| Bridge | `bridge_signals` + heuristics | **Mismatch** priority | Marketplace DEMO, recalculate heuristic | `bridgeEngine.test.js` (sin golden) | Gaps P1 + P2 marketplace |
| Risk | `risk.service.js` | **Mismatch** score formula | — | Sin golden | Gaps P1 |
| Reporting | Backend reporting | **Source unclear** variance | — | boardPack integration | Pending C.13.7 |
| Executive Overview | Aggregator only | Health avg **pending** | API fallback, localStorage board pack ts | `executiveMetrics.test.js` | Pending C.13.1 / C.13.7 |

### 9. Golden Dataset vs implementación (14 datasets)

| Golden Dataset ID | Resultado C.13.0 | Nota |
|---|---|---|
| `ma_valuation_ebitda_multiple_basic` | **source unclear** | No engine EV simple localizado |
| `ma_valuation_equity_value_basic` | **partial** | `netDebt` en core; EV no simple |
| `ma_waterfall_simple_distribution` | **source unclear** | Sin fórmula dedicada localizada |
| `funding_runway_basic` | **likely match** | Si burn > 0 FE/BE |
| `funding_runway_zero_burn` | **mismatch** | FE `999`; BE `null` |
| `funding_post_money_and_dilution_basic` | **likely match** | `calculateFundingCore` |
| `compliance_weighted_risk_score_basic` | **mismatch** | Fórmula distinta en FE |
| `compliance_resilience_score_basic` | **mismatch** | Engine distinto |
| `pmi_synergy_capture_rate_basic` | **partial** | Ratio existe |
| `pmi_synergy_zero_forecast` | **mismatch** | Devuelve 0, no null |
| `bridge_priority_score_basic` | **mismatch (by design Option C)** | Golden oracle via `bridgeGoldenFormulas.js`; product `calculateSignalPriority` = separate `operationalSignalPriority` heuristic |
| `risk_score_likelihood_impact_basic` | **mismatch (by design Option C)** | Golden oracle via `riskGoldenFormulas.js` (C.13.6C); product `riskScoreFrom` = `operationalEnterpriseRiskScore` (C.13.6D tests) |
| `reporting_kpi_variance_basic` | **source unclear** | Implementación no localizada |
| `executive_module_health_average_basic` | **pending** | Múltiples agregadores |

**Leyenda:** match = alineado con evidencia; partial = parte alineada; mismatch = diverge del golden; source unclear = sin ancla de código; pending = requiere subfase C.13.x.

### 10. Plan de remediación (sin aplicar en C.13.0)

| Subfase | Objetivo |
|---|---|
| **C.13.1A** | Golden harness seguro: estructura + import JSON sin romper CI |
| **C.13.1B** | Tests de implementación por cluster **tras** decidir source-of-truth |
| **C.13.2** | Funding: runway null, localStorage labeling, SoT |
| **C.13.3** | Compliance: weighted/resilience, FE vs BE |
| **C.13.4** | Bridge priority + Risk score |
| **C.13.5** | PMI: mergeWithDemo opt-in, zero forecast null |
| **C.13.6** | M&A: EV/waterfall golden anchors o registry update |
| **C.13.7** | Reporting variance + Executive health |
| **C.13.8** | Security endpoint sweep (organizationId, viewer, audit) |

### 11. Decisión importante — tests y golden

**No crear tests de implementación que rompan CI** hasta decidir explícitamente por cluster:

1. **Alinear código** al Golden Dataset (cambio de producto autorizado), o  
2. **Actualizar `FORMULA_REGISTRY.md`** (y registries) con la fórmula real vigente, o  
3. **Modificar Golden Dataset** solo con revisión humana y cálculo manual documentado (prohibido silencioso).

Orden recomendado: C.13.1A → decisión SoT por cluster → C.13.1B → C.13.2–C.13.8.

### Próxima subfase recomendada

**C.13.1C** — Compliance weighted risk source-of-truth audit (modo solo lectura primero).

**Prompt:** `docs/ai/PROMPT_LIBRARY.md` → Calculation Verification (Compliance weighted risk) o Module Logic Integrity Audit (Compliance).

---

## C.13.1B — Funding zero-burn calculation verification & controlled fix — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED / RESOLVED**  
**Commit:** `e0054e8` — `fix(funding): return null runway when monthly burn is zero`  
**Baseline al cerrar:** `HEAD = origin/main = e0054e8`

### 1. Issue resuelto

| Campo | Valor |
|---|---|
| ID | **C13-P1-02** — Funding frontend zero-burn mismatch |
| Golden Dataset | `funding_runway_zero_burn` |
| Estado issue | **RESOLVED** |

### 2. Bug detectado

El frontend Funding devolvía **`999`** como proxy de runway cuando `monthlyBurn <= 0` en `calculateFundingCore` (`fundingFormulas.js`).

Eso contradecía:

- Golden Dataset: `runwayMonths: null`
- Backend: `calculateCashRunway` ya devolvía `projectedRunwayMonths: null`

Riesgo: la UI podía mostrar “999 meses” como métrica financiera real.

### 3. Source of Truth (decisión C.13.1B)

| Fuente | Regla |
|---|---|
| `docs/testing/golden_inputs.json` → `funding_runway_zero_burn` | `runwayMonths` debe ser `null` / not meaningful |
| Backend `calculateCashRunway` | `null` cuando burn <= 0 — **ya alineado** |
| Decisión de negocio | `monthlyBurn <= 0` → `runwayMonths = null`. **Nunca** `999`, `Infinity` ni `NaN` |

### 4. Archivos corregidos

| Archivo | Cambio |
|---|---|
| `src/modules/funding/engine/fundingFormulas.js` | `999` → `null` en `currentRunwayMonths` y `runwayAfterRaiseMonths`; `bufferVsTargetMonths` null-safe |
| `src/modules/funding/engine/fundingNarrative.js` | `formatRunwayMonthsLabel`; checklist y narrative sin `.toFixed(null)` |
| `src/modules/funding/engine/fundraisingScoring.js` | `runwayComponent = 0` si runway null (evita NaN en readiness) |
| `src/modules/funding/engine/useFundingEngine.js` | Escenarios: `999` → `null` cuando `scenario.burn <= 0` |

### 5. Test añadido

| Archivo | Cobertura |
|---|---|
| `tests/unit/funding/fundingFormulas.test.js` | Zero-burn → `null`; post-raise zero-burn → `null`; burn positivo → 10 meses (golden `funding_runway_basic`) |

### 6. Validaciones ejecutadas

| Comando | Resultado |
|---|---|
| `vitest run tests/unit/funding/fundingFormulas.test.js` | **3/3 passed** |
| `vitest run tests/unit/funding` | **12/12 passed** |
| `npm run test:unit` | **123/123 passed** |
| `npm run build` | **OK** |

### 7. Scope confirmado

| Área | Tocado en C.13.1B |
|---|---|
| Golden Dataset | **No** |
| Backend | **No** (solo lectura de referencia) |
| Docs (salvo inventario) | **No** |
| CSS | **No** |
| Otros módulos | **No** |
| `backend-server.err` | **Fuera** (untracked, no staged) |

### 8. Product truthfulness

La UI ya no debe presentar “999 meses” como runway real.

El caso zero-burn queda representado como **`null`** en el motor core; la narrativa usa **“No burn / runway not meaningful”** cuando el valor no es finito.

### 9. Pendientes Funding (fuera de C.13.1B)

| ID | Estado |
|---|---|
| C13-P1-03 | **PARTIALLY RESOLVED** — SoT + labels + tests + legacy migration fix (C.13.3G–J); dashboard runtime/e2e optional pending |

### 10. Siguiente paso recomendado (post C.13.1C)

Ver **C.13.1C-f5B** (decisión precedence) y **C.13.1C-f6A** (tests precedencia).

---

## C.13.1C — Compliance weighted risk / riskScore / resilienceScore audit — CLOSED (READ ONLY)

**Fecha cierre auditoría:** 20 mayo 2026  
**Estado:** **CLOSED (READ ONLY)** — hallazgos documentados; **sin fix**  
**Baseline auditoría:** `HEAD = origin/main = 13594b6`  
**Modo:** Solo lectura — no código, no tests, no golden, no commit en C.13.1C

### 1. Objetivo

Auditar source-of-truth y fórmulas reales de Compliance para **C13-P1-04**, **C13-P1-05** y **C13-P1-06** antes de cualquier corrección.

### 2. Golden Datasets Compliance

| Golden ID | Fórmula documentada | Expected (ejemplo) | Tolerancia |
|---|---|---|---|
| `compliance_weighted_risk_score_basic` | `financial*0.4 + jurisdiction*0.4 + evidence*0.2` | `weightedRiskScore: 68` (70, 80, 40) | 0.000001 |
| `compliance_resilience_score_basic` | `clamp(100 - riskScore + mitigationBonus, 0, 100)` | `resilienceScore: 40` (risk 68, bonus 8) | 0 |

**GAP:** Inputs golden (`financialRisk`, `jurisdictionRisk`, `evidenceRisk`, `mitigationBonus`) **no existen** en modelo supplier ni en código producto.

### 3. Formula Registry (lectura)

| ID registry | Alineación texto con golden | Implementación en código |
|---|---|---|
| `COMPLIANCE_WEIGHTED_RISK` | Sí (definición) | **No** — Pending C.13 validation |
| `COMPLIANCE_RESILIENCE` | Sí (definición) | **No** — Pending C.13 validation |

### 4. Backend observado (solo lectura)

| Archivo | Comportamiento |
|---|---|
| `backend/services/compliance/suppliers.service.js` | **Persiste** `riskScore` / `resilienceScore` del payload (default 50, clamp 0–100). **No calcula** weighted ni resilience golden. |
| `auditRuns.service.js` | Score legal/compliance para auditorías M&A — **métrica distinta**, no supplier weighted risk. |

**SoT backend:** almacenamiento autoritativo de valores enviados por cliente, no motor de fórmula golden.

### 5. Frontend observado (solo lectura)

| Función | Archivo | Fórmula real |
|---|---|---|
| **riskScore UI** | `complianceScoring.js` → `calculateSupplierRiskScore` | `criticality + tier + region + alertRisk + evidence/review adjustments` → clamp 0–100 |
| **resilienceScore UI** | `resilienceScore.js` → `calculateResilienceScore` | `base 72 - penalties + bonuses` → clamp 0–100 |
| **Orquestación** | `useComplianceEngine.js` | **Sobrescribe** campos `riskScore` / `resilienceScore` del supplier API con valores recalculados FE |

**Búsqueda código:** `financialRisk`, `jurisdictionRisk`, `evidenceRisk`, `weightedRiskScore`, `mitigationBonus` aparecen **solo** en `golden_inputs.json` y `FORMULA_REGISTRY.md`.

**Páginas que consumen motor FE:** `ComplianceDashboardPage`, `SuppliersPage`, `SupplierDetailPage`, `RiskMapPage`, `AlertsPage`, `EvidencePage`, `ReviewsPage`, `ComplianceReportPage`.

### 6. Mismatch por métrica (confirmado)

| Métrica | Golden | Backend persistido | Frontend calculado | Match golden | Match FE/BE |
|---|---|---|---|---|---|
| `weightedRiskScore` | 68 (3 dimensiones) | No existe | No implementado | **No** | N/A |
| `riskScore` (campo supplier) | Input para resilience golden | Payload cliente | Motor operativo FE | **No** (fórmula distinta) | **No** (FE pisa BE) |
| `resilienceScore` | 40 (`100-68+8`) | Payload cliente | Motor `base 72…` | **No** | **No** (FE pisa BE) |

**Ejemplo ilustrativo (fixture `useComplianceEngine.test`):** proveedor Alta/Tier1/Europa + alert high → FE `riskScore` ≈ **87**, resilience ≈ **48** — no coincide con golden 68/40.

### 7. Tests (gaps)

| Cobertura | Estado |
|---|---|
| `useComplianceEngine.test.js` | Propiedades y rangos 0–100 — **sin golden** |
| `goldenInputsSchema.test.js` | Solo esquema JSON |
| Tests implementation vs `compliance_weighted_*` | **Parcial** — `complianceWeightedRisk.test.js` (f2A); operational/resilience sin oráculo |

### 8. Issues C.13.0 — estado post auditoría

| ID | Hallazgo | Estado |
|---|---|---|
| C13-P1-04 | Weighted risk reports/export integrado | **PARTIALLY RESOLVED** — reports/export complete (`c7c567b`); broader adoption pending |
| C13-P1-05 | Resilience golden + labels (f8A/f8B) | **PARTIALLY RESOLVED** — helper/test + labels/re-export; rename modelo/API pending |
| C13-P1-06 | Labels/precedence; persisted vs operational mejor separados | **PARTIALLY RESOLVED** — f6B fix; rename modelo/API pending |

**P0:** ninguno confirmado en esta subfase (scoring).

### 9. Product truthfulness

- La UI muestra `riskScore` / `resilienceScore` como si fueran únicos, pero en dashboard son **scores calculados en cliente**, no necesariamente los persistidos en SQLite.
- Golden oracle **no valida** el motor operativo actual en CI.
- Riesgo de confundir **tres conceptos** bajo nombres similares: `weightedRiskScore`, `operationalRiskScore` (FE), `resilienceScore` (dos fórmulas posibles).

### 10. Decisión adoptada (C.13.1C-f1B) — Option C Hybrid

**Estado:** Documentada en `FORMULA_REGISTRY.md` y `SOURCE_OF_TRUTH_REGISTRY.md`. **No implementada en código.**

| Métrica | Rol | SoT documental |
|---|---|---|
| **weightedRiskScore** | Golden 3-dimension explicable | Golden + Formula Registry |
| **operationalRiskScore** | Motor FE actual (dashboard) | FE engine interim; pending hardening |
| **resilienceScore** | Métrica separada | Alignment pending subphase |
| **Persisted `riskScore`/`resilienceScore`** | SQLite payload | Backend persistence SoT only |

Opciones A/B rechazadas para implementación inmediata: no forzar motor FE a golden 68; no deprecar motor operativo sin migración.

### 11. Archivos clave (referencia lectura)

- `docs/testing/golden_inputs.json` — datasets compliance
- `src/modules/compliance/engine/complianceScoring.js`
- `src/modules/compliance/engine/resilienceScore.js`
- `src/modules/compliance/engine/useComplianceEngine.js`
- `backend/services/compliance/suppliers.service.js`
- `src/modules/compliance/services/suppliersApi.js`

### 12. Siguiente paso (post C.13.1C audit)

Ver sección **C.13.1C-f1B** para decisión formal y siguiente fase f2.

---

## C.13.1C-f1B — Compliance scoring Formula Decision / Source-of-Truth — CLOSED (DOCS ONLY)

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)**  
**Baseline:** `HEAD = origin/main` al documentar (post-commit `57ca269` audit)  
**Decisión adoptada:** **Option C — Controlled Hybrid**

### 1. Resumen ejecutivo

Compliance scoring queda con **tres métricas separadas**. El campo ambiguo `riskScore` no es SoT único. Golden Dataset **no modificado**. Motor operativo FE **no eliminado**. Ningún helper ni test creado en esta subfase.

### 2. Métricas canónicas documentadas

| Métrica | Fórmula / origen | Uso | Implementación |
|---|---|---|---|
| **weightedRiskScore** | `financial*0.4 + jurisdiction*0.4 + evidence*0.2` | Informes, benchmark, golden tests | **Helper + test** (`adcdf77`); integración UI/reporting pendiente |
| **operationalRiskScore** | Motor FE `calculateSupplierRiskScore` | Dashboards, priorización operativa | **Existing** — pending naming/SoT cleanup |
| **resilienceScore** | Golden: `clamp(100-risk+bonus)`; FE: modelo distinto | UI resilience | **Pending alignment** |

### 3. Source-of-truth por capa

| Capa | Rol |
|---|---|
| Golden + Formula Registry | Canonical para **weightedRiskScore** |
| FE engine | Implementación actual de **operationalRiskScore** (interim display SoT) |
| Backend SQLite fields | **Persistence SoT** para `riskScore`/`resilienceScore` — not calculation SoT |

### 4. Issues — estado post f1B (no RESOLVED)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **OPEN** | Decision documented; weighted helper/test pending (C.13.1C-f2A) |
| C13-P1-05 | **PARTIALLY RESOLVED** | f8A golden helper + f8B labels/re-export; backend/model rename pending — ver f8A/f8B/f8C |
| C13-P1-06 | **PARTIALLY RESOLVED** | f6B labels/precedence + re-export + CEO; backend/model rename pending — ver C.13.1C-f6B |

### 5. Archivos documentales actualizados

| Archivo | Cambio |
|---|---|
| `docs/testing/FORMULA_REGISTRY.md` | Sección Compliance Hybrid + filas WEIGHTED / OPERATIONAL / RESILIENCE |
| `docs/architecture/SOURCE_OF_TRUTH_REGISTRY.md` | Tabla Compliance ampliada + sección SoT híbrida |
| `docs/product/PHASE_A1_CLEANUP_INVENTORY.md` | Esta sección + estados P1 |

### 6. Scope confirmado (f1B)

| Área | Tocado |
|---|---|
| `golden_inputs.json` | **No** |
| `src/` | **No** |
| `backend/` | **No** |
| `tests/` | **No** |
| Helper `calculateWeightedRiskScore` | **No creado** |
| Golden expected outputs | **No** |

### 7. Siguiente paso recomendado

**C.13.1C-f2A** — Compliance `weightedRiskScore` golden helper + unit test.

**Whitelist esperada f2A:** helper Compliance scoring + test file only (sin UI/BE en misma fase salvo autorización explícita).

**Condiciones para f2A:**

1. C.13.1C-f1B pusheada.
2. C13-P1-04 OPEN con decisión clara.
3. Golden intacto.
4. `weightedRiskScore` ≠ `operationalRiskScore` documentado.

**Prohibido hasta f2A validado:** C.13.1C-f3 controlled fix de UI/BE naming.

---

## C.13.1C-f2A — Compliance weightedRiskScore golden helper/test — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED / TECHNICAL HELPER + GOLDEN TEST ADDED**  
**Commit:** `adcdf77` — `test(compliance): add weighted risk golden helper`  
**Baseline:** `HEAD = origin/main = adcdf77`

### 1. Scope

Implementación mínima de helper puro `weightedRiskScore` + test unitario contra Golden Dataset. Sin UI, sin backend, sin motor operativo, sin resilience, sin `useComplianceEngine`.

### 2. Golden

| Campo | Valor |
|---|---|
| **Golden ID** | `compliance_weighted_risk_score_basic` |
| **Inputs** | `financialRisk: 70`, `jurisdictionRisk: 80`, `evidenceRisk: 40` |
| **Expected** | `weightedRiskScore: 68` |
| **Fórmula** | `weightedRiskScore = financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2` |
| **Tolerancia** | `0.000001` |

### 3. Artefactos creados

| Artefacto | Ubicación |
|---|---|
| Helper | `src/modules/compliance/engine/complianceWeightedRisk.js` |
| Export | `calculateWeightedRiskScore` |
| Test | `tests/unit/compliance/complianceWeightedRisk.test.js` |

### 4. Edge cases cubiertos (test)

- Input faltante → `null`
- Input no finito → `null`
- Inputs fuera de rango → clamp 0–100
- Salida nunca `NaN`/`Infinity`
- Strings numéricos aceptados cuando son finitos

### 5. Validaciones

| Comando | Resultado |
|---|---|
| `npx vitest run tests/unit/compliance/complianceWeightedRisk.test.js` | 5/5 passed |
| `npm run test:unit` | 128/128 passed |
| `npm run build` | OK |

### 6. Scope confirmado (f2A)

| Área | Tocado |
|---|---|
| `golden_inputs.json` | **No** |
| `FORMULA_REGISTRY.md` / `SOURCE_OF_TRUTH_REGISTRY.md` | **No** |
| UI / backend | **No** |
| `useComplianceEngine` / `complianceScoring` / `resilienceScore` | **No** |
| `backend-server.err` | **No** (sin stage) |

### 7. Issues — estado post f2A

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export integrado; dashboards/model-data pendiente |
| C13-P1-05 | **PARTIALLY RESOLVED** | f8A/f8B complete; backend/model rename pending |
| C13-P1-06 | **PARTIALLY RESOLVED** | f6B labels/precedence + re-export + CEO; backend/model rename pending — ver C.13.1C-f6B |

### 8. Product truthfulness

- El proyecto ya tiene fórmula **testada y trazable** para `weightedRiskScore`.
- **No** debe presentarse como score operativo global hasta integración y etiquetado correcto.
- **No** confundir `weightedRiskScore` con `operationalRiskScore`.

### 9. Siguiente paso (post f2A)

**C.13.1C-f2B** — Documentar cierre parcial en inventario (docs only).

**No avanzar** a resilience ni precedence FE/BE hasta f2B documental cerrada.

---

## C.13.1C-f2B — Compliance weightedRiskScore partial closure — CLOSED (DOCS ONLY)

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)**  
**Baseline:** `HEAD = origin/main = adcdf77` (post-commit f2A)  
**Referencia técnica:** sección **C.13.1C-f2A** — commit `adcdf77`

### 1. Resumen ejecutivo

C.13.1C-f2A quedó cerrada y pusheada. `weightedRiskScore` tiene helper puro y test contra Golden. **C13-P1-04 no está completamente RESOLVED** hasta integrar la métrica donde corresponda (reporting/UI/benchmark). Golden Dataset intacto. C13-P1-05 **PARTIALLY RESOLVED** tras f8A/f8B (`4414208`/`eb48db6`). C13-P1-06 **PARTIALLY RESOLVED** tras f6B (`1e82980`).

### 2. Estado de issues (post f2B)

| ID | Estado | Criterio de cierre completo |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export complete (f4A); model-data/dashboards pending |
| C13-P1-05 | **PARTIALLY RESOLVED** | f8A/f8B complete; backend/model rename pending |
| C13-P1-06 | **PARTIALLY RESOLVED** | f6B labels/precedence + re-export + CEO; backend/model rename pending — ver C.13.1C-f6B |

**Reports/export cerrado en C.13.1C-f4A.** No marcar C13-P1-04 RESOLVED global hasta adopción en modelo de datos/demo, dashboards y naming C13-P1-06.

### 3. Confirmaciones de scope (f2B)

| Área | Tocado en f2B |
|---|---|
| `PHASE_A1_CLEANUP_INVENTORY.md` | **Sí** (esta sección + tablas P1/fase) |
| `src/` / `backend/` / `tests/` | **No** |
| Golden / Formula Registry / SoT Registry | **No** |
| Compliance engines operativos | **No** |

### 4. Prohibiciones hasta f3

- **No** pasar a `resilienceScore` alignment (C13-P1-05).
- **No** pasar a FE/BE precedence/naming (C13-P1-06).
- **No** marcar C13-P1-04 RESOLVED completo sin integración documentada.

### 5. Siguiente paso (post f2B)

Ver sección **C.13.1C-f3A/f3B** — auditoría read-only y decisión documental de integración.

---

## C.13.1C-f3A/f3B — weightedRiskScore integration decision — READ-ONLY + DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estados:** **C.13.1C-f3A CLOSED (READ ONLY)** · **C.13.1C-f3B CLOSED (DOCS ONLY)**  
**Baseline auditado:** `HEAD = origin/main = c925ad5`  
**Sin modificaciones de código** en f3A/f3B · **Sin commit de implementación**

### 1. C.13.1C-f3A — Auditoría read-only (resumen)

| Hallazgo | Evidencia |
|---|---|
| Helper puro existe | `src/modules/compliance/engine/complianceWeightedRisk.js` → `calculateWeightedRiskScore` |
| Test golden existe | `tests/unit/compliance/complianceWeightedRisk.test.js` → `compliance_weighted_risk_score_basic` (68) |
| **No integrado** en producto | Sin imports en UI, `complianceReportsApi`, `ComplianceReportPage`, backend suppliers, CEO Overview, Reporting general |
| `riskScore` en UI/informes | **Operativo** vía `useComplianceEngine` + `calculateSupplierRiskScore` (C13-P1-06) |
| Inputs weighted en datos reales | **Ausentes** en `complianceStore`, BE `suppliers.service`, demo suppliers |

**Recomendación auditoría:** integrar primero en **Compliance reports/export/benchmark**; no en dashboards ni Supplier Detail en esta oleada.

### 2. Datos actuales — regla de inputs explícitos

Los proveedores actuales (demo, store, backend SQLite) **no** contienen:

- `financialRisk`
- `jurisdictionRisk`
- `evidenceRisk`

Estos campos existen **solo** en `docs/testing/golden_inputs.json` y en el test unitario.

**Regla de producto (obligatoria):**

| Permitido | Prohibido |
|---|---|
| Calcular `weightedRiskScore` solo si los **3 inputs explícitos** están presentes y finitos | Derivar dimensiones desde `spend`, `region`, `tier`, `criticality`, `alerts`, `evidence gap`, `reviews`, `confidence` u otros señales operativas |
| Omitir campo/fila o `null` con etiqueta clara si faltan inputs | Inventar valores para “rellenar” el golden 68 en producción |
| Añadir inputs weighted en modelo de datos **solo** con decisión humana posterior | Sustituir `riskScore` operativo por weighted |

Hoy `calculateWeightedRiskScore(supplierActual)` devolvería **`null`** para todo proveedor del sistema.

### 3. Decisión de integración (C.13.1C-f3B)

**Integrar primero** `weightedRiskScore` en:

| Superficie | Rol |
|---|---|
| Compliance reports (`complianceReportsApi.buildSupplierReport`) | Campo opcional en payload |
| Export HTML/PDF (`complianceReportsApi.exportReport`) | Fila board pack / decision memo |
| `ComplianceReportPage` (`buildCurrentReport`) | Calcular solo con 3 inputs explícitos |
| Benchmark / decision memo explicable | Métrica separada, no KPI operativo |

**No integrar todavía** en:

| Superficie | Motivo |
|---|---|
| `ComplianceDashboardPage`, `SuppliersPage`, `RiskMapPage` | Contamina priorización operativa |
| `SupplierDetailPage` | Riesgo de confusión con `riskScore` del engine |
| `CEOOverviewPage` | Agregados ejecutivos mezclarían scores sin precedence resuelta |
| `src/modules/reporting/**` | Sin acoplamiento Compliance scoring hoy |
| `useComplianceEngine`, `complianceScoring`, `resilienceScore` | C13-P1-06 / motor operativo — fase aparte |
| Backend `suppliers.service` (f4A) | Fuera de whitelist f4A |

**No usar** `weightedRiskScore` para sustituir `riskScore` / operational risk score.

### 4. Label futuro (product truthfulness)

| Métrica | Label UI/export futuro | No usar |
|---|---|---|
| `weightedRiskScore` | **Weighted risk (explicable)** | "Risk Score", "Supplier risk", score global oficial |
| `riskScore` (motor FE actual) | **Operational risk score** / mantener "Risk Score" hasta C13-P1-06 | Mismo label que weighted |
| `resilienceScore` | Sin cambio en f4A | — |

Si faltan inputs weighted: **no mostrar** la fila o mostrar `N/A` con nota “requires explicit financial/jurisdiction/evidence risk inputs”.

### 5. Futura fase — C.13.1C-f4A (no ejecutada)

**Whitelist esperada f4A:**

- `src/modules/compliance/services/complianceReportsApi.js`
- `src/modules/compliance/pages/ComplianceReportPage.jsx`
- `tests/unit/compliance/complianceReportsApi.test.js` (nuevo)
- `tests/unit/compliance/complianceWeightedRisk.test.js` (solo ampliar edge cases si hace falta)

**Reglas f4A:**

1. Importar `calculateWeightedRiskScore` solo en report path.
2. Pasar `weightedRiskScore` al report **solo** si los 3 inputs existen en supplier/report payload.
3. No tocar dashboards, Supplier Detail, CEO Overview, backend, Golden.
4. No derivar inputs.
5. Test: report con inputs → fila weighted; sin inputs → sin fila / null; `riskScore` operativo intacto.

**Prohibido en la misma PR que f4A:** resilience (C13-P1-05), precedence FE/BE (C13-P1-06).

### 6. Riesgos evitados por esta decisión

- No contaminar dashboards operativos.
- No presentar weighted como score global oficial.
- No sustituir `riskScore` operativo.
- No mezclar oráculo Golden con motor FE sin etiquetas.
- No inventar `financialRisk`/`jurisdictionRisk`/`evidenceRisk`.

### 7. Estado C13-P1 (post f3B)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export complete (f4A); broader model-data adoption pending |
| C13-P1-05 | **PARTIALLY RESOLVED** | f8A/f8B complete; backend/model rename pending |
| C13-P1-06 | **PARTIALLY RESOLVED** | f6B labels/precedence + re-export + CEO; backend/model rename pending — ver C.13.1C-f6B |

**C13-P1-04 — alcance RESOLVED:** helper + golden test + reports/export. **Pendiente global:** dashboards, backend fields, demo suppliers con 3 dimensiones explícitas.

### 8. Scope confirmado (f3A/f3B)

| Área | Tocado |
|---|---|
| `PHASE_A1_CLEANUP_INVENTORY.md` | **Sí** |
| `src/` / `backend/` / `tests/` | **No** |
| `golden_inputs.json` | **No** |
| `FORMULA_REGISTRY` / `SOURCE_OF_TRUTH_REGISTRY` | **No** (decisión ya en f1B; detalle integración aquí) |
| `complianceReportsApi` / `ComplianceReportPage` | **No** (f4A) |
| Helper `complianceWeightedRisk.js` | **No** |

### 9. Siguiente paso (post f3B)

Ver secciones **C.13.1C-f4A** y **C.13.1C-f4B** para integración y cierre documental reports/export.

---

## C.13.1C-f4A — weightedRiskScore reports/export integration — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED — reports/export integration complete**  
**Commit:** `c7c567b` — `feat(compliance): surface weighted risk in reports`  
**Baseline:** `HEAD = origin/main = c7c567b`

### 1. Alcance

Integración mínima de `weightedRiskScore` en Compliance reports, export HTML/PDF, board pack y decision memo. Sin dashboards, sin backend, sin motor operativo.

### 2. Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/modules/compliance/services/complianceReportsApi.js` | `resolveWeightedRiskScoreForSupplier`, `WEIGHTED_RISK_LABEL`, `buildComplianceReportBoardRows`, payload/export |
| `src/modules/compliance/pages/ComplianceReportPage.jsx` | `buildCurrentReport`, persist/export con weighted opcional |
| `tests/unit/compliance/complianceReportsApi.test.js` | 7 tests (nuevo) |

### 3. Cálculo en report payload

En `ComplianceReportPage.buildCurrentReport()`:

- `resolveWeightedRiskScoreForSupplier(engine.activeSupplier)`
- Solo si existen propiedades explícitas `financialRisk`, `jurisdictionRisk`, `evidenceRisk`
- Llama a `calculateWeightedRiskScore` (helper `complianceWeightedRisk.js`)
- Pasa `weightedRiskScore` a `buildSupplierReport` solo si es finito

### 4. Regla de datos

| Condición | Comportamiento |
|---|---|
| 3 inputs explícitos finitos | `weightedRiskScore` en informe + fila export |
| Faltan inputs | `null` → propiedad omitida → **sin fila** "Weighted risk (explicable)" |
| Derivación prohibida | No usar region, tier, spend, alerts, criticality, evidence gap, reviews, confidence |

### 5. Label y separación

| Métrica | Label export |
|---|---|
| Operativo | **Risk Score** (sin cambio) |
| Explicable | **Weighted risk (explicable)** |

No sustituye `riskScore`, `operationalRiskScore` ni `resilienceScore`.

Fila weighted en board pack: **después** de "Risk Score", solo si valor finito.

### 6. Tests y validaciones

| Test / comando | Resultado |
|---|---|
| `complianceReportsApi.test.js` | 7/7 — golden 68, sin derivación, export HTML label/68, sin fila engañosa |
| `tests/unit/compliance` | 46/46 |
| `npm run test:unit` | 135/135 |
| `npm run build` | OK |

### 7. Scope confirmado (f4A)

Golden, registries, backend, dashboards, Supplier Detail, CEO Overview, Reporting general, `useComplianceEngine`, `complianceScoring`, `resilienceScore` — **no tocados**.

### 8. Nota operativa

Proveedores demo actuales **no** muestran weighted en export (sin `financialRisk`/`jurisdictionRisk`/`evidenceRisk`). **Comportamiento correcto.** Fase posterior: modelo de datos o demo explícita.

### 9. Estado C13-P1 post f4A

| ID | Estado |
|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** — RESOLVED FOR REPORTS/EXPORT SCOPE; broader model-data adoption pending |
| C13-P1-05 | **PARTIALLY RESOLVED** — f8A/f8B complete (ver f8C) |
| C13-P1-06 | **PARTIALLY RESOLVED** |

---

## C.13.1C-f4B — weightedRiskScore reports/export closure — CLOSED (DOCS ONLY)

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)**  
**Referencia técnica:** **C.13.1C-f4A** — commit `c7c567b`

### 1. Resumen ejecutivo

`weightedRiskScore` queda operativo en **informes Compliance y export** como métrica explicable opcional. Helper (`adcdf77`) + test golden + integración reports (`c7c567b`) completos para el alcance definido. **No** es score operativo global. **No** sustituye `riskScore` en dashboards.

### 2. Product truthfulness

- Puede aparecer en board pack / export con label **Weighted risk (explicable)**
- **No** debe mostrarse sin inputs explícitos
- **No** debe confundirse con Risk Score operativo
- Demo actual: weighted ausente en export → esperado

### 3. C13-P1-04 — estado documental

**RESOLVED FOR REPORTS/EXPORT SCOPE.**

Inventario usa **PARTIALLY RESOLVED** porque pendiente:

- Adopción en modelo de datos / demo suppliers con 3 dimensiones
- Dashboards, Supplier Detail, CEO Overview (fuera f4A)
- Backend persistence de dimensiones weighted (futuro)

**No** marcar RESOLVED global sin matiz.

### 4. Issues no cerrados

| ID | Estado |
|---|---|
| C13-P1-05 | **PARTIALLY RESOLVED** — f8A/f8B complete (ver f8C) |
| C13-P1-06 | **PARTIALLY RESOLVED** — labels/precedence fixed (f6B); backend/model rename pending |

### 5. Siguiente paso (post f4B)

Ver **C.13.1C-f9A** (cierre global cadena scoring). Siguiente: **C.13.2** Formula Approval Gate.

---

## C.13.1C-f6A — Compliance scoring precedence tests — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED** — test coverage added (no product code changes).  
**Commit:** `1580d6f` — `test(compliance): add scoring precedence coverage`  
**Baseline:** `HEAD = origin/main` post f5B docs.

### Alcance

- Nuevo `tests/unit/compliance/compliancePrecedence.test.js` (8 tests iniciales; ampliado a 9 en f6B).
- Documenta: persisted `riskScore` vs operational (`useComplianceEngine`) vs `weightedRiskScore`.
- Documenta gap re-export (store vs report) y CEO Overview (pre-f6B).

### Validaciones (f6A)

| Suite | Resultado |
|---|---|
| `compliancePrecedence.test.js` | 8/8 (f6A) |
| `tests/unit/compliance` | 54/54 |
| `npm run test:unit` | 143/143 |
| `npm run build` | OK |

### Estado C13-P1-06 post f6A

**OPEN** — tests listos; fix controlado pendiente en **f6B**.

---

## C.13.1C-f6B — Operational risk score precedence fix — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED** — controlled fix completed.  
**Commit:** `1e82980` — `fix(compliance): clarify operational risk score precedence`  
**Baseline:** `HEAD = origin/main = 1e82980` (post f6A `1580d6f`).

### 1. Scope

Fix controlado de **labels** y **precedencia visible** de scoring Compliance (C13-P1-06). Sin cambiar fórmulas, sin backend, sin Golden Dataset, sin resilience.

### 2. Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/modules/compliance/services/complianceReportsApi.js` | `OPERATIONAL_RISK_LABEL`; board rows |
| `src/modules/compliance/pages/ComplianceReportPage.jsx` | Labels UI; re-export `report.riskScore` primero |
| `src/modules/compliance/pages/ComplianceDashboardPage.jsx` | Label avg operational |
| `src/modules/compliance/pages/SuppliersPage.jsx` | Labels KPI/signal |
| `src/modules/compliance/pages/SupplierDetailPage.jsx` | Labels operational |
| `src/modules/compliance/pages/RiskMapPage.jsx` | Labels KPI/signal |
| `src/modules/ceo-overview/pages/CEOOverviewPage.jsx` | `complianceEngine.suppliers` en overview |
| `tests/unit/compliance/compliancePrecedence.test.js` | 9 tests (labels, re-export, CEO) |
| `tests/unit/compliance/complianceReportsApi.test.js` | Export label operational |

### 3. Labels corregidos

| Antes | Después | Nota |
|---|---|---|
| Risk Score / Risk score | **Operational risk score** | Cuando el valor viene del motor operativo FE (`useComplianceEngine` / `calculateSupplierRiskScore`) |
| Avg risk / Average risk | **Avg operational risk score** | Suppliers, Risk map, Compliance dashboard |
| Riesgo medio / Riesgo medio cartera | **Riesgo operativo medio** | Copy explícito: operational risk score — portfolio average |
| Weighted risk (explicable) | **Sin cambio** | Sigue separado y condicional |
| Resilience | **Sin cambio** | C13-P1-05 — no abierto en f6B |
| CEO audit “CEO risk score” | **Sin cambio** | Audit score distinto del operational compliance score |

### 4. Reports / export

- `OPERATIONAL_RISK_LABEL = "Operational risk score"`.
- `buildComplianceReportBoardRows` usa esa etiqueta para `riskScore` operativo del informe.
- **Weighted risk (explicable)** sigue separado y condicional (`WEIGHTED_RISK_LABEL`).
- **No** se sustituye `weightedRiskScore` por `riskScore` ni se deriva weighted desde operativo.

### 5. Re-export (stored reports)

**Política aplicada en `handleExportStoredReport`:**

```text
riskScore: report.riskScore ?? supplier?.riskScore
```

| Prioridad | Fuente |
|---|---|
| 1 | Snapshot del report guardado (`report.riskScore`) |
| 2 | Store supplier solo si falta en el report |

**Resultado:** se evita mezclar silenciosamente el `riskScore` persistido del store sobre el snapshot del informe al re-exportar.

### 6. CEO Overview

- `useComplianceEngine` asignado a `complianceEngine`.
- `getComplianceOverview` recibe `complianceEngine.suppliers` (misma fuente operativa que dashboards Compliance).
- CEO Overview deja de usar solo `safeSuppliers` sin enriquecer por engine.

### 7. Tests

| Archivo | Cobertura |
|---|---|
| `compliancePrecedence.test.js` | 9 tests: persisted vs operational; weighted separado; report paths; re-export report-first; CEO alineado con engine; export labels |
| `complianceReportsApi.test.js` | Operational risk score en HTML/export; weighted separado; sin NaN/999/Infinity |

### 8. Validaciones (f6B)

| Comando | Resultado |
|---|---|
| `compliancePrecedence.test.js` | 9/9 |
| `complianceReportsApi.test.js` | OK |
| `tests/unit/compliance` | 55/55 |
| `npm run test:unit` | 144/144 |
| `npm run build` | OK |

### 9. Scope confirmado (f6B)

| Área | Tocado en f6B |
|---|---|
| Fórmulas (`complianceScoring`, `complianceWeightedRisk`, `resilienceScore`) | **No** |
| Backend / Golden Dataset / registries docs | **No** |
| Docs inventario | **No** (cierre en f6C) |
| `backend-server.err` | Fuera del commit |

### 10. Estado C13-P1 (post f6B)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export scope complete; broader model-data/dashboards/backend adoption pending |
| C13-P1-05 | **PARTIALLY RESOLVED** | f8A/f8B complete; backend/model rename pending |
| C13-P1-06 | **PARTIALLY RESOLVED** | Labels/precedence + re-export + CEO source aligned; **backend/API/model rename pending** (`persistedRiskScore` / `operationalRiskScore`) — **no RESOLVED global** |

### 11. Product truthfulness

- UI y exports distinguen mejor el **score operativo** del **weighted risk (explicable)**.
- Persisted snapshot vs operational score queda mejor protegido (re-export report-first; CEO con engine).
- Falta fase posterior si se formaliza modelo de datos/API: campos explícitos `persistedRiskScore` / `operationalRiskScore`.

### 12. Siguiente paso recomendado (post f6B)

| Ruta | Objetivo |
|---|---|
| **A) C.13.1C-f7A** (recomendado) | Auditoría read-only C13-P1-05 `resilienceScore` — Golden vs FE vs UI/reports |
| B) C.13.1D | Auditoría read-only modelo `riskScore` / persisted vs operational |
| C) C.13.2 | Formula Approval Gate — después de cerrar cadena Compliance scoring |

**Recomendación (histórico post-f6B):** superseded por **C.13.1C-f7A/f7B** — ver sección f7A/f7B.

---

## C.13.1C-f6C — Inventario cierre parcial C13-P1-06 — DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)**  
**Commit documental:** (esta fase) — `docs: record compliance precedence fix closure`  
**Registra cierre de:** f6A `1580d6f` + f6B `1e82980`.

**C13-P1-06 permanece PARTIALLY RESOLVED** — no marcar RESOLVED global hasta rename/modelo backend/API.

---

## C.13.1C-f7A/f7B — resilienceScore source-of-truth decision — READ-ONLY + DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estados:** **C.13.1C-f7A CLOSED (READ ONLY)** · **C.13.1C-f7B CLOSED (DOCS ONLY)**  
**Baseline auditado:** `HEAD = origin/main = ca95b61` (post f6C `ca95b61`, f6B `1e82980`)  
**Sin modificaciones de código** en f7A/f7B · **Sin commit de código** en f7A

### 1. Estado de fases

| Fase | Estado |
|---|---|
| **f7A** | **CLOSED** — auditoría read-only C13-P1-05; cero archivos modificados |
| **f7B** | **CLOSED** — decisión documental Option C híbrido; solo inventario |

### 2. Hallazgos Golden (f7A)

| Campo | Valor |
|---|---|
| **Golden ID** | `compliance_resilience_score_basic` |
| **Fórmula** | `resilienceScore = clamp(100 - riskScore + mitigationBonus, 0, 100)` |
| **Inputs** | `riskScore: 68`, `mitigationBonus: 8` |
| **Expected** | `resilienceScore: 40` |
| **manualCalculation** | `100 - 68 + 8 = 40` |
| **tolerance** | `0` |
| **edgeCase** | `false` |

**GAP confirmado:** `mitigationBonus` **no existe** en modelo supplier, API ni FE — solo en `golden_inputs.json` y `FORMULA_REGISTRY.md`. El `riskScore: 68` del golden es **input abstracto** del oráculo (no el motor operativo FE).

### 3. Hallazgos backend (f7A)

| Aspecto | Hallazgo |
|---|---|
| **Archivo principal** | `backend/services/compliance/suppliers.service.js` |
| **Cálculo** | **No calcula** `resilienceScore` |
| **Comportamiento** | `normalizeSupplierPayload` → `clampScore(resilienceScore, 50)` en create/update |
| **SoT** | **Persistence SoT** — snapshot histórico/legacy desde payload cliente |
| **mitigationBonus** | **No existe** en backend |

### 4. Hallazgos frontend (f7A)

| Aspecto | Hallazgo |
|---|---|
| **Archivo** | `src/modules/compliance/engine/resilienceScore.js` → `calculateResilienceScore` |
| **Fórmula FE (operativa)** | `base 72 - criticalityPenalty - tierPenalty - alertPenalty - concentrationPenalty + evidenceBonus + reviewBonus` → `clamp(round(score), 0, 100)` |
| **Inputs reales** | `supplier`, `alerts`, `evidenceItems`, `reviews` (incl. `spend` vía supplier) |
| **Orquestación** | `useComplianceEngine` **sobrescribe** `supplier.resilienceScore` con valor calculado FE |
| **Ejemplo test** | Fixture `supplierBase` (Alta/Tier1/spend 420k) → **51/100** — no coincide con golden **40** |

**Mismatch confirmado:** Golden y motor FE son **métricas distintas**, no error de redondeo.

### 5. Hallazgos UI / reports / export (f7A)

| Superficie | Valor | Fuente actual | Riesgo |
|---|---|---|---|
| Dashboards, Suppliers, Risk map, Supplier detail | `resilienceScore/100` | **Operativo FE** (engine) | Label genérico "Resilience" — confusión con golden/persistido |
| Report generado (`buildCurrentReport`) | `engine.activeSupplier.resilienceScore` | **Operativo FE** | Coherente con generación viva |
| Export board rows | `report.resilienceScore` | Del payload del report | Label `Resilience` — sin distinción operational vs golden |
| Re-export stored (`handleExportStoredReport`) | `supplier?.resilienceScore ?? report.resilienceScore` | **Store primero** | **Invertido** respecto a `riskScore` post-f6B (`report` primero) — alinear en **f8B** |
| CEO Overview | Sin métrica resilience directa | Agregado compliance usa risk operativo (f6B) | Bajo para resilience |

### 6. Decisión adoptada — Option C (híbrido controlado)

Replica la arquitectura ya adoptada para Compliance scoring (Option C — f1B/f5B/f6):

| Métrica conceptual | Rol | Implementación actual (legacy) | SoT por capa |
|---|---|---|---|
| **persistedResilienceScore** | Snapshot histórico / payload API | Campo `resilienceScore` en BE/store | Backend persistence (clamp 0–100) |
| **operationalResilienceScore** | DSS operativo vivo | `calculateResilienceScore` + `useComplianceEngine` | **Frontend engine** — UI e informes operativos |
| **goldenResilienceScore** (benchmark) | Oráculo / informes explicables | `clamp(100 - riskScore + mitigationBonus, 0, 100)` | Golden + Formula Registry — **helper pendiente f8A** |

**Prohibido en esta decisión:**
- Sustituir motor FE por fórmula Golden sin Formula Approval y sin inputs reales en producto.
- Inferir `mitigationBonus` desde alerts, evidence, reviews o spend.
- Mover cálculo resilience al backend en f8.
- Marcar C13-P1-05 como RESOLVED en f7B.

### 7. Política futura (f8+)

| Superficie | Política |
|---|---|
| **UI / dashboards / informes operativos** | Mostrar **operationalResilienceScore** con label explícito (**Operational resilience score** en f8B). No presentar persistido como score vivo. |
| **Golden / benchmark** | Helper puro + test contra `compliance_resilience_score_basic` (**f8A**). Solo calcular si existen inputs explícitos `riskScore` + `mitigationBonus`. |
| **Reports/export** | Mantener `resilienceScore` operativo en informes generados; golden/benchmark separado si inputs explícitos (patrón weighted f4A). |
| **Re-export stored** | **f8B:** `report.resilienceScore ?? supplier?.resilienceScore` (alinear con risk post-f6B). |
| **Backend** | Sigue **persistence SoT**; no calculation SoT hasta fase enterprise explícita. |

### 8. Tests — estado y gaps (f7A)

| Cobertura | Estado |
|---|---|
| `resilienceScore.test.js` | Motor FE (ej. 51 base) — **sin** golden 40 |
| `useComplianceEngine.test.js` | Rangos 0–100 — **sin** precedence resilience |
| `compliancePrecedence.test.js` | Risk/weighted — **sin** resilience |
| `goldenInputsSchema.test.js` | Esquema ID — **sin** implementación oráculo |
| Helper golden resilience | **No existe** (pendiente f8A) |

### 9. Product truthfulness

- La UI **no debe** presentar `resilienceScore` como métrica única universal.
- Diferenciar: **operational resilience** vs **persisted snapshot** vs **golden benchmark**.
- No confundir resilience operativo con `weightedRiskScore` ni con `operationalRiskScore` (f6B).

### 10. Estado C13-P1 (post f7B)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export weighted complete; broader adoption pending |
| C13-P1-05 | **PARTIALLY RESOLVED** (histórico post-f7B) | Superseded por f8A/f8B/f8C — ver sección f8A/f8B |
| C13-P1-06 | **PARTIALLY RESOLVED** | Labels/precedence risk (f6B); backend/model rename pending |

### 11. Siguiente paso recomendado

**C.13.1C-f8A — Helper + test Golden resilience (sin integración UI)**

| Objetivo | Restricción |
|---|---|
| Helper puro (ej. `calculateBenchmarkResilienceScore` / `calculateGoldenResilienceScore`) | Solo `riskScore` + `mitigationBonus` explícitos |
| Test vs `compliance_resilience_score_basic` → expected **40** | Tolerance **0** |
| **No** tocar `resilienceScore.js` operativo | |
| **No** tocar UI, backend, Golden Dataset, registries | |

**C.13.1C-f8B — Labels + re-export resilience (post f8A)**

- Label **Operational resilience score** donde el valor sea motor FE.
- Re-export: `report.resilienceScore ?? supplier?.resilienceScore`.
- Tests precedence resilience en `compliancePrecedence.test.js` / reports API.
- **Sin** mover cálculo al backend.

**No abrir C.13.2 Formula Approval Gate** hasta cerrar f8A + f8B de la cadena Compliance scoring.

### 12. Scope confirmado (f7A/f7B)

| Área | Tocado |
|---|---|
| `PHASE_A1_CLEANUP_INVENTORY.md` | **Sí** (f7B) |
| `src/` / `backend/` / `tests/` | **No** |
| Golden / `FORMULA_REGISTRY` / `SOURCE_OF_TRUTH_REGISTRY` | **No** (f7B) |

---

## C.13.1C-f8A/f8B — resilienceScore golden helper and operational precedence — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estados:** **C.13.1C-f8A CLOSED** · **C.13.1C-f8B CLOSED** · **C.13.1C-f8C CLOSED (DOCS ONLY)**  
**Baseline:** `HEAD = origin/main = eb48db6` (post f7B `fbe1d61`)

### 1. C.13.1C-f8A — Golden resilience helper (CLOSED)

| Campo | Valor |
|---|---|
| **Commit** | `4414208` — `test(compliance): add golden resilience helper` |
| **Helper** | `src/modules/compliance/engine/complianceGoldenResilience.js` → `calculateGoldenResilienceScore` |
| **Test** | `tests/unit/compliance/complianceGoldenResilience.test.js` (6 tests) |
| **Golden ID** | `compliance_resilience_score_basic` |
| **Inputs** | `riskScore: 68`, `mitigationBonus: 8` |
| **Expected** | `resilienceScore: 40` |
| **Fórmula** | `clamp(100 - riskScore + mitigationBonus, 0, 100)` |
| **Tolerance** | `0` |

**Edge cases cubiertos (f8A):** input ausente → `null`; no finito → `null`; clamp inputs 0–100; salida 0–100; sin NaN/Infinity.

**Scope f8A:** sin UI, sin backend, sin `resilienceScore.js` operativo, sin Golden Dataset, sin registries.

### 2. C.13.1C-f8B — Operational resilience labels/re-export (CLOSED)

| Campo | Valor |
|---|---|
| **Commit** | `eb48db6` — `fix(compliance): clarify operational resilience score precedence` |

**Archivos modificados (7):**

| Archivo | Cambio |
|---|---|
| `complianceReportsApi.js` | `OPERATIONAL_RESILIENCE_LABEL`; board rows |
| `ComplianceReportPage.jsx` | Labels UI; re-export `report.resilienceScore ?? supplier?.resilienceScore` |
| `SuppliersPage.jsx` | Labels KPI/signal |
| `SupplierDetailPage.jsx` | Labels operational |
| `RiskMapPage.jsx` | Labels KPI/signal |
| `compliancePrecedence.test.js` | 12 tests (+ resilience precedence) |
| `complianceReportsApi.test.js` | Export label operational resilience |

**Labels aplicados:**

| Antes | Después |
|---|---|
| Resilience / Resilience Score | **Operational resilience score** |
| Avg resilience | **Avg operational resilience score** |
| Resiliencia media | **Resiliencia operativa media** (+ copy explícito) |

**Re-export stored report (f8B):**

```text
resilienceScore: report.resilienceScore ?? supplier?.resilienceScore
```

Prioridad: snapshot del report primero; store solo si falta (alineado con risk post-f6B).

**Validaciones f8B:**

| Suite | Resultado |
|---|---|
| `tests/unit/compliance` | 64/64 |
| `npm run test:unit` | 153/153 |
| `npm run build` | OK |

**Scope confirmado f8B:**

| Área | Tocado |
|---|---|
| `resilienceScore.js` operativo | **No** |
| `complianceGoldenResilience.js` | **No** (f8A only) |
| Backend / Golden / registries / docs | **No** en f8B |
| Integración golden en UI principal | **No** |

### 3. Product truthfulness (post f8A/f8B)

- UI/export distinguen mejor **operational resilience** del **golden benchmark**.
- `goldenResilienceScore` = oráculo separado (`calculateGoldenResilienceScore`); no sustituye motor FE.
- `operationalResilienceScore` = `calculateResilienceScore` + engine para dashboards/informes operativos.
- `persistedResilienceScore` = snapshot BE/API; rename formal pendiente.

### 4. Estado C13-P1 (post f8A/f8B/f8C)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export weighted complete; broader model-data/dashboards/backend adoption pending |
| C13-P1-05 | **PARTIALLY RESOLVED** | Golden helper/test (f8A) + operational labels/re-export (f8B); **backend/API/model rename pending** — **no RESOLVED global** |
| C13-P1-06 | **PARTIALLY RESOLVED** | Labels/precedence risk + CEO + re-export; backend/model rename pending |

### 5. Siguiente paso recomendado (histórico post-f8B)

Superseded por **C.13.1C-f9A** — ver sección **Compliance scoring chain global closure** más abajo.

---

## C.13.1C-f9A — Compliance scoring chain global closure — DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **DOCS CLOSED** — Compliance scoring chain closed for current scope.  
**Baseline:** `HEAD = origin/main = e5c74b2` (post f8C `f4da19a` / `e5c74b2`, f8B `eb48db6`)

### 1. Alcance cerrado (cadena C.13.1C)

| Tema | Cerrado en alcance actual |
|---|---|
| **weightedRiskScore** (C13-P1-04) | Helper puro + test Golden; integración reports/export; label **Weighted risk (explicable)**; sin dashboards contaminados |
| **operational risk score** (C13-P1-06) | Auditoría + decisión híbrida; tests precedence; label **Operational risk score**; re-export report-first; CEO Overview con `complianceEngine.suppliers` |
| **operational resilience score** (C13-P1-05) | Decisión híbrida; helper Golden resilience; labels operational; re-export report-first; sin cambiar motor FE operativo |
| **Golden oracles** | `compliance_weighted_risk_score_basic` (68); `compliance_resilience_score_basic` (40) |
| **Reports/export** | Labels operativos + weighted condicional; política re-export snapshot-first |
| **Product truthfulness** | Tres métricas separadas documentadas; no mezclar weighted/operational/golden sin inputs |

### 2. Commits principales (cronología)

| Commit | Descripción |
|---|---|
| `adcdf77` | `test(compliance): add weighted risk golden helper` |
| `c7c567b` | `feat(compliance): surface weighted risk in reports` |
| `1580d6f` | `test(compliance): add scoring precedence coverage` |
| `1e82980` | `fix(compliance): clarify operational risk score precedence` |
| `4414208` | `test(compliance): add golden resilience helper` |
| `eb48db6` | `fix(compliance): clarify operational resilience score precedence` |
| `fbe1d61` / `f4da19a` / `e5c74b2` | Cierres documentales f7B/f8C/f9A en inventario |

### 3. Estado final C13-P1 (no marcar RESOLVED global)

| ID | Estado | Cerrado | Pendiente |
|---|---|---|---|
| **C13-P1-04** | **PARTIALLY RESOLVED** | Helper/test weighted + reports/export + label explicable | Adopción modelo/demo/dashboards/backend con inputs `financialRisk`/`jurisdictionRisk`/`evidenceRisk` |
| **C13-P1-05** | **PARTIALLY RESOLVED** | Golden helper/test + labels operational resilience + re-export report-first | Rename/modelo: `persistedResilienceScore` / `operationalResilienceScore`; Formula Approval metadata |
| **C13-P1-06** | **PARTIALLY RESOLVED** | Tests + labels operational risk + re-export + CEO alignment + weighted separado | Rename/modelo: `persistedRiskScore` / `operationalRiskScore`; BE calculation SoT futuro |

### 4. Product truthfulness (cierre cadena)

- **weightedRiskScore** no se mezcla con operational risk score.
- **Operational risk score** y **Operational resilience score** etiquetados en UI/export operativo.
- **Re-export** prioriza snapshot del report: `report.riskScore ?? supplier?.riskScore` y `report.resilienceScore ?? supplier?.resilienceScore`.
- **Golden resilience** y **weighted risk** quedan como benchmark/oracle separados; no se muestran si faltan inputs explícitos.
- **CEO Overview** usa fuente operativa de risk (engine), no store crudo sin enriquecer.

### 5. Límites actuales (explícitos)

| Límite | Detalle |
|---|---|
| Backend | **Persistence SoT** — no calculation SoT para scoring Compliance |
| Campos API/DB | Sin rename formal (`riskScore`/`resilienceScore` legacy) |
| Cálculo en BE | No movido en esta cadena |
| Formula Approval Gate | **No ejecutado** — pendiente C.13.2 |
| C13-P1-04/05/06 | **PARTIALLY RESOLVED** — no promover a RESOLVED global sin modelo enterprise |

### 6. Pendientes técnicos futuros (fuera C.13.1C)

- `persistedRiskScore` / `operationalRiskScore` (campos y labels formales).
- `persistedResilienceScore` / `operationalResilienceScore`.
- Modelo backend/API y posible demo con dimensiones weighted explícitas.
- **C.13.2 Formula Approval Gate:** owner, fuente, inputs, unidades, edge cases, Golden ID, test, status, fecha aprobación, límites de uso; posible `formulaRegistryCoverage.test.js`.

### 7. Decisión de cierre

La cadena **C.13.1C Compliance scoring** queda **cerrada** para el alcance:

- reports / export / labels / tests / documentación source-of-truth.

**No seguir tocando Compliance scoring** antes de abrir **C.13.2**, salvo bug crítico de producción.

### 8. Siguiente paso

**C.13.2 — Formula Approval Gate**

| Objetivo |
|---|
| Control formal de fórmulas críticas: Formula ID, owner, fuente, inputs, unidades, fórmula, edge cases, Golden Dataset, test, status, fecha, límites de uso |

**No abrir C.13.2** antes de este cierre f9A (completado en inventario).

---

## C.13.2A — Formula Approval Gate foundation — CLOSED

**Fecha:** 20 mayo 2026  
**Estado:** **Foundation Added** — metadata mínima + protocolo + test de cobertura; sin cambios de producto ni Golden Dataset.

### Qué se añadió

| Artefacto | Detalle |
|---|---|
| `docs/testing/FORMULA_REGISTRY.md` | Sección **Formula Approval Gate (C.13.2A)** + bloques metadata para 5 fórmulas críticas |
| `docs/testing/LOGIC_INTEGRITY_PROTOCOL.md` | Sección **Formula Approval Gate** con reglas de gate y estados |
| `tests/unit/golden/formulaRegistryCoverage.test.js` | Cobertura mínima de campos + Golden IDs + test files declarados |

### Fórmulas mínimas cubiertas

| Formula ID | Golden | Test | Status documentado |
|---|---|---|---|
| `FUNDING_RUNWAY_MONTHS` | `funding_runway_zero_burn` (+ basic) | `fundingFormulas.test.js` | Implemented and tested |
| `COMPLIANCE_WEIGHTED_RISK` | `compliance_weighted_risk_score_basic` | `complianceWeightedRisk.test.js` | Implemented for limited scope |
| `COMPLIANCE_RESILIENCE` | `compliance_resilience_score_basic` | `complianceGoldenResilience.test.js` | Implemented for limited scope (golden oracle) |
| `COMPLIANCE_OPERATIONAL_RISK` | N/A (operational) | `compliancePrecedence.test.js` | Pending validation |
| `COMPLIANCE_OPERATIONAL_RESILIENCE` | N/A (operational) | `compliancePrecedence.test.js` | Pending validation |

### Límites (C.13.2A)

- No se tocó `src/**`, `backend/**`, tests de producto existentes, ni `golden_inputs.json`.
- Filas del Required Formula Table fuera de las 5 anteriores siguen **Pending C.13.2 validation**.
- Operational risk/resilience: **Pending human approval** — no certificación externa.
- C13-P1-04/05/06 permanecen **PARTIALLY RESOLVED** (no reabierta cadena scoring en código).

### Pendiente C.13.2B

- Inventario de **todas** las fórmulas del registry: Approved for DSS/demo · Implemented and tested · Pending Golden · Pending Owner · Pending external validation · Deprecated.
- Actualizar Implementation Status por módulo tras auditoría.
- Posible ampliación de `formulaRegistryCoverage.test.js` por lotes (sin exigir completitud global en un solo paso).

### Siguiente paso

**C.13.2B — Formula Approval Gate expansion / inventory** (docs only; clasificar fórmulas restantes).

---

## C.13.2B — Formula Approval Gate expansion / inventory — CLOSED

**Fecha:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)** — inventario ampliado; sin cambios de producto ni Golden Dataset.

### Qué se inventarió

| Artefacto | Detalle |
|---|---|
| `FORMULA_REGISTRY.md` | Bloques `###` de approval para **11 fórmulas nuevas** (M&A×4, Funding×2, PMI, Bridge, Risk, Reporting, Executive) + tabla resumen C.13.2B |
| Required Formula Table | Estados actualizados a **Pending C.13.x validation** o enlace a C.13.2A (runway) |
| Pending discovery | **12 áreas** sin fila en tabla (stubs Golden / heurísticas / Governance) |

### Conteo

| Métrica | Valor |
|---|---|
| Filas Required Formula Table | **16** |
| Bloques approval (`###`) | **16** (5 C.13.2A + 11 C.13.2B) |
| Implemented and tested (gate) | **1** (`FUNDING_RUNWAY_MONTHS`) |
| Implemented for limited scope | **2** (compliance weighted + golden resilience) |
| Pending validation (operational compliance) | **2** |
| Pending C.13.x validation | **11** |
| Pending discovery (fuera tabla) | **12** clasificadas |
| Externally / production certified | **0** |

### Por módulo (clasificación)

| Módulo | Formula IDs | Estado predominante |
|---|---|---|
| Funding | `FUNDING_RUNWAY_MONTHS`, `POST_MONEY`, `INVESTOR_OWNERSHIP` | Implemented and tested (C.13.3C/D); readiness/window DSS pending |
| M&A | `EV_EBITDA`, `NET_DEBT`, `EQUITY_VALUE`, `WATERFALL_SIMPLE` | Pending C.13.x + Pending external (valuation) |
| Compliance | 5 IDs C.13.2A | Sin cambio; cadena cerrada |
| PMI | `PMI_CAPTURE_RATE` | Pending C.13.6 |
| Bridge | `BRIDGE_PRIORITY` | Pending C.13.7 |
| Risk | `RISK_LIKELIHOOD_IMPACT` | Pending C.13.8 |
| Reporting | `REPORTING_VARIANCE` | **Logic baseline closed (C.13.8F)** — Golden tested; product deferred; e2e pass; PDF/renderer P2 |
| Executive | `EXEC_MODULE_HEALTH_AVG` | Pending C.13.1 |

### Qué NO se tocó

- `src/**`, `backend/**`, tests de producto, `golden_inputs.json`, `LOGIC_INTEGRITY_PROTOCOL.md`, `SOURCE_OF_TRUTH_REGISTRY.md`.
- C13-P1-04/05/06 — **PARTIALLY RESOLVED** (no reabierto).
- No se promovió ninguna fórmula a **production-ready certified**.

### Riesgos documentados

- Golden existe pero **sin unit test dedicado** para M&A, post-money, PMI, Bridge, Risk, Reporting, Executive → riesgo de drift FE/BE hasta auditoría C.13.x.
- M&A valuation/waterfall: **Pending external validation** (fairness / legal language).
- Executive module health: **empty map** edge case aún por fijar en código (C.13.1).
- Discovery rows: stubs en `golden_inputs.json` **future phase** — no inventar fórmulas.

### Siguiente paso

1. **C.13.2C** — Formula Approval Gate enforcement / CI hardening (lotes en `formulaRegistryCoverage.test.js`).  
2. **C.13.3** — Funding formulas **CLOSED** (ver C.13.3 — CLOSED); siguiente **C.13.3F** (C13-P1-03) o **C.13.4** M&A.  
3. Auditorías por módulo C.13.1–C.13.9 según tabla discovery.

**Nota test:** C.13.2B no endureció el coverage test global; C.13.2C lo hará por lotes.

---

## C.13.2C — Formula Approval Gate enforcement / CI hardening — CLOSED

**Fecha:** 20 mayo 2026  
**Estado:** **CLOSED** — `formulaRegistryCoverage.test.js` endurecido por lote clasificado (16 fórmulas); sin producto ni Golden.

### Qué se endureció

| Regla | Comportamiento |
|---|---|
| Campos mínimos | `Formula ID`, `Module`, `Owner`, `Source`, `Status`, `Approval`, `Inputs`, `Formula`, `Usage limits` en los **16** bloques `###` |
| Golden | Si `Golden ID` ≠ N/A → cada id declarado debe existir en `golden_inputs.json` |
| Test file | Si `Test file` ≠ `pending` → ruta `tests/...` debe existir en disco |
| Approval `Approved` | Solo con scope explícito (DSS/demo, reports/export, limited scope) |
| Pending | Solo fragmentos permitidos (Golden, Owner, external, C.13.x, implementation, discovery, human, validation) |

### Qué sigue permitido (sin fallar CI)

- `Golden ID: N/A` justificado (operational compliance).
- `Test file: pending` (M&A, PMI, Bridge, Risk, Reporting, Executive, post-money).
- `Status` / `Approval` con Pending (no promoción a Approved global).
- **12 áreas Pending discovery** — fuera del lote de 16; no exigidas en C.13.2C.
- **No** cobertura 100% del Required Formula Table ni fórmulas sin bloque `###`.

### Qué NO se tocó

- `src/**`, `backend/**`, tests de módulos, `golden_inputs.json`, `FORMULA_REGISTRY.md` (sin inconsistencias detectadas).
- Ninguna fórmula marcada como certificación legal/financiera externa.

### Siguiente paso

**C.13.3 — Funding formula coverage** — **CLOSED** (C.13.3A–E). Ver sección **C.13.3 — CLOSED** abajo. Siguiente: **C.13.3F** (C13-P1-03 read-only) o **C.13.4** M&A.

---

## C.13.3 — Funding formula coverage and controlled fix — CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED** for current formula scope (POST_MONEY, INVESTOR_OWNERSHIP / dilution, runway zero-burn, dashboard runway not meaningful, readiness UI → canonical engine).  
**Commits:** `e0e200b` (tests), `eb97064` (fix), cierre docs C.13.3E.

### 1. Estado

Cadena C.13.3 cerrada para el alcance acordado: fórmulas golden + edge cases + alineación dashboard/readiness con motor. **C13-P1-03** (localStorage draft vs API rounds/summary) permanece **OPEN** — fase separada.

### 2. C.13.3A — Read-only audit (completada)

| Hallazgo | Detalle |
|---|---|
| POST_MONEY | Semántica alineada con Golden/Registry; sin test dedicado en ese momento |
| INVESTOR_OWNERSHIP | Alineado; edge `postMoney <= 0` devolvía `0` en FE — pendiente fix |
| Dashboard runway | `FundingDashboardPage` reintroducía `0` cuando `monthlyBurn <= 0` |
| Readiness | Tres definiciones: canónica `fundraisingScoring.js`; duplicadas en Dashboard e Investor Readiness |
| C13-P1-03 | localStorage (draft) vs API (rounds/summary) — vigente, no resuelto |

### 3. C.13.3B — Source-of-truth decisions (docs only)

| Decisión | Valor |
|---|---|
| POST_MONEY | `postMoney = preMoney + newInvestment` |
| FE naming | `preMoneyValuation + targetRaise` → `postMoneyValuation` |
| INVESTOR_OWNERSHIP | `newInvestment / postMoney`; `dilutionPct = ownership * 100` |
| Edge post-money | `postMoney <= 0` => **`null`** |
| Readiness canónico | `src/modules/funding/engine/fundraisingScoring.js` |
| Rounds / summary | API/BE = SoT enterprise |
| Workspace draft | `localStorage` = draft/scenario, no persistencia enterprise |
| C13-P1-03 | **No resuelto** en 3B |

### 4. C.13.3C — Golden tests

**Commit:** `e0e200b` — `test(funding): add golden formula coverage`

| Cobertura | Resultado |
|---|---|
| POST_MONEY golden | 8M + 2M = **10M** |
| INVESTOR_OWNERSHIP / dilution | **20%**; `postRoundOwnership.newInvestors = 20` |
| Runway basic | Desde Golden |
| Zero-burn regression | `null`; no `0` / `999` / `NaN` / `Infinity` |
| Edge `postMoney <= 0` | Inicialmente **`it.todo`** (fix en 3D) |

**Scope:** solo `tests/unit/funding/fundingFormulas.test.js`; sin fix de producto; sin tocar Golden expected.

### 5. C.13.3D — Controlled fix

**Commit:** `eb97064` — `fix(funding): align dashboard formulas with source of truth`

| Cambio | Archivo / detalle |
|---|---|
| `postMoneyValuation <= 0` | `dilutionPct = null`; `postRoundOwnership` completo en `null` |
| `it.todo` | Convertido en test activo (no devuelve `0`, `NaN`, `Infinity`) |
| Dashboard métricas | `FundingDashboardPage` usa `derived` del engine (`useFundingEngine`) |
| Runway post-raise | `null` si `monthlyBurn <= 0`; labels N/A / not meaningful |
| Readiness dashboard | Eliminado `calculateReadinessScore` local duplicado |
| Investor Readiness | `derived.readinessScore` / `readinessLevel` desde engine; umbrales **78 / 58** |
| GAP menor | Sin test de página/`getFundingSignal` (no exportable); copy/señales locales opcionales |

**Validaciones 3D:** `tests/unit/funding` 17/17 · `npm run test:unit` 245/245 · `npm run build` OK.

**Qué NO se tocó en 3D:** `backend/**`, `docs/**`, `golden_inputs.json`, expected outputs, store/services, C13-P1-03; sin `git add .`.

### 6. Product truthfulness (post C.13.3)

- Funding **no** presenta `0` meses de runway como métrica real sin burn.
- Dilution **no** muestra `0` cuando post-money no existe (`null`).
- Readiness en Dashboard e Investor Readiness usa **una fuente canónica** (`fundraisingScoring.js`).
- Métricas de `localStorage` siguen siendo **draft/scenario** — no registro enterprise oficial.

### 7. Estado final recomendado

| Item | Estado |
|---|---|
| POST_MONEY | **RESOLVED** for current scope — implemented and tested |
| INVESTOR_OWNERSHIP / dilution | **RESOLVED** for current scope — tested; edge `postMoney <= 0` fixed |
| Funding runway (engine + BE + dashboard) | **RESOLVED** for current scope — `null` / not meaningful, no `0` como runway real |
| Readiness | **PARTIALLY RESOLVED** — UI alineada al engine; Formula Approval / human validation broader pending; `FUNDING_INVESTOR_READINESS` no fully approved |
| C13-P1-03 | **PARTIALLY RESOLVED** — SoT + labels + tests + legacy migration fix (C.13.3G–J); dashboard runtime/e2e optional pending |

### 8. GAPs documentados (no bloquean cierre 3.x fórmulas)

| GAP | Notas |
|---|---|
| Dashboard `getFundingSignal` | Sin unit test dedicado (helper no exportado) |
| Investor Readiness copy | `getReadinessSignal` puede seguir siendo copy local (umbrales ya 78/58) |
| Funding window / funding risk | Backend heurísticas — Pending Formula Approval |
| C13-P1-03 | Reconciliación UI draft vs API — fase aparte |

### 9. Siguiente paso recomendado

| Ruta | Cuándo |
|---|---|
| **A — C.13.3H** | Labels/copy + tests strategy draft vs persisted (`FundingDashboardPage`, `fundingStore`) |
| **B — C.13.4** | M&A valuation / waterfall integrity — si se prioriza fórmulas por módulo |

**Recomendación (post C.13.3G):** Ruta A (C.13.3H) si se quiere cerrar product truthfulness Funding antes de M&A; Ruta B si se avanza cadena C.13 por módulos.

### 10. Qué NO se tocó (cadena C.13.3 completa)

- Golden Dataset expected outputs (sin cambios en 3C/3D).
- `SOURCE_OF_TRUTH_REGISTRY.md`, `LOGIC_INTEGRITY_PROTOCOL.md`, `GOLDEN_DATASETS.md` (salvo este inventario + registry en 3E).
- Backend en 3C/3D/3E.
- C13-P1-03 **no** marcado RESOLVED.

---

## C.13.3F / C.13.3G — Funding persistence source-of-truth — READ-ONLY + DOCS CLOSED

**Fechas:** 23 mayo 2026  
**C.13.3F:** **CLOSED (READ ONLY)** — auditoría C13-P1-03 sin modificaciones de código.  
**C.13.3G:** **CLOSED (DOCS ONLY)** — decisión SoT persistencia Funding (Option C híbrido por fases).  
**Baseline:** `HEAD = origin/main = 520fbd1`

### 1. Estado subfases

| Subfase | Estado |
|---|---|
| C.13.3F | **CLOSED** — read-only audit |
| C.13.3G | **CLOSED** — docs only |
| C13-P1-03 | **PARTIALLY RESOLVED** — ver sección **C.13.3K** (3H–J completadas) |

**No marcar C13-P1-03 como RESOLVED** hasta completar separación UI y tests de consistencia.

### 2. Mapa localStorage / draft workspace

| Elemento | Detalle |
|---|---|
| **Store activo** | `src/modules/funding/store/fundingStore.jsx` |
| **Clave activa** | `funding_draft_by_org_v1_{organizationId}` |
| **Contenido** | `fundingInputs`, `fundingSettings`, `organizationId`, `userId`, `updatedAt` |
| **Scoping client** | `organizationId` desde sesión Auth; fallback `org_demo` si ausente |
| **Claves legacy (global)** | `funding_workspace_draft_v1`, `funding_workspace_settings_v1` (`fundingFormulas.js` / `fundingApi.js`) |
| **Migración legacy** | Si no existe clave por org, importa draft global y reescribe en clave por org — **riesgo cross-org en primer uso por browser** |
| **Alimenta** | `useFundingEngine`, scenario rows, readiness workspace, export memo (`fundingExportApi`), hero/panels en páginas Funding; también `CEOOverviewPage` vía `useFundingStore` |

### 3. Mapa API / backend / SQLite

| Elemento | Detalle |
|---|---|
| **Tablas** | `funding_rounds` (006), `funding_snapshots`, `funding_board_memos` (005) |
| **Endpoints** | `GET/POST/PUT/DELETE /funding/rounds`, `GET /funding/summary`, `GET/POST /funding/snapshots`, `GET /funding/hub-overview` |
| **Scoping server** | `req.organizationId` + `WHERE organization_id = @organizationId` |
| **Calcula BE** | runway por round, dilution, summary agregado, optimal funding window, funding risk, capital efficiency, bridge signals |
| **Consumidores UI** | `FundingDashboardPage` (`getExecutiveBridgeSnapshot`), `CEOOverviewPage`; CRUD rounds **sin UI** en módulo Funding (API client definido, no usado en páginas Funding) |
| **Snapshots API** | Persistencia enterprise opcional; **no consumida** desde páginas Funding en baseline auditado |

### 4. Decisión SoT — Option C (híbrido por fases)

| Capa | Source-of-truth | Rol |
|---|---|---|
| **Funding rounds** | Backend API / SQLite `funding_rounds` | Registro enterprise oficial por organización |
| **Funding summary** | Backend `getFundingSummary` | KPIs agregados, window, risk, executive signals |
| **Funding snapshots / hub** | Backend `funding_snapshots` + `hub-overview` | Historial enterprise; fallback resiliente en bridge snapshot |
| **Draft workspace** | Client `localStorage` solo | Scenario modelling, inputs panel, readiness/export draft — **no** dato enterprise persistido |
| **Readiness / scenarios (draft)** | FE engine (`fundraisingScoring.js`, `useFundingEngine`) | DSS workspace hasta persistir vía snapshot/round en fase futura |
| **FundingDashboardPage** | **Mezcla** draft + API hoy | Debe distinguir visualmente draft/scenario vs persisted (pendiente C.13.3H) |

### 5. Riesgos documentados (C.13.3F)

| Riesgo | Severidad | Notas |
|---|---|---|
| Dashboard dual SoT sin labels | **P1** | Hero/multinational = draft; KPI rounds/summary = API; mismo viewport |
| Legacy global → org migration | **P1** | `funding_workspace_draft_v1` puede copiarse a org incorrecta una vez |
| Falta tests localStorage/API | **P1** | Sin `fundingStore.test`; sin test consistencia dashboard |
| Product truthfulness | **P1** | Usuario puede interpretar draft como registro oficial |
| KPI divergence draft vs summary | **P2** | Runway/dilution/readiness usan inputs distintos |
| Fallback `org_demo` compartido | **P2** | Varios usuarios sin org en Auth comparten bucket local |

### 6. Estado C13-P1-03

```
C13-P1-03: PARTIALLY RESOLVED — ver sección C.13.3K.
           (Histórico pre-3H: decisión 3G; labels/tests/fix abordados en 3H–J.)
```

### 7. Siguiente paso recomendado

| Ruta | Alcance |
|---|---|
| **C.13.3H** | Labels/copy en `FundingDashboardPage` + estrategia tests (`fundingStore`, draft vs API); sin migración backend completa |
| **C.13.4** | M&A valuation / waterfall integrity — si se prioriza cadena fórmulas por módulo |

**Recomendación:** C.13.3H si se quiere cerrar truthfulness Funding antes de M&A.

### 8. Qué NO se tocó (3F + 3G)

- `src/**`, `backend/**`, `tests/**`, `golden_inputs.json`, `FORMULA_REGISTRY.md`
- Sin fix `fundingStore`, `FundingDashboardPage`, localStorage
- C13-P1-03 **no** marcado RESOLVED

---

## C.13.3A / C.13.3B — Funding formulas and persistence source-of-truth — READ-ONLY + DOCS CLOSED

**Fechas:** 20 mayo 2026  
**C.13.3A:** **CLOSED (READ ONLY)** — auditoría sin modificaciones, sin commit de código.  
**C.13.3B:** **CLOSED (DOCS ONLY)** — decisiones de fórmula, naming, SoT y orden de fixes.

### 1. POST_MONEY — decisión

| Campo | Decisión |
|---|---|
| **Fórmula canónica** | `postMoney = preMoney + newInvestment` |
| **Naming equivalente (FE)** | `preMoneyValuation` = `preMoney`; `targetRaise` = `newInvestment`; `postMoneyValuation` = `postMoney` |
| **Implementación FE** | `calculateFundingCore` en `fundingFormulas.js` — semántica alineada |
| **Golden** | `funding_post_money_and_dilution_basic` — expected `postMoneyValuation: 10_000_000` (8M + 2M) |
| **Estado** | Semántica alineada; **test golden dedicado pendiente** |
| **Siguiente** | **C.13.3C** — unit test contra golden |

### 2. INVESTOR_OWNERSHIP / dilution — decisión

| Campo | Decisión |
|---|---|
| **Fórmula canónica (ronda simple)** | `investorOwnership = newInvestment / postMoney`; `dilutionPct = investorOwnership * 100` |
| **Alias** | En ronda simple, **dilution % = ownership del nuevo inversor**; no confundir con cap table extendida |
| **Cap table extendida** | `postRoundOwnership` en `calculateFundingCore` — cálculo separado (normalización founder/existing/option + `legacyFactor`); **no** sustituye golden simple 80/20 |
| **Edge case** | `postMoney <= 0` => `investorOwnership` / `dilutionPct` = **`null`**, no `0` |
| **BE** | `calculateDilution` ya devuelve `null` si `postMoney <= 0` |
| **FE gap** | `dilutionPct` devuelve `0` hoy — corregir en **C.13.3D** tras tests |
| **Siguiente** | **C.13.3C** — golden 2M/10M = 20%; edge postMoney≤0; **C.13.3D** — fix FE edge |

### 3. Runway zero-burn — decisión

| Campo | Decisión |
|---|---|
| **SoT (C.13.1B)** | `monthlyBurn <= 0` => `runwayMonths = null` — nunca `999`, `Infinity`, `NaN` |
| **Alineados** | `calculateFundingCore`, `useFundingEngine` escenarios, `calculateCashRunway` (BE), `fundingFormulas.test.js` |
| **Gap P1** | `FundingDashboardPage` calcula `runwayAfterRaise = 0` cuando `monthlyBurn <= 0` (regresión visual/señal vs C.13.1B) |
| **f3B** | **No corregir código** |
| **Siguiente** | **C.13.3C** — cobertura engine/zero-burn regression; test dashboard si viable sin UI pesada; **C.13.3D** — dashboard usa `null` |

### 4. Investor readiness — decisión

| Campo | Decisión |
|---|---|
| **Canónico** | `calculateReadinessScore` en `src/modules/funding/engine/fundraisingScoring.js` (ponderación data room, fit, interest, runway, growth, debt, dilution penalty) |
| **No canónico** | Promedio simple en `FundingDashboardPage.jsx` e `InvestorReadinessPage.jsx` |
| **Estado** | **P1 — duplicated readiness definitions** (product truthfulness) |
| **Siguiente** | **C.13.3D** — UI consume engine readiness; **después** de tests C.13.3C |

### 5. C13-P1-03 — persistence SoT — decisión

| Capa | Source-of-truth | Detalle |
|---|---|---|
| **Workspace draft** | `localStorage` por `organizationId` (`funding_draft_by_org_v1`) | Inputs, settings, escenarios — **draft**, no persistencia enterprise |
| **Rounds / summary** | **Backend API / SQLite** (`funding_rounds`, `getFundingSummary`) | Datos enterprise persistidos por org |
| **Window / risk** | Backend heurísticas en summary | DSS; no fórmula certificada |
| **Dashboard** | Mezcla store (draft) + API (rounds/summary) | Riesgo métricas inconsistentes sin etiqueta draft |
| **Decisión** | API/BE = SoT rounds/summary; localStorage = draft workspace | **C13-P1-03 permanece ABIERTO** — no marcar RESOLVED en f3B |
| **Product truthfulness** | Métricas de draft deben entenderse como scenario/draft, no como registro oficial |
| **Siguiente** | Fase separada **C13-P1-03** post C.13.3E si se aborda reconciliación UI/API |

### 6. Funding window / funding risk / readiness signals

| Señal | Tipo | Estado |
|---|---|---|
| `evaluateOptimalFundingWindow` | Heurística DSS (BE) | Pending Formula Approval / Pending C.13.x |
| `fundingRiskStatus` | Heurística (compliance + round risk) | Pending discovery |
| Readiness (UI duplicada) | Debe converger al engine | P1 — ver §4 |

No aprobar como fórmula certificada ni investment advice.

### 7. Prioridad (post auditoría 3A)

| Prioridad | Items |
|---|---|
| **P1** | C13-P1-03 localStorage vs API; readiness duplicado; dashboard runway `0` con burn=0 |
| **P2** | Tests golden post-money/ownership; FE dilution `0` vs `null`; cap table vs golden simple |
| **P3** | Naming registry vs FE; funding window/risk discovery |

### 8. Orden aprobado de subfases

| Subfase | Alcance | Prohibido en subfase |
|---|---|---|
| **C.13.3C** | Tests golden POST_MONEY, INVESTOR_OWNERSHIP, edge postMoney≤0, runway engine regression; dashboard test si viable | Fix producto |
| **C.13.3D** | Fix dashboard runway `null`; FE ownership edge `null`; unificar readiness UI → engine | Backend salvo fase explícita |
| **C.13.3E** | Cierre documental Funding formulas | Código |
| **C13-P1-03** | Fase aparte — reconciliación draft vs API | Mezclar con 3C si scope es solo fórmula |

### 9. Qué NO se tocó (3A + 3B)

- `src/**`, `backend/**`, `tests/**`, `golden_inputs.json`, expected outputs.
- Sin fix Funding; sin tests nuevos; sin marcar C13-P1-03 RESOLVED.

### 10. Siguiente paso (histórico 3A/3B)

Completado en **C.13.3C/D/E** — ver sección **C.13.3 — CLOSED** arriba.

---

## C.13.1C-f8C — Inventario cierre parcial C13-P1-05 — DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estado:** **CLOSED (DOCS ONLY)**  
**Commit documental:** (esta fase) — `docs: record compliance resilience precedence closure`  
**Registra cierre de:** f8A `4414208` + f8B `eb48db6`.

**C13-P1-05 permanece PARTIALLY RESOLVED** — no marcar RESOLVED global hasta rename/modelo backend/API.

---

## C.13.1C-f5A/f5B — C13-P1-06 FE/BE naming & precedence decision — READ-ONLY + DOCS CLOSED

**Fecha cierre:** 20 mayo 2026  
**Estados:** **C.13.1C-f5A CLOSED (READ ONLY)** · **C.13.1C-f5B CLOSED (DOCS ONLY)**  
**Baseline auditado:** `HEAD = origin/main = ef06bc7` (post `c7c567b` reports integration)  
**Sin modificaciones de código** en f5A/f5B

### 1. Hallazgos f5A (auditoría read-only)

| Capa | Hallazgo |
|---|---|
| **Backend** | Acepta, normaliza/clampa (0–100) y persiste `riskScore`/`resilienceScore` en SQLite. **No calcula** motor operativo. |
| **Frontend** | `useComplianceEngine` recalcula con `calculateSupplierRiskScore` / `calculateResilienceScore` y **pisa** valores del store/API en el mismo campo `riskScore`. |
| **Dashboards Compliance** | Muestran score **operativo calculado** (vía engine), label actual "Risk Score". |
| **Reports generados** | `buildCurrentReport` usa `engine.activeSupplier` → **operativo**. |
| **Re-export guardado** | `handleExportStoredReport` puede usar `supplier.riskScore` del **store persistido** → posible divergencia vs informe generado. |
| **CEO Overview** | `getComplianceOverview` usa `safeSuppliers` **sin enriquecer** por engine → puede divergir de dashboards. |
| **weightedRiskScore** | Separado en reports/export con label **Weighted risk (explicable)** — no mezclar con operativo. |

### 2. Problema (C13-P1-06)

El campo `riskScore` tiene **un solo nombre** pero **múltiples semánticas**: persistido (API/BD), operativo (motor FE), y confusión potencial con weighted explicable. El usuario puede asumir una única verdad.

### 3. Decisión adoptada — Option E (híbrido por fases)

| Fase | Alcance | Estado |
|---|---|---|
| **f5B (esta)** | Decisión documental | **CLOSED** |
| **f6A** | Tests de precedencia antes de fix | **CLOSED** (`1580d6f`) |
| **f6B** | Labels + alineación fuentes (CEO/re-export) | **CLOSED** (`1e82980`) |
| **f6C** | Inventario cierre parcial C13-P1-06 | **CLOSED** (docs) |
| **Posterior** | BE calculation SoT / rename campos | Enterprise — no ahora |

**No** mover cálculo completo al backend en f6. **No** renombrar campos en código en f5B. **No** resolver C13-P1-05 (resilience) en la misma cadena.

### 4. Nombres conceptuales futuros (no implementados en código aún)

| Concepto | Nombre legacy en código | Origen actual | Uso futuro |
|---|---|---|---|
| **Persisted risk snapshot** | `riskScore` (supplier/report BE) | Payload cliente + clamp BE + SQLite | Histórico, auditoría, snapshot inicial — **no** score operativo vivo |
| **Operational risk score** | `riskScore` en UI tras `useComplianceEngine` | `calculateSupplierRiskScore` | Dashboards, priorización, informes operativos — label **Operational risk score** |
| **Persisted resilience snapshot** | `resilienceScore` (BE) | Payload + clamp | C13-P1-05 — no tratar en f6 |
| **Operational resilience score** | `resilienceScore` en UI tras engine | `calculateResilienceScore` | C13-P1-05 — no tratar en f6 |
| **Weighted risk (explicable)** | `weightedRiskScore` | Helper golden + inputs explícitos | Reports/export — ya separado (f4A) |

### 5. Política de precedence (futuras fases f6+)

| Superficie | Política documentada |
|---|---|
| **Dashboards Compliance** | Mostrar **operationalRiskScore** con label claro. No presentar persistido como si fuera el score vivo. |
| **Supplier Detail** | Score principal = operativo. Persistido solo con bloque/label separado (f6B+ opcional). |
| **Reports generados** | Operativo desde `engine.activeSupplier` + `weightedRiskScore` separado si hay 3 inputs explícitos. |
| **Re-export reports guardados** | Evitar divergencia silenciosa. Recomendación preliminar: usar **snapshot del report** al re-exportar y etiquetar fuente; o alinear con `buildCurrentReport` — decidir en f6A tests. |
| **CEO Overview** | Alinear con **operationalRiskScore** (misma fuente que dashboards) o etiquetar explícitamente que usa persisted snapshot — recomendación: alinear con operativo en f6B. |
| **Backend** | Mantener **persistence SoT** por ahora. Cálculo en BE = opción enterprise posterior (portar fórmulas + tests multi-tenant). |

### 6. Product truthfulness

El usuario **no** debe ver "Risk Score" sin saber si es: persistido, operativo calculado, o weighted explicable. La fase f6 debe blindar **labels y precedence con tests** antes de cambios visuales amplios.

### 7. Tests recomendados — C.13.1C-f6A (no creados)

| Test | Objetivo |
|---|---|
| Persistido vs operativo | Supplier con `riskScore: 68` persistido + alertas → enriched ≠ 68 o regla documentada |
| Separación weighted | `operationalRiskScore` ≠ `weightedRiskScore` en report payload |
| Report paths | `buildCurrentReport` vs `handleExportStoredReport` — política coherente |
| CEO source | `getComplianceOverview` vs engine — divergencia o alineación |
| Labels | Export/UI no usa "Risk Score" para weighted |

**Whitelist f6A:** `tests/unit/compliance/compliancePrecedence.test.js` (nuevo), ampliar `useComplianceEngine.test.js`.

### 8. Fix futuro — C.13.1C-f6B (no ejecutado)

- Labels UI/export: **Operational risk score** vs **Weighted risk (explicable)**
- Posible exposición `persistedRiskScore` junto a operativo (sin rename BD en misma PR)
- Alineación CEO Overview + política re-export según tests f6A
- **Sin** tocar fórmula resilience (C13-P1-05)
- **Sin** mover cálculo al backend

### 9. Estado C13-P1 (post f5B)

| ID | Estado | Nota |
|---|---|---|
| C13-P1-04 | **PARTIALLY RESOLVED** | Reports/export scope complete; broader adoption pending |
| C13-P1-05 | **OPEN** | Resilience alignment — no abrir en f6 |
| C13-P1-06 | **PARTIALLY RESOLVED** | f6A tests + f6B fix + f6C docs; backend/model rename pending — ver **C.13.1C-f6B** |

### 10. Scope confirmado (f5A/f5B)

| Área | Tocado |
|---|---|
| `PHASE_A1_CLEANUP_INVENTORY.md` | **Sí** |
| `src/` / `backend/` / `tests/` | **No** (f5); f6A/f6B en fases posteriores |
| Golden / registries | **No** |

### 11. Siguiente paso recomendado (histórico f5B — superseded)

Superseded por **C.13.1C-f6A–f9A** (cadena scoring cerrada). Siguiente: **C.13.2** — Formula Approval Gate.

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

---

## C.3 — Auditoría funcional Compliance

**Fecha:** 18 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

Compliance funciona, está intacto y es enseñable en demo con narrativa DSS / human review.

Se puede presentar como:

- Third-Party Risk workspace
- Compliance Intelligence workspace
- sistema de soporte a revisión de proveedores
- evidence hub
- review queue
- audit ledger
- DSS con revisión humana

No debe venderse todavía como:

- certificación legal
- auditoría certificada
- asesoramiento GDPR/legal automatizado
- whistleblowing enterprise
- SaaS compliance completo sin límites
- sustituto de departamento legal/compliance

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/compliance/dashboard` | OK — Compliance dashboard |
| `/compliance/audit-runs` | OK — Audit Ledger enterprise |
| `/compliance/audit-runs/:id` | OK — deep link ledger |
| `/compliance/suppliers` | OK — Supplier Registry |
| `/compliance/suppliers/:id` | OK — Supplier Detail |
| `/compliance/risk-map` | OK |
| `/compliance/alerts` | OK |
| `/compliance/evidence` | OK |
| `/compliance/reviews` | OK |
| `/compliance/reports` | OK |

**Workspace key:** `compliance`

**Topbar:** `Compliance`

**Ruta extra relevante:** `/compliance/audit-runs` como ledger enterprise con reglas deterministas, evidencia citada y export JSON firmado/simulado.

### Fortalezas

- Flujo completo suppliers → supplier detail → evidence → reviews → reports.
- Backend CRUD real para suppliers, alerts, evidence, reviews y reports.
- Audit runs reales con rule engine.
- Migraciones enterprise 003/004.
- Multi-tenant probado en tests de servicios.
- Review workflow alineado con DSS / human review.
- Evidence hub y report export HTML.
- Audit ledger fuerte para narrativa enterprise.
- No hay P0 detectados.
- Compliance encaja con el roadmap enterprise C → D → E → F → H.

### Backend / datos reales

Compliance tiene backend real para:

- suppliers
- alerts
- evidence
- reviews
- reports
- audit runs
- rule results
- evidence links
- M&A risk impacts
- executive hub overview

También tiene capa cliente para:

- scoring
- resilience
- risk map
- supplier memo
- jurisdiction exposure
- red flags / mitigants
- evidence pack assembly
- HTML report generation

### Demo / datos calculados

La rama mezcla:

- datos reales persistidos
- defaults locales
- demo multinacional desde `demoData.js`
- scoring cliente
- reports HTML generados en frontend
- risk map calculado en cliente

Esto es aceptable para demo si se explica correctamente, pero debe etiquetarse mejor antes de piloto enterprise.

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | No tocar CSS Compliance |
| Datos reales | Parcial | Backend CRUD + audit runs reales; defaults/demo locales |
| Backend | Parcial / sólido | Audit ledger y CRUD reales |
| Multi-tenant | Parcial | Backend probado; store/localStorage puede mezclar datos |
| Permisos | Parcial | API granular; validar UX viewer |
| Suppliers | Parcial | CRUD real + demo multinacional |
| Evidence | Parcial | CRUD real + pack cliente |
| Reviews | Parcial | Workflow DSS real |
| Reports / export | Parcial | HTML cliente + persistencia API |
| Alerts | Parcial | CRUD real + default alerts |
| Risk map | Parcial / visual | Cliente; backend riskMap service stub |
| Tests | Parcial | Servicios fuertes; API/E2E débiles |
| Demo readiness | Cerrado con narrativa | Se puede enseñar |
| Venta readiness | Parcial | Piloto DSS / third-party risk |
| Enterprise readiness | Parcial | Legal, truthfulness y QA pendientes |

### Gaps P0

Ninguno detectado.

### Gaps P1

- Mezcla de datos default local, remoto y demo multinacional sin etiquetado uniforme.
- `integration/api/complianceApi.test.js` es placeholder.
- `complianceReportsApi.test.js` es placeholder.
- `getExecutiveHubBrief` no se consume directamente en Compliance UI, solo vía Overview.
- Risk scores recalculados en cliente pueden divergir de `riskScore` persistido.
- Validar que viewer no pueda crear/decidir/editar desde UI.
- No vender como certificación legal, auditoría certificada o asesoramiento GDPR.
- Auto-sync local → backend cuando remoto vacío puede contaminar organización con seeds demo.

### Gaps P2

- Páginas monolíticas y CSS embebido masivo.
- `riskMap.service.js` stub; risk map 100% cliente.
- E2E solo URL checks; faltan flujos CRUD, export y audit ledger.
- `suppliersApi.js` legacy localStorage redundante.
- Módulo RAG existe pero no está cableado en UI.
- Compliance no estuvo en el smoke producción B.1 explícito.
- `/compliance/audit-runs/:id` sin pageMeta dedicado.

### Gaps P3

- Consolidar `ceos-compliance-crud.spec.js`.
- Corregir typo `compilanceFlow.spec.js`.
- PDF/server-side reports futuro.
- Wiring RAG retrieval real futuro.

### Decisión demo

Compliance se puede enseñar en demo.

**Recorrido recomendado:**

1. `/compliance/dashboard`
2. `/compliance/suppliers`
3. `/compliance/suppliers/:id`
4. `/compliance/evidence`
5. `/compliance/reviews`
6. `/compliance/reports`
7. `/compliance/audit-runs` opcional como audit ledger

**Narrativa recomendada:**

“Compliance Intelligence es un workspace de soporte a revisión de terceros, evidencias, riesgos y auditoría. Es un DSS con revisión humana. No sustituye asesoramiento legal ni certifica automáticamente el cumplimiento normativo.”

### Antes de piloto

**Prioridades:**

1. Crear 2–3 proveedores reales cross-módulo.
2. Crear 1 audit run real.
3. Añadir evidencia real tipo DPA/SOC2/ISO.
4. Crear una review decidida.
5. Generar un report exportado.
6. Etiquetar demo data/defaults.
7. Convertir tests API placeholder en tests reales.
8. Validar viewer UX.
9. Incluir Compliance en smoke producción explícito.
10. Reducir fallback silencioso local → backend.

### No tocar ahora

- Visual/CSS Compliance.
- AppShell / Topbar / Sidebar.
- M&A.
- Executive Overview.
- Bridge Marketplace.
- Premium AI / Whistleblowing.
- A.1.4b.
- RAG retrieval real.
- Legal automation.

### Recomendación

Mantener Compliance congelado en código.

Usarlo en demo como workspace de Third-Party Risk / Compliance Intelligence DSS.

Antes de piloto enterprise, priorizar truthfulness, datos reales, tests API, UX viewer, smoke producción explícito y legal pack.

### Próxima subfase

**C.4 — Auditoría funcional Funding.**

---

## C.4 — Auditoría funcional Funding

**Fecha:** 19 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

Funding funciona, está intacto y es enseñable en demo con narrativa DSS / human review.

Se puede presentar como:

- Funding Intelligence workspace
- Capital Planning workspace
- Investor Readiness workspace
- sistema de soporte a planificación de financiación
- DSS con revisión humana

No debe venderse todavía como:

- asesoramiento financiero
- recomendación de inversión
- valoración certificada
- placement o intermediación financiera
- sustituto de banca, VC, legal o corporate finance advisor
- SaaS funding enterprise completo sin límites

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/funding/dashboard` | OK — Funding Dashboard |
| `/funding/readiness` | OK — Investor Readiness |
| `/funding/capital-structure` | OK — Capital Structure |
| `/funding/scenarios` | OK — Funding Scenarios |
| `/funding/data-room` | OK — Investor Data Room checklist |

**Nota:** La ruta real de investor readiness es `/funding/readiness`, no `/funding/investor-readiness`.

**Workspace key:** `funding`

**Topbar:** `Funding`

**Deep links:** No hay rutas `:id` en Funding.

### Fortalezas

- Funding dashboard carga correctamente.
- Engine cliente calcula runway, dilution, post-money y escenarios.
- Backend real para funding rounds y funding summary.
- Funding bridge con M&A / Compliance / Executive Overview.
- Integración backend probada para rounds, multi-tenant, bridge y permisos viewer.
- Widget ejecutivo de Funding probado.
- Export memo HTML con disclaimers DSS.
- No hay P0 detectados.
- Encaja bien en el roadmap C → D → E.

### Backend / datos reales

Funding tiene backend real para:

- funding rounds
- funding summary
- executive bridge snapshot
- M&A / Compliance bridge
- audit events
- snapshots / ledger export a nivel API

También tiene capa cliente para:

- funding inputs
- runway / burn / dilution calculations
- capital structure
- scenarios
- investor readiness
- data room checklist
- funding narrative
- export memo

### Demo / datos calculados

La rama mezcla:

- rounds reales en SQLite
- summary backend
- bridge backend
- inputs locales por organizationId
- defaults tipo demo
- scenarios calculados en cliente
- investor readiness calculado
- data room checklist visual
- export memo en cliente

Esto es aceptable para demo si se explica como DSS, pero debe alinearse mejor antes de piloto enterprise.

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | No tocar CSS Funding |
| Datos reales | Parcial | Rounds/summary backend + inputs locales |
| Backend | Parcial / sólido | Rounds, summary y bridge fuertes |
| Multi-tenant | Parcial | Backend probado; drafts en localStorage por org |
| Permisos | Parcial | API viewer read-only; validar UI |
| Funding rounds | Parcial | Backend CRUD sólido; UI principalmente lectura |
| Capital structure | Parcial / calculado | Engine cliente |
| Scenarios | Parcial / calculado | Sensibilidad heurística |
| Investor readiness | Parcial / calculado | No valida documentos reales |
| Data room | Parcial / visual | Checklist, no VDR enterprise |
| Reports / export | Parcial | HTML memo cliente |
| Executive bridge | Parcial / sólido | Bridge M&A/Compliance real |
| Tests | Parcial | Backend fuerte; E2E Funding débil |
| Demo readiness | Cerrado con narrativa | Se puede enseñar |
| Venta readiness | Parcial | Piloto Funding Intelligence DSS |
| Enterprise readiness | Parcial | Truthfulness, UI rounds/snapshots, legal y E2E pendientes |

### Gaps P0

Ninguno detectado.

### Gaps P1

- Inputs/scenarios en localStorage frente a rounds en SQLite: riesgo de verdad dual.
- No hay UI completa para crear/editar rounds ni snapshots aunque la API existe.
- Defaults `DEFAULT_FUNDING_INPUTS` / Nova Industrial pueden parecer reales sin etiqueta.
- No vender como asesoramiento financiero, inversión, placement ni valoración certificada.
- Validar que viewer no persista drafts sensibles si solo tiene READ.
- `enterprise.service` snapshots sin tests integration dedicados en suite actual.

### Gaps P2

- CSS embebido masivo en FundingDashboardPage.
- Data room es checklist, no data room enterprise real.
- No existe `tests/e2e/funding/`.
- E2E Funding limitado al smoke hub.
- Investor pipeline existe solo como narrativa/copy.
- Falta E2E de export memo, scenarios, readiness y data room.

### Gaps P3

- PDF/server export futuro.
- Liquidation Preference Stress Tester queda para Fase J.
- UI para ledger-export snapshots.
- Tests E2E export memo.
- Posible evolución hacia investor pipeline real.

### Decisión demo

Funding se puede enseñar en demo.

**Recorrido recomendado:**

1. `/funding/dashboard`
2. `/funding/readiness`
3. `/funding/capital-structure`
4. `/funding/scenarios`
5. `/funding/data-room`
6. export memo si procede

**Narrativa recomendada:**

“Funding Intelligence es un workspace de planificación de capital y preparación para financiación. Ayuda a simular escenarios, runway, dilución y readiness, siempre como DSS con revisión humana. No sustituye asesoramiento financiero, legal, bancario ni de inversión.”

### Antes de piloto

**Prioridades:**

1. Crear 1–2 funding rounds reales en API.
2. Alinear inputs locales con rounds persistidos.
3. Crear 1 snapshot / ledger export.
4. Generar un memo exportado.
5. Etiquetar defaults y demo data.
6. Validar viewer UX.
7. Añadir tests integration dedicados para snapshots.
8. Añadir E2E Funding mínimo.
9. Diferenciar claramente checklist vs data room real.

### No tocar ahora

- Visual/CSS Funding.
- AppShell / Topbar / Sidebar.
- M&A.
- Compliance.
- Executive Overview.
- Bridge Marketplace.
- Premium AI / Liquidation Preference Stress Tester.
- A.1.4b.
- Rutas Funding si no hay P0.

### Recomendación

Mantener Funding congelado en código.

Usarlo en demo como workspace de Capital Planning / Funding Intelligence DSS.

Antes de piloto enterprise, priorizar truthfulness, datos reales, alineación inputs ↔ rounds, snapshots, E2E Funding y legal disclaimers.

### Próxima subfase

**C.5 — Auditoría funcional Governance.**

---

## C.5 — Auditoría funcional Governance

**Fecha:** 19 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

Governance funciona, está intacto y es enseñable en demo con narrativa DSS / human review.

Es una de las ramas más backend-first y coherentes del producto: tiene API real, workflow de decisiones, audit trail, integración con Executive Overview y board pack transversal.

Se puede presentar como:

- Board Governance workspace
- Decision Support workspace
- governance operating layer
- decision register
- audit trail
- board pack preparation workspace
- DSS con revisión humana

No debe venderse todavía como:

- gobierno corporativo certificado
- actas legales oficiales
- secretaría del consejo automatizada
- asesoramiento legal
- compliance board formal certificado
- SaaS governance enterprise completo sin límites
- sustituto de secretario del consejo o asesor jurídico

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/governance/dashboard` | OK — Governance Dashboard |
| `/governance/decisions` | OK — Decision Register |
| `/governance/decisions/:id` | OK — deep link, sin pageMeta dedicado |
| `/governance/board-packs` | OK |
| `/governance/committees` | OK |
| `/governance/policies` | OK |
| `/governance/actions` | OK |
| `/governance/meetings` | OK |
| `/governance/reports` | OK |
| `/governance/audit-trail` | OK |
| `/governance/security-audit` | OK como alias visual de audit trail |

**Workspace key:** `governance`

**Topbar:** `Governance`

**Nota:** No existe ruta UI `/governance/esg`, aunque existen APIs de ESG/controls en backend.

### Fortalezas

- Rama muy backend-first.
- No depende de demoData ni localStorage de negocio.
- Dashboard real vía API.
- Decision register con CRUD y workflow.
- Decision detail real.
- Board packs reales a nivel API.
- Committees, policies, actions y meetings con APIs reales.
- Reports backend.
- Audit trail persistido.
- Multi-tenant probado.
- Buen E2E enterprise flow con 9 rutas.
- Integración con Executive Overview.
- Board pack transversal.
- Empty states honestos si la organización no tiene datos.
- Sin P0 detectados.

### Backend / datos reales

Governance tiene backend real para:

- dashboard / summary
- decisions
- decision workflow
- board packs
- committees
- policies
- actions
- meetings
- reports
- audit trail
- hub overview / bridge signals
- controls / ESG metrics a nivel API

**Tablas principales:**

- `governance_decisions`
- `governance_board_packs`
- `governance_committees`
- `governance_policies`
- `governance_action_items`
- `governance_meetings`
- `governance_approval_history`
- `governance_report_exports`

### Demo / datos calculados

Governance no tiene una capa demo local masiva.

Si la organización está vacía, muestra estados honestos como:

- insufficient validated data
- human review required
- empty states

Esto es positivo para product truthfulness.

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | No tocar CSS Governance |
| Datos reales | Mayormente real | API SQLite, sin demo local masivo |
| Backend | Parcial / sólido | API extensa y coherente |
| Multi-tenant | Parcial / sólido | Probado en governanceEnterprise.test.js |
| Permisos | Parcial | Viewer/board_member read-only; approve solo admin |
| Decisions | Parcial / sólido | CRUD + workflow backend |
| Decision workflow | Parcial | Submit/approve/escalate en lista; detail sin acciones |
| Board packs | Parcial | Create/list real; finalize solo API |
| Audit trail | Parcial / sólido | Persistencia real + tests |
| Security audit | Visual / alias | Misma página que audit trail; copy confuso |
| Reports / export | Parcial | Backend report generation básico |
| Executive bridge | Parcial / sólido | Integrado con Overview |
| Tests | Parcial / fuerte | E2E fuerte, faltan permisos/board_member |
| Demo readiness | Cerrado con narrativa | Rama muy enseñable |
| Venta readiness | Parcial | Board Governance DSS |
| Enterprise readiness | Parcial | Legal, workflow UX, ESG UI y finalize pendientes |

### Gaps P0

Ninguno detectado.

### Gaps P1

- Botón Approve puede estar habilitado con `UPDATE_GOVERNANCE`, pero API exige `APPROVE_GOVERNANCE_DECISION`, generando 403 para rol user.
- Validar UX board_member / viewer read-only.
- No vender como gobierno corporativo certificado, actas legales ni compliance board formal.
- Meeting “minutes lite” no equivale a acta legal.
- `/governance/security-audit` puede confundir por copy/contenido.
- Organización vacía sin seed: para demo hay que crear decisiones en vivo o tener datos demo controlados.

### Gaps P2

- `/governance/decisions/:id` sin pageMeta dedicado.
- Detail sin workflow actions; `ApprovalFlowPanel` es informativo.
- Sin UI para ESG/controls aunque la API existe.
- Sin UI finalize board-pack / meeting minutes.
- `governanceApi` incompleto frente a rutas backend.
- Governance no estuvo en smoke B.1 hubs explícito.

### Gaps P3

- Governance Minute Generator queda para Fase J.
- PDF export formal futuro.
- Tests permisos board_member en UI.
- Unificar `/governance/security-audit` vs `/governance/audit-trail`.

### Decisión demo

Governance se puede enseñar en demo.

**Recorrido recomendado con admin:**

1. `/governance/dashboard`
2. `/governance/decisions`
3. crear decisión
4. submit
5. approve
6. `/governance/board-packs`
7. `/governance/audit-trail`

**Narrativa recomendada:**

“Governance es un workspace de soporte a decisiones, trazabilidad, comités, políticas, acciones y preparación de board packs. Es un DSS con revisión humana. No sustituye asesoramiento legal, actas oficiales ni gobierno corporativo certificado.”

### Antes de piloto

**Prioridades:**

1. Crear 2–3 decisiones con workflow cerrado.
2. Crear 1 board pack.
3. Crear 1 policy.
4. Crear 1 action item.
5. Crear 1 meeting.
6. Crear 1 report.
7. Revisar UX approve/permisos.
8. Validar board_member UI.
9. Añadir smoke hub Governance.
10. Aclarar `/governance/security-audit` o unificarlo con audit trail.

### No tocar ahora

- Visual/CSS Governance.
- AppShell / Topbar / Sidebar.
- Executive Overview.
- M&A.
- Compliance.
- Funding.
- Bridge Marketplace.
- Premium AI / Governance Minute Generator.
- A.1.4b.
- Legal automation.

### Recomendación

Mantener Governance congelado en código.

Usarlo en demo como Board Governance / Decision Support workspace.

Antes de piloto enterprise, priorizar permisos/UX approve, datos seed, board pack lifecycle, smoke explícito, disclaimers legales y claridad entre audit trail y security audit.

### Próxima subfase

**C.7 — Auditoría funcional Bridge.**

---

## C.6 — Auditoría funcional PMI

**Fecha:** 19 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

PMI funciona, está intacto y es enseñable en demo con narrativa DSS / human review.

PMI es una de las ramas más completas del producto: tiene backend, E2E, producción validada y recorrido post-M&A.

Se puede presentar como:

- PMI Execution workspace
- Post-Merger Integration workspace
- Synergy Execution workspace
- Integration Control Center
- capa de seguimiento post-M&A
- DSS con revisión humana

No debe venderse todavía como:

- garantía de captura de sinergias
- certificación de integración exitosa
- asesoramiento legal, laboral u operativo
- sustituto de un integration management office
- SaaS PMI enterprise completo sin límites
- motor autónomo de integración

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/pmi/dashboard` | OK — Command Center principal |
| `/pmi/programs` | OK — Programs |
| `/pmi/programs/:id` | Parcial — deep link sin detalle real |
| `/pmi/synergies` | OK |
| `/pmi/milestones` | OK |
| `/pmi/risks` | OK |
| `/pmi/day1` | OK |
| `/pmi/day-100` | OK |
| `/pmi/transition-services` | OK |
| `/pmi/operating-model` | OK |
| `/pmi/people-culture` | OK |
| `/pmi/technology` | OK |
| `/pmi/reports` | Parcial |

**Workspace key:** `pmi`

**Topbar:** `PMI & Synergies`

**Notas:**

- No existen rutas dedicadas `/pmi/workstreams` ni `/pmi/dependencies`.
- Workstreams y dependencies viven en el dashboard.
- Solo `/pmi/dashboard` tiene pageMeta específico en routeConfig.
- Existe un segundo `PMIDashboardPage` en `PMIEnterprisePages.jsx` que no está enrutado.

### Fortalezas

- Dashboard operativo.
- Backend real para cases, programs, synergies, milestones, risks, day1, day100, TSA, operating model, people/culture, technology y reports.
- Migraciones PMI enterprise existentes.
- M&A handoff disponible.
- Executive hub brief disponible.
- Board memo export HTML con disclaimer.
- E2E fuerte en happy path admin.
- Producción B.1 validó `/pmi/dashboard`.
- Sin NaN/overflow crítico detectado.
- No hay P0.

### Backend / datos reales

PMI tiene backend real para:

- `pmi_cases`
- `pmi_programs`
- `pmi_synergy_initiatives`
- `pmi_milestones`
- `pmi_risks`
- `pmi_day1_checklist`
- `pmi_100_day_plan`
- `pmi_transition_services`
- `pmi_operating_model_items`
- `pmi_people_culture_items`
- `pmi_technology_items`
- `pmi_report_exports`
- audit log compartido
- executive summary / hub overview

### Demo / datos calculados

PMI mezcla:

- datos reales SQLite enterprise
- `pmi_cases` persistidos
- engine cliente
- board memo HTML cliente
- `DEMO_PMI_CASE` local en `pmiStore.jsx`
- `mergeWithDemo()` que fusiona demo Iberia con datos guardados

Este punto es el principal riesgo de truthfulness antes de piloto.

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | B.1 validó dashboard y tablas |
| Datos reales | Parcial | Enterprise tables reales; dashboard contaminado por demo |
| Backend | Cerrado | Backend PMI sólido |
| Multi-tenant | Parcial | Backend sí; UI sin pruebas org-switch |
| Permisos | Parcial | Falta E2E viewer/read-only |
| Synergies | Parcial | Doble modelo case vs enterprise |
| Milestones | Parcial | API real; workflow ejecución visual |
| Risks | Parcial | API real; vínculo compliance limitado |
| Workstreams | Parcial | Solo dashboard, case JSON |
| Dependencies | Parcial | Solo dashboard, sin ruta propia |
| Integration controls | Parcial | Sliders + persistencia |
| Reports / export | Parcial | HTML memo + pmi_report_exports |
| Executive bridge | Cerrado | Summary + Overview + board pack branch |
| Tests | Parcial | Fuerte admin E2E + integration; gaps permisos/demo |
| Demo readiness | Cerrado | Se puede enseñar |
| Venta readiness | Parcial | Piloto DSS sí |
| Enterprise readiness | Parcial | Truthfulness y sync pendientes |

### Gaps P0

Ninguno detectado.

### Gaps P1

- `mergeWithDemo()` siempre fusiona `DEMO_PMI_CASE` sobre casos API.
- Doble modelo de datos: `pmi_cases` del dashboard vs tablas enterprise sin sincronización.
- Sin etiqueta visible de demo data cuando no hay cases o falla API.
- `PMIProgramDetailPage` no es detalle real.
- Rutas enterprise sin pageMeta específico.
- Código duplicado `PMIDashboardPage` en `PMIEnterprisePages.jsx`, no enrutado.

### Gaps P2

- Workflows formales de milestones/synergies: aprobación, evidencia y finance validation.
- E2E viewer read-only.
- Multi-tenant UI.
- Unificar o documentar explícitamente case vs enterprise.
- PATCH/update completo en UI enterprise.
- Trazabilidad dependencies ↔ milestones ↔ compliance.
- Extraer CSS dashboard en fase posterior, no ahora.

### Gaps P3

- Rutas dedicadas `/pmi/workstreams` y `/pmi/dependencies`.
- Key Talent Retention Map queda para Fase J.
- PDF firmado / board pack server-side.
- Sync bidireccional M&A valuation → synergy targets.
- Tests E2E export memo.

### Decisión demo

PMI se puede enseñar en demo.

**Recorrido recomendado:**

1. `/pmi/dashboard`
2. M&A handoff si procede
3. Synergy ledger
4. Workstreams
5. Milestones
6. Risks
7. Dependencies
8. Integration controls
9. Export board memo

**Narrativa recomendada:**

“PMI es un workspace de soporte a integración post-M&A. Ayuda a priorizar sinergias, riesgos, hitos, dependencias y controles de integración. Es un DSS con revisión humana. No garantiza la captura de sinergias ni sustituye un integration management office.”

### Antes de piloto

**Prioridades:**

1. Resolver o etiquetar `mergeWithDemo()`.
2. Separar claramente demo vs datos reales.
3. Alinear `pmi_cases` con tablas enterprise o documentar la dualidad.
4. Crear caso PMI real coherente con M&A industrial.
5. Crear programas enterprise reales.
6. Añadir tests viewer/read-only.
7. Añadir tests multi-tenant UI.
8. Validar program detail real.
9. Añadir test anti-demo-merge.
10. Documentar límites del board memo.

### No tocar ahora

- Visual/CSS PMI.
- AppShell / Topbar / Sidebar.
- Executive Overview.
- M&A.
- Compliance.
- Funding.
- Governance.
- Bridge Marketplace.
- Premium AI / Key Talent Retention Map.
- A.1.4b.
- `backend-server.err`.

### Recomendación

Mantener PMI congelado en código.

Usarlo en demo como PMI Execution / Post-Merger Integration DSS.

Antes de piloto enterprise, priorizar product truthfulness sobre `mergeWithDemo()`, dual model, demo labeling, viewer tests y sincronización case ↔ enterprise.

### Próxima subfase

**C.8 — Auditoría funcional Risk.**

---

## C.7 — Auditoría funcional Bridge

**Fecha:** 19 mayo 2026

**Estado:** Auditoría solo lectura completada.

### Veredicto

Bridge funciona, está intacto y es enseñable en demo como capa cross-module de inteligencia ejecutiva.

Bridge enterprise se puede presentar como:

- Cross-Module Executive Intelligence
- Enterprise Bridge
- capa de señales entre módulos
- sistema de dependencias, conflictos y prioridades
- DSS con revisión humana

No debe venderse todavía como:

- red privada de deals
- marketplace activo
- matching garantizado de inversores
- bolsa de oportunidades
- sistema autónomo de recomendaciones
- SaaS enterprise completo sin límites

Marketplace sigue congelado como:

`INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK`

### Rutas auditadas

| Ruta | Estado |
|---|---|
| `/bridge/dashboard` | OK — Bridge dashboard |
| `/bridge/signals` | OK — signal lifecycle |
| `/bridge/dependencies` | OK |
| `/bridge/conflicts` | OK |
| `/bridge/attention-queue` | OK — read-only |
| `/bridge/reports` | OK |
| `/bridge/snapshots` | OK — deep link sin sidebar |
| `/bridge/marketplace` | Congelado — URL directa autenticada, fuera de nav |

**Workspace key:** `bridge`

**Topbar:** `Enterprise Bridge`

### Política Marketplace

| Check | Resultado |
|---|---|
| No aparece en sidebar | PASS |
| No aparece en rail | PASS |
| Ruta activa por URL directa autenticada | Sí |
| Política A.1.5 | Vigente |
| Badge demo fallback | Sí |
| Promoción en demo principal | No |
| E2E marketplace | Excluido a propósito |

**Decisión:** Marketplace no se enseña, no se vende y no se desarrolla ahora.

### Fortalezas

- Bridge dashboard funcional.
- Backend real para signals, dependencies, conflicts, attention queue, snapshots y reports.
- Recalculate operativo.
- Signal lifecycle disponible.
- Executive bridge integrado con Overview.
- Tests dedicados bridge enterprise.
- Marketplace fuera de nav/rail.
- WorkspaceConfig parity cubre que marketplace no entre en navegación.
- Disclaimers de human review presentes.
- No hay P0 detectados.

### Backend / datos reales

Bridge tiene backend real para:

- bridge dashboard
- bridge summary
- hub overview
- signals
- signal workflow
- dependencies
- conflicts
- attention queue
- evidence links
- snapshots
- reports
- report generation
- audit logs

**Tablas principales:**

- `bridge_signals`
- `bridge_dependencies`
- `bridge_conflicts`
- `bridge_attention_queue`
- `bridge_evidence_links`
- `bridge_snapshots`
- `bridge_signal_history`
- `bridge_reports`
- `bridge_opportunities`
- `bridge_counterparties`
- `bridge_introductions`
- `bridge_documents`

### Demo / datos calculados

Bridge enterprise es backend-first, pero las señales calculadas por recalculate son heurísticas cross-module.

Marketplace tiene fallback demo local `DEMO_BRIDGE_*`.

Esto es aceptable para demo si:

- se enseña Bridge enterprise, no marketplace
- se explica que las señales son DSS / human review
- no se vende como red privada de deals
- no se promete matching automático

### Clasificación funcional

| Área | Estado | Nota |
|---|---|---|
| Visual shell | Cerrado | No tocar CSS Bridge |
| Datos reales | Parcial | Enterprise real; marketplace demo fallback |
| Backend | Cerrado | Servicios Bridge sólidos |
| Multi-tenant | Parcial | Backend sí; UI sin org-switch tests |
| Permisos | Parcial | Viewer read-only sin E2E |
| Dashboard | Cerrado | Cross-module dashboard |
| Signals | Cerrado | Lifecycle + engine |
| Dependencies | Parcial | Falta trazabilidad entidad fuente |
| Conflicts | Parcial | CRUD/workflow básico |
| Reports / snapshots | Parcial | Backend real; UI parcial |
| Marketplace | Riesgo / congelado | Fuera de nav; no vender |
| Executive bridge | Cerrado | Overview integrado |
| Tests | Parcial | Backend/E2E buenos; faltan viewer/prod smoke |
| Demo readiness | Cerrado sin marketplace | Se puede enseñar Bridge enterprise |
| Venta readiness | Parcial | Piloto Bridge DSS sí |
| Enterprise readiness | Parcial | Truthfulness, trazabilidad, permisos y smoke pendientes |

### Gaps P0

Ninguno detectado.

### Gaps P1

- Marketplace accesible por URL con narrativa “deal network” y demo Iberia.
- `DEMO_BRIDGE_*` fallback sin bloqueo en prod piloto.
- Señales recalculate pueden parecer reales sin etiqueta clara de calculated/heuristic.
- `/bridge/snapshots` sin nav.
- Dos `bridgeApi`: enterprise bridge y ecosystem marketplace; puede confundir si no se documenta.
- B.1 no validó `/bridge/dashboard` en producción explícitamente.

### Gaps P2

- Viewer E2E.
- Multi-tenant UI.
- Trazabilidad dependency → entidad fuente.
- Evidence links UI completa en snapshots.
- PATCH/update en tablas enterprise desde UI.
- Posible redirect marketplace → dashboard para pilotos.

### Gaps P3

- Feature Harvest Marketplace queda para futuro.
- PDF server-side board packs Bridge.
- Audit trail UI dedicada en workspace Bridge.
- E2E export/report generate.

### Decisión demo

Bridge se puede enseñar en demo, pero solo como Bridge Enterprise.

**Recorrido recomendado:**

1. `/bridge/dashboard`
2. `/bridge/signals`
3. `/bridge/dependencies`
4. `/bridge/conflicts`
5. `/bridge/attention-queue`
6. `/bridge/reports`
7. `/bridge/snapshots` opcional

**No enseñar:**

- `/bridge/marketplace`

**Narrativa recomendada:**

“Bridge consolida señales, dependencias y conflictos entre M&A, Compliance, Funding, PMI y Governance. Recalcula prioridades ejecutivas con revisión humana obligatoria. No es una bolsa de deals ni garantiza matching de inversores.”

### Antes de piloto

**Prioridades:**

1. No promocionar marketplace.
2. Añadir smoke producción explícito de `/bridge/dashboard`.
3. Etiquetar señales calculadas como heuristic / calculated / human review.
4. Añadir viewer E2E.
5. Añadir multi-tenant UI checks.
6. Mejorar trazabilidad dependency → entidad fuente.
7. Documentar doble `bridgeApi`.
8. Evaluar redirect marketplace → dashboard en pilotos.

### No tocar ahora

- `/bridge/marketplace`.
- Bridge Marketplace Page.
- Ecosystem marketplace API.
- Visual/CSS Bridge.
- AppShell / Topbar / Sidebar.
- Executive Overview.
- M&A.
- Compliance.
- Funding.
- Governance.
- PMI.
- Premium AI.
- A.1.4b.
- `backend-server.err`.

### Recomendación

Mantener Bridge congelado en código.

Usarlo en demo como Cross-Module Executive Intelligence / Bridge DSS.

No vender ni mostrar Marketplace.

Antes de piloto enterprise, priorizar truthfulness de señales, marketplace hidden/redirect policy, smoke producción de Bridge, viewer tests y trazabilidad cross-module.

### Próxima subfase

**C.8 — Auditoría funcional Risk.**

---

## C.14.0 — AI Guardrails Anti-Paralysis Update — CLOSED

**Commit baseline:** post-C.13.3J (`55a088a` and later guardrails commit).

### Crítica recibida

Durante C.13.x, los guardrails IA provocaban:

- **Falsa parada:** READ-ONLY audits se detenían al encontrar deuda, duplicados o legacy en lugar de clasificar y continuar.
- **Parálisis por análisis:** exceso de Stop Conditions aplicadas igual en auditoría y en fix.
- **Ceguera por .cursorignore:** SQLite, logs y `backend-server.err` no indexados permanentemente, pero sin política de inspección controlada.
- **Pending documental artificial:** riesgo de llenar docs con Pending masivo sin reconciliación.
- **Refactor/borrado peligroso:** riesgo de eliminar código "muerto" sin validar rutas, tests y referencias dinámicas.

### Decisión

Separar **cuatro modos operativos IA:**

1. **READ-ONLY AUDIT** — leer/mapear; Stop Conditions relajadas; entregar P0–P3 + whitelist/blacklist.
2. **WRITE/FIX** — fixes controlados; Stop Conditions duras; tests/build; git selectivo.
3. **PROPOSE ONLY** — refactors/limpieza propuestos sin tocar archivos.
4. **QUARANTINE BEFORE DELETE** — marcar candidatos a borrado; borrar solo en fase posterior explícita.

Añadidas también:

- Política logs/SQLite/.cursorignore (inspección controlada, sin indexación permanente de secretos).
- **Reconciliation Pass** — actualizar solo docs afectados; estados PARTIALLY RESOLVED vs RESOLVED global.
- **Modular sandbox** — auditorías C.14 por módulo, no whole-repo por defecto.
- **Refactor/delete safety** — no borrar por intuición; áreas especialmente protegidas documentadas.

### Archivos actualizados (C.14.0)

- `.cursorrules`
- `.cursor/rules/ceos-os-enterprise-guardrails.mdc`
- `.cursor/rules/ceos-os-prompt-discipline.mdc`
- `.cursor/rules/ceos-os-release-gates.mdc`
- `docs/ai/AI_OPERATING_MODEL.md`
- `docs/ai/PROMPT_LIBRARY.md`
- `docs/testing/LOGIC_INTEGRITY_PROTOCOL.md`
- `docs/product/PHASE_A1_CLEANUP_INVENTORY.md` (esta sección)

### Estado

**Guardrails updated.** No se tocó código de producto, backend, tests, Golden ni fórmulas en C.14.0.

### Siguiente fase recomendada

**C.13.4** — M&A valuation / waterfall integrity.

Opcional después: **C.14.1** — Modular Architecture Read-Only Audit by sandbox.

---

## C.13.3F / C.13.3G / C.13.3H / C.13.3I / C.13.3J — Funding persistence source-of-truth and legacy migration — PARTIALLY CLOSED

**Fechas:** 23 mayo 2026  
**Baseline final:** `HEAD = origin/main = 05b3520` (post C.14.0 guardrails)  
**Commits clave:** `5ad9d8f` (3G docs), `e803813` (3H), `25e4ff4` (3I), `55a088a` (3J), `05b3520` (C.14.0 guardrails)  
**C.13.3K:** **CLOSED (DOCS ONLY)** — cierre parcial documental C13-P1-03.

### 1. C.13.3F — Read-only audit (completada)

| Elemento | Resultado |
|---|---|
| Alcance | Mapeo localStorage draft vs API enterprise Funding |
| Store activo | `src/modules/funding/store/fundingStore.jsx` |
| Clave org-scoped | `funding_draft_by_org_v1_{organizationId}` |
| Claves legacy global detectadas | `funding_workspace_draft_v1`, `funding_workspace_settings_v1` |
| API/backend | `funding_rounds`, `funding_snapshots`, `/funding/summary`, `/funding/hub-overview` |
| Riesgo identificado | **P1 cross-org** — legacy global podía copiarse a múltiples orgs en el mismo browser |
| Código modificado | Ninguno (read-only) |

### 2. C.13.3G — Source-of-truth decision (docs only)

**Decisión Option C híbrida:**

| Capa | Source-of-truth | Rol |
|---|---|---|
| Backend/API/SQLite | Enterprise persisted | Rounds, summary, snapshots — autoridad por `req.organizationId` |
| localStorage | Draft/scenario workspace | Inputs, settings, scenario modelling — **no** dato enterprise persistido |

**Estado tras 3G:** C13-P1-03 **no resuelto** — decisión documentada; labels/tests/fix pendientes (abordados en 3H–3J).

**Commit:** `5ad9d8f` — `docs: record funding persistence source of truth`

### 3. C.13.3H — Labels/copy draft vs persisted

**Commit:** `e803813` — `fix(funding): clarify draft versus persisted metrics`

Labels/copy añadidos en dashboard y widgets:

- **Scenario draft workspace**
- **Enterprise rounds summary**
- **Persisted rounds**
- **From backend summary and stored funding rounds**

`FundingDashboardPage`, `FundingHeroCard`, `FundingExecutiveWidget` distinguen fuentes draft vs persisted en el dashboard principal.

### 4. C.13.3I — Store/localStorage/legacy tests

**Commit:** `25e4ff4` — `test(funding): cover draft storage source of truth`

Tests en `tests/unit/funding/fundingStore.test.js` (15 tests):

- Patrón clave org-scoped `funding_draft_by_org_v1_{organizationId}`
- Org key gana sobre legacy global
- Aislamiento org_a / org_b con claves pobladas
- Hidratación desde legacy cuando falta clave org
- **Riesgo documentado:** legacy global permanecía tras migración; segunda org sin clave heredaba mismo draft global

### 5. C.13.3J — Legacy migration controlled fix

**Commit:** `55a088a` — `fix(funding): consume legacy draft after migration`

**Helpers añadidos** (`fundingApi.js`):

- `hasLegacyDraft()` — detecta claves legacy globales presentes
- `clearLegacyDraft()` — elimina `funding_workspace_draft_v1` y `funding_workspace_settings_v1`

**Comportamiento** (`fundingStore.jsx`):

1. Si no hay clave org y existen claves legacy → migrar a `funding_draft_by_org_v1_{organizationId}`
2. Verificar escritura org-scoped exitosa
3. Eliminar claves legacy globales inmediatamente
4. Segunda org sin clave recibe **defaults**, no legacy ya consumido

**Validación:**

| Suite | Resultado |
|---|---|
| `fundingStore.test.js` | 15/15 |
| `tests/unit/funding` | 32/32 |
| `npm run test:unit` | 260/260 |
| `npm run build` | OK |

### 6. C.14.0 — AI guardrails anti-parálisis (contexto)

**Commit:** `05b3520` — `docs: update ai guardrails operating modes`

Guardrails actualizados: READ-ONLY AUDIT, WRITE/FIX, PROPOSE ONLY, QUARANTINE BEFORE DELETE; Stop Conditions mode-aware; Reconciliation Pass documental. No cambió producto Funding; habilita auditorías C.13/C.14 sin falsa parada.

### 7. Estado final C13-P1-03

```
C13-P1-03: PARTIALLY RESOLVED
           SoT decision + labels/copy + store tests + legacy cross-org fix completed.
           Dashboard runtime/e2e consistency optional pending.
           Other Funding pages labels optional pending.
           Broader persisted workspace backend migration — future enterprise phase.
```

**No marcar RESOLVED global.**

### 8. Resuelto dentro del scope (C.13.3F–J)

| Item | Estado |
|---|---|
| Decisión SoT Option C híbrida | Documentada (3G) |
| Dashboard/widgets labels draft vs persisted | Implementado (3H) |
| Tests store org-scoped + legacy risk | Implementado (3I) |
| Legacy cross-org contamination | Corregido consume-on-migrate (3J) |
| Backend `organizationId` como autoridad enterprise | Sin cambio — confirmado |

### 9. Pendiente (fuera de scope cerrado)

| Item | Prioridad | Notas |
|---|---|---|
| Dashboard runtime/e2e consistency draft vs API | P2 optional | Smoke Playwright no obligatorio para cierre parcial |
| Labels en otras páginas Funding | P2 optional | Scenarios, Capital Structure, Investor Readiness — parcialmente alineadas |
| Persist workspace vía `POST /funding/snapshots` | Future | Acción explícita usuario |
| Migración backend completa del draft workspace | Future enterprise | Fase separada |

### 10. Product truthfulness (post C.13.3J)

- Draft **no debe confundirse** con persisted enterprise data en dashboard principal (labels 3H).
- Legacy global draft **no debe contaminar** múltiples orgs tras migración (fix 3J).
- Backend `organizationId` sigue siendo **autoridad enterprise** para rounds/summary/snapshots.
- Client-side `organizationId` en localStorage es **metadata**, no autoridad de tenancy.

### 11. Qué NO se tocó (cadena 3F–K)

- `backend/**`, `golden_inputs.json`, `FORMULA_REGISTRY.md`
- C13-P1-03 **no** marcado RESOLVED global
- M&A / C.13.4 **no** abierto en esta fase

### 12. Siguiente paso recomendado

**C.13.4** — M&A valuation / waterfall integrity:

- EV_EBITDA, NET_DEBT, EQUITY_VALUE, WATERFALL_SIMPLE
- valuation reports, buyer matching si aplica

---

## C.13.4A / C.13.4B — M&A valuation formula source-of-truth — READ-ONLY + DOCS CLOSED

**Fechas:** 23 mayo 2026  
**Baseline:** `HEAD = origin/main = a958ee2` (pre-commit C.13.4B)  
**C.13.4A:** **CLOSED (READ ONLY)** — auditoría integridad M&A valuation/waterfall; cero modificaciones.  
**C.13.4B:** **CLOSED (DOCS ONLY)** — decisiones source-of-truth documentales.

### 1. C.13.4A — Resumen auditoría

| Elemento | Resultado |
|---|---|
| Modificaciones | **Cero** (read-only) |
| P0 | **Ninguno** |
| P1 | EV simple vs adjusted engine; equity simple vs WC-adjusted; WATERFALL_SIMPLE vs product waterfall; sin golden oracle tests; snapshot drift FE/BE |
| Engine SoT live | `src/modules/ma/engine/useValuationEngine.js` |
| Backend | Persiste snapshots cliente; **no recalcula** engine |

### 2. Fórmulas auditadas

- EV_EBITDA (simple golden)
- NET_DEBT
- EQUITY_VALUE (simple golden)
- WATERFALL_SIMPLE (golden)
- Buyer matching (`buildBuyerMatches`)
- Product metrics: adjusted EV, DCF, blended EV, adjusted equity, netProceeds, product waterfall

### 3. Decisión EV (C.13.4B)

| Métrica | SoT | Rol |
|---|---|---|
| **simpleEnterpriseValue** | Golden `EV_EBITDA` | Benchmark/oracle (`ebitda × multiple`) |
| **adjustedEnterpriseValue** | `useValuationEngine` → `evBase` | Product DSS headline |
| **dcfEnterpriseValue** | `calculateDcfEnterpriseValue` | Triangulation metric |
| **blendedEnterpriseValue** | 65% evBase + 35% DCF | Secondary DSS |

**No sustituir producto por Golden simple automáticamente.** C.13.4C crea tests simple EV vs Golden y documenta gap con adjusted EV.

### 4. Decisión NET_DEBT

- `netDebt = debt - cash` — **alineado** registry/golden/código (`calculateCoreMetrics`).
- Test Golden pendiente **C.13.4C**.
- Net cash (cash > debt) permitido; edge case golden futuro.

### 5. Decisión EQUITY_VALUE

| Métrica | Fórmula |
|---|---|
| **simpleEquityValue** | `enterpriseValue - netDebt` (Golden) |
| **adjustedEquityValue** | `enterpriseValue - netDebt + workingCapitalAdjustment` (product `equityBase`) |
| **netProceeds** | `adjustedEquityValue - fees - taxes` |

**No mezclar** equityValue simple, adjusted equity, ni netProceeds.

### 6. Decisión WATERFALL_SIMPLE

- **WATERFALL_SIMPLE Golden** = simple seller cash bridge (`grossProceeds - costs - debtRepayment - sellerRollover`).
- **Product waterfall** = `MA_PRODUCT_WATERFALL`: EV → netDebt → WC → equity → fees/taxes → netProceeds.
- Product **no implementa** WATERFALL_SIMPLE exacto hoy.
- No afirmar equivalencia hasta test/fase explícita.

### 7. Decisión Buyer matching

- Heurística DSS (`buildBuyerMatches`).
- **Pending Formula Approval** (`MA_BUYER_MATCH_FIT`).
- Label/copy DSS en fase posterior (C.13.4D+).
- **Not certified buyer matching.**

### 8. Decisión Frontend vs Backend

| Capa | SoT |
|---|---|
| **Frontend engine** | Live calculation SoT |
| **Backend SQLite snapshot** | Persisted record SoT — **not** calculation SoT |
| **Riesgo** | Snapshot drift vs live engine |

### 9. Estado C13-P1-11

```
C13-P1-11: PARTIALLY RESOLVED
           SoT decision documented (C.13.4B).
           Golden implementation tests pending (C.13.4C).
           No RESOLVED global.
```

### 10. P1 abiertos (post-decisión)

| ID | Notas |
|---|---|
| MA-P1-01 | Sin golden oracle tests M&A |
| MA-P1-02 | Product adjusted metrics ≠ simple golden (documentado, no bug hasta C.13.4C) |
| MA-P1-03 | Snapshot drift backend vs live engine |
| MA-P1-04 | Buyer matching sin label DSS en páginas |

### 11. Qué NO se tocó

- `src/**`, `backend/**`, `tests/**`, `golden_inputs.json` expected outputs
- No fix de código
- No certified/fairness language

### 12. Siguiente paso

**C.13.4C — M&A golden tests:**

- simple EV_EBITDA vs Golden
- NET_DEBT vs Golden
- simple EQUITY_VALUE vs Golden
- WATERFALL_SIMPLE via pure helper if needed
- document adjusted equity / product waterfall gaps
- **no product fix** unless pure helper authorized

---

## C.13.4A–C.13.4G — M&A valuation / waterfall / report alignment — PARTIALLY CLOSED

**Fechas:** 23 mayo 2026  
**Baseline commit (C.13.4G):** `af44a97` (`test(ma): cover report valuation alignment`)  
**Modo C.13.4G:** docs only — cero cambios en `src/`, `backend/`, `tests/`, Golden expected outputs.

### 1. Estado general de la cadena

| Fase | Estado | Entregable |
|---|---|---|
| **C.13.4A** | **CLOSED** (read-only) | Auditoría M&A valuation/waterfall; P1 documentados; no P0 |
| **C.13.4B** | **CLOSED** (docs) | SoT: simple vs adjusted vs product waterfall vs buyer heuristic |
| **C.13.4C** | **CLOSED** | `maGoldenFormulas.js` + `maGoldenFormulas.test.js` (Golden simple benchmarks) |
| **C.13.4D** | **CLOSED** (read-only) | Alignment audit labels/snapshots/reports |
| **C.13.4E** | **CLOSED** | Labels/copy UI: adjusted DSS, heuristic buyer fit, live vs saved snapshot |
| **C.13.4F** | **CLOSED** | `maProductReportAlignment.test.js` — engine/report parity + policy mirror |
| **C.13.4G** | **CLOSED** (docs) | Cierre parcial documental + snapshot policy |

### 2. Qué queda resuelto (C.13.4A–F)

- Golden simple formulas ancladas por tests (`EV_EBITDA`, `NET_DEBT`, `EQUITY_VALUE`, `WATERFALL_SIMPLE`).
- Product DSS adjusted valuation **separado** de Golden simple (documentado + testeado como divergencia esperada).
- UI labels/copy corregidos (adjusted DSS EV/equity, estimated net proceeds, heuristic buyer fit, live engine vs saved snapshot).
- Buyer matching etiquetado como **heuristic DSS** — not certified buyer recommendation.
- Report alignment tests: `formatMAReportData` preserva `evBase`, `equityBase`, `netProceeds`, `netDebt` desde `useValuationEngine` derived.
- HTML report: disclaimers DSS / not fairness opinion cubiertos en test; sin `NaN` / `Infinity` / `999` en HTML bajo fixture default.
- Backend snapshot = persisted record SoT; **no** live recalculation SoT (documentado C.13.4B, reconfirmado C.13.4G).

### 3. Estado C13-P1-11

```
C13-P1-11: PARTIALLY RESOLVED
           SoT decision (C.13.4B).
           Golden benchmark tests (C.13.4C).
           UI labels/copy (C.13.4E).
           Report alignment unit tests (C.13.4F).
           Snapshot policy documented (C.13.4G).
           No RESOLVED global.
```

**No marcar RESOLVED global** porque siguen pendientes:

- **netProceeds fallback** — si falta `derived.netProceeds`, `formatMAReportData` usa `equityBase` (legacy tolerado; P1 → C.13.4H).
- **Backend snapshot drift policy** — integración/e2e no cubierta; re-export desde snapshot vs live engine no enforced en producto.
- **Optional integration/e2e** snapshot tests.
- **Server-side valuation calculation SoT** — fase enterprise futura (human review).

### 4. Decisión snapshot / report policy (C.13.4G)

| Flujo | Política |
|---|---|
| **Live export** | Debe usar **liveDerived** / output de `useValuationEngine` + `formatMAReportData` con derived completo. |
| **Saved / re-export** | Debe **preservar savedSnapshot** capturado en save/export time. |
| **Merge silencioso** | **Prohibido** mezclar live engine y saved snapshot salvo fallback **documentado campo a campo**. |
| **netProceeds faltante** | Comportamiento actual: fallback a `equityBase` — **legacy tolerado temporalmente** (P1). No presentar como proceeds reales sin label. |

**Fase futura C.13.4H** puede decidir:

- **A)** `netProceeds` faltante → `null` / “not available”
- **B)** Fallback permitido con label explícito (“Equity used as fallback”)
- **C)** Recomputar product waterfall con inputs completos
- **D)** Bloquear export si falta `netProceeds`

### 5. Product truthfulness (reconfirmado)

- **No fairness opinion.** M&A outputs = DSS / decision-support only.
- Adjusted valuation **no** es certified valuation.
- Buyer matching **no** es certified buyer recommendation.
- Backend snapshot **no** es live recalculation.

### 6. Tests (estado unitario)

| Test file | Rol |
|---|---|
| `tests/unit/ma/maGoldenFormulas.test.js` | Golden simple benchmarks |
| `tests/unit/ma/maProductReportAlignment.test.js` | Engine/report parity, disclaimers, Golden vs adjusted divergence, live/snapshot policy mirror, netProceeds fallback documented |
| `tests/unit/ma/useValuationEngine.test.js` | Smoke engine (existente) |

**GAP:** backend integration snapshot policy **not covered** at integration level.

### 7. P1 abiertos post C.13.4G

| ID | Notas |
|---|---|
| MA-P1-03 | Snapshot drift backend vs live engine; re-export policy not product-enforced |
| MA-P1-05 | `netProceeds` fallback to `equityBase` when missing (C.13.4H candidate) |
| MA-P1-06 | Optional M&A snapshot integration/e2e tests |

### 8. Paso siguiente recomendado

| Opción | Fase | Cuándo |
|---|---|---|
| **A (recomendada si cerrar M&A limpio)** | **C.13.4H** — controlled fix for `netProceeds` fallback | Priorizar truthfulness report terminal |
| **B (deuda tracked aceptada)** | **C.13.5** — Bridge / marketplace signals audit | Si se acepta fallback como deuda documentada |

**Recomendación:** **C.13.4H** si se prioriza cerrar cadena M&A valuation/report antes de Bridge.

---

## C.13.4H / C.13.4I — M&A netProceeds fallback controlled fix — CLOSED / DOCS CLOSED

**Fechas:** 23 mayo 2026  
**Baseline commit (C.13.4H):** `cc6a52a` (`fix(ma): avoid equity fallback for net proceeds`)  
**Modo C.13.4H:** fix controlado mínimo — solo `formatMAReportData.js` + `maProductReportAlignment.test.js`.  
**Modo C.13.4I:** docs only — cero cambios en `src/`, `backend/`, `tests/`, Golden expected outputs.

### 1. Problema (P1 — product truthfulness)

`formatMAReportData` podía resolver `summary.netProceeds` con fallback silencioso a `equityBase` cuando faltaba `derived.netProceeds`:

```javascript
// legacy (pre C.13.4H)
const netProceeds = firstNumber(derived?.netProceeds, derived?.sellerProceeds, equityBase);
```

**Riesgo:** equity value (antes de fees/taxes) podía mostrarse como estimated net proceeds en report/export, sin etiqueta y sin representar el terminal real del product waterfall.

### 2. Fix (C.13.4H)

- Nuevo helper `resolveNetProceeds(derived)` en `formatMAReportData.js`.
- Usa **solo** `derived.netProceeds` o `derived.sellerProceeds` si son finitos.
- Si faltan → `summary.netProceeds = null` y `summary.netProceedsSource = 'missing'`.
- Si presentes → `summary.netProceedsSource = 'derived'`.
- `equityBase` permanece separado como `summary.equityValueBase` — **no** se usa como proceeds.

**Archivos modificados (C.13.4H):**

| Archivo | Cambio |
|---|---|
| `src/modules/ma/utils/formatMAReportData.js` | `resolveNetProceeds`; elimina fallback a `equityBase` |
| `tests/unit/ma/maProductReportAlignment.test.js` | 13 tests; missing netProceeds ≠ equityValueBase; HTML safe |

**No tocado:** engine, backend, UI, Golden Dataset, FORMULA_REGISTRY expected outputs, `buildMAReportHtml.js`.

### 3. Tests y validaciones (C.13.4H)

| Validación | Resultado |
|---|---|
| `maProductReportAlignment.test.js` | 13/13 pass |
| `tests/unit/ma` | 50/50 pass |
| `npm run test:unit` | 283/283 pass |
| `npm run build` | OK |

**Cobertura clave:**

- Con `netProceeds` presente → usa valor derived; `netProceedsSource = 'derived'`.
- Sin `netProceeds` → `null`; `netProceedsSource = 'missing'`; no iguala `equityValueBase`.
- HTML seguro sin `NaN` / `Infinity` / `999` cuando falta netProceeds.

### 4. Estado C13-P1-11 (post C.13.4I)

```
C13-P1-11: PARTIALLY RESOLVED
           SoT decision documented (C.13.4B).
           Golden benchmark tests (C.13.4C).
           UI labels/copy DSS (C.13.4E).
           Report alignment unit tests (C.13.4F).
           Snapshot policy documented (C.13.4G).
           netProceeds fallback fixed (C.13.4H).
           Docs closure netProceeds fix (C.13.4I).
           No RESOLVED global.
```

**Resuelto (C.13.4A–I):**

- SoT M&A valuation/waterfall documentado.
- Golden benchmark tests (`maGoldenFormulas`).
- UI labels/copy DSS (adjusted EV, heuristic buyer fit, live vs saved).
- Report alignment tests (`maProductReportAlignment`).
- **netProceeds fallback silencioso eliminado** — `netProceedsSource` expuesto.

**Pendiente (no RESOLVED global):**

- **Backend snapshot/re-export policy** — integración/e2e no cubierta; re-export desde snapshot vs live engine no enforced en producto.
- **Optional integration/e2e** snapshot tests (MA-P1-06).
- **Server-side valuation calculation SoT** — fase enterprise futura (human review).

### 5. P1 abiertos post C.13.4I

| ID | Estado | Notas |
|---|---|---|
| MA-P1-03 | **OPEN** | Snapshot drift backend vs live engine; re-export policy not product-enforced |
| MA-P1-05 | **RESOLVED (C.13.4H)** | netProceeds fallback to equityBase — legacy removed |
| MA-P1-06 | **OPEN** | Optional M&A snapshot integration/e2e tests |

### 6. Paso siguiente recomendado (post C.13.4I — histórico)

**C.13.5A** — Bridge / Marketplace read-only audit (completado).

---

## C.13.5A / C.13.5B — Bridge / Marketplace source-of-truth and quarantine labels — READ-ONLY + CONTROLLED FIX

**Fechas:** 23 mayo 2026  
**Baseline commit (C.13.5B):** `3ea64f3` (pre-commit docs + copy)  
**Modo C.13.5A:** read-only audit — cero modificaciones.  
**Modo C.13.5B:** docs SoT + copy/labels en `BridgeMarketplacePage.jsx` únicamente.

### 0. Contexto (post C.13.5C–E)

| Subfase | Commit / estado | Resultado |
|---|---|---|
| C.13.5C | `91c1b25` | Marketplace quarantine guard (`VITE_ENABLE_BRIDGE_MARKETPLACE`) |
| C.13.5D | `d11c831` | Golden helper `bridgeGoldenFormulas.js` + tests vs `bridge_priority_score_basic` (expected **73**) |
| C.13.5E | docs | **Option C** — separación documental `bridgePriorityGolden` vs `operationalSignalPriority` |

### 1. C.13.5A — Resumen auditoría (read-only)

| Hallazgo | Clasificación |
|---|---|
| No P0 confirmado (auth + tenant scoping en Bridge Enterprise) | — |
| `/bridge/marketplace` existe, protegido, **no** en nav | Coherente A.1.5 |
| Marketplace copy sugería red/liquidez/verified network / success fee activo | **P1** |
| Demo fallback puede presentarse como pipeline real | **P1** |
| `BRIDGE_PRIORITY` product ≠ Golden/registry | **P1** — C13-P1-07 |
| `getMatchScore` heurístico sin registry/test | **P1** |
| Bridge Enterprise señales tenant-scoped + human review | OK DSS |

### 2. Bridge Enterprise — decisión SoT

| Elemento | Decisión |
|---|---|
| **Rol** | DSS internal executive **cross-module signal layer** — not automated decision engine |
| **SoT actual** | `backend/services/bridge/bridge.service.js` + tenant-scoped stores (`bridge_signals`, dependencies, conflicts, attention queue) |
| **Recalculate** | `recalculateEnterpriseBridge` — heurísticas desde summaries Compliance/Funding/M&A/PMI/Governance/Risk/Reporting/Strategy |
| **Señales** | Heuristic DSS; `humanReviewStatus: 'required'` unless formula-approved |
| **Rutas producto** | `/bridge/dashboard`, `/signals`, `/dependencies`, `/conflicts`, `/attention-queue`, `/reports`, `/snapshots` |
| **No es** | Public marketplace, transaction layer, certified matching, investment/financing advice |

### 3. Bridge Marketplace — decisión SoT

| Elemento | Decisión |
|---|---|
| **Política** | `INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK` (A.1.5 reconfirmado) |
| **Ruta** | `/bridge/marketplace` — activa por URL directa; **no** sidebar/rail |
| **SoT datos** | Backend `/bridge/opportunities` etc. si existen; si vacío/error → `DEMO_BRIDGE_*` fallback FE |
| **No es** | Public marketplace, active transaction platform, active success-fee engine, certified buyer/seller/funding matching |
| **Demo fallback** | **Not** enterprise persisted marketplace data — must be labelled |
| **Matching** | `getMatchScore` — heuristic DSS; Pending Formula Approval (`BRIDGE_MARKETPLACE_MATCH_FIT`) |
| **C.13.5B copy** | Labels/disclaimers en `BridgeMarketplacePage.jsx` — internal preview, future private network, transaction layer not active |

### 4. BRIDGE_PRIORITY — decisión (Option C — C.13.5E)

| Capa | Nombre lógico | Fórmula / comportamiento | Rol |
|---|---|---|---|
| **Golden / benchmark** | `bridgePriorityGolden` | `priorityScore = impact*0.5 + urgency*0.3 + confidence*0.2` → `bridge_priority_score_basic` expected **73** | Oracle matemático; validación; auditoría lógica; **no** fórmula operativa del producto |
| **Product / DSS operativo** | `operationalSignalPriority` (implementado hoy como `calculateSignalPriority`) | `severityRank*18 + confidenceLevel*0.2 + blockingBonus - stalePenalty` | Heurística DSS para cola de atención / orden de señales; **no** oracle Golden; **no** priorización certificada |
| **Estado C13-P1-07** | **PARTIALLY RESOLVED / DECISION DOCUMENTED** | Mismatch **intencionalmente coexisten** bajo Option C; Golden tests completos (C.13.5D); **sin cambio de código product** en C.13.5E |
| **No es** | — | Presentar product priority como equivalente Golden; vender como fórmula certificada | Product truthfulness |
| **Siguiente** | **C.13.5F** | Naming/labels/tests operativos o alineación controlada — **solo tras autorización explícita** | No refactor ni rename en C.13.5E |

### 5. Tests y validaciones (C.13.5B)

| Validación | Resultado esperado |
|---|---|
| `formulaRegistryCoverage` | Pass (registry docs only) |
| `npm run test:unit` | Pass |
| `npm run build` | Pass |
| Marketplace e2e | Not required (route still unlisted) |

### 6. Estado resumen

```
C13-P1-07: PARTIALLY RESOLVED / DECISION DOCUMENTED (C.13.5E Option C).
           Golden benchmark tests complete (C.13.5D).
           bridgePriorityGolden vs operationalSignalPriority separated in docs.
           Product calculateSignalPriority unchanged.
           No RESOLVED global.
Bridge Marketplace truthfulness: PARTIALLY RESOLVED — quarantine labels C.13.5B + guard C.13.5C.
```

**Resuelto (C.13.5B):**

- SoT Bridge Enterprise vs Marketplace documentado.
- Marketplace internal demo / future private network labels.
- Success fee / transaction layer explicitamente future-only.
- Heuristic matching labelled DSS / not certified.

**Pendiente:**

- C.13.5F — Bridge operational priority alignment tests / naming (optional controlled code phase).
- Backend marketplace policy / integration tests (optional).

### 7. Paso siguiente recomendado

**C.13.5F — Bridge operational priority alignment tests / naming** (documentar/heuristic tests para `operationalSignalPriority`; rename opcional; **no** alinear product a Golden sin fase autorizada separada).

---

## C.13.5D — BRIDGE_PRIORITY golden/helper tests — CLOSED

**Fecha:** 23 mayo 2026  
**Commit:** `d11c831` — `test(bridge): add golden priority benchmark`  
**Modo:** WRITE/FIX — helper puro + tests controlados.

| Entregable | Detalle |
|---|---|
| Helper | `backend/services/bridge/bridgeGoldenFormulas.js` → `calculateBridgePriorityGolden` |
| Tests | `tests/unit/bridge/bridgeGoldenFormulas.test.js` — oracle **73**, edge cases, divergencia product documentada |
| Golden ID | `bridge_priority_score_basic` |
| Product | `calculateSignalPriority` **no modificado** |

---

## C.13.5E — Bridge priority product formula decision — CLOSED (docs only)

**Fecha:** 23 mayo 2026  
**Baseline:** `d11c831`  
**Modo:** DOCUMENTAL / DECISIONAL — sin cambios de código productivo.

### Decisión formal: **Option C — Dual-layer priority model**

1. **`bridgePriorityGolden`**
   - Benchmark/oracle lógico alineado a Golden Dataset `BRIDGE_PRIORITY`.
   - Fórmula: `impact * 0.5 + urgency * 0.3 + confidence * 0.2`.
   - Implementación de referencia: `calculateBridgePriorityGolden()` en `bridgeGoldenFormulas.js` (C.13.5D).
   - Uso: validación, referencia matemática, auditoría lógica, CI oracle.
   - **No** representa la prioridad operativa del producto Bridge.

2. **`operationalSignalPriority`**
   - Prioridad operativa DSS usada por el producto Bridge hoy.
   - Implementación actual: `calculateSignalPriority()` en `bridge.service.js` (sin rename en esta fase).
   - Inputs operativos: severity, confidenceLevel, blocking/stale heuristics — **no** impact/urgency Golden weights.
   - Uso: attention queue, signal ordering, executive bridge heuristics.
   - Debe etiquetarse como **señal operativa DSS**, no oracle matemático ni priorización certificada.

### Rechazado en C.13.5E (sin implementar)

| Opción | Motivo de no aplicar ahora |
|---|---|
| **A — Mantener sin documentar dualidad** | Insuficiente — mismatch ya confirmado; requiere separación explícita |
| **B — Alinear product al Golden** | Requiere fase controlada posterior; impacto operativo en señales existentes; human review |

### Estado C13-P1-07 (post C.13.5E)

```
C13-P1-07: PARTIALLY RESOLVED / DECISION DOCUMENTED
           Option C dual-layer model formalized.
           Golden tests complete (C.13.5D).
           Product formula unchanged.
           No RESOLVED global.
```

### Paso siguiente recomendado (post C.13.5E — histórico)

**C.13.5F** — Bridge operational priority alignment tests / naming (completado — ver sección C.13.5F).

---

## C.13.5F — Bridge operational priority alignment tests / naming — CLOSED

**Fecha:** 23 mayo 2026  
**Baseline:** `45c101a`  
**Modo:** WRITE/FIX — tests dedicados + docs; **sin cambio de comportamiento productivo**.

### Enfoque

Blindar la heurística operativa actual (`calculateSignalPriority`) **sin alinearla al Golden** (Option C mantenida).

| Entregable | Detalle |
|---|---|
| Tests | `tests/unit/bridge/bridgeOperationalPriority.test.js` — 8 tests |
| Naming conceptual | `operationalSignalPriority` documentado en tests (alias de `calculateSignalPriority`) |
| Golden layer | `bridgePriorityGolden` / `calculateBridgePriorityGolden` — **no tocado** |
| Product code | `bridge.service.js`, `calculateSignalPriority` — **sin cambios** |
| Helper mirror | **No creado** — export pública existente suficiente para test directo |

### Cobertura operativa (comportamiento actual bloqueado)

| Área | Verificado |
|---|---|
| Severity rank ordering | blocked > critical > risk > watch > info |
| Confidence contribution | `confidenceLevel * 0.2` (clamped) |
| Blocking bonus | +12 when severity = blocked |
| Stale penalty | -8 when `staleFlag` true |
| Clamp 0–100 | High/low edge scores |
| Unknown severity default | watch rank (36 base) |
| Dual-layer divergence | operational ≠ Golden 73 |
| Summary integration | `topRecommendedActions` sorted by operational priority |

### Validaciones

| Comando | Resultado |
|---|---|
| `npx vitest run tests/unit/bridge/bridgeOperationalPriority.test.js` | 8/8 ✅ |
| `npx vitest run tests/unit/bridge` | 16/16 ✅ |
| `npm run test:unit` | 300/300 ✅ |
| `npm run build` | ✅ |

### Estado C13-P1-07 (post C.13.5F)

```
C13-P1-07: PARTIALLY RESOLVED
           Option C dual-layer maintained.
           Golden benchmark tests (C.13.5D).
           Operational heuristic tests (C.13.5F).
           Product formula unchanged.
           No RESOLVED global — intentional mismatch remains by design.
```

### Paso siguiente recomendado

Optional **C.13.5G** — extract pure operational helper mirror (only if refactor authorized), or **product→Golden alignment** (Option B) only with separate human-approved phase.

---

## C.13.6A — Risk Logic Integrity / Formula Audit — CLOSED (read-only)

**Fecha:** 23 mayo 2026  
**Baseline:** `fe45be0`  
**Modo:** READ ONLY — cero modificaciones.

### Hallazgos principales

| Hallazgo | Clasificación |
|---|---|
| No P0 (auth + tenant scoping Risk Enterprise) | OK |
| Golden `likelihood × impact = 20` ≠ product `riskScoreFrom` | **P1** — C13-P1-08 |
| UI heatmap ignora `dashboard.heatmap` scores del backend | **P1** |
| Copy heatmap vs implementación (impact×likelihood counts) | **P1** |
| Register UI no captura likelihood/impact | **P1** |
| Sin tests oráculo Golden Risk | **P1** |
| `riskReadinessScore` composite sin golden | **P2** |
| Múltiples dominios “risk” (M&A, Compliance, PMI, Strategy) | **P2** |

### Fórmulas identificadas

| Capa | Función | Fórmula product (actual) |
|---|---|---|
| Golden / Registry | `RISK_LIKELIHOOD_IMPACT` | `riskScore = likelihood × impact` → expected **20** (L=4, I=5), severity **critical** |
| Product operativo | `riskScoreFrom()` en `risk.service.js` | `round(((severityRank + likelihood + impact) / 15) × 100)` con `inherentSeverity` / `residualRisk` |
| Portfolio DSS | `calculateRiskMetrics()` | Heurística compuesta (readiness, posture, bridge signals) — **sin golden** |

**Recomendación auditoría:** replicar **Option C dual-layer** (patrón Bridge C.13.5E).

---

## C.13.6B — Risk dual-layer decision — CLOSED (docs only)

**Fecha:** 23 mayo 2026  
**Baseline:** `fe45be0`  
**Modo:** DOCUMENTAL / DECISIONAL — sin cambios de código productivo.

### Decisión formal: **Option C — Dual-layer Risk Model**

1. **`riskLikelihoodImpactGolden`**
   - Benchmark/oracle lógico alineado a Golden Dataset `RISK_LIKELIHOOD_IMPACT`.
   - Fórmula: `likelihood × impact` (escala 1–5).
   - Golden ID: `risk_score_likelihood_impact_basic` — expected **20** (L=4, I=5), severity band **critical** (16–25).
   - Uso: validación matemática, Formula Approval Gate, auditoría lógica, CI oracle futuro (C.13.6C).
   - **No** representa el score operativo actual del producto Risk Enterprise.

2. **`operationalEnterpriseRiskScore`**
   - Score DSS operativo usado por Risk Enterprise hoy.
   - Implementación actual: `riskScoreFrom()` interno en `risk.service.js` (sin rename en esta fase).
   - Inputs: `inherentSeverity`, `residualRisk`, `likelihood`, `impact` → output 0–100.
   - Uso: dashboard, residual risk KPI, `riskReadinessScore`, executive/bridge signals, heatmap operativo (cuando se alinee en fase posterior).
   - Debe etiquetarse como **señal DSS operativa** — no oracle Golden, no scoring certificado, no underwriting.

### Rechazado en C.13.6B (sin implementar)

| Opción | Motivo |
|---|---|
| **A — Mantener sin documentar dualidad** | Insuficiente — mismatch confirmado en C.13.6A |
| **B — Alinear product al Golden L×I** | Requiere fase controlada posterior; impacto en KPIs/readiness/heatmap |

### Gaps documentados (pendientes post-decisión)

| ID | Gap | Fase sugerida |
|---|---|---|
| C13-P1-08a | UI ignora `dashboard.heatmap` scores | **CLOSED** C.13.6E |
| C13-P1-08b | Copy heatmap engañoso | **CLOSED** C.13.6E |
| C13-P1-08c | Register sin campos likelihood/impact | **CLOSED** C.13.6E |
| C13-P1-08d | Sin golden/oracle tests | **CLOSED** C.13.6C |

### Estado C13-P1-08 (post C.13.6B)

```
C13-P1-08: PARTIALLY RESOLVED / DECISION DOCUMENTED
           Option C dual-layer model formalized.
           Golden helper/tests pending (C.13.6C).
           Operational tests pending (C.13.6D).
           Product riskScoreFrom unchanged.
           No RESOLVED global.
```

### Paso siguiente recomendado

**C.13.6C** — `RISK_LIKELIHOOD_IMPACT` golden helper + tests (`riskLikelihoodImpactGolden` vs `risk_score_likelihood_impact_basic` expected **20**).

---

## C.13.6C — RISK_LIKELIHOOD_IMPACT golden helper/tests — CLOSED

**Fecha:** 23 mayo 2026  
**Commit:** `fbb6271` — `test(risk): add golden likelihood impact benchmark`  
**Modo:** WRITE/FIX — helper puro Golden + tests.

| Entregable | Detalle |
|---|---|
| Helper | `backend/services/risk/riskGoldenFormulas.js` |
| Tests | `tests/unit/risk/riskGoldenFormulas.test.js` — 8 tests |
| Golden ID | `risk_score_likelihood_impact_basic` — score **20**, severity **critical** |
| Product | `riskScoreFrom` **sin cambios de fórmula** |

---

## C.13.6D — Risk operational score heuristic tests — CLOSED

**Fecha:** 23 mayo 2026  
**Baseline:** `fbb6271`  
**Modo:** WRITE/FIX — tests operativos + export mínimo; **sin cambio de fórmula**.

| Entregable | Detalle |
|---|---|
| Tests | `tests/unit/risk/riskOperationalScore.test.js` — 8 tests |
| Export | `riskScoreFrom` exportado para test shield (sin cambio de lógica) |
| Naming | `operationalEnterpriseRiskScore` documentado en tests |
| Golden layer | **No tocado** |

### Cobertura operativa

| Área | Verificado |
|---|---|
| Severity + likelihood + impact → 0–100 | critical/critical 100; high/medium 67 |
| Modo inherent | inherentSeverity driver |
| Clamp L/I 1–5 | 0→1, 10→5 |
| Defaults L/I = 2 | medium/medium → 47 |
| Unknown severity label (`watch`) | rank default 1 → 33 |
| `calculateRiskMetrics` integration | residualRisk, criticalRiskCount, posture |
| Dual-layer divergence | operational 93 ≠ Golden 20 |

### Estado C13-P1-08 (post C.13.6D)

```
C13-P1-08: PARTIALLY RESOLVED
           Option C dual-layer maintained.
           Golden tests complete (C.13.6C).
           Operational tests complete (C.13.6D).
           UI/heatmap gaps pending (C.13.6E).
           No RESOLVED global.
```

### Paso siguiente recomendado

**C.13.6F** — Risk final closure / report-export truthfulness / e2e smoke (2026-05-23)

### Report/export review

| Item | Result |
|---|---|
| Active feature | Yes — `POST /risk/reports` persists export metadata + operational summary payload |
| UI | `RiskReportsPage`, `RiskReportsPanel` |
| Backend | `createRiskReport()` — disclaimer + `scoringTruthfulness` metadata (no formula change) |
| PDF/HTML download | **Not active** — list/create metadata only; no separate export renderer |

### Copy/labels corrected

- Reports page hero copy → decision-support / not certified
- Reports panel disclaimer → operational DSS + Golden validation-only + human review
- Table column **Scoring model** → `operationalEnterpriseRiskScore · DSS`
- Export payload `boardReadyMemo.disclaimer` + `scoringTruthfulness` block

### E2E

| Item | Result |
|---|---|
| Playwright version | 1.59.1 |
| `npx playwright install chromium` | ✅ Installed (no repo file changes) |
| `npx playwright test tests/e2e/risk` | ❌ `ECONNREFUSED 127.0.0.1:4000` — backend API not running in test env |
| Product impact | **None** — spec + browsers ready; smoke requires live backend (C.13.6G optional production smoke) |

### Estado C13-P1-08 (post C.13.6F)

```
C13-P1-08: RESOLVED / DUAL-LAYER RISK MODEL CLOSED
           All subgaps C13-P1-08a–e closed (C.13.6C–E).
           Report/export truthfulness verified and aligned (C.13.6F).
           Dual-layer divergence remains by design (Option C) — documented, not a product defect.
           E2E: browsers installed; smoke blocked by missing backend server in env (not product defect).
```

### Paso siguiente recomendado

**C.13.7** — PMI Logic Integrity / Synergy Formula Audit READ ONLY

---

## C.13.6E — Risk UI / Heatmap / Copy / Register Fields Alignment (2026-05-23)

**Scope:** UI truthfulness only — no formula, Golden Dataset, or backend scoring changes.

### Cambios

| Área | Corrección |
|---|---|
| Heatmap dashboard | `RiskDashboardPage` pasa `dashboard.heatmap` enriquecido a `RiskHeatmap`; fallback defensivo a `dashboard.risks` |
| Adaptador | `src/modules/risk/utils/riskHeatmapData.js` — `normalizeRiskHeatmapData`, referencia L×I display-only, max operational residual por celda |
| Copy heatmap | Eliminado “severity vs likelihood”; labels: “Likelihood × impact matrix”, DSS decision-support, Golden solo validación |
| Register | Campos visibles `likelihood` e `impact` (1–5) en formulario; columnas en tabla; payload via `prepareRiskRegisterPayload` |
| KPI copy | Risk readiness / residual risk etiquetados como operational DSS posture |

### Tests añadidos

- `tests/unit/risk/riskHeatmapData.test.js`
- `tests/unit/risk/riskRegisterPayload.test.js`
- `tests/unit/risk/riskUiAlignment.test.jsx`
- `tests/e2e/risk/risk-enterprise-flow.spec.js` — fill Likelihood/Impact en register

### No tocado

- `riskScoreFrom`, `riskGoldenFormulas.js`, Golden Dataset, migraciones, Bridge, Compliance, Funding, M&A, backend API (ya aceptaba likelihood/impact)

### Estado C13-P1-08 (post C.13.6E)

```
C13-P1-08: PARTIALLY RESOLVED / UI ALIGNMENT COMPLETED
           C13-P1-08a heatmap → dashboard.heatmap: CLOSED
           C13-P1-08b copy heatmap fiel: CLOSED
           C13-P1-08c register likelihood/impact: CLOSED
           C13-P1-08d Golden tests: CLOSED (C.13.6C)
           C13-P1-08e operational tests: CLOSED (C.13.6D)
           Dual-layer mismatch by design (Option C) — no RESOLVED global
           Report/export truthfulness pending C.13.6F
```

---

## C.13.7B — PMI SoT / Dual-Layer Decision (docs-only)

**Fecha:** 24 mayo 2026  
**Modo:** DOCUMENTAL / DECISIONAL (sin cambios de código, sin tests nuevos)  
**Estado:** **COMPLETED DOCS-ONLY**  
**PMI formula status:** **MISMATCH CONFIRMED / SOT DECISION DOCUMENTED**

### Decisión formalizada

**OPTION C — Multi-layer PMI Logic Model**

| Layer | Logical name | Formula / source | Role | Status |
|---|---|---|---|---|
| Golden benchmark | `pmiCaptureRateGolden` | `captured / forecast`; `forecast=0 => null` | Oracle / Formula Approval benchmark | **IMPLEMENTED AND TESTED** (C.13.7C) |
| Case operational | `operationalPmiCaseCapture` | `synergyCaptured / synergyTarget` | DSS case dashboard | OPEN — denom distinto a Golden |
| Ledger operational | `operationalPmiLedgerCapture` | `Σcaptured / Σforecast` | DSS ledger view | OPEN — null behavior pending |
| Enterprise operational | `operationalPmiEnterpriseCapture` | `capturedValue / targetValue` + fallback case/ledger | DSS enterprise initiatives | OPEN — sync SoT pending |
| Readiness DSS | `operationalPmiReadinessScore` | Heurística compuesta (`pmiReadinessScore`, `integrationReadinessScore`, `integrationScore`) | DSS executive signal | OPEN — no Golden asociado |
| Demo/template | `demoPmiCase` | `DEMO_PMI_CASE` / `mergeWithDemo` | Template/fallback only | OPEN — no truth ejecutiva |
| CEO/Hub | `pmiExecutiveHubSignal` | Backend hub brief agregada | DSS signal agregada | OPEN — demo/default gating pending |

### Estado P1 (C13-P1-09…15)

| ID | Estado | Decisión | Siguiente fase |
|---|---|---|---|
| C13-P1-09 | RESOLVED / DEMO TRUTHFULNESS GATED | `mergeWithDemo` eliminado para persistidos; demo/template/fallback explícitos | C.13.7F copy residual |
| C13-P1-10 | PARTIALLY RESOLVED / GOLDEN ZERO FORECAST TESTED | Golden helper devuelve `null` si forecast≤0; producto operacional pendiente | C.13.7D |
| C13-P1-11 | PARTIALLY RESOLVED / GOLDEN CAPTURE SEPARATED | Golden (captured/forecast) testeado aparte de target operacional | C.13.7D |
| C13-P1-12 | PARTIALLY RESOLVED / GOLDEN HELPER TESTED | `pmiGoldenFormulas.js` + `pmiGoldenFormulas.test.js` | C.13.7D |
| C13-P1-13 | PARTIALLY RESOLVED / OPERATIONAL SOURCES TESTED | Case/ledger/enterprise testeados por capa; sync SoT único pendiente | C.13.7E |
| C13-P1-14 | PARTIALLY RESOLVED / OPERATIONAL READINESS TESTED | Readiness DSS testeado; no Golden | C.13.7E |
| C13-P1-15 | RESOLVED / CEO HUB GATING ADDED | Hub `executiveSignalEligible` + CEO `scoreDisplay` pending data | C.13.7F copy residual |

### No-acciones confirmadas (C.13.7B)

- No se tocó `backend/services/pmi/pmi.service.js`.
- No se tocó `src/modules/pmi/store/pmiStore.jsx`.
- No se tocó `src/modules/pmi/engine/usePMIEngine.js`.
- No se tocó UI PMI ni tests.
- No se tocó `docs/testing/golden_inputs.json`.
- No se tocó `docs/testing/FORMULA_REGISTRY.md`.
- No se tocó `src/modules/ceo-overview/pages/CEOOverviewPage.jsx`.
- No se aplicaron fixes de `mergeWithDemo`.
- No se tocaron otros módulos.

### Regla de continuidad

1. No alinear product → Golden sin fase explícita y aprobación humana.
2. No promover demo/fallback a executive truth sin gating/label.
3. No presentar readiness/integration DSS como fórmula Golden certificada.

### C.13.7C — PMI Golden helper/tests (COMPLETED)

**Modo:** WRITE/FIX (helper + tests + docs de cierre)  
**Estado:** **COMPLETED**  
**PMI formula status:** **MISMATCH CONFIRMED / GOLDEN BENCHMARK TESTED**

**Entregables:**
- `backend/services/pmi/pmiGoldenFormulas.js` — `calculatePmiCaptureRateGolden`
- `tests/unit/pmi/pmiGoldenFormulas.test.js` — oráculo `pmi_synergy_capture_rate_basic`, `pmi_synergy_zero_forecast`, edge cases, dual-layer truthfulness

**No tocado:** `pmi.service.js`, PMI UI, `mergeWithDemo`, `golden_inputs.json`, `FORMULA_REGISTRY.md`, CEO/Hub.

### C.13.7D — PMI operational synergy/readiness tests (COMPLETED)

**Modo:** WRITE/TEST (harness + tests + docs de cierre)  
**Estado:** **COMPLETED**  
**PMI formula status:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL TESTED**

**Entregables:**
- `backend/services/pmi/pmiOperationalFormulas.js` — harness case/ledger/enterprise ratio (no product import)
- `tests/unit/pmi/pmiOperationalMetrics.test.js` — oráculos operativos + `calculatePmiEnterpriseMetrics` readiness

**No tocado:** `pmi.service.js` (sin cambio de fórmula), `mergeWithDemo`, CEO/Hub, Golden JSON, UI.

### C.13.7E — PMI demo/fallback truthfulness + CEO/Hub gating (COMPLETED)

**Modo:** WRITE/FIX (store + hub + CEO mínimo + tests)  
**Estado:** **COMPLETED**  
**PMI formula status:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL + DEMO GATED**

**Entregables:**
- `pmiStore.jsx` — `normalizePersistedPmiCase`, demo/template/fallback explícitos (sin `mergeWithDemo` silencioso)
- `pmi.service.js` — hub truthfulness metadata; `buildPmiSignal(null)` → score `null`
- `PMIDashboardPage.jsx` — banner truthfulness
- `CEOOverviewPage.jsx` — PMI pending-data copy
- Tests: `pmiDemoTruthfulness.test.js`, `pmiHubTruthfulness.test.js`

### C.13.7F — PMI UI/copy labels + report truthfulness + cross-tenant tests (COMPLETED)

**Modo:** WRITE/FIX (labels + report metadata + tests)  
**Estado:** **COMPLETED**  
**PMI formula status:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL + DEMO + UI TRUTHFULNESS GATED**

**Entregables:**
- Labels DSS en `PMIEnterpriseComponents.jsx`, `PMIEnterprisePages.jsx`, `PMIDashboardPage.jsx`
- `generatePmiReport` — `scoringTruthfulness`, `boardReadyMemo`, `humanReviewRequired`
- Tests: `pmiUiTruthfulness.test.js`, `pmiReportTruthfulness.test.js`, `pmiMultiTenant.test.js`

**Pendiente documentado (post C.13.7F):** zero forecast productivo (0% operational vs Golden null); e2e env-dependent.

### C.13.7G — PMI final smoke / zero forecast product behavior decision

**Commit:** `30869ca` — `fix(pmi): align zero denominator capture semantics`

**Decisión:** **Option B** — operational case/ledger/enterprise capture return `null` when denominator ≤ 0; UI/export show N/A; Golden unchanged.

**Archivos:** `pmi.service.js`, `pmiOperationalFormulas.js`, `usePMIEngine.js`, `PMIDashboardPage.jsx`, `PMIEnterpriseComponents.jsx`, `pmiExportApi.js`, `tests/unit/pmi/*`, docs (3).

**Tests:** PMI unit + integration; full unit suite + build. E2E: document if `ECONNREFUSED :4000`.

**C13-P1-10:** **RESOLVED / ZERO DENOMINATOR ALIGNED TO NULL**

**PMI global:** **RESOLVED PRODUCT LOGIC / MULTI-LAYER PMI MODEL CLOSED** (E2E-prod smoke / PDF renderer = P2/P3)

### Siguiente fase recomendada

**C.13.12 — Global Logic Integrity Final Gate / Release Readiness Audit**

### C.13.12 — Global Logic Integrity Final Gate (CLOSED)

**Commit:** 1c27d88 — `docs: record global logic integrity final gate`

**Mode:** VALIDATION / DOCS — no product code changed.

**Final status:** **C.13 GLOBAL LOGIC BASELINE CLOSED / P2–P3 ENTERPRISE HARDENING PENDING**

| Validation | Result |
|---|---|
| `npm run test:unit` | 418 passed |
| `npm run test:integration` | 65 passed |
| `npm run build` | pass |
| Reporting / Governance / Strategy / CEO e2e | 4 passed (local harness) |
| Golden → product imports | none in `src/` |
| CEO fallback scores | gated (C.13.10B) |
| P1 logic blockers | **none known** |

**P2 residuals:** Governance/Strategy Golden · ~~Render smoke~~ **passed with residuals (2026-05-24)** · PDF renderer · per-module variance · ~~PMI `mergeWithDemo` stale reference~~ **resolved C.13.12B** · `executiveReports` readiness `\|\| 0` · Heritage audit · broader e2e.

**Siguiente:** Production Render smoke · C.14 Enterprise Hardening

### C.13.12B — PMI stale mergeWithDemo reference fix

**Commit:** afc7f2a — `fix(pmi): remove stale demo merge reference`

**Fix:** `savePmiCase` — `mergeWithDemo(saved)` → `normalizePersistedPmiCase(saved)` in `pmiStore.jsx`.

**C13-P2-PMI-STALE-MERGE:** RESOLVED / normalizePersistedPmiCase used for persisted hydration

**Validaciones:** PMI unit + integration + full suite + build pass.

**Siguiente:** Production Render smoke / C.14

### Production Render Smoke — app.theceosos.com (2026-05-24)

**Mode:** VALIDATION / DOCS — no product code changed.

**Git baseline:** `HEAD` = `origin/main` = `51fe72b` · working tree `?? backend-server.err` only.

**URLs:** Main `https://app.theceosos.com` · Render origin `https://ceos-os.onrender.com`

| Check | Result |
|---|---|
| Local `npm run test:unit` | **418 passed** |
| Local `npm run test:integration` | **65 passed** |
| Local `npm run build` | **pass** (`dist/assets/index-cJpBWyAU.js`) |
| `/health` + `/api/health` (app + Render) | **200 OK** — `status: ok`, CEO OS Backend |
| API without token `GET /api/ma/cases` | **401** |
| SPA direct refresh (32 routes) | **200** — SPA shell + `assets/index-*` on all module routes listed in smoke prompt |
| Production login/logout/session | **NOT EXECUTED** — no authorized production test credentials in agent env; bootstrap dev creds return **401** on prod |
| CEO Overview truthfulness (authenticated) | **NOT VERIFIED** — requires login + post-C.13.10B bundle |
| Module dashboards (authenticated) | **NOT VERIFIED** — requires login |
| CRUD smoke | **NOT EXECUTED** — no production test dataset authorized |
| Reporting / Board Review Draft (authenticated) | **NOT VERIFIED** |
| Playwright vs production | **NOT EXECUTED** — would require prod creds / env; config unchanged |
| Browser console (unauthenticated `/login`) | No critical JS errors observed (CursorBrowser dialog warnings only) |

**Deploy drift (P2):** Production serves `assets/index-Bf_8bVe8.js`; local build at `51fe72b` produces `index-cJpBWyAU.js`. Production main bundle **does not contain** C.13.10B/C.13.12B markers (`Board Review Draft`, `insufficient_data`, `normalizePersistedPmiCase`, `mergeWithDemo` absent in prod bundle grep). **Assumed:** Render deploy behind `main` until redeploy triggered.

**Public copy smoke (unauthenticated landing/login HTML):** Permitted DSS language present (`Private Executive`). Prohibited terms from smoke list **not found** in static HTML shell (authenticated UI copy not scanned).

**Unauthenticated routing:** `/ceo` returns SPA shell **200** (client-side auth gate); marketing landing at `/` with path to `/login`.

**Final production status:** **PRODUCTION SMOKE PASSED WITH P2 RESIDUALS**

**P0:** None.

**P1:** None confirmed on infra/auth perimeter; authenticated CEO truthfulness **pending** post-redeploy + test account.

**P2:**
- Production frontend bundle drift vs `51fe72b` (redeploy required to ship C.13.10B/12B).
- Authenticated login/session/module/CEO/Reporting smoke blocked (env).
- CRUD not executed (no test dataset).

**P3:** Cold-start not observed; minor browser automation warnings.

**Recommendation:** Trigger Render deploy from `main` @ `51fe72b`; rerun authenticated smoke with `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` (prod test org only). Then advance to **C.14 Enterprise Hardening**.

**Commit:** docs-only — `docs: record production render smoke`

### Post-redeploy Authenticated Production Smoke (2026-05-24)

**Mode:** VALIDATION / DOCS — no product code changed.

**Git baseline:** `HEAD` = `origin/main` = `6e701e8` · working tree `?? backend-server.err` only.

**Redeploy status:** Render Dashboard commit hash **not verified by agent** (no dashboard access). **Bundle proxy confirms redeploy:** production no longer serves `index-Bf_8bVe8.js` (**404**); current main `index-C6AoPVVs.js` · lazy `ExecutiveOverviewer-RmxyISiT.js`.

| Check | Result |
|---|---|
| Local unit / integration / build | **418 / 65 / pass** |
| Health (app + Render) | **200 OK** |
| API perimeter (no token) | **401** on `/api/ma/cases`, `/api/reporting/reports`, `/api/executive/overview` |
| Bundle drift (P2 prior) | **RESOLVED** — new prod bundle; C.13.10B strings in `ExecutiveOverviewer-RmxyISiT.js`: `Board Review Draft`, `insufficient_data`, `human review`; `mergeWithDemo` **absent** |
| `insufficient_data` in main index | **present** |
| Production login (bootstrap local creds) | **401 INVALID_CREDENTIALS** — dev bootstrap not valid on prod |
| `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` | **not set** in agent env or `.env` |
| Authenticated CEO / Reporting / modules | **NOT EXECUTED** |
| CRUD prod | **NOT EXECUTED** |
| Playwright prod | **NOT EXECUTED** |

**Final status:** **PRODUCTION AUTH SMOKE BLOCKED BY ENV/CREDENTIALS**

**P0:** None.

**P1:** None confirmed (authenticated CEO truthfulness still unverified).

**P2 (resolved):** Deploy drift — bundle updated post-redeploy.

**P2 (open):** Authenticated session smoke · CEO UI truthfulness post-login · Reporting/Board Review Draft UI · module navigation post-login · CRUD — all blocked until **production test credentials** (`CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` for prod test org).

**P3:** Render deploy commit ID not captured in docs (manual dashboard check recommended).

**Recommendation:** Provision prod-only test user; set env vars locally (never commit); rerun CEO + Reporting + module smoke; then **C.14** if clean.

**Commit:** `docs: record authenticated production smoke`

### Post-redeploy Authenticated Production Smoke — EXECUTED (2026-05-24)

**Mode:** VALIDATION / DOCS — no product code changed. Credentials provided by operator in session only (not stored in repo).

**Git baseline:** `HEAD` = `origin/main` = `6e701e8` at start · docs commit `a4c22b3` after prior blocked pass.

| Check | Result |
|---|---|
| Bundle C.13.10B | **CONFIRMED** — `index-C6AoPVVs.js` + `ExecutiveOverviewer-RmxyISiT.js` (`Board Review Draft`, `insufficient_data`, `human review`) |
| Health + API 401 perimeter | **PASS** |
| Production login | **200** — admin test org (`admin.prod2@ceoos.local`) |
| API with session | **200** on `/api/ma/cases`, `/api/executive/overview`, `/api/reporting/reports`, `/api/governance/decisions`, `/api/strategy/objectives`, `/api/funding/rounds`, `/api/pmi/programs` |
| Logout API | **200** |
| CEO API truthfulness | **PASS** — no synthetic cluster `64/60/58/55/62/65`; **M&A = 64** (module-specific); empty modules **null** on radar; PMI **28**; Compliance radar empty-state fixed in P2-FIX-02 |
| Playwright prod (`CEOS_BASE_URL`) | **ceo-command-center** PASS · **reporting-enterprise-flow** PASS · **governance-enterprise-flow** PASS · **strategy-enterprise-flow** PASS (includes create objective) · **authenticated-hubs** FAIL on Funding heading copy |
| CRUD | **PARTIAL** — Strategy e2e create on prod org; dedicated `[SMOKE TEST]` CRUD not separately executed |
| Reporting/Board draft UI | **PASS** via reporting e2e (no certified/final markers in suite) |

**Final status:** **PRODUCTION AUTH SMOKE PASSED WITH P2 RESIDUALS**

**P0:** None.

**P1:** None confirmed (no fake multi-module fallback cluster post-login).

**P2:**
- `authenticated-hubs` Funding heading — **RESOLVED** in P2-FIX-01 (flexible hero matcher + testids).
- Compliance executive radar empty-state — **RESOLVED** in P2-FIX-02 (`null` / `N/A` / `insufficient_data`; no `0/watch` without audit baseline).

**P3:** Ad-hoc API paths `/api/compliance/suppliers` returned 404 (route naming differs; UI routes OK).

**Security note:** Operator shared prod test password in chat — **rotate** test password after smoke; never commit credentials.

**Recommendation:** Proceed **C.14** with Funding hub heading alignment as optional P2 test fix; monitor Compliance `0` vs `null` on empty org in a future WRITE/FIX if confirmed bug.

**Commit:** `docs: record prod authenticated smoke execution`

### C.14.1 — Tenant-safe create hardening

**Commit:** `fix(security): enforce tenant-safe create payloads`

**Mode:** WRITE/FIX/TEST — scoped security hardening.

**C14-P1-TENANT-CREATE-01:** **RESOLVED** / CLIENT TENANT FIELDS STRIPPED FROM CREATE PAYLOADS — backend session `organizationId` wins.

**C14-P1-CREDENTIAL-01:** **OPEN** — prod test password rotation required outside repo (not in scope).

**Helper:** `backend/utils/tenantPayload.js` — `omitClientTenantFields`, `buildTenantSafeCreateFields`.

**Modules fixed:**
- Risk — `createWith` / `updateWith`
- Strategy — `createWith` / `updateWith`
- Reporting — `createWith`
- Executive signals — `createExecutiveSignal` / `updateExecutiveSignal`

**Pattern:** `{ ...omitClientTenantFields(payload), ...commonCreate(organizationId, actor) }` (session org last).

**Tests added:**
- `tests/unit/security/tenantPayload.test.js`
- Integration tenant-create cases in `riskEnterprise`, `strategyEnterprise`, `reportingEnterprise`, `executiveCommandCenter`

**Validaciones:** unit **420** passed · integration **69** passed · build pass.

**Residual C.14.1B (not fixed):** Other modules with body spread (Heritage, Bridge controllers) — audit separately if P1 confirmed.

**Siguiente:** C.14.2 backup/restore · C.14.3 audit logs · credential rotation ops

### C.14.2 — Backup/restore rehearsal + integrity_check

**Commit:** `chore(ops): add sqlite backup and restore rehearsal`

**Mode:** OPS / DOCS / SCRIPTING — no product runtime changes.

**C14-P1-BACKUP-RESTORE-01:** **RESOLVED** / BACKUP + INTEGRITY CHECK + LOCAL RESTORE DRILL DOCUMENTED AND TESTED

**C14-P1-CREDENTIAL-01:** **OPEN** (unchanged)

**Deliverables:**
- `scripts/backup-sqlite.js` — `better-sqlite3` async `.backup()` (WAL-safe)
- `scripts/verify-sqlite-integrity.js` — `PRAGMA integrity_check` / `--quick`
- `scripts/restore-sqlite-drill.js` — copy backup → drill target; blocks `/var/data/ceos-os.sqlite`
- `scripts/lib/sqlite-cli.mjs` — shared helpers
- `docs/operations/BACKUP_RESTORE_RUNBOOK.md` — RPO 24h / RTO 4h provisional (not SLA)
- `.gitignore` — `.local/`, `backups/`, `*.backup`

**Local rehearsal (2026-05-25):**
- Drill DB `.local/drill/ceos-drill-source.sqlite` → backup `integrity_check: ok` (~1.5MB)
- Restore drill `.local/restore-drill/ceos-os-restore.sqlite` → `integrity_check: ok`
- Production target restore → **blocked** (expected)

**Production:** Run backup from Render shell with `DB_PATH` + `BACKUP_DIR=/var/data/backups` per runbook (not executed from agent — no prod disk access).

**Validaciones:** unit **420** · integration **69** · build pass

**Siguiente:** C.14.4 security/privacy/RGPD · credential rotation ops

### C.14.3 — Audit logs Compliance CRUD + Auth login/logout

**Commit:** `fix(audit): record auth and compliance events`

**Mode:** WRITE/FIX/TEST — backend audit only; no schema migration; no UI.

**C14-P1-AUDIT-COMPLIANCE-01:** **RESOLVED** / COMPLIANCE CRUD ACTIONS AUDITED

**C14-P1-AUDIT-AUTH-01:** **RESOLVED** / AUTH LOGIN LOGOUT EVENTS AUDITED

**C14-P1-CREDENTIAL-01:** **OPEN** (unchanged — ops rotation outside repo)

**Pattern:** Reused `backend/services/audit/auditLog.service.js` + `audit_logs` table; `recordAuthAuditLog` for platform-scoped failures; `recordComplianceAudit` wrapper; `backend/utils/auditMetadata.js` sanitizes metadata (no password/token/excerpt/notes).

**Auth events:** `auth.login.succeeded`, `auth.login.failed`, `auth.logout.succeeded`

**Compliance events:** `compliance.supplier.*`, `compliance.evidence.*`, `compliance.review.*` / `compliance.review.status_changed`, `compliance.report.created`

**Tests:** `tests/unit/audit/auditMetadata.test.js`; auth audit cases in `tests/integration/api/authApi.test.js`; compliance CRUD audit in `tests/integration/services/complianceApi.test.js`

**Not closed:** OIDC id_token verification · final DPA/legal · credential rotation (ops)

**Siguiente:** P2-FIX-02 Compliance radar · demo/sales pack honest wording

### P2-FIX-01 — Funding e2e copy mismatch

**Commit:** `test(e2e): align funding hub smoke copy`

**Mode:** WRITE/FIX/TEST — e2e + stable Funding dashboard anchors only.

**P2-FIX-FUNDING-E2E-COPY:** **RESOLVED** / AUTHENTICATED HUBS FUNDING COPY ALIGNED

**Root cause:** Playwright `authenticated-hubs` expected exact text `Funding Command Center.`; prod Funding dashboard copy/deploy could differ (`Funding Dashboard`, `Funding Workspace`, or subtitle-only hero) while route and shell were valid.

**Fix:** `tests/e2e/smoke/authenticated-hubs.spec.js` — route + `.funding-dashboard-page` / `data-testid` root + flexible `h1` matcher (Command Center | Dashboard | Workspace | Raise capital…). `FundingDashboardPage.jsx` — `data-testid="funding-dashboard-root"` and `funding-dashboard-title` (no product claim change).

**Not touched:** Funding formulas · backend · Golden · Formula Registry.

**E2E:** Re-run `authenticated-hubs` with `CEOS_E2E_*` on prod after deploy (agent env login blocked).

**Validaciones:** unit **435** · integration **74** · build pass

### P2-FIX-02 — Compliance radar empty-state

**Mode:** WRITE/FIX/TEST — display/adapter truthfulness only (no weightedRisk/resilience formula change).

**P2-FIX-COMPLIANCE-RADAR-EMPTY:** **RESOLVED** / EMPTY COMPLIANCE RADAR USES NULL_NA_INSUFFICIENT_DATA

**Root cause:** Executive overview mapped null compliance scores to `0/watch`; hub exposed `legalHealthScore` without audit; CEO page fell back to client compliance score; radar SVG coerced null to geometry ~12%.

**Fix:** `executiveHub.service.js` (audit-gated `legalHealthScore`); `executiveOverview.service.js` (audit-only persisted compliance, `insufficient_data` cards/radar); CEO overview truthfulness helpers + radar/card display.

**Tests:** `ceoOverviewTruthfulness.test.js`; `executiveCommandCenter.test.js` empty-org compliance assertions.

**Not touched:** Golden Dataset · Formula Registry · weightedRiskScore · unrelated modules.

### Post-rotation auth smoke closure

**Commit:** `docs(security): record post-rotation auth smoke`

**Mode:** DOCS ONLY — operator attestation; no code, secrets, or credential values.

**C14-P1-CREDENTIAL-01:** **RESOLVED OPS / PROD TEST PASSWORD ROTATED OUTSIDE REPO / POST-ROTATION AUTH SMOKE DONE**

**Recorded (no secrets):**
- Login with rotated credential succeeded.
- Old password rejected.
- New value not stored in git/docs/chat.
- Future smoke: `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` from shell or secret manager only.
- No credentials logged.

**Validaciones:** unit **435** · integration **74** · build pass (docs-only)

### C.14.7b — Credential rotation closure / RESOLVED OPS

**Commit:** `docs(security): close production credential rotation`

**Mode:** DOCS ONLY — no code, tests, secrets, or credential values.

**C14-P1-CREDENTIAL-01:** **RESOLVED OPS / PROD TEST PASSWORD ROTATED OUTSIDE REPO**

**Recorded (no secrets):**
- Old prod test password considered compromised and rotated outside repo (Render shell + `scripts/ops/reset-user-password.js`).
- New value not stored in git/docs/chat.
- Future smoke credentials: `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` in local shell or secret manager only.
- **POST-ROTATION AUTH SMOKE:** **DONE** (documented in post-rotation smoke closure section above)

**Validaciones:** unit **435** · integration **74** · build pass (docs-only)

### C.14.7 — Credential rotation closure / prod test password hygiene

**Commit:** `docs(security): reinforce production credential hygiene`

**Mode:** OPS / DOCS only — no code, tests, secrets, or credential values.

**C14-P1-CREDENTIAL-01:** **OPEN / ROTATION REQUIRED OUTSIDE REPO**

**Operator confirmation:** **Not received** — cannot mark RESOLVED OPS without explicit attestation (no password in message).

**Actions documented:**
- Compromised prod test password policy reinforced in `CREDENTIAL_HYGIENE.md`
- Post-rotation smoke procedure (`CEOS_E2E_*` local only) — **POST-ROTATION AUTH SMOKE PENDING**
- Blocks expanded pilot / “credential hygiene closed” until rotation confirmed

**To close P1:** Operator confirms: “rotated outside repo, no value stored” → optional smoke → follow-up commit marking **RESOLVED OPS / PROD TEST PASSWORD ROTATED OUTSIDE REPO**

**Validaciones:** unit **430 passed / 1 failed** (`oidcIdTokenVerify` invalid-signature flake, pre-existing from C.14.6) · integration **74** · build pass (docs-only)

### C.14.6b — OIDC invalid-signature unit test stabilization

**Commit:** `test(auth): stabilize oidc invalid signature coverage`

**Mode:** TEST FIX only — no production auth/OIDC behavior change.

**C14-P1-OIDC-IDTOKEN-01:** **REMAINS RESOLVED** / INVALID SIGNATURE TEST STABILIZED

**Root cause:** Flaky fixture flipped the JWT’s last character; that can leave an RS256 signature valid under base64url decoding.

**Fix:** Deterministic coverage — JWKS key mismatch (sign with key A, verify with key B) plus corrupted signature segment; unique `jwks_uri` per case to avoid cache bleed.

**Files:** `tests/unit/auth/oidcIdTokenVerify.test.js` only.

**C14-P1-CREDENTIAL-01:** **OPEN** at C.14.6b (closed in C.14.7b)

**Validaciones:** unit **432** · integration **74** · build pass

### C.14.6 — OIDC id_token verification + Secure Share technical hardening

**Commit:** `fix(security): harden oidc and secure share controls`

**Mode:** SECURITY WRITE/FIX/TEST — no migrations · no new npm dependencies.

**C14-P1-OIDC-IDTOKEN-01:** **RESOLVED** / ID_TOKEN SIGNATURE ISSUER AUDIENCE VERIFIED (when SSO enabled with `jwks_uri`)

**Implementation:** `backend/utils/oidcIdTokenVerify.js` (RS256/HS256 via Node `crypto` + JWKS fetch). `oidcAuth.service.js` — removed unverified `id_token` decode fallback; `resolveOidcUserProfileFromTokens` requires verified id_token if userinfo unavailable; `auth.login.failed` audit on verification failure (no raw token).

**C14-P1-SECURE-SHARE-01:** **RESOLVED** / TECHNICAL ACCESS CONTROLS + AUDIT VERIFIED (no schema change)

**Secure share:** token stored as hash; public route uniform `404 SECURE_SHARE_NOT_FOUND` for invalid/expired/revoked/wrong token; audit metadata sanitized (`tokenPrefix` only, no raw token). Authenticated route keeps specific error codes.

**Tests:** `tests/unit/auth/oidcIdTokenVerify.test.js`, `oidcAuthProfile.test.js`; integration secure share updated.

**C14-P1-CREDENTIAL-01:** **OPEN** (unchanged)

**Validaciones:** unit **431** · integration **74** · build pass

### C.14.5 — Pilot Readiness Pack

**Commit:** `docs: add pilot readiness pack`

**Mode:** DOCS / OPS / PILOT READINESS — no product code, tests, Golden, or Formula Registry.

**C14-PILOT-READINESS-01:** **RESOLVED** / CONTROLLED PILOT PACK DOCUMENTED

**Pilot-ready (controlled internal use):** **YES**, with conditions (NDA, human review, security/privacy drafts, credential rotation, no procurement claims).

**Enterprise certified / procurement-ready:** **NO**

**Deliverables:**
- `docs/pilot/PILOT_READINESS_PACK.md`
- `docs/pilot/PILOT_ONBOARDING_CHECKLIST.md`
- `docs/pilot/PILOT_DATA_INTAKE_TEMPLATE.md`
- `docs/pilot/PILOT_SUCCESS_CRITERIA.md`
- `docs/pilot/PILOT_WEEKLY_REVIEW.md`
- `docs/pilot/PILOT_OFFBOARDING_CHECKLIST.md`
- `docs/pilot/PILOT_RISK_REGISTER.md`
- Cross-links in `PILOT_SECURITY_RUNBOOK.md`, `SECURITY_PRIVACY_PILOT_PACK.md`

**P1 unchanged:** C14-P1-CREDENTIAL-01 OPEN · C14-P1-DPA-RGPD-PRIVACY-01 PARTIALLY RESOLVED · C14-P1-OIDC-IDTOKEN-01 OPEN if SSO · C14-P1-SECURE-SHARE-01 PARTIALLY RESOLVED

**Validaciones (docs-only):** unit **423** · integration **73** · build pass (expected)

### C.14.4 — Security / Privacy / RGPD Pilot Pack

**Commit:** `docs: add security privacy pilot pack`

**Mode:** DOCS / OPS / SECURITY-PACK — no product code, tests, Golden, or Formula Registry changes.

**C14-P1-DPA-RGPD-PRIVACY-01:** **PARTIALLY RESOLVED** / PILOT PRIVACY PACK DRAFTED / LEGAL REVIEW REQUIRED

**C14-P1-SECURE-SHARE-01:** **PARTIALLY RESOLVED** / OPERATIONAL SECRECY GUIDELINES DOCUMENTED

**C14-P1-CREDENTIAL-01:** **OPEN / ROTATION REQUIRED OUTSIDE REPO** (operator must confirm rotation for RESOLVED OPS)

**C14-P1-OIDC-IDTOKEN-01:** **OPEN** (if SSO enabled — `id_token` parsed without full signature verification)

**Deliverables:**
- `docs/security/SECURITY_PRIVACY_PILOT_PACK.md`
- `docs/security/CREDENTIAL_HYGIENE.md`
- `docs/security/SECURE_SHARE_OPERATIONAL_GUIDELINES.md`
- `docs/security/SECURITY_REVIEW_CHECKLIST.md` (control inventory table)
- `docs/privacy/RGPD_PILOT_READINESS.md`
- `docs/privacy/DATA_PROCESSING_SUMMARY.md`
- `docs/privacy/DPA_DRAFT_NOTES.md` (index only — not final DPA)
- `docs/operations/PILOT_SECURITY_RUNBOOK.md`
- `docs/operations/PRODUCTION_ACCESS_RUNBOOK.md`

**Not closed:** Final DPA · final privacy policy · SOC2/ISO · procurement · SLA · retention automation · OIDC hardening · credential rotation confirmation

### C.13.11A — Cross-module Source-of-Truth Closure (AUDIT / DOCS)

**Commit:** 1b39c9f — `docs: record cross-module source-of-truth closure`

**Mode:** Documentation only — no product code, tests, Golden, or Formula Registry changes.

**Global status:** **C.13 GLOBAL LOGIC BASELINE CLOSED / P2–P3 ENTERPRISE HARDENING PENDING** (confirmed C.13.12)

**Deliverables:**
- Cross-module SoT matrix in `SOURCE_OF_TRUTH_REGISTRY.md`
- Module status table (below)
- Commercial can-say / cannot-say in `LOGIC_INTEGRITY_PROTOCOL.md`
- C.13 open items P1/P2/P3 documented

**P1 after C.13.10B:** None known — confirmed C.13.12 final gate.

#### C.13 module status table (final)

| Module | C.13 status | Pilot DSS readiness | Enterprise complete? | Key closure | Remaining blockers |
|---|---|---|---|---|---|
| **M&A** | Strong pilot DSS / valuation chain closed at docs+tests level | Yes — controlled internal DSS | **No** | C.13.4A–I Golden + report alignment + netProceeds fix | Backend snapshot/re-export; not certified valuation |
| **Compliance** | DSS operational / scoring chain advanced | Yes — with human review | **No** | C.13.1C weighted/resilience + labels/precedence | API/model rename; backend calc SoT future |
| **Funding** | Formula baseline / persistence partial closure | Yes — draft vs persisted labelled | **No** | C.13.3 Golden + SoT + migration | Dashboard runtime/e2e optional; module variance |
| **Bridge** | DSS signals / marketplace quarantined | Yes — enterprise signals | **No** | C.13.5 dual-layer + quarantine | Product alignment optional; no public marketplace |
| **Risk** | **Resolved logic baseline** | Yes | **No** | C.13.6 dual-layer closed | Production smoke/e2e env |
| **PMI** | **Resolved product logic baseline** | Yes | **No** | C.13.7 multi-layer closed | Production smoke; PDF renderer |
| **Reporting** | **Resolved aggregator baseline** / variance deferred | Yes — metadata + board draft | **No** | C.13.8 truthfulness + variance Golden | PDF renderer; per-module variance |
| **Governance** | Product logic baseline / truthfulness gated / Golden pending | Yes — DSS | **No** | C.13.9B approve + empty null | Golden helper/tests; state-machine P2 |
| **Strategy** | Product logic baseline / truthfulness gated / Golden pending | Yes — DSS | **No** | C.13.9C empty gated + Board Pack exclusion | Golden helper/tests; Board Pack branch future |
| **CEO / Executive** | DSS aggregator / truthfulness gated | Yes — when module data exists | **No** | C.13.10B fallbacks gated | CEO e2e empty org; Golden blend |
| **Heritage** | Not C.13 logic-audited | Preview / partial only | **No** | N/A in C.13 chain | Full module audit future |

**Siguiente:** C.13.12 closed — Production Render smoke / C.14 / Golden helpers

### C.13.10B — CEO Overview truthfulness fix

**Commit:** 3fcc71f — `fix(ceo-overview): gate executive fallbacks and truthfulness`

**Fixes:** CEO local calculators gated (no 64/60/58/62/65 fallbacks); `getExecutiveSignal` no longer averages insufficient modules; radar axes N/A labels; Command Center fallback cards insufficient_data; `boardView.service.js` null readiness preserved; Risk empty org null readiness; Compliance empty controlled posture removed; truthfulness tests added.

**C13-P1-CEO-01:** RESOLVED / CEO LOCAL FALLBACKS GATED

**C13-P1-CEO-02:** RESOLVED / EXECUTIVE SIGNAL NO LONGER SYNTHESIZED FROM FALLBACKS

**C13-P1-CEO-03:** RESOLVED / GOVERNANCE ESG RADAR FALLBACK REMOVED

**C13-P1-CEO-04:** RESOLVED / COMMAND CENTER FALLBACK CARDS GATED

**C13-P1-EXEC-02:** RESOLVED / BOARD VIEW NULL READINESS PRESERVED

**C13-P1-EXEC-03:** RESOLVED / RISK EMPTY STATE GATED

**C13-P1-CEO-05:** RESOLVED / COMPLIANCE EMPTY CONTROLLED POSTURE REMOVED

**C13-P1-TEST-CEO-01:** RESOLVED / CEO TRUTHFULNESS TESTS ADDED

**CEO Overview global:** DSS AGGREGATOR / TRUTHFULNESS GATED / EXECUTIVE API ALIGNED / GOLDEN MODULES PENDING — **no fully enterprise complete**

**Siguiente:** C.13.11 Cross-module Source-of-Truth Closure

### C.13.10A — CEO Overview / Executive Aggregator Audit READ ONLY

**Estado:** READ ONLY — P0=0, P1=8, P2=12, P3=4. Dual-path mismatch: backend defensive, CEO frontend legacy fallbacks.

**Siguiente:** C.13.10B truthfulness fix

### C.13.9C — Strategy SoT decision + truthfulness fix

**Commit:** 39f4076 — `fix(strategy): gate readiness fallbacks and clarify truthfulness`

**Fixes:** Empty org null scores (no 60 defaults); CEO Strategy fallback gated; Board Pack Strategy exclusion; report metadata copy; `strategicRiskLevel` not_assessed when zero risks.

**C13-P1-STRAT-01:** PARTIALLY RESOLVED / OPERATIONAL DSS / GOLDEN PENDING

**C13-P1-STRAT-02:** RESOLVED / EMPTY STRATEGY DEFAULTS GATED

**C13-P1-STRAT-03:** RESOLVED / CEO STRATEGY FALLBACK GATED

**C13-P1-STRAT-04:** RESOLVED / STRATEGY BOARD PACK EXCLUSION DOCUMENTED

**C13-P2-STRAT-01:** RESOLVED / STRATEGY COPY TRUTHFULNESS UPDATED

**C13-P2-STRAT-02:** RESOLVED / STRATEGY REPORT METADATA LABELLED

**C13-P2-STRAT-04:** RESOLVED / STRATEGIC RISK EMPTY STATE GATED

**Strategy global:** DSS OPERATIONAL / TRUTHFULNESS GATED / GOLDEN PENDING — **no RESOLVED global**

**Siguiente:** C.13.10 CEO Overview

### C.13.9B — Governance SoT decision + truthfulness fix

**Commit:** c3187c8 — `fix(governance): align approval permissions and truthfulness signals`

**Fixes:** Approve UI → `APPROVE_GOVERNANCE_DECISION`; empty org null scores; hub 55/58/50 gated; `board_pack_ready` DSS metadata; board pack SoT boundary.

**C13-P1-GOV-01:** PARTIALLY RESOLVED / OPERATIONAL DSS / GOLDEN PENDING

**C13-P1-GOV-02:** RESOLVED / APPROVE UI API ALIGNED

**C13-P1-GOV-03:** RESOLVED / GOVERNANCE VS REPORTING BOARD PACK BOUNDARY

**C13-P1-GOV-04:** RESOLVED / BOARD PACK READY SIGNAL DSS LABEL

**Governance global:** DSS OPERATIONAL / TRUTHFULNESS GATED / GOLDEN PENDING — **no RESOLVED global**

**Siguiente:** C.13.9C Strategy

### C.13.9A — Strategy/Governance Logic Integrity Audit READ ONLY

**Commit:** `9a89b58` — `docs(reporting): record final reporting logic baseline status`

**Import check:** `reportingGoldenFormulas` / `reportingVarianceGolden` — **no product imports** (helper + unit test + docs only).

**Validaciones:**

| Comando | Resultado |
|---|---|
| `npm run test:unit` | 391 passed |
| `npm run test:integration` | 61 passed |
| `npm run build` | pass |
| `node scripts/run-e2e.mjs tests/e2e/reporting/reporting-enterprise-flow.spec.js` | **1 passed** |

**UI copy:** Board review draft / human review / decision-support — no "Certified" or generic variance in Reporting UI.

**No tocado:** Golden Dataset, Formula Registry, product code, `reportingGoldenFormulas.js`, auth/router.

**C13-P1-20:** RESOLVED / REPORTING TRUTHFULNESS + VARIANCE GOLDEN + E2E VALIDATED

**C13-P2-REPORTING-01:** RESOLVED AS GOLDEN BENCHMARK / PRODUCT DEFERRED

**Reporting global:** **RESOLVED LOGIC BASELINE / PRODUCT VARIANCE DEFERRED / PDF-RENDERER PENDING** — not fully enterprise complete

**Riesgos restantes:** PDF/HTML renderer · per-module variance · Board Pack M&A/Funding recalc not Golden · production Render smoke · global SoT · sales/demo pack

**Siguiente:** C.13.9 Strategy/Governance audit READ ONLY

### C.13.8E — Reporting product alignment decision — DOCS ONLY

**Commit:** `adaf770` — `docs(reporting): record variance product alignment decision`

**Decisión:** **OPTION C — Product alignment deferred / per-module ownership required**

**Significado:** `reportingVarianceGolden` queda como oráculo Golden genérico. Producto **no lo usa** en Reporting UI, Board Pack, Executive, CEO Overview, report library ni exports hasta que un módulo fuente apruebe semántica, labels y truthfulness.

**Opciones documentadas:** A global now (rechazada) · B Board Pack now (rechazada) · **C deferred per-module (aprobada)** · D UI pilot (rechazada sin feature flag)

**Matriz ownership:** M&A/Funding/Compliance/Bridge — pending module decision, no generic variance · PMI — display only if PMI provides payload · Risk — dual-layer, no generic · Reporting Golden — oracle only

**No tocado:** `reportingGoldenFormulas.js`, tests, `reporting.service.js`, `boardPack.service.js`, Executive, Reporting UI, `golden_inputs.json`, `FORMULA_REGISTRY.md`, módulos fuente.

**No implementado:** variance productiva, Board Pack variance, Executive variance, UI variance, per-module variance product, PDF/HTML renderer.

**C13-P1-20:** PARTIALLY RESOLVED / REPORTING TRUTHFULNESS + VARIANCE DECISION ADDED

**C13-P2-REPORTING-01:** PARTIALLY RESOLVED / REPORTING VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT DECIDED

**Reporting global:** AGGREGATOR RISK MITIGATED / VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT DEFERRED BY SOT — **no RESOLVED global**

**Riesgos restantes:** e2e Reporting `:4000` · PDF/HTML renderer · per-module variance implementations · Board Pack M&A/Funding recalc not Golden · production smoke · global SoT closure

**Siguiente:** C.13.8F e2e/smoke

### C.13.8D — Reporting variance Golden helper/tests

**Commit:** `e899648` — `test(reporting): add variance golden benchmark`

**Helper:** `backend/services/reporting/reportingGoldenFormulas.js` — `calculateReportingVarianceGolden`; Golden `reporting_kpi_variance_basic` (`budget` alias, percent ×100).

**Tests:** `tests/unit/reporting/reportingGoldenFormulas.test.js` — 12 oracle cases; truthfulness separation from product readiness.

**No tocado:** `reporting.service.js`, `boardPack.service.js`, Executive, Reporting UI, `golden_inputs.json`, `FORMULA_REGISTRY.md`.

**C13-P1-20:** PARTIALLY RESOLVED / REPORTING TRUTHFULNESS TESTS ADDED / VARIANCE GOLDEN TESTED

**C13-P2-REPORTING-01:** PARTIALLY RESOLVED / REPORTING VARIANCE GOLDEN HELPER TESTED

**Reporting global:** AGGREGATOR RISK MITIGATED / REPORTING VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT PENDING — **no RESOLVED global**

**Siguiente:** C.13.8E product alignment decision

### C.13.8C — Reporting SoT decision / variance decision — DOCS ONLY

**Commit:** `5e88266` — `docs(reporting): record variance source-of-truth decision`

**Decisión:** **OPTION C** — `REPORTING_VARIANCE` = Golden benchmark / future product capability. Reporting **no** es motor transversal de varianzas productivas hoy.

**Opciones documentadas:** A defer · B helper/tests (C.13.8D) · **C aprobada** · D product now (rechazada)

**No tocado:** código, tests, `golden_inputs.json`, `FORMULA_REGISTRY.md`, Board Pack, Executive, UI.

**C13-P1-20:** PARTIALLY RESOLVED / REPORTING TRUTHFULNESS TESTS ADDED / VARIANCE SOT DOCUMENTED

**C13-P2-REPORTING-01:** REPORTING_VARIANCE MAPPED / NO PRODUCT IMPLEMENTATION / SOT DECISION DOCUMENTED

**Reporting global:** AGGREGATOR RISK MITIGATED / REPORTING VARIANCE SOT DOCUMENTED / PENDING HELPER TESTS — **no RESOLVED global**

**Roadmap:** C.13.8D Golden helper · C.13.8E product alignment · C.13.8F e2e/smoke

### C.13.8A — Reporting Logic Integrity Audit READ ONLY

**Estado:** AGGREGATOR RISK CONFIRMED — sin cambios de código.

### C.13.8B — ExecutiveCommandCenter + Board Pack aggregation truthfulness

**Commit:** `33e12c6` — `fix(reporting): align board pack and executive truthfulness`

**Correcciones:** Executive empty org defensive signals; Board Pack PMI null preserved; Compliance null not 55; reportingReadinessScore null without metadata; createBoardPack generation_failed flag; scoringTruthfulness payload; tests.

**Reporting global:** **AGGREGATOR RISK MITIGATED / PENDING REPORTING VARIANCE SOT**

---

## C.14.8 - Global P0/P1/P2/P3 Residual Register & Cleanup Plan

**Fecha:** 26 mayo 2026  
**Mode:** DOCS / AUDIT / PLANNING only. No product code, tests, migrations, Golden Dataset, Formula Registry, package/config, secrets, cleanup, refactor, or AI implementation.

### 1. Estado general

C.13 global logic baseline is closed for controlled DSS pilot use, with human review and truthfulness boundaries. C.14 pilot/security hardening has resolved the known controlled-pilot P1 blockers: tenant-safe creates, backup/restore rehearsal, auth + Compliance CRUD audit logs, OIDC id_token verification, Secure Share technical hardening, credential rotation closure, post-rotation auth smoke, Funding e2e copy mismatch, and Compliance radar empty-state.

**Current global status:** controlled pilot can proceed as DSS/human-reviewed material if legal/pilot conditions are followed. Commercial demo, procurement enterprise readiness, AI, PDF/reporting renderer, and architecture cleanup remain gated by P2/P3 work below.

### 2. Severity classification

| Severity | Current count | Summary |
|---|---:|---|
| P0 | 0 | None known. |
| P1 | 0 | None known for controlled pilot after C.14.7b, post-rotation smoke, P2-FIX-01, and P2-FIX-02. |
| P2 | 15 | Blocks serious commercial demo, expanded pilot, procurement preparation, AI readiness, or architecture cleanup sequencing. |
| P3 | 6 | Polish, broader coverage, naming/docs refinement, and later legacy cleanup after architecture audit. |

### 3. P0 actuales

**None known.**

P0 remains reserved for production outage, auth bypass, confirmed cross-tenant leak, data loss/corruption, secret/token exposed in repo, or broken build/deploy.

### 4. P1 actuales

**None known for controlled pilot.**

Notes:
- Legal final / DPA remains not final, but it does not block an internal controlled pilot when documented as draft and legal review required.
- Procurement enterprise remains blocked.
- CORS allowlist, retention/DSR, and legal pack remain important, but based on the current docs they are not classified as controlled-pilot P1 unless a concrete deployment/customer condition makes them critical.
- ES256 OIDC remains conditional: P2/P1 depending on the selected IdP. If the IdP requires ES256-only support before SSO go-live, reclassify as P1 for that SSO deployment.

### 5. P2 actuales

| Item | Severity | Blocker for | Recommended phase |
|---|---|---|---|
| Post-deploy CEO smoke after `ea98a0d` to verify Compliance `N/A` in prod empty org | P2 | Commercial demo confidence | C.14.8 follow-up / prod smoke |
| Production authenticated-hubs rerun after `45b7e93` / `ea98a0d` deploy | P2 | Commercial demo confidence | C.14.8 follow-up / prod smoke |
| Compliance API ad-hoc 404 route naming review | P2 | Expanded demo / API confidence | C.14.13 |
| Retention / DSR automation | P2 | Procurement enterprise | C.17 |
| PDF/HTML renderer | P2 | Commercial demo / reporting expectations | C.15 / dedicated renderer phase |
| Governance Golden helper/tests | P2 | Logic hardening / future procurement | C.14.x / C.16 readiness |
| Strategy Golden helper/tests | P2 | Logic hardening / future procurement | C.14.x / C.16 readiness |
| Per-module variance ownership | P2 | Reporting product completeness | C.14.x / Reporting module phases |
| M&A snapshot/re-export policy | P2 | M&A report truthfulness / demo | C.14.13 or M&A follow-up |
| Funding dashboard e2e/runtime broader coverage | P2 | Expanded pilot confidence | C.14.13 or Funding follow-up |
| Heritage audit/freeze decision | P2 | Demo scope / architecture cleanup | C.14.9 |
| Bridge optional alignment and marketplace quarantine review | P2 | Demo/sales truthfulness | C.14.9 / C.15 |
| Observability/APM/Sentry/LOG_HTTP | P2 | Expanded pilot operations | C.17 |
| ES256 OIDC support if selected IdP requires it | P2 conditional | Enterprise SSO readiness | C.17 or SSO phase |
| Final legal review for DPA/privacy/customer-facing documents | P2 | External/customer deployment and procurement | C.17 |

### 6. P3 actuales

| Item | Severity | Blocker for | Recommended phase |
|---|---|---|---|
| Docs polish | P3 | No direct pilot block | C.15 / ongoing |
| Sales collateral refinement | P3 | Demo polish | C.15 |
| Visual polish | P3 | Demo polish | C.15 / UI polish |
| Wider e2e matrix | P3 | Broader confidence | C.14.13 / CI hardening |
| Naming cleanup | P3 | Maintainability | C.14.10+ |
| Legacy cleanup after architecture audit | P3 | Maintainability | C.14.10-C.14.12 |

### 7. What blocks controlled pilot

No known P0 or P1 blocks controlled pilot today, provided:

1. DSS/human-review positioning is explicit.
2. NDA/pilot agreement and legal review path are followed.
3. Credential rotation remains outside repo and smoke credentials stay in secret/local environment only.
4. Legal/DPA documents are treated as draft for pilot, not final customer/procurement pack.
5. Procurement/SOC2/SLA/certification claims are not made.

### 8. What blocks serious commercial demo

1. Production CEO smoke refresh after `ea98a0d`.
2. Production authenticated-hubs rerun after deploy.
3. PDF/HTML renderer expectation management or renderer delivery.
4. Demo script and sales wording review.
5. No false claims: no certified enterprise, legal, investment, SOC2/ISO/SLA, autonomous decision, or public marketplace claims.
6. Bridge marketplace remains internal/unlisted/quarantined.
7. Heritage remains preview/future unless audited/frozen.

### 9. What blocks enterprise procurement

1. Final DPA/privacy/legal review.
2. Retention/DSR process and automation.
3. SLA/support model.
4. SOC2/ISO roadmap and security questionnaire.
5. Incident response and DR/BCP.
6. Audit log export and broader audit coverage.
7. SSO/SAML/SCIM roadmap and tenant admin model.
8. Observability and operational monitoring.

### 10. What must happen before AI

1. C.14.8 residual register closed.
2. C.14.9 architecture / monolith / duplication audit READ ONLY completed.
3. Data boundaries documented for AI use.
4. Tenant isolation for AI documented.
5. Prompt injection guardrails documented.
6. AI audit logging planned.
7. First AI feature limited to draft-only, human-reviewed output.
8. No AI feature may present legal, financial, governance, compliance, valuation, or board decisions as autonomous or certified.

### 11. What must happen before refactor / cleanup

1. C.14.8 residual register closed.
2. C.14.9 architecture / monolith / duplication audit READ ONLY completed.
3. Cleanup batches defined with file allowlists.
4. No big-bang refactor.
5. No deletion without import/route/service/test audit.
6. No auth/router/migration/security runtime changes without explicit phase authorization.

### 12. Gates

| Gate | Status | Notes |
|---|---|---|
| Gate A - Controlled Pilot Ready | Ready with conditions | P0 none known; P1 none known for controlled pilot; C.13 logic baseline closed; C.14 security baseline closed; credential rotation smoke done; pilot pack documented; human review required; legal/DPA final not required for internal controlled pilot, but legal review required before formal external/customer deployment. |
| Gate B - Commercial Demo Ready | Not yet | Requires Gate A, P2 visible issues fixed or documented, production smoke refreshed, demo script prepared, sales wording reviewed, no false claims, no enterprise certification claims. |
| Gate C - Architecture Cleanup Ready | Not yet | Requires C.14.8 closed, C.14.9 architecture/monolith/duplication audit READ ONLY completed, cleanup batches defined, no big-bang refactor. |
| Gate D - AI Readiness | Not yet | Requires C.14.8 and C.14.9 closed, AI data boundaries, tenant isolation, prompt-injection guardrails, AI audit logging plan, first AI feature draft-only and human-reviewed. |
| Gate E - Procurement Enterprise Ready | Not yet | Requires final DPA/privacy/legal review, retention/DSR process, SLA/support, SOC2/ISO roadmap, security questionnaire, incident response, audit log export, SSO/SAML/SCIM roadmap, tenant admin model, DR/BCP. |

### 13. Recommended cleanup roadmap

1. Re-run prod CEO smoke after deploy `ea98a0d`.
2. Re-run authenticated-hubs prod e2e after deploy.
3. C.14.9 - Architecture / monolith / duplication audit READ ONLY.
4. C.14.10 - Safe cleanup batch A: dead/unused/legacy only.
5. C.14.11 - Safe cleanup batch B: duplicate helpers/shared utilities.
6. C.14.12 - Safe cleanup batch C: monolith extraction low-risk.
7. C.14.13 - Route/API consistency audit/fix if needed.
8. C.15.0 - Honest demo/sales pack.
9. C.16.0 - AI readiness audit.
10. C.16.1 - AI provider abstraction.
11. C.16.2 - AI Board Review Draft Assistant.
12. C.17 - Procurement/legal/retention/SOC2/SLA roadmap.

### 14. C.14.8 decision

No implementation changes were made in this phase. No product code, backend code, frontend code, tests, migrations, Golden Dataset, Formula Registry, package/config, secrets, runtime security, or cleanup files were touched.

The next recommended phase is **C.14.9 - Architecture / monolith / duplication audit READ ONLY**.

---

## C.14.9 - Architecture / monolith / duplication audit READ ONLY

**Status:** COMPLETED / READ ONLY / NO CODE CHANGES.

**Audit document:** `docs/architecture/ARCHITECTURE_CLEANUP_AUDIT.md`

**Summary:** P0 none found. P1 none found for controlled pilot. P2 architecture debt documented across frontend/backend monoliths, route/API consistency, source-of-truth boundaries, CSS global override risk, and test/gate clarity. P3 cleanup/polish items documented for later batches.

**Decision:** Architecture cleanup is not authorized by C.14.9. Cleanup may start only in C.14.10+ with explicit file allowlists, import/route/test checks, and no big-bang refactor.

**Next recommended phase:** C.14.10 Cleanup Batch A - dead/unused/legacy only, or C.15.0 Honest Demo/Sales Pack if demo sequencing takes priority.

---

## C.14.10 - Safe Cleanup Batch A

**Status:** COMPLETED / SAFE CLEANUP.

**Reference:** `docs/architecture/ARCHITECTURE_CLEANUP_AUDIT.md`

**Summary:** Removed five unreferenced Compliance placeholder components after import/route/test/name searches. Deferred ambiguous component-name cases, root test layout decisions, the `compilanceFlow` typo rename, empty CSS cleanup, and generated/dependency/artifact cleanup.

**Runtime posture:** No auth, router, storage, formulas, Golden Dataset, Formula Registry, source-of-truth logic, migrations, package/config, secrets, production config, CSS global behavior, or business formulas changed.

**Validation note:** `npx eslint . --no-fix` was attempted and failed before implementation because `npx` tried to fetch ESLint from npm and the environment returned `EACCES`; no autofix was applied.

**Next recommended phase:** C.14.11 Duplicate Helpers Audit/Fix or C.15.0 Honest Demo/Sales Pack.

---

## C.14.11 - Duplicate Helpers Audit/Fix

**Status:** COMPLETED / AUDIT ONLY / NO SAFE CONSOLIDATION.

**Reference:** `docs/architecture/ARCHITECTURE_CLEANUP_AUDIT.md`

**Summary:** Audited duplicate-looking helpers for currency, percent formatting, number parsing, score clamps, null/`N/A` mapping, `insufficient_data`, human-review labels, Board Review Draft wording, and frontend/backend utility mirrors. No code was changed because the candidates had module-specific semantics or touched scoring/source-of-truth boundaries.

**Runtime posture:** No formulas, Golden Dataset, Formula Registry, scoring semantics, API contracts, auth, router, storage, package/config, secrets, UI visual behavior, or source-of-truth logic changed.

**Decision:** Keep duplicate-looking helpers deferred until exact contract tests prove equivalence. The next cleanup phase may proceed to C.14.12 only with explicit low-risk monolith extraction boundaries, or sequencing may move to C.15.0 for demo/sales readiness.

**Next recommended phase:** C.14.12 Monolith Extraction Low-Risk Audit or C.15.0 Honest Demo/Sales Pack.

---

## C.15.0 - Demo / Sales Pack honest DSS

**Status:** COMPLETED / COMMERCIAL PILOT PACK DRAFTED.

**Commercial assets:**

1. `docs/commercial/CEO_OS_ONE_PAGER.md`
2. `docs/commercial/DEMO_SCRIPT.md`
3. `docs/commercial/PILOT_PROPOSAL.md`
4. `docs/commercial/PRICING_HYPOTHESIS.md`
5. `docs/commercial/SALES_MESSAGING.md`
6. `docs/commercial/WHAT_WE_CAN_AND_CANNOT_SAY.md`

**Summary:** C.15.0 prepares CEO's OS for controlled commercial conversations as a Private Executive DSS / Controlled Pilot / Human Review Required / Board Review Draft product. It does not change product runtime, tests, formulas, Golden Dataset, Formula Registry, package/config, secrets, AI, marketplace, procurement status, legal status or certification status.

**Claims posture:** The sales pack explicitly prohibits enterprise certification, procurement-ready, SOC2/ISO certified, fully GDPR compliant, SLA-backed, autonomous AI, legal advice, investment advice, fairness opinion, board-approved output, complete PDF reporting, public marketplace, active verified buyer network and operational success-fee claims.

**Next recommended phase:** C.15.1 Production Smoke Refresh or C.16.0 AI Readiness Audit.

---

## C.15.1 - Production Smoke Refresh

**Status:** BLOCKED BY ENV/CREDENTIALS after local, perimeter and public shell checks.

**Baseline:** `HEAD = origin/main = 284bd35`.

**Local validation:** PASS.

| Check | Result |
|---|---|
| `npm run test:unit` | PASS - 439 passed |
| `npm run test:integration` | PASS - 74 passed |
| `npm run build` | PASS |

**Production perimeter:** PASS for unauthenticated checks.

| Area | Result |
|---|---|
| `https://app.theceosos.com` | 200 |
| `https://app.theceosos.com/health` | 200 |
| `https://app.theceosos.com/api/health` | 200 |
| `https://ceos-os.onrender.com/health` | 200 |
| `https://ceos-os.onrender.com/api/health` | 200 |
| Protected `/api/executive/overview` without token | 401 as expected |
| Public SPA route shell checks | 23/23 returned 200 shell |

**Bundle / claims check:** No critical public-bundle drift identified in the initial production shell. The public entry bundle exposes `insufficient_data`; C.15.0 commercial docs are docs-only and are not expected in the runtime bundle. No prohibited visible public-bundle strings were found for enterprise certification, procurement-ready, SOC2 certified, board-approved, autonomous AI, public marketplace live or operational success-fee claims.

**Blocked checks:** Authenticated login, authenticated APIs, logout, authenticated UI module smoke, CEO truthfulness smoke, Reporting Board Review Draft smoke, Funding authenticated hub smoke and Compliance authenticated empty-state smoke were not executed because `CEOS_E2E_USER` and `CEOS_E2E_PASSWORD` were not present in the local environment. No credentials, tokens, cookies or secrets were printed.

**Finding classification:** No P0/P1 was confirmed. Remaining production confidence gap is P2/env-blocked authenticated smoke until local secret-store credentials are available.

**Next recommended phase:** C.15.1b Authenticated Production Smoke with `CEOS_BASE_URL`, `CEOS_E2E_USER` and `CEOS_E2E_PASSWORD` provided from local secret store, or C.16.0 AI Readiness Audit if production authenticated smoke is scheduled separately.

---

## C.15.1b - Authenticated Production Smoke

**Status:** BLOCKED BY ENV/CREDENTIALS.

**Baseline:** `HEAD = origin/main = 4023905`.

**Local validation:** PASS.

| Check | Result |
|---|---|
| `npm run test:unit` | PASS - 439 passed |
| `npm run test:integration` | PASS - 74 passed |
| `npm run build` | PASS |

**Production perimeter confirmation:** PASS.

| Area | Result |
|---|---|
| `https://app.theceosos.com` | 200 |
| `https://app.theceosos.com/health` | 200 |
| `https://app.theceosos.com/api/health` | 200 |
| Protected `/api/executive/overview` without token | 401 as expected |

**Authenticated smoke:** Not executed because `CEOS_BASE_URL`, `CEOS_E2E_USER` and `CEOS_E2E_PASSWORD` were not present in the local environment. No credentials, tokens, cookies, session IDs, auth headers, JWTs, `id_token`, `access_token` or `refresh_token` values were printed or written.

**Blocked checks:** Login, authenticated APIs, authenticated UI routes, CEO synthetic-score regression check, Reporting Board Review Draft check, Funding hub check, Compliance empty-state check and logout/session invalidation remain blocked until local secret-store credentials are available.

**Finding classification:** No P0/P1 was confirmed. The only active finding remains P2/env credential availability for authenticated production smoke.

**Next recommended phase:** Re-run C.15.1b after loading `CEOS_BASE_URL`, `CEOS_E2E_USER` and `CEOS_E2E_PASSWORD` from local secret store, or proceed to C.16.0 AI Readiness Audit if authenticated smoke is scheduled separately.

### C.15.1b - Authenticated Production Smoke Rerun (baseline correction)

**Status:** BLOCKED BY ENV/CREDENTIALS.

**Corrected approved baseline:** `HEAD = origin/main = f03cf5b`.

**Working tree at start:** `?? backend-server.err` only.

**Local validation:** PASS.

| Check | Result |
|---|---|
| `npm run test:unit` | PASS - 439 passed |
| `npm run test:integration` | PASS - 74 passed |
| `npm run build` | PASS |

**Credential availability:** `CEOS_BASE_URL` was set for `https://app.theceosos.com`; `CEOS_E2E_USER` and `CEOS_E2E_PASSWORD` were not present in the local environment. No password, token, cookie, session ID, auth header, JWT, `id_token`, `access_token` or `refresh_token` value was printed or written.

**Authenticated smoke:** Not executed because prod test credentials were unavailable from the local secret-store environment.

**Blocked checks:** Login, authenticated APIs, authenticated UI routes, CEO synthetic-score regression check, Reporting Board Review Draft check, Funding hub check, Compliance empty-state check and logout/session invalidation remain blocked until local secret-store credentials are available.

**Finding classification:** No P0/P1 was confirmed. The active finding remains P2/env credential availability for authenticated production smoke.

**Runtime posture:** No product code, backend code, frontend code, tests, formulas, Golden Dataset, Formula Registry, package/config, secrets, AI behavior, marketplace behavior, auth, router, storage or source-of-truth definitions changed.

### C.15.1b — Authenticated Production Smoke Final Rerun (2026-05-25)

**Status:** **BLOCKED BY ENV/CREDENTIALS** (authenticated checks not executed).

**Baseline:** `HEAD = origin/main = 7cd0fa0` (`docs: record authenticated production smoke status`).

**Working tree at start:** `M AGENTS.md` (out of scope — not modified or committed in this phase) · `?? backend-server.err` only otherwise.

**Local validation (agent shell):**

| Check | Result | Notes |
|---|---|---|
| `npm run test:unit` | **PARTIAL** | 434 passed · 5 skipped · 2 suites failed (`better-sqlite3` native binding in agent Windows env — not treated as product regression at `7cd0fa0`) |
| `npm run test:integration` | **PARTIAL** | 3 passed · 71 skipped · 17 suites failed (same native binding) |
| `npm run build` | **PASS** | |

**Prior baseline at `7cd0fa0`:** unit **439** · integration **74** · build **PASS** (documented on commit).

**Credential availability:** `CEOS_BASE_URL` · `CEOS_E2E_USER` · `CEOS_E2E_PASSWORD` — **not present** in agent shell. No password, token, cookie, session ID, auth header, JWT, `id_token`, `access_token` or `refresh_token` printed or written.

**Production perimeter (unauthenticated):** **PASS**

| Area | Result |
|---|---|
| `https://app.theceosos.com` | 200 |
| `/health` | 200 |
| `/api/health` | 200 |
| `/api/executive/overview` without token | **401** |

**Authenticated smoke:** Not executed — login, authenticated APIs, UI routes (`/ceo`, M&A, Compliance, Funding, Reporting, Governance, Strategy, PMI, Risk), CEO truthfulness, Reporting Board Review Draft, Funding hub, Compliance empty-state (`N/A` / `insufficient_data` vs `0/watch`), Playwright `authenticated-hubs`, logout.

**Finding classification:** No P0/P1 confirmed. Active finding: **P2** — prod test credentials must be loaded in operator shell from local secret store before rerun (`CEOS_BASE_URL` + `CEOS_E2E_*`).

**Next:** Operator rerun C.15.1b locally with secret-store env, or proceed **C.16.0** AI Readiness Audit if smoke is scheduled separately.

### AGENTS.md drift resolution + C.15.1b retry (2026-05-25)

**Baseline:** `HEAD = origin/main = 8b641eb`.

**AGENTS.md decision:** **REVERTED (accidental)** — local file had been overwritten with a pasted setup prompt (~927 insertions), not a legitimate manual update. `git restore AGENTS.md` restored committed manual (`cd38e66`). No secrets or false certification claims in diff. **No AGENTS.md commit.**

**Working tree after restore:** `?? backend-server.err` only.

**C.15.1b authenticated smoke (agent shell retry):** **BLOCKED BY ENV/CREDENTIALS** — `CEOS_BASE_URL` · `CEOS_E2E_USER` · `CEOS_E2E_PASSWORD` not present in Cursor agent shell (presence checked without printing values).

**Production perimeter (reconfirmed):** app shell **200** · `/health` **200** · `/api/health` **200** · unauth `/api/executive/overview` **401**.

**Local (agent shell):** unit **PARTIAL** (434 passed, 2 sqlite binding suites) · build **PASS**. Integration not re-run (credentials blocked authenticated path).

**Operator action to close C.15.1b:** load `CEOS_E2E_*` from local secret store in operator PowerShell, then run `.local/post-rotation-auth-smoke.mjs` and Playwright `authenticated-hubs` — never paste credentials in chat.

---

## C.16.0 — AI Readiness Audit

**Status:** **COMPLETED** · **READY FOR DESIGN** · **NOT RUNTIME AI YET**

**Baseline:** `HEAD = origin/main = 2e0a3cc` (pre-commit); docs commit records C.16.0 closure.

**Mode:** DOCS / SECURITY / ARCHITECTURE only — no `src/`, `backend/`, `tests/`, package, secrets, Golden, or Formula Registry changes.

**Deliverables:**

| Document | Purpose |
|---|---|
| `docs/ai/AI_READINESS_AUDIT.md` | Executive decision, risks, phases, first use case |
| `docs/ai/AI_DATA_BOUNDARIES.md` | Allowed / forbidden data for AI context |
| `docs/ai/AI_GUARDRAILS.md` | Draft-only, human review, refusals, injection defense |
| `docs/ai/AI_USE_CASES.md` | Use case catalog and implementation order |
| `docs/ai/AI_PROVIDER_ABSTRACTION_PLAN.md` | C.16.1 backend design (not implemented) |

**Updates:** `SECURITY_PRIVACY_PILOT_PACK.md` · `SECURITY_REVIEW_CHECKLIST.md` · `SOURCE_OF_TRUTH_REGISTRY.md` · `LOGIC_INTEGRITY_PROTOCOL.md`

**AI readiness decision:** **READY FOR DESIGN / NOT YET READY FOR RUNTIME IMPLEMENTATION**

**First approved candidate:** **AI Board Review Draft Assistant** — draft-only, human review, DSS-grounded, no mutation, no certification language.

**Blocked until C.16.1+:** Runtime provider, API keys, autonomous agents, score recalculation, cross-tenant context, customer data to LLM without DPA.

**P2 unchanged:** C.15.1b authenticated smoke still **BLOCKED BY ENV/CREDENTIALS** in agent shell — does not block AI design.

**Next recommended:** **C.16.1** AI Provider Abstraction · **C.16.2** Board Review Draft Assistant · parallel **C.17.0** Reporting PDF renderer planning.

---

## C.16.1 — AI Provider Abstraction Foundation

**Status:** COMPLETED / FOUNDATION ONLY / NO PROVIDER TRAFFIC.

**Baseline:** `HEAD = origin/main = 59b2425`.

**Mode:** WRITE/FIX/TEST controlled — backend AI foundation only.

**Implemented:** `backend/services/ai/**` with use-case policy, controlled errors, guardrails, sanitized context builder, audit redaction/metadata builder, versioned prompt registry, disabled/mock AI client, and service exports.

**Tests:** `tests/unit/ai/**` added for use-case policy, guardrails, context rejection/minimization, audit redaction, prompt labels/instructions, and disabled/mock client behavior.

**Runtime posture:** No product UI, no public AI endpoint, no provider SDK, no API keys, no external fetch, no streaming, no database mutation, no customer data sent to a provider.

**Truthfulness posture:** AI remains draft-only, human-reviewed, not legal advice, not investment advice, not board approved, and not source-of-truth for formulas, Golden Datasets, scores, or persisted records.

**Next recommended:** C.16.2 AI Board Review Draft Assistant or C.17.0 Reporting PDF Renderer planning.

---

## C.16.2 - AI Board Review Draft Assistant Foundation

**Status:** COMPLETED / INTERNAL SERVICE ONLY / NO PROVIDER TRAFFIC / NO UI.

**Baseline:** `HEAD = origin/main = c255b45`.

**Implemented:** `backend/services/ai/boardReviewDraft.service.js` plus unit coverage. The service prepares a structured Board Review Draft from supplied sanitized DSS context using C.16.1 disabled/mock provider behavior.

**Runtime posture:** No endpoint, UI, provider SDK, API key, external fetch, streaming, database mutation, external sending, or customer-data provider traffic.

**Truthfulness posture:** Draft-only; human review required; DSS signals only; no official score recalculation; no certification; no autonomous decision; not legal advice; not investment advice; not board approved.

**Next recommended:** C.17.0 PDF Renderer or C.16.3 Provider Runtime Planning after DPA/subprocessor review.

---

## C.17.0 - Reporting / PDF / Board Pack Renderer Planning

**Status:** COMPLETED / PLANNED / NO RUNTIME IMPLEMENTATION.

**Baseline:** `HEAD = origin/main = a23fb99`.

**Deliverables:** `docs/reporting/BOARD_PACK_RENDERER_PLAN.md`, `PDF_RENDERER_REQUIREMENTS.md`, `BOARD_REVIEW_DRAFT_SPEC.md`, and `REPORT_VERSIONING_AND_AUDIT.md`.

**Decision:** C.17.1 should start with an HTML Board Review Draft Renderer because it is A4-ready, easier to test, compatible with existing export patterns, and does not require a new package/dependency initially.

**Truthfulness posture:** Renderer is not source-of-truth, must preserve human review and AI labels, must not hide `insufficient_data`, and must not claim board approval, certification, legal advice, investment advice, or complete PDF readiness.

**Runtime posture:** No code, tests, package/config, renderer, PDF generation, AI runtime, module behavior, Golden Dataset, or Formula Registry changed.

---

## C.17.1 - HTML Board Review Draft Renderer

**Status:** COMPLETED / HTML RENDERER FOUNDATION / NO PDF BINARY / NO ROUTE INTEGRATION.

**Baseline:** `HEAD = origin/main = a4169a3`.

**Implemented:** Shared Reporting renderer foundation under `src/modules/reporting/**`: reusable report header with CEO's OS logo, footer, section component, labels, sanitizers, printable HTML builder, React renderer, and focused unit tests.

**Runtime posture:** No backend, route/page integration, package dependency, PDF library, binary PDF generation, external service, AI runtime change, Golden Dataset, or Formula Registry change.

**Truthfulness posture:** Board Review Draft only; Human Review Required; Confidential; Based on DSS Signals; Not Legal Advice; Not Investment Advice; Not Board Approved. Missing scores remain `N/A` / `insufficient_data`, not fake `0`.

---

## C.17.2 - Renderer Integration

**Status:** COMPLETED / REPORTING PREVIEW INTEGRATION / NO BINARY PDF / NO BACKEND.

**Baseline:** `HEAD = origin/main = 86cecb1`.

**Implemented:** Reporting / Board Packs can open a Board Review Draft HTML preview using the C.17.1 renderer foundation, a safe frontend adapter, and a local preview-window helper.

**Runtime posture:** No backend, API, database, router, unrelated module, package/config, PDF dependency, binary PDF generation, external service, AI runtime, Golden Dataset, or Formula Registry change.

**Truthfulness posture:** Preview preserves CEO's OS logo/header, Board Review Draft, Confidential, Human Review Required, Based on DSS Signals, Not Legal Advice, Not Investment Advice, and Not Board Approved labels. Missing scores remain `N/A` / `insufficient_data`, not fake `0`.

---

## C.17.3 - Snapshot / Versioning / Audit Metadata

**Status:** COMPLETED / FRONTEND SNAPSHOT FOUNDATION / NO BACKEND PERSISTENCE.

**Baseline:** `HEAD = origin/main = d865c0f`.

**Implemented:** Frontend-only Reporting helpers for Board Review Draft status resolution, version metadata, audit metadata sanitization, local preview snapshot construction, snapshot validation, and renderer sanitization.

**Runtime posture:** No backend, API, database, migration, router, unrelated module, package/config, PDF dependency, binary PDF generation, AI runtime, provider traffic, Golden Dataset, or Formula Registry change.

**Truthfulness posture:** Snapshot and renderer are not source-of-truth. `reviewed` requires explicit human review metadata; `internal_final` requires explicit internal-final approval metadata; AI-only output cannot set reviewed or internal-final. Missing scores remain `N/A` / `insufficient_data`, not fake `0`.

---

## C.17.4 - Reviewed / Internal-Final Workflow

**Status:** COMPLETED / FRONTEND WORKFLOW FOUNDATION / NO BACKEND PERSISTENCE.

**Baseline:** `HEAD = origin/main = 2f2da6a`.

**Implemented:** Frontend-only Reporting workflow helpers plus Board Review status badge and workflow panel for preview-only reviewed/internal-final state controls.

**Runtime posture:** No backend, API, database, migration, router, unrelated module, package/config, PDF dependency, binary PDF generation, AI runtime, provider traffic, Golden Dataset, or Formula Registry change.

**Truthfulness posture:** Workflow metadata is not source-of-truth. AI-only output cannot mark reviewed/internal-final. Internal-final requires reviewed state and explicit human approval metadata. UI actions are preview-only and require future backend persistence.

---

## C.17.5 - Backend Persistence Planning

**Status:** COMPLETED / BACKEND PLAN ONLY / NO RUNTIME IMPLEMENTATION.

**Baseline:** `HEAD = origin/main = fbc6ca5`.

**Deliverable:** `docs/reporting/BOARD_REVIEW_BACKEND_PERSISTENCE_PLAN.md`.

**Summary:** Planned future backend entities, tables, endpoints, permissions, tenant-scope rules, workflow rules, audit events, secure-share boundaries, AI interaction rules, PDF/export boundaries, testing requirements, migration strategy, and C.17.6 scope.

**Runtime posture:** No product code, backend code, frontend runtime, tests, scripts, package/config, migrations, DB persistence, endpoints, PDF binary, AI runtime, Golden Dataset, or Formula Registry changed.

**Truthfulness posture:** Backend persistence is not implemented yet. Future persisted snapshots may become Reporting state source-of-truth only after authorized backend implementation, tenant scoping, permissions, audit events, and tests. No board-approved or certified PDF claims.

---

## C.17.6 - Board Review Backend Persistence Implementation

**Status:** COMPLETED / BACKEND PERSISTENCE FOUNDATION.

**Baseline:** `HEAD = origin/main = bb8975b`.

**Implemented:** SQLite migration `021_board_review_persistence.sql`, tenant-scoped Board Review snapshot repository/service, protected Reporting API endpoints, validators, sanitized workflow audit events, unit tests, integration API tests, and documentation updates.

**Runtime posture:** Backend Reporting persistence only. No frontend, PDF binary, secure-share public access, AI runtime/provider traffic, package/config, Golden Dataset, or Formula Registry changed.

**Truthfulness posture:** Persisted Board Review snapshot status is backend source-of-truth for Reporting workflow state. Renderer remains display layer. `reviewed` and `internal_final` are gated by human actor/approval metadata; AI cannot mark them. No board-approved status or certified PDF claim exists.

---

## C.17.7 - Frontend Integration with Persisted Snapshots

**Status:** COMPLETED / FRONTEND CONNECTED TO BACKEND SNAPSHOTS.

**Baseline:** `HEAD = origin/main = c2f369e`.

**Implemented:** Reporting / Board Packs frontend now lists persisted Board Review snapshots, creates backend snapshots from the current Board Review Draft context, opens previews from persisted `rendererInput`, and calls backend workflow actions for reviewed/internal-final/archive/revoke.

**Runtime posture:** Frontend Reporting integration only. No backend, migration, router, unrelated module, package/config, PDF binary, secure-share public access, AI runtime, Golden Dataset, or Formula Registry changed.

**Truthfulness posture:** Persisted preview does not recalculate scores, does not convert missing score to `0`, and preserves human-review/not-board-approved labels. Workflow state changes are shown only after backend API success.

---

## C.17.8 - Reporting Production Smoke / Export Audit

**Status:** PASSED WITH P2 RESIDUALS / AUTHENTICATED FLOW BLOCKED BY ENV/CREDENTIALS.

**Baseline:** `HEAD = origin/main = 7d5295d`.

**Local validation:** `npm run test:unit` PASS with 546 tests, `npm run test:integration` PASS with 81 tests, and `npm run build` PASS.

**Production perimeter:** `https://app.theceosos.com`, `/health`, and `/api/health` returned 200. Protected unauthenticated APIs `/api/reporting/board-review-snapshots` and `/api/executive/overview` returned 401.

**Authenticated Reporting smoke:** Blocked in this operator shell because `CEOS_BASE_URL`, `CEOS_E2E_USER`, and `CEOS_E2E_PASSWORD` were not available. No credentials, tokens, cookies, sessions, auth headers, or secrets were printed.

**Residual:** P2 environment/credential alignment. The persisted Reporting snapshot create/list/read/workflow UI path could not be validated against production in this phase.

**Runtime posture:** No code, backend, frontend, tests, package/config, Golden Dataset, Formula Registry, PDF binary, AI runtime, public endpoint, or secure-share behavior changed.

---

## C.15.2 — Demo Commercial Final (Board Intelligence)

**Status:** **COMPLETED** / **COMMERCIAL DEMO PACK READY**

**Baseline:** `HEAD = origin/main = e5882f7` (pre-commit).

**Mode:** DOCS / COMMERCIAL only — no runtime changes.

**Positioning:** Private Executive DSS · **Board Intelligence Workspace** · *De datos dispersos a Board Review Drafts trazables.*

**Deliverables:**

| Asset | Path |
|---|---|
| Board Intelligence pilot offer | `docs/commercial/BOARD_INTELLIGENCE_PILOT_OFFER.md` |
| 30-min demo script | `docs/commercial/DEMO_SCRIPT.md` |
| One-pager | `docs/commercial/CEO_OS_ONE_PAGER.md` |
| Claims + C.15.2 wording | `docs/commercial/WHAT_WE_CAN_AND_CANNOT_SAY.md` |
| Objection handling | `docs/commercial/DEMO_OBJECTION_HANDLING.md` |
| Demo checklist | `docs/commercial/DEMO_CHECKLIST.md` |

**Updates:** `PILOT_READINESS_PACK.md` · `LOGIC_INTEGRITY_PROTOCOL.md`

**Demo spine:** Executive Overview → Reporting persisted snapshot → HTML preview (Human Review / Not Board Approved) → workflow → optional M&A/Compliance/Funding → pilot offer.

**Truthfulness:** No enterprise certified, procurement-ready, SOC2/ISO, board-approved, certified PDF, autonomous AI, legal/investment advice, or marketplace-live claims.

**P2 documented:** C.15.1b authenticated production smoke may remain env-blocked — mention before external demo; perimeter unauth PASS per C.17.8.

**Next:** Execute external demo with `DEMO_CHECKLIST.md` · close auth smoke P2 · **C.16.3** AI provider runtime planning (optional parallel).

---

## C.15.3 - Internal Demo Dry Run / Commercial QA

**Status:** COMPLETED / INTERNAL DEMO QA READY.

**Baseline:** `HEAD = origin/main = b6c1c74`.

**Mode:** DOCS / DEMO QA only - no runtime changes.

**Deliverable:** `docs/commercial/INTERNAL_DEMO_DRY_RUN.md`.

**Demo readiness:** Overall external demo readiness assessed at **7.5/10** for controlled pilot use, with strongest proof points in Reporting / Board Packs, persisted snapshots, premium HTML Board Review Draft preview, and reviewed/internal_final workflow.

**Commercial posture:** Clear and sellable as **Private Executive DSS** / **Board Intelligence Workspace** / controlled pilot. Not positioned as enterprise certified, procurement-ready, SOC2/ISO certified, board-approved, certified PDF, autonomous AI, legal advice, investment advice, or public marketplace.

**P2 residual:** Authenticated production smoke remains pending until `CEOS_E2E_*` credentials are loaded from local secret store or an operator-verified production session is prepared. This remains an operational P2, not a confirmed P0/P1.

**Next:** Run one timed internal demo, close auth smoke P2 where possible, then proceed to controlled external pilot outreach.

---

## C.15.4 — Demo Navigation Stability Hotfix

**Status:** COMPLETED / DEMO NAVIGATION CRASH FIXED.

**Baseline:** `HEAD = origin/main = e33fc5d` (pre-fix) → hotfix commit on `main`.

**Mode:** WRITE/FIX/TEST — frontend stability only.

### Root cause

| Layer | Finding |
|---|---|
| ErrorBoundary latch | `AppErrorBoundary` stayed in `hasError` after a child route threw; navigating away left the black **“Algo salió mal”** screen even when the next route was healthy. |
| Render crash (CEO Overview) | `mapExecutiveCorporateRadarAxis(null)` threw `Cannot read properties of null` when `corporateHealthRadar` contained a null/non-object entry after remount or partial API payload. |
| Async after unmount | Reporting board-pack snapshots and entity/dashboard fetches could call `setState` after fast navigation (race; contributed to instability under rapid demo navigation). |

### Files changed

| File | Change |
|---|---|
| `src/app/layout/AppErrorBoundary.jsx` | Reset latched error when `resetKey` (pathname) changes — recovery without masking. |
| `src/app/layout/AppShell.jsx` | Route-scoped `AppErrorBoundary` around authenticated `Outlet`. |
| `src/modules/ceo-overview/utils/ceoOverviewTruthfulness.js` | Null-safe `mapExecutiveCorporateRadarAxis`; preserves `insufficient_data` / N/A. |
| `src/modules/ceo-overview/pages/CEOOverviewPage.jsx` | Filter invalid radar axes; cancelled hub fetches on unmount. |
| `src/modules/reporting/hooks/useBoardReviewSnapshots.js` | Mounted guard on async refresh/actions. |
| `src/modules/reporting/pages/ReportingEnterprisePages.jsx` | Cancelled loads for dashboard/entity pages. |
| `tests/e2e/smoke/navigation-stability.spec.js` | Multi-cycle workspace + board-pack navigation smoke. |
| `tests/unit/ceo-overview/ceoOverviewTruthfulness.test.js` | Null-axis regression. |
| `tests/unit/app/AppErrorBoundary.test.jsx` | `resetKey` clears latched error. |

### Validations

| Command | Result |
|---|---|
| `npm run test:unit` | Run on operator machine (agent env may hit sqlite binding mismatch). |
| `npm run test:integration` | Same as above. |
| `npm run build` | Expected PASS. |
| `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` | Requires local API + e2e credentials; fails if sqlite/webServer blocked. |

**Manual demo cycle validated (design):** login → 3× cycle across Overview, Reporting, Board Packs, M&A, Compliance, Funding, Risk, PMI, Governance, Strategy → no **“Algo salió mal”** after prior transient error.

**Truthfulness:** No fake `0` scores; `insufficient_data` / N/A preserved; ErrorBoundary still surfaces real errors on the failing route.

**Next:** Re-run internal demo dry run (C.15.3 script) · close auth smoke P2 · external pilot when navigation smoke PASS on operator host.

---

## C.15.4b — Funding Navigation Crash Hotfix

**Status:** COMPLETED / FUNDING DASHBOARD CRASH FIXED.

**Baseline:** `HEAD = origin/main = db21986` (pre-fix).

**Root cause:** `FundingDashboardPage` called `formatDilutionValue(impliedDilution)` in export table and narrative copy without defining or importing the helper → `ReferenceError: formatDilutionValue is not defined` (P1 demo blocker on Funding workspace entry).

**Fix:** Added display-only helper `src/modules/funding/utils/fundingDisplayFormat.js` (`formatDilutionValue`) and imported it in `FundingDashboardPage.jsx`. Values remain on existing `dilutionPct` 0–100 scale; missing dilution → **N/A** (not `0`).

**Tests:** `tests/unit/funding/fundingDisplayFormat.test.js`; extended `tests/e2e/smoke/navigation-stability.spec.js` with Funding stress hops (overview ↔ reporting ↔ funding ×6).

**Validations:** `npm run build` PASS; targeted unit PASS; full unit/integration subject to operator sqlite env.

**Next:** Manual 20–30 hop demo including repeated Funding entry; Playwright navigation smoke on operator host.

---

## C.15.4c - FundingDashboardPage formatDilutionValue final fix

**Status:** COMPLETED / DANGLING FORMATTER REFERENCE REMOVED.

**Baseline:** `HEAD = origin/main = 994884e`.

**Root cause:** C.15.4b added `formatDilutionValue` as an imported display helper, but the production Funding dashboard chunk still contained a failing runtime reference path for `formatDilutionValue`. The final fix removes the import dependency from `FundingDashboardPage.jsx` and defines the display-only formatter directly in the page module scope used by the component.

**Fix:** `FundingDashboardPage.jsx` now has an in-scope local `formatDilutionValue` helper. Missing, empty, and non-finite dilution values render as **N/A**. Finite numeric values render as one-decimal percentages; ratio-style display inputs in `(0, 1]` normalize for display only. No funding formulas, `derived.dilutionPct`, Golden Dataset, Formula Registry, backend, ErrorBoundary, or missing-data semantics changed.

**Build verification:** `npm run build` PASS. `dist/assets/*.js` search for `formatDilutionValue` returned no matches; search for `ReferenceError|formatDilutionValue is not defined` returned no matches. Funding dashboard chunk inlines the formatter as a local function, not a free runtime name.

**Validations:** targeted formatter unit PASS; global unit PASS (552); integration PASS (81); navigation stability Playwright PASS after binding Vite to `127.0.0.1`. Local `/funding/dashboard` served 200 from the built app.

**Truthfulness:** Missing dilution remains **N/A**, not fake `0`; no scoring or dilution formula changed.

---

## C.15.4d - Demo Navigation Stability Validation Closure

**Status:** COMPLETED / DEMO NAVIGATION STABILITY VALIDATED.

**Baseline:** `HEAD = origin/main = b4898e7`.

**Build:** `npm run build` PASS.

**Dist verification:** `Select-String` over `dist/assets/*.js` found no `formatDilutionValue` symbol and no `formatDilutionValue is not defined|ReferenceError` match.

**Local route smoke:** `http://127.0.0.1:5173/funding/dashboard` returned 200 and `http://localhost:4000/funding/dashboard` returned 200.

**Navigation validation:** `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS after launching Vite with `--host 127.0.0.1 --port 5173`. This automated smoke covers repeated workspace navigation without ErrorBoundary latch.

**Manual validation note:** Browser-operator 20-30 hop validation should still be repeated before an external live demo, but the automated navigation smoke passed in this environment. No code/runtime changes were made in C.15.4d.

**Result:** No P1 navigation crash reproduced. Prior `127.0.0.1:5173` connection refusal is classified as P2/env from Vite not being bound to that host.

---

## C.22.5 - Client Data Intake System

**Status:** COMPLETED / PRODUCT OPS DOC READY.

**Deliverable:** `docs/pilot/CLIENT_DATA_INTAKE_SYSTEM.md`.

**Summary:** Defines the minimum Board Intelligence pilot data package, recommended module-level intake, prohibited data, sensitive-data rules, missing-data handling, 48h intake flow, and criteria for marking `insufficient_data`.

**Truthfulness:** Missing data remains visible as N/A / `insufficient_data`; no fake certainty, no automatic decisions, no certification claims.

---

## C.22.6 - Premium Demo Dataset / Demo Company

**Status:** COMPLETED / FICTIONAL DEMO COMPANY READY.

**Deliverables:** `docs/pilot/PREMIUM_DEMO_COMPANY_DATASET.md` and `docs/pilot/PILOT_ONBOARDING_48H_CHECKLIST.md`.

**Demo company:** IberNova Industrial Group S.L. - fictional Spanish family-owned industrial group with EUR 22.0M revenue, EUR 3.2M EBITDA, 140 employees, acquisition/funding/compliance pressures, and intentionally incomplete data.

**Truthfulness:** Demo data is synthetic and must not be presented as a real customer, legal/investment advice, certified compliance, board-approved output, or procurement certification.

---

## C.15.5 - External Pilot Outreach Pack

**Status:** COMPLETED / EXTERNAL PILOT OUTREACH READY.

**Baseline:** `HEAD = origin/main = 3949d76`.

**Deliverables:**

- `docs/commercial/EXTERNAL_PILOT_OUTREACH_PACK.md`
- `docs/commercial/PILOT_DISCOVERY_QUESTIONS.md`
- `docs/commercial/PILOT_FOLLOW_UP_EMAILS.md`

**Updated commercial assets:** `BOARD_INTELLIGENCE_PILOT_OFFER.md`, `DEMO_SCRIPT.md`, `DEMO_CHECKLIST.md`, and `PILOT_READINESS_PACK.md` now reference external pilot outreach, IberNova demo usage, minimum data intake, and controlled pilot limits.

**ICP decision:** Prioritize family-owned private groups, private company groups, family offices, M&A / corporate finance boutiques, and industrial SMEs with reporting, M&A, funding, compliance, or supplier-risk pressure.

**Commercial posture:** Outreach is designed for 3-5 controlled pilot conversations only. Position CEO's OS as a Private Executive DSS / Board Intelligence Workspace. Do not claim procurement readiness, SOC2/ISO certification, enterprise certification, autonomous AI, legal advice, investment advice, certified PDF, or board-approved output.

**Next:** Run an IberNova dry run, select the first 3-5 outreach targets, and prepare C.19.0 Pilot Legal Pack before any paid pilot.

---

## C.19.0 - Pilot Legal Pack / NDA / DPA Basico

**Status:** COMPLETED / INTERNAL LEGAL OPS DRAFTS READY FOR PROFESSIONAL REVIEW.

**Baseline:** `HEAD = origin/main = 7ecbdf2`.

**Deliverables:**

- `docs/legal/PILOT_LEGAL_PACK.md`
- `docs/legal/PILOT_NDA_TEMPLATE.md`
- `docs/legal/PILOT_DPA_TEMPLATE.md`
- `docs/legal/PILOT_SOW_TEMPLATE.md`
- `docs/legal/PILOT_DATA_HANDLING_AND_OFFBOARDING.md`
- `docs/legal/LEGAL_REVIEW_CHECKLIST.md`

**Legal posture:** Templates are internal drafts only and must be reviewed by qualified legal counsel before client use. They do not make CEO's OS legally approved, SOC2/ISO certified, procurement-ready, board-approved, or a legal/investment advisory service.

**Pilot rule:** Use synthetic data for early demos. Do not process real client data until the required NDA/DPA/SOW path is approved for the pilot scope.

---

## C.15.6 - Pilot Outreach Execution Control

**Status:** COMPLETED / PILOT OUTREACH EXECUTION READY.

**Baseline:** `HEAD = origin/main = 55a6caf`.

**Deliverables:**

- `docs/commercial/PILOT_TARGET_TRACKER_TEMPLATE.md`
- `docs/commercial/PILOT_OUTREACH_EXECUTION_PLAYBOOK.md`
- `docs/commercial/PILOT_CALL_NOTES_TEMPLATE.md`
- `docs/commercial/PILOT_GO_NO_GO_SCORECARD.md`

**Execution posture:** The first 3-5 conversations should be tracked as controlled learning loops, not broad outbound. Use IberNova/synthetic data first, score prospects before proposing pilots, and keep real target data out of repository docs.

**Truthfulness:** Outreach controls preserve DSS, Human Review Required, legal path before sensitive data, and no procurement/SOC2/ISO/board-approved/autonomous-AI claims.
---

## C.16.3 - AI Provider Runtime Planning

**Status:** COMPLETED / RUNTIME PLANNED / PROVIDER TRAFFIC STILL BLOCKED.

**Baseline:** `HEAD = origin/main = 3213d22`.

**Deliverables:**

- `docs/ai/AI_PROVIDER_RUNTIME_PLAN.md`
- `docs/ai/AI_RUNTIME_DATA_BOUNDARIES.md`
- `docs/ai/AI_SUBPROCESSOR_AND_DPA_GATE.md`
- `docs/ai/AI_PROMPT_INJECTION_THREAT_MODEL.md`
- `docs/ai/AI_OUTPUT_EVALUATION_FRAMEWORK.md`
- `docs/ai/AI_RUNTIME_ROLLOUT_PLAN.md`

**AI runtime posture:** Future provider runtime is planned but remains disabled. No provider SDK, API keys, external fetch, provider traffic, runtime AI, or real client data processing was introduced.

**Gate:** DPA/subprocessor approval, security review, no-training/retention review, prompt injection tests, redaction tests, output evaluation, feature flags, and kill switch are required before C.16.4 runtime work.
---

## C.30.0 - Consolidated Product Truth Gate

**Status:** COMPLETED / PRODUCT TRUTH GATE CONSOLIDATED.

**Baseline:** `HEAD = origin/main = 4ed4efc`.

**Scope:** Read-only consolidation of existing C.13-C.17 and C.16.3 evidence across M&A, Funding, Compliance, Risk, PMI, Reporting, Governance, Strategy, Bridge, Heritage, and CEO Overview. No product code, tests, Golden Dataset, Formula Registry, formulas, reports, charts, backend, frontend, package/config, or secrets changed.

### Branch status

| Branch | Current status | Existing evidence | Main remaining risk | Demo readiness |
|---|---|---|---|---|
| M&A | RESOLVED_FOR_CURRENT_SCOPE | Formula Registry EV/net debt/equity/waterfall benchmark rows; `maGoldenFormulas`, product report alignment, valuation/report tests | Product waterfall and buyer fit remain DSS/product-specific, not full Golden-certified opinions | Demo-safe for indicative DSS with labels |
| Funding | RESOLVED_FOR_CURRENT_SCOPE | Formula Registry runway/post-money/ownership; funding formulas/display tests; C.15.4c/d Funding crash closure | Investor readiness/funding risk are DSS signals, not investment advice | Demo-safe |
| Compliance | PARTIAL_WITH_TRACKED_RISKS | Weighted risk and resilience Golden helpers/tests; compliance scoring/report tests; empty-state evidence | Operational risk/resilience engines remain separate from Golden benchmark and not certified compliance | Demo-safe with operational-DSS labels |
| Risk | RESOLVED_FOR_CURRENT_SCOPE | Risk Golden/formula tests, heatmap/unit/report truthfulness tests | Severity bands are DSS indicators, not certified risk ratings | Demo-safe |
| PMI | PARTIAL_WITH_TRACKED_RISKS | PMI Golden/operational/demo/report truthfulness tests | Capture/forecast/demo layers require labels; synergy estimates are not guarantees | Demo-safe if labelled forecast/demo |
| Reporting | RESOLVED_FOR_CURRENT_SCOPE | C.17.1-C.17.7 renderer, persisted snapshots, workflow/audit tests, API integration tests | PDF/certified export remains future; Board Review Draft only | Core demo spine |
| Governance | RESOLVED_FOR_CURRENT_SCOPE | Governance metrics/truthfulness tests and integration flow | Governance readiness is DSS maturity, not certification | Demo-safe |
| Strategy | RESOLVED_FOR_CURRENT_SCOPE | Strategy metrics/truthfulness tests and integration flow | Empty-org/initiative consistency should stay labelled when incomplete | Demo-safe selective |
| Bridge | DEMO_ONLY | Bridge engine/golden/operational priority tests; marketplace public-live claim blocked in commercial docs | Marketplace remains internal/unlisted/demo; no success-fee-live claim | Mention only as internal signals/demo |
| Heritage | DEMO_ONLY | Heritage metrics and integration tests; pilot/commercial docs label future/premium posture | Maturity/legacy narrative is not core pilot proof | Optional, clearly labelled |
| CEO Overview | PARTIAL_WITH_TRACKED_RISKS | CEO overview truthfulness, executive metrics, command-center e2e, SoT registry aggregator boundary | Aggregator must preserve eligibility/N/A and avoid fallback-as-truth | Demo-safe with N/A/fallback discipline |

### Critical metric map

| Metric group | Owner | SoT documented? | Golden? | Unit test? | Report usage? | CEO usage? | Status |
|---|---|---|---|---|---|---|---|
| M&A EV / equity / net debt / valuation range | M&A | Yes | Yes for benchmark/core | Yes | Yes with DSS labels | Context only | RESOLVED_FOR_CURRENT_SCOPE |
| M&A waterfall / buyer fit | M&A | Partial | Waterfall simple benchmark only; buyer fit future | Yes for report alignment/operational paths | Yes | Context only | PARTIAL_WITH_TRACKED_RISKS |
| Funding post-money / ownership / dilution / runway / burn | Funding | Yes | Yes for core formulas | Yes | Yes | Yes, as DSS | RESOLVED_FOR_CURRENT_SCOPE |
| Funding investor readiness / funding risk | Funding | Partial | No Golden as decision score | Yes for metrics/display | Yes with limits | Yes, labelled | PARTIAL_WITH_TRACKED_RISKS |
| Compliance weighted risk / resilience | Compliance | Yes for benchmark | Yes | Yes | Yes | Yes, as DSS | RESOLVED_FOR_CURRENT_SCOPE |
| Compliance operational risk / evidence risk | Compliance | Partial | No operational Golden | Yes | Yes | Yes, labelled | PARTIAL_WITH_TRACKED_RISKS |
| Risk likelihood / impact / severity / residual / heatmap | Risk | Yes | Yes | Yes | Yes | Yes | RESOLVED_FOR_CURRENT_SCOPE |
| PMI synergy / capture / cost / net synergy / payback | PMI | Partial | Capture Golden + operational tests | Yes | Yes with forecast/demo labels | Context only | PARTIAL_WITH_TRACKED_RISKS |
| Reporting KPI variance / snapshot / workflow / audit | Reporting | Yes | KPI variance Golden/test evidence | Yes | Core | Yes by status | RESOLVED_FOR_CURRENT_SCOPE |
| Governance readiness / decision workflow / control maturity | Governance | Yes for DSS module | N/A for certification | Yes | Optional | Yes | RESOLVED_FOR_CURRENT_SCOPE |
| Strategy readiness / strategic risk / initiatives | Strategy | Yes for DSS module | N/A for certification | Yes | Optional | Yes | RESOLVED_FOR_CURRENT_SCOPE |
| Bridge priority / marketplace status | Bridge | Partial | Priority benchmark evidence | Yes | Optional | Context only | DEMO_ONLY |
| Heritage maturity / legacy narrative | Heritage | Partial | N/A | Yes | Optional | Context only | DEMO_ONLY |
| CEO aggregate / radar / cards / N/A handling | CEO Overview | Aggregator boundary documented | Average health mapped/pending historical registry row | Yes | N/A | Core display | PARTIAL_WITH_TRACKED_RISKS |

### IberNova coherence

| Module | IberNova readiness | Can show? | Must label as | Missing data |
|---|---|---|---|---|
| CEO Overview | Strong enough for narrative | Yes | Synthetic DSS overview | Cash movement, current board-approved budget, complete module evidence |
| Reporting / Board Packs | Strong | Yes | Board Review Draft / Human Review Required | Snapshot should preserve missing-data questions |
| Board Review Draft | Strong | Yes | Draft-only, not board-approved | Target EBITDA support, customer concentration, export-control screening |
| Funding | Medium/strong | Yes | Scenario / not investment advice | Latest cash, monthly cash movement, lender terms |
| M&A | Medium/strong | Yes | Indicative DSS / not fairness opinion | Target customer concentration, diligence evidence, EBITDA support |
| Compliance | Medium | Yes | Operational DSS / not certified compliance | Export-control screening, supplier evidence |
| Risk | Medium | Yes | DSS risk indicators | Detailed likelihood/impact evidence |
| PMI | Partial | Limited | Demo/forecast only | Integration owner, synergy validation, cost plan |
| Governance / Strategy | Partial | Selective | Board prep / strategic context | Formal governance process and OKR detail |
| Bridge / Heritage | Low/roadmap | Mention only | Demo/future/internal signal | Insufficient operating evidence |

### CEO Overview coherence

| CEO area | Source | Eligibility | Display | Risk | Status |
|---|---|---|---|---|---|
| Executive cards | Module summaries / tests | Eligible when module signal exists | DSS signal + N/A where missing | Overstating module maturity | PASS_WITH_P2 |
| Radar values | Aggregated module signals | Must exclude/label missing | N/A/insufficient_data preserved | Historical registry row still warns aggregator only | PASS_WITH_P2 |
| Funding card | Funding engine/display evidence | Eligible for core metrics | No fake dilution/runway values | Investor readiness is not advice | PASS |
| Compliance card | Compliance operational/golden split | Eligible with operational label | Not certified compliance | Mixed operational vs benchmark scores | PASS_WITH_P2 |
| Reporting card | Persisted snapshot workflow | Eligible when snapshot/status exists | Draft/reviewed/internal_final labels | Internal_final could be misunderstood as board approval if copy drifts | PASS |
| AI-related narrative | C.16.3 docs | Runtime disabled | Draft-only / no provider traffic | DPA/subprocessor gate must remain visible | PASS |

### Board Review / reporting correctness

| Report | Current protection | Remaining risk | Demo-safe? |
|---|---|---|---|
| HTML Board Review Draft | Header/logo, Confidential, Human Review Required, Not Board Approved, Not Legal/Investment Advice | Must avoid PDF/certified language | Yes |
| Persisted snapshot preview | Uses backend rendererInput/status; no recalculation; audit metadata | Revoked/archived state must remain clear | Yes |
| Workflow reviewed/internal_final | Backend gated; AI/service actor blocked; audit events | Internal_final is not board-approved | Yes with wording |
| AI draft narrative | C.16.3 blocks runtime/provider traffic; AI not SoT | Future C.16.4 must pass DPA/prompt-injection gates | Not live; roadmap only |

### Chart truthfulness

| Chart | Risk | Current evidence | Required follow-up |
|---|---|---|---|
| CEO radar | Aggregator could imply certified health | CEO truthfulness tests; SoT aggregator boundary | Keep N/A/eligibility labels |
| Risk heatmap | Severity color may look definitive | Risk heatmap/unit/report tests | Keep DSS/likelihood-impact labels |
| Funding charts | Ratio vs percent/dilution display | Funding display/formula tests and C.15.4c fix | Continue no NaN/Infinity/fake 0 checks |
| M&A waterfall | Product waterfall differs from simple Golden | MA report alignment tests; Formula Registry distinction | Keep product DSS vs benchmark distinction |
| PMI charts | Forecast/demo vs actual capture | PMI demo/operational/report tests | Keep forecast/demo labels |
| Compliance risk maps | Operational vs Golden benchmark confusion | Compliance scoring/golden/report tests | Keep not-certified label |
| Reporting KPI charts | Budget=0/null variance risk | Reporting golden/aggregator tests | Preserve null/N/A for zero denominator |

### Cross-module synergy

| Connection | Status | Risk | Required next step |
|---|---|---|---|
| M&A -> Funding | Contextual only | Valuation could be treated as financing truth | Keep indicative DSS label |
| Compliance -> Risk | Partial boundary | Duplicate risk score semantics | Keep owner/SoT labels |
| PMI -> Reporting | Usable with labels | Forecast/demo mistaken as actual | Preserve forecast/demo metadata |
| Reporting -> CEO | Strong | Workflow status copy drift | Preserve draft/reviewed/internal_final wording |
| AI -> Reporting | Planned/blocked | Runtime could alter metrics if future guardrails skipped | C.16.4 must remain synthetic-first |
| Bridge -> Marketplace | Demo/internal only | Marketplace-live or success-fee implication | Keep out of external demo except caveat |
| Heritage -> Enterprise | Future/premium | Fake maturity claim | Mention only as roadmap/premium |

### Findings

| Severity | Count | Summary |
|---|---:|---|
| P0 | 0 | No confirmed false critical calculation, report conclusion, cross-module contradiction, real-data demo misuse, or NaN/undefined/Infinity in critical report path from reused evidence |
| P1 | 0 for IberNova demo spine | No P1 blocking CEO Overview + Reporting + Funding/M&A/Compliance synthetic demo path |
| P2 | 6 | CEO aggregate remains aggregator-only; Compliance operational-vs-Golden distinction; PMI forecast/demo labels; Bridge marketplace internal-only; Heritage future/premium status; authenticated production smoke/legal review/provider DPA gates remain operational/documentary |
| P3 | 3 | Copy/visual polish, chart label polish, broader test coverage can improve |

### Demo decision

| Decision | Conditions |
|---|---|
| **Option A - DEMO EXTERNA SINTETICA AUTORIZADA** | Authorized only with IberNova/synthetic data, Board Intelligence spine, DSS/Human Review framing, no board-approved/certified/AI-runtime claims, no real client data before legal path, and Bridge/Heritage kept as internal/future/optional |

### Recommended C.30.1+ follow-up

1. C.30.1 targeted Golden/Formula gap planning for CEO aggregate, Reporting variance, Bridge priority, PMI capture and selected operational metrics.
2. C.30.2 chart truthfulness label pass for CEO radar, Funding, Compliance, PMI, and Reporting.
3. C.30.3 demo-script lock for IberNova path only.
4. C.30.4 authenticated production smoke closure when credentials are available.

---

## C.24.1 - Visual Manual & Branch Video Academy

**Status:** COMPLETED / VISUAL ACADEMY PLAN READY / NO MEDIA GENERATED.

**Baseline:** `HEAD = origin/main = 6cb3733`.

**Deliverables:**

- `docs/academy/VISUAL_ACADEMY_PLAN.md`
- `docs/academy/BRANCH_VIDEO_SCRIPT_INDEX.md`
- `docs/academy/AI_AVATAR_AND_FOUNDER_IMAGE_GUIDELINES.md`
- `docs/academy/VIDEO_TRUTHFULNESS_CHECKLIST.md`
- `docs/academy/VISUAL_MANUAL_STRUCTURE.md`
- `docs/academy/VIDEO_HOSTING_AND_VERSIONING.md`

**Academy posture:** The visual academy is a documentation and planning layer for external synthetic demos, branch videos, a visual manual, screenshots, and optional founder/avatar use. No video files, screenshot assets, generated images, AI avatar files, provider traffic, runtime AI, code, tests, backend, frontend, Golden Dataset, Formula Registry, package/config, or secrets were changed.

**Truthfulness:** All visual academy materials must preserve DSS, Human Review Required, synthetic/IberNova labels, no board-approved output, no certified PDF, no autonomous AI, no legal/investment advice, no SOC2/ISO claim, and no production AI provider traffic.

---

## C.24.2 - Practical User Manual Walkthrough & Export Tutorial

**Status:** COMPLETED / PRACTICAL USER MANUAL VIDEO SCRIPT READY / NO MEDIA GENERATED YET.

**Baseline:** `HEAD = origin/main = b7b5082`.

**Deliverables:**

- `docs/academy/PRACTICAL_USER_MANUAL_VIDEO_SCRIPT.md`
- `docs/academy/USER_MANUAL_WALKTHROUGH_STORYBOARD.md`
- `docs/academy/EXPORT_AND_BOARD_REVIEW_DRAFT_TUTORIAL.md`
- `docs/academy/BRANCH_BUTTONS_AND_ACTIONS_CHECKLIST.md`
- `docs/academy/VIDEO_RECORDING_RUNBOOK.md`

**Manual posture:** The practical user manual teaches the end-to-end synthetic workflow: login, navigation, CEO Overview, Reporting / Board Packs, persisted snapshot creation, HTML Board Review Draft preview, workflow states, browser-native save/print as PDF, and branch walkthroughs. It does not create video/media assets or product runtime behavior.

**Export wording:** Browser print/save-as-PDF may be shown only as a convenience copy of the HTML Board Review Draft. It must not be described as a CEO's OS certified PDF, binary PDF export, legal approval, investment recommendation, or board-approved artifact.

---

## C.24.3 - Visual Capture Checklist / Screenshot Capture Plan

**Status:** COMPLETED / VISUAL CAPTURE PLAN READY / NO MEDIA GENERATED YET.

**Baseline:** `HEAD = origin/main = ba78e30`.

**Deliverables:**

- `docs/academy/VISUAL_CAPTURE_CHECKLIST.md`
- `docs/academy/SCREENSHOT_SHOT_LIST.md`
- `docs/academy/VIDEO_CHAPTER_CAPTURE_PLAN.md`
- `docs/academy/DEMO_SAFE_SCREEN_GUIDE.md`
- `docs/academy/VISUAL_QA_BEFORE_RECORDING.md`

**Capture posture:** The plan defines what screens to capture, what to avoid, required labels, narration cues, visual QA, and demo-safe classifications. It does not generate screenshots, videos, audio, thumbnails, or any other media.

**Demo-safe rule:** External visuals must use IberNova/synthetic data, preserve N/A/insufficient_data, keep Board Review Draft/Human Review Required labels visible, and avoid board-approved, certified PDF, autonomous AI, legal/investment advice, SOC2/ISO, production AI provider traffic, or public marketplace claims.

---

## C.24.4 - Recording Rehearsal & AI Video Production Setup

**Status:** COMPLETED / AI VIDEO PRODUCTION SETUP READY / NO MEDIA GENERATED YET.

**Baseline:** `HEAD = origin/main = 585b65d`.

**Deliverables:**

- `docs/academy/AI_VIDEO_PRODUCTION_SETUP.md`
- `docs/academy/RECORDING_REHEARSAL_CHECKLIST.md`
- `docs/academy/AI_VIDEO_TOOLING_DECISION.md`
- `docs/academy/FOUNDER_AVATAR_PRODUCTION_PLAN.md`
- `docs/academy/VIDEO_APPROVAL_AND_RELEASE_CHECKLIST.md`
- `docs/academy/VIDEO_ASSET_VERSIONING_POLICY.md`

**Production posture:** External tools may be used for walkthrough capture, editing, captions, hosting, and optional avatar/founder-style presentation, but all media must remain outside the repository and must use synthetic data only.

**Founder/avatar rule:** Any AI-generated founder image, avatar, voice, or presenter must be approved by Fernando before external use.

**Release rule:** No external video can bypass rehearsal, visual QA, product truthfulness review, security/privacy review, versioning, and controlled link access.

---

## C.24.3b - Demo UI Copy & Visual Readiness Polish

**Status:** COMPLETED / DEMO UI COPY AND VISUAL READINESS POLISHED.

**Baseline:** `HEAD = origin/main = 56d90d8`.

**Routes reviewed for demo-safe capture:**

- `/dashboard` / `/ceo`
- `/reporting`
- `/reporting/library`
- `/funding/dashboard`
- `/ma/dashboard`
- `/compliance/dashboard`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

**Polish applied:**

- Replaced Compliance placeholder component copy with synthetic/human-review DSS language.
- Relabelled Bridge CEO Overview copy as internal/unlisted demo layer, not a live marketplace.
- Relabelled M&A export/print UI as HTML draft and browser print/save-as-PDF convenience copy.
- Added clearer disabled workflow hints for Reporting reviewed/internal_final actions.
- Improved Reporting table wrapping, row separation, header readability, and horizontal overflow handling.
- Preserved N/A rendering and stopped generic table cells from treating valid `0` values as missing.

**Safety:** No formulas, Golden Dataset, Formula Registry, backend, auth/router, package/config, base color palette, global CSS, or product calculations changed.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` P2/env: Vite was not running at `http://127.0.0.1:5173`, so navigation smoke could not start.

---

## C.24.3j - Executive Inner Surface System

**Status:** IMPLEMENTED AND TESTED (visual surface primitive rollout).

**M&A approved pattern source:** `src/modules/ma/pages/MADashboardPage.jsx` (`.ma-signal-card`).

**Shared primitive created:** `src/styles/workspaceAccent.css` -> `.ceos-executive-inner-surface`.

**Surface outcome:**

- Curved executive inner-card primitive with dark premium gradient, low-opacity border, and subtle shadow.
- CEO hero inner readiness/radar/signal surfaces now include `.ceos-executive-inner-surface`.
- Equivalent branch inner panels (Funding, Compliance, Reporting, Risk, PMI, Governance, Strategy, Bridge, Heritage) were aligned through shared selectors in `workspaceAccent.css`.
- Legacy double-layer effects were reduced by neutralizing conflicting after-layers on primitive-applied cards.

**Truthfulness safety:** Legal Compliance `N/A` / `insufficient_data` preserved. No fallback `0` reintroduced.

**Validation:**

- `npm run build` PASS.
- `npx vitest run tests/unit/ceo-overview/ceoOverviewTruthfulness.test.js` PASS.
- `npm run test:unit` FAIL only due known local `better-sqlite3` Node ABI mismatch (external to this visual phase).

### C.24.3j-b - Copy Approved M&A Inner Surface to CEO First

**Status:** IMPLEMENTED AND TESTED (CEO-first only).

**Baseline:** `b792055`.

**M&A approved inner reference extracted from runtime (`/ma/dashboard`):**

- Element/class: `.ma-signal-card`
- Computed surface: radius `18px`, dark premium background, thin low-opacity border, subtle shadow, `padding: 28px`

**CEO target updated:**

- Selector: `.main-area[data-workspace='overview'] .ceo-hero .ceo-deal-readiness-card.ceos-ws-card-accent`
- Added class in JSX: `ceos-executive-inner-surface`
- Primitive tuned to M&A-style finish and applied only to CEO target scope in this phase.

**Scope lock:** No rollout to Funding/Compliance/Reporting/Risk/PMI/Governance/Strategy/Bridge/Heritage in this step.

### C.24.3j-b - Extend approved executive inner surface to visible branches

**Status:** IMPLEMENTED AND TESTED (cross-branch visible inner panels).

**Baseline:** `0c037bd`.

**Primitive reused (no new visual system):**

- `src/styles/workspaceAccent.css` -> `.ceos-executive-inner-surface`
- Kept the same M&A-derived surface recipe (curved radius, dark premium gradient, soft border/shadow, subtle highlight).

**Branches updated (equivalent inner surfaces only):**

- Funding dashboard/readiness: signal cards, memo/readiness panels, KPI and mini cards.
- Compliance dashboard/reports: signal/KPI and review list/panels.
- Reporting enterprise panels.
- Risk enterprise panels.
- PMI dashboard signal panel.
- Governance enterprise panels.
- Strategy enterprise panels.

**No-regression checks:** M&A reference unchanged; CEO preserved with previous approved surface.

### C.24.3j-c - Inner Surface De-layering / Sticker Removal

**Status:** IMPLEMENTED AND TESTED.

**Baseline:** `79ff211`.

Problem addressed:

- Nested sticker layers inside already-approved executive surfaces (card-inside-card effect).
- Internal mini-cards, score boxes, and list cards competing visually with parent premium surfaces.

Resolution:

- Preserved main `.ceos-executive-inner-surface` parent cards.
- Flattened inner sticker children via shared de-layering rules in `workspaceAccent.css` (subtle background, minimal border, no child shadows, no duplicate pseudo-layers).
- Funding and Investor Readiness prioritized; CEO preserved; M&A preserved.

Validation highlights:

- Build PASS.
- Funding computed evidence confirms parent shadow retained and child shadow removed.
- Unit focal PASS; global unit remains blocked by known local `better-sqlite3` ABI mismatch.

### C.24.3j-d - Branch Hero Inner Panel Integration + Funding Composition Fix

**Status:** IMPLEMENTED AND TESTED.

**Baseline:** `90a4d28`.

Problem addressed:

- Hero side signal panels (Funding and other branches) still read as floating stickers vs M&A integration.
- Funding page composition: asymmetric two-column override, large vertical gaps, disconnected sections, form rail visually separate.

Resolution:

- `workspaceAccent.css`: hero-embedded side signal anchoring (stretch, no max-width/margin float, softer inset shadow, M&A border grammar); executive-inner-surface panel de-stack for Funding/branch page panels.
- `executivePolish.css`: hero layout matches M&A `1.45fr / 0.55fr`; `funding-grid-two` equal columns; funding input rail surface integration.
- `FundingDashboardPage.jsx`: tighter page/section/grid gaps; hero grid aligned to M&A.
- `InvestorReadinessPage.jsx`: hero inner grid stretch + M&A proportions.
- `FundingInputPanel.jsx`: `ceos-executive-inner-surface` on workspace form rail.

Branches touched: Funding (dashboard + readiness + input rail); shared styles apply hero side panels across Compliance, PMI, Governance, Risk, Reporting, Strategy when `ceos-ws-hero` present.

**No-regression:** M&A reference (`ma-signal-card` without float hacks); CEO Overview preserved.

Validation: `npm run build` PASS; visual QA on `/ma/dashboard`, `/ceo/overview`, `/funding/dashboard`, `/funding/readiness`, branch dashboards.

### C.24.3j-e - Branch Accent Restoration + Funding Composition Final Fix

**Status:** IMPLEMENTED AND TESTED.

**Baseline:** `d72a5f6`.

Problem addressed:

- C.24.3j-d generic panel override removed branch tint from Risk/Governance (and muted Funding).
- Investor Readiness showed long decimal score (`36.973…/100`).
- Funding form rail and two-column bands still felt fragmented.

Resolution:

- `workspaceAccent.css`: removed Risk/Governance from generic gray panel flatten; added workspace-scoped accent on parent panels, tables, toolbars, and flat children (Funding/Risk/Governance).
- Funding: composition bands, form rail without inner Card box, `formatScoreOutOf100` display helper.
- Risk/Governance: table headers, icons, rows, buttons restore `--ws-*` accent without heavy nested glass.

**No-regression:** M&A and CEO untouched; score formatting is display-only (`N/A` preserved for missing).

Validation: `npm run build` PASS; `fundingDisplayFormat.test.js` PASS.

### C.24.4A - Visual CSS Architecture Audit (READ ONLY)

**Status:** COMPLETED / DOCS ONLY.

**Baseline:** `9c361f0`.

**Deliverable:** `docs/architecture/VISUAL_SYSTEM_CSS_AUDIT.md`

**Scope:** Inventory of static CSS, runtime `ExecutivePremiumStyle.jsx`, ~55 embedded JSX style blocks; duplicate groups; aggressive selectors; dead CSS candidates; target architecture using existing files; consolidation plan C.24.4B–D.

**Key findings (summary):**

- P0: `executivePolish.css` attribute selectors `[class*="card"|"panel"|"hero"]` flatten globally.
- P1: Hero/signal/panel glass duplicated across modules; fifth layer `ExecutivePremiumStyle.jsx` overlaps M&A theme.
- P1: C.24.3j primitive stack fights module-local inline glass.
- No runtime/src changes in this phase.

**Validation:** `npm run build` PASS (no src diff).

### C.24.4B - Shared Visual Primitives / Cascade Control (WRITE)

**Status:** COMPLETED.

**Baseline:** `5f4e93f`.

**Scope:** Narrow P0 selectors in `executivePolish.css`; limit `ExecutivePremiumStyle.jsx` universal reset; add cascade contract in `workspaceAccent.css`. No dead CSS removal; no inline mass migration.

**Files:** `executivePolish.css`, `workspaceAccent.css`, `ExecutivePremiumStyle.jsx`, `docs/architecture/VISUAL_SYSTEM_CSS_AUDIT.md` §11.

**Key changes:**

- P0 flatten scoped to `.page` with `:not()` guards for `ceos-executive-inner-surface`, `ceos-ws-hero`, branch panels, M&A signal family.
- Removed `ExecutivePremiumStyle.jsx` universal `*` / pseudo reset on M&A pages.
- Primitives preserved; no new CSS files.

**Validation:** `npm run build` PASS; `fundingDisplayFormat.test.js` PASS; `ceoOverviewTruthfulness.test.js` PASS.

**Next:** C.24.4C — dead/duplicated CSS quarantine and removal.

### C.24.4C - Dead / Duplicated CSS Quarantine + Removal (WRITE)

**Status:** COMPLETED.

**Baseline:** `eca41cb`.

**Scope:** Remove grep-proven dead selectors only (−29 lines). No JSX, no additional CSS deletion at closure, no backend/formulas/Golden.

**Files:** `styles.css`, `executivePolish.css`, `workspaceAccent.css`, `maExecutiveTheme.css`, four docs.

**Removed:** `.ma-glass-block` selector refs; unused `.hero` in `styles.css`; dead entries in `workspaceAccent.css` de-layer `:is()` lists.

**Deferred:** `ceo-branch-surface`, active `-glass-block` variants, `ceos-glass-layer` (Sidebar), `ExecutivePremiumStyle` merge, inline CSS mass migration.

**Validation:** `npm run build` PASS; `fundingDisplayFormat.test.js` PASS; `ceoOverviewTruthfulness.test.js` PASS; manual visual QA route matrix PASS.

**Next:** C.24.4D — Visual Regression QA after CSS consolidation.

### C.24.4D - Visual Regression QA after CSS consolidation (QA)

**Status:** COMPLETED.

**Baseline:** `56ceb09`.

**Deliverable:** `docs/academy/VISUAL_REGRESSION_QA_REPORT.md`

**Result:** No P0/P1 visual regressions. Navigation stability smoke PASS. M&A / CEO / Funding routes PASS (authenticated E2E). No code fixes required.

**Decision:** Ready for focused product copy cleanup and recording rehearsal (operator production spot-check recommended).

---

## C.14.0B - Update AI Agent Prompt Output Discipline

**Status:** COMPLETED / COPY-PASTE PROMPT OUTPUT DISCIPLINE ADDED.

**Baseline:** `HEAD = origin/main = bf39a05`.

**Scope:** AI operating model and Cursor prompt-discipline rules only.

**Rule added:** When Fernando asks for a prompt, Cursor prompt, master prompt, handoff, PowerShell block, script, final code, execution block, "copy and paste" format, "un único bloque", or "ponmelo todo en un solo texto", the AI must return the main deliverable in one clean code fence.

**Required behavior:**

- Use one complete code fence for the main deliverable.
- Use `text` for prompts, Cursor instructions, handoffs, and generic execution blocks.
- Use `powershell` only for PowerShell command blocks.
- Use the relevant language tag for final code/scripts.
- Do not use fence attributes such as `id="..."`.
- Do not split the prompt across multiple blocks.
- Do not interleave external explanation inside the block.

**Files updated:**

- `.cursorrules`
- `.cursor/rules/ceos-os-prompt-discipline.mdc`
- `docs/ai/AI_OPERATING_MODEL.md`
- `docs/ai/PROMPT_LIBRARY.md`

**Safety:** Docs/rules only. No runtime code, backend, frontend product behavior, tests, Golden Dataset, Formula Registry, package/config, secrets, or data changed.

**Validation:**

- `npm run build` PASS.

---

## C.24.3e - Cross-Branch Visual Coherence & Action Surface Integration Fix

**Status:** COMPLETED / DEMO ACTION SURFACES VISUALLY UNIFIED.

**Baseline:** `HEAD = origin/main = 485565c`.

**Branches reviewed for action-surface coherence:**

- CEO Overview
- Reporting / Board Packs / snapshots / workflow actions
- Funding
- M&A
- Compliance
- Risk
- PMI
- Governance
- Strategy
- Bridge labels/surfaces
- Heritage labels/surfaces

**Action wrapper and surface work completed:**

- Reused existing `workspaceAccent.css` workspace primitives instead of adding another visual layer.
- Softened `.ceos-ws-action-row` so action rows use neutral integrated panel treatment rather than a left-accent sticker edge.
- Softened the shared enterprise table toolbar/footer treatment so table controls sit inside the parent table surface.
- Reduced Reporting snapshot/filter/action wrapper contrast so buttons read as native actions, not separate rectangular overlays.
- Applied the same toolbar integration pattern to Risk and Strategy to keep cross-branch demo surfaces visually consistent.
- Toned Bridge enterprise toolbar borders away from strong accent framing while preserving future/internal/demo boundaries.

**Style cleanup posture:** No new visual system, no new duplicated action style family, no broad selector expansion, no high z-index masking, and no palette/brand redesign were introduced.

**Safety:** No formulas, data, Golden Dataset, Formula Registry, backend, auth/router, package/config, source-of-truth logic, report logic, workflow logic, or product claims changed. N/A and insufficient_data remain visible.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS.

---

## C.24.3f - Cross-Branch Visual Parity Using Approved M&A Surface Pattern

**Status:** COMPLETED / CROSS-BRANCH SURFACES ALIGNED WITH APPROVED M&A PATTERN.

**Baseline:** `HEAD = origin/main = 35d18a7`.

**Approved M&A reference pattern used:**

- Reference surfaces: M&A Current Deal Snapshot, Recommended Next Step, Saved Valuation Snapshot, mini metrics, command items, and action rows.
- Pattern: broad radius, very-low-alpha border, radial + linear dark glass background, softened internal glow, feathered `::before`/`::after` surface overlays, action rows without visible rectangular wrappers, and content isolated above the surface glow.
- Implementation posture: replicated through existing branch classes only; no new visual system, no new `v2`/`sticker-fix` classes.

**Branches corrected:**

- Funding dashboard KPI/panel/flow cards now use the approved integrated surface pattern.
- Compliance dashboard KPI/panel/list/bridge cards now use the approved integrated surface pattern.
- Compliance suppliers, evidence, and reports list/panel/KPI cards now use the same softer surface hierarchy.
- Reporting panels now use the same feathered surface integration while preserving existing table/action logic.
- Risk, PMI, Governance, and Strategy enterprise panels now use the same integrated dark-glass panel treatment.

**Branches reviewed:** Funding, Compliance, Reporting, Risk, PMI, Governance, Strategy, M&A reference surfaces, CEO Overview entry surfaces, Bridge/Heritage future/internal labels.

**Styles reused/consolidated:** Existing module classes were upgraded in place. The M&A-approved surface properties were mirrored into existing branch surfaces; no shared broad selector or parallel visual family was introduced.

**Safety:** No formulas, data, Golden Dataset, Formula Registry, backend, auth/router, package/config, source-of-truth logic, report logic, workflow logic, or product claims changed. N/A and insufficient_data remain visible.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS.

---

## C.24.3g - M&A + Compliance Reports Visual Fix Before Recording

**Status:** COMPLETED / FOCUSED SCREENSHOT-BASED VISUAL QA FIX READY FOR RECORDING REVIEW.

**Baseline:** `HEAD = origin/main = 96fb6e6`.

**Visual reference:** `bf39a05` remains the approved C.24.3f M&A surface-pattern reference.

**Routes reviewed:**

- `/ma/dashboard`
- `/ma/pipeline`
- `/ma/deals` as the repository/archive surface containing "Deal archive at a glance"
- `/compliance/reports`

**M&A fixes:**

- M&A dashboard action rows were corrected so action buttons sit directly on the card surface, without a visible rectangular wrapper behind the buttons.
- Action links keep their real handlers/routes; no fake buttons were introduced.
- M&A pipeline board spacing was compacted by reducing inflated board-shell padding, column minimum height, empty-state minimum height, and section gaps.
- Deals Repository hero overflow and page gap were reduced so the route flows naturally into "Deal archive at a glance" instead of presenting a large dark separation before the archive.

**Compliance Reports fixes:**

- Removed the generic `Card` wrapper from the draft controls, evidence base, and report library sections to reduce the "card inside card" effect.
- Reframed "Report Builder" as "Review controls" and "Generated Reports" as "Board review draft library".
- Replaced dashed placeholder-style empty states with solid, integrated dark-premium empty surfaces.
- Reduced report panel density and softened nested blocks/action rows so draft controls, evidence base, preview posture, and report library read as one product surface.

**Copy audit:**

- Corrected localized Compliance Reports copy: "Generated reports" -> "Report library" / "Board review draft library"; "Report Builder" -> "Review controls"; "Report content" -> "Evidence and review base".
- No visible `This section can house more detail later if the pilot needs` or `Autogenerated short-line based on M&A inputs` strings were found in M&A/Compliance source.
- Deferred for C.24.3h Product Copy Cleanup: cross-branch phrases outside this phase scope including "Enterprise executive layer", "Liquidity & Runway Widget", "Attention classification", and Heritage "Generated reports".

**Safety:** No formulas, Golden Dataset, Formula Registry, backend, auth/router, package/config, source-of-truth logic, report generation contract, or data semantics changed. N/A and insufficient_data remain visible.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 88 files / 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS.

---

## C.24.3g-b — Targeted DOM/Class Visual Fix (M&A, CEO Overview, Compliance)

**Status:** COMPLETED / TARGETED LAYER REMOVAL — REQUIRES OPERATOR VISUAL RE-CHECK BEFORE RECORDING.

**Baseline:** `HEAD = origin/main = c787371` (pre-fix).

**Root causes fixed:**

| Area | Class/wrapper | Fix |
|---|---|---|
| M&A action rows | `.ma-glass-block` inside `.ma-panel` + glass pseudo-layers on nested block | Replaced with `.ma-panel-body` (transparent); removed nested block from premium glass system; flattened `.ma-action-row` / `.ma-hero-actions` link wrappers |
| M&A pipeline | `.ma-pipeline-column { min-height: 270px/280px }` + default stretch | `min-height: 0`, `align-items: start`, compact `.ma-pipeline-empty` (solid border, not dashed) |
| CEO Overview upper frame | `.ceo-hero` + `.ceo-deal-readiness-card` both using `.ceo-glass-branch` | Removed `ceo-glass-branch` from hero and inner readiness cards; inset cards use single soft border, no double glass |
| Compliance Reports builder look | `.report-glass-block` inside `.report-panel` + workspace accent double-surface | Renamed to `.report-panel-note` (transparent); excluded nested metrics from workspace accent bulk rule; softened list shell |

**Files:** `MADashboardPage.jsx`, `DealPipelinePage.jsx`, `ValuationPage.jsx` (action links only), `CEOOverviewPage.jsx`, `ComplianceReportPage.jsx`, scoped `workspaceAccent.css`.

**New classes:** `.ma-panel-body`, `.report-panel-note` only — semantic, module-scoped, replace duplicated inner surfaces.

**Copy:** No mass rewrite. C.24.3h deferred phrases unchanged.

**Validation:** `npm run build` PASS. Full unit/e2e on operator host recommended before external recording.

---

## C.24.3g-c — Runtime Override Visual Fix

**Status:** COMPLETED / RUNTIME OVERRIDE REMOVAL — OPERATOR VISUAL RE-CHECK BEFORE RECORDING.

**Baseline:** `HEAD = origin/main = 29bfc93` (`fix(ui): remove visual layering issues before recording`).

**Overrides that were still winning after C.24.3g-b:**

| Area | File | Selector / class | Previous issue | Fix applied |
|---|---|---|---|---|
| M&A action rows | `src/modules/ma/styles/maExecutiveTheme.css` | `.ma-executive-page :is(.ma-arrow-link, .ma-action-row a)` | Permanent gradient sticker on dashboard botoneras | Action-row links transparent; arrow links keep accent |
| M&A pipeline | `maExecutiveTheme.css`, `executivePolish.css` | `.ma-pipeline-board` stretch; column `min-height: 380px` | Giant empty columns | `align-items: flex-start`; `min-height: 0` |
| CEO hero | `CEOOverviewPage.jsx` | `ceo-glass-branch` on hero | Screen-in-screen double glass | Removed from hero; readiness card accent scoped in `workspaceAccent.css` |
| Compliance Reports | `ComplianceReportPage.jsx`, `workspaceAccent.css` | `.report-panel` + `.report-list-card` shared pseudo layers | Builder / scaffolding look | Flat list cards; lighter panels; list shell unwrapped |

**Routes reviewed (automated smoke + build):** `/ma/dashboard`, `/ma/pipeline`, `/ma/deals`, `/ma/valuation`, `/compliance/reports`, CEO overview route via navigation smoke.

**Validations:** `npm run build` PASS; Playwright `navigation-stability.spec.js` PASS; unit 537/552 (4 sqlite ABI skips on this host).

**No regression:** backend, formulas, Golden Dataset, Formula Registry, package/config, secrets untouched.

---

## C.24.3c - Demo UI Layout Integration Polish

**Status:** COMPLETED / DEMO TABLES AND PANELS VISUALLY INTEGRATED.

**Baseline:** `HEAD = origin/main = 72d69ec`.

**Routes reviewed for layout integration scope:**

- `/dashboard` / `/ceo`
- `/reporting`
- `/reporting/library`
- `/funding/dashboard`
- `/ma/dashboard`
- `/compliance/dashboard`
- `/compliance/suppliers`
- `/compliance/evidence`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

**Layout polish applied:**

- Reduced the opt-in enterprise table shell glow/shadow so tables read as part of their parent panels rather than floating layers.
- Removed sticky/z-index table header behavior from enterprise table headers to avoid visual stacking above surrounding cards.
- Softened enterprise table shell borders/backgrounds while preserving the dark executive workspace theme.
- Integrated Reporting snapshot tables into the shared enterprise table shell.
- Added consistent Reporting panel-to-table spacing and toned table action buttons into the panel surface.

**Safety:** No formulas, Golden Dataset, Formula Registry, backend, auth/router, package/config, base color palette, product calculations, source-of-truth logic, or data rendering semantics changed. N/A and insufficient_data remain visible.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` P2/env: Vite was not running at `http://127.0.0.1:5173`, so navigation smoke could not start.

---

## C.24.3d - Final Cross-Branch Visual Integration & Style Cleanup

**Status:** COMPLETED / CROSS-BRANCH VISUAL INTEGRATION CONSOLIDATED.

**Baseline:** `HEAD = origin/main = bb23788`.

**Branches reviewed for recording-safe layout:**

- CEO Overview
- Reporting / Board Packs / snapshots
- Funding
- M&A
- Compliance
- Risk
- PMI
- Governance
- Strategy
- Bridge labels/surfaces
- Heritage labels/surfaces

**Styles reused/consolidated:**

- Reused existing `workspaceAccent.css` workspace surface and table primitives.
- Consolidated the remaining legacy `.table-wrap` treatment with the softer enterprise table shell from C.24.3c.
- Removed duplicate Compliance report table-header styling.
- Reduced repeated workspace glow/shadow treatment on module KPI cards, enterprise panels, workspace sections, lower-page surfaces, and table panels.
- Softened table header backgrounds across M&A, Funding, Compliance, Risk, PMI, Reporting, and Strategy so headers integrate with parent panels instead of appearing as separate overlay layers.

**Style cleanup posture:** No new visual system, no new broad selector family, no high z-index masking, no absolute-position layout masking, and no palette/brand redesign were introduced.

**Safety:** No formulas, data, Golden Dataset, Formula Registry, backend, auth/router, package/config, source-of-truth logic, report logic, workflow logic, or product claims changed. N/A and insufficient_data remain visible.

**Validation:**

- `npm run build` PASS.
- `npm run test:unit` PASS: 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` P2/env: Vite was not running at `http://127.0.0.1:5173`, so navigation smoke could not start.

---

## C.24.3h — Focused Product Copy Cleanup

**Status:** COMPLETED.

**Baseline:** `2042cc3` (after C.24.4D visual regression QA).

**Scope:** Frontend visible copy in CEO Overview, Funding, Compliance (prior pass), Reporting, Risk, Governance context routes — no visual/CSS/backend/formula changes.

**Removed / rewritten scaffolding copy (examples):**

| Old (visible) | New (visible) | Area |
|---|---|---|
| Enterprise executive layer | Executive operating view | CEO Overview |
| Liquidity & Runway Widget | Liquidity and runway signal | CEO Overview |
| Close the executive release… | Recommended next steps | CEO Overview |
| Attention classification | Executive priorities | CEO Alerts |
| Investor Readiness Pack | Investor readiness review | Funding |
| Board pack builder | Board review draft assembly | Reporting |
| No generated reports yet | No risk briefs prepared yet | Risk |

**Claims reviewed:** No new certified/board-approved/autonomous/legal/investment/marketplace-live claims. Existing “not certified” disclaimers kept.

**Deferred:** `*ExecutiveWidget` component export names; Heritage “Generated reports”; CSS `report-builder-stack` class token.

**Validation:** `npm run build` PASS; funding + CEO truthfulness unit tests PASS (24).

**Next:** C.24.5 recording rehearsal or operator production spot-check before external recording.

---

## C.24.5A — Executive Overviewer Premium Command Center Redesign

**Status:** COMPLETED.

**Baseline:** `00725cc` (`copy(ui): refine enterprise pilot language`).

**Scope:** Targeted redesign of `src/modules/ceo-overview/pages/CEOOverviewPage.jsx` only; no backend, formula, or cross-module branch redesign.

**Structure implemented:**

1. Executive Status (hero)
2. Executive Decision Queue
3. Cross-Module Intelligence Summary
4. Module Readiness Overview
5. Board Review Workflow
6. Executive Briefing Packs

**Sovereign mark strategy:** Reused existing repo asset `src/assets/brand/ceos-os-emblem-lion.webp` as subtle hero watermark (low opacity, non-interactive, does not block content).

**Gold CTA:** Primary CTA styled as premium gold gradient (`Generate Board Review Draft`), secondary dark CTA (`View Executive Briefing`).

**Truthfulness preserved:** DSS language, human review required, board review draft posture, no board-approved/certified/autonomous claims.

**Claims scan:** No unsafe certified/approved/autonomous/procurement/SOC2/ISO claims added in CEO Overview.

**Validation:** `npm run build` PASS; `ceoOverviewTruthfulness.test.js` PASS; `fundingDisplayFormat.test.js` PASS.

**Recording readiness:** Ready for production spot-check + recording rehearsal.

---

## C.24.5A-fix — Executive Overviewer Command Center Composition Fix

**Status:** COMPLETED.

**Baseline:** `fff7874`.

**Root cause:** C.24.5A renamed headers and added gold styling but kept the legacy CEO layout (radar blocks, `ModuleCard` grid, `executive-command-layer`, long vertical dashboard sections).

**Fix:** Replaced page composition with `ExecutiveCommandCenterView.jsx` implementing the real 6-section command center layout and removed legacy JSX from `CEOOverviewPage.jsx` render path.

**Structure:** Executive Status → Decision Queue → Cross-Module Intelligence → Module Readiness → Board Review Workflow → Executive Briefing Packs.

**Validation:** `npm run build` PASS; CEO + funding truthfulness unit tests PASS.

---

## C.24.5A-polish — Executive Overviewer Golden Command Center Polish

**Status:** COMPLETED.

**Baseline:** `fa06cf5`.

**Motivo:** Estructura correcta tras C.24.5A-fix, pero acabado visual aún genérico (CTA cyan por `executivePolish.css`, cards azules, secciones sin marco premium).

**Fix:** Gold CTA overrides scoped; section shells dorados; hero black/gold con watermark más visible; cards charcoal/gold; readiness ring circular; badges/chips dorados; confidence N/A cuando falta dato.

**Validation:** `npm run build` PASS; CEO + funding truthfulness unit tests PASS.

---

## C.24.5A-exec-polish — CEO-Oriented Final Overview Polish

**Status:** COMPLETED.

**Baseline:** `e6cc109`.

**UX decision:** Hero primary metric = **Executive Readiness Index**; radar preserved in Section 04; Unified readiness contextual only.

**Validation:** `npm run build` PASS; truthfulness unit tests PASS.

---

## C.24.5A-radar-polish — Corporate Health Radar Premium Visual Recovery

**Status:** COMPLETED.

**Baseline:** `2a760a8`.

**Fix:** Premium radar 42/58 layout, larger SVG, gold glow, branch legend; N/A excluded from polygon.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-final-polish — Executive Overview Final Premium Polish

**Status:** COMPLETED.

**Baseline:** `773dc94`.

**Fix:** Radar 46/54 + 360px SVG; lighter legend rows; hero black/gold + sovereign seal ring; lion soft-light; warmer charcoal cards.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-hero-integration-fix — Lion Integration and Hero Composition

**Status:** COMPLETED.

**Baseline:** `566e824`.

**Fix:** Lion moved from absolute hero watermark into primary hero block grid (copy + sovereign mark); removed right-side glow behind ERI/priorities panels.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-text-decontainerize — Remove Technical Text Bars / Pills

**Status:** COMPLETED.

**Baseline:** `2aaa20c`.

**Fix:** Lighter hero badges; executive priority list; status as text+dot not pills; softer radar legend; discrete section kickers.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-texture-polish — Executive Overview Technical Bars Cleanup

**Status:** COMPLETED.

**Baseline:** `13374d8`.

**Fix:** Warmer black/gold cards; flat module postures; executive unified-readiness note; softer radar legend rows; priority accent colors.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-logo-integration — New CEO Lion Mark Integration

**Status:** COMPLETED.

**Baseline:** `2a09781`.

**Asset:** `public/brand/ceos-lion-mark.png`.

**Fix:** CEO hero uses clean lion emblem (no branch wheel); legacy `ceos-os-emblem-lion.webp` no longer referenced in hero.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-logo-fix — Replace Wrong CEO Wordmark with Approved Lion Emblem

**Status:** COMPLETED.

**Baseline:** `a3f6af2`.

**Root cause:** `ceos-lion-mark.png` had been populated from wordmark PNG by mistake.

**Fix:** Replaced with approved geometric lion emblem; hero path `/brand/ceos-lion-mark.png` unchanged.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-logo-fix-hard — Approved Lion Mark Hard Replacement

**Status:** COMPLETED.

**Baseline:** `435bcbc`.

**Fix:** Hard hero bind to `/brand/ceos-lion-mark.png?v=20260529-lion`; `.ceo-lion-mark` class; cache-buster for stale wordmark PNG.

**Validation:** build + truthfulness tests PASS.

---

## C.24.5A-lion-blend-fix — Approved Lion Mark Visual Integration Polish

**Status:** COMPLETED.

**Baseline:** `bdb3bbf`.

**Problem:** Hero lion rendered as visible square black PNG box; pasted sticker look; undersized; hero imbalance.

**Fix:** Scoped CSS in `ExecutiveCommandCenterView.jsx` — `mix-blend-mode: lighten` + radial mask to dissolve black rectangle; ~37% size increase (196px → 268px desktop); gold glow via `::before`/`::after` and layered drop-shadow; cache-bust `?v=20260529-blend`; grid column widened for center-right sovereign mark.

**Visual QA:** `/dashboard`, `/ceo/overview` — no black box, premium integrated mark; ERI, Top Priorities, radar, CTA unchanged.

**No-regression:** `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` — layout intact.

**Validation:** build + truthfulness + fundingDisplayFormat tests PASS.

---

## C.24.5A-final-close — Executive Overview Final Visual Close

**Status:** COMPLETED.

**Baseline:** `968eb34`.

**Lion cleanup:** Removed `::after` ring; softer gold-only glow; `mix-blend-mode: screen` + aggressive radial mask; cache-bust `?v=20260529-final`.

**Text integration:** Hero chips lighter; decision/intelligence/module rows de-containerized (hairline separators); workflow steps as left-accent list; posture copy polish (`Insufficient data`, `Executive review needed`).

**Black premium:** Charcoal section shells preserved; navy card overrides excluded from global polish.

**Radar labels:** Branch names on each radar point via SVG `<text class="ceo-radar-point-label">`; legend retained.

**Validation:** build + truthfulness + fundingDisplayFormat tests PASS.

---

## C.24.5A-final-correction-hard — Runtime-targeted final Executive Overview correction

**Status:** COMPLETED (visual-only; lion transparency asset blocker documented).

**Baseline:** `d6c299f`.

**Lion asset check:** `public/brand/ceos-lion-mark.png` — IHDR colorType 2 (RGB), **no alpha channel**; outer corners opaque black. Removed blend/mask CSS camouflage; honest `drop-shadow` only + cache-bust `?v=20260529-integrate`. **Pending:** approved transparent RGBA PNG replacement for full DONE criteria #1–2.

**Runtime targeting report (scoped):** `.ceo-executive-command-page` hero chips, decision queue labels, module posture badges, workflow steps, radar legend rows — de-containerized via hairline separators and transparent card overrides in `executivePolish.css` / `workspaceAccent.css`. Radar panel navy reduced via `.ceo-radar-visual-wrap` charcoal shell.

**Branch colors restored:** New `src/modules/ceo-overview/utils/ceoBranchAccents.js` — hex accents from `WORKSPACE_THEMES` (`workspaceTheme.js`) applied to Module Readiness bars/dots, Corporate Health Radar points/legend, and legacy `CEOOverviewPage` radar axes.

**Radar labels:** Abbreviations (M&A, Comp., Funding, Gov., PMI, Risk, Bridge, Report., Strat., Herit.); expanded SVG viewBox; anchor-aware `<text class="ceo-radar-point-label">`; no truncated labels.

**Typography:** Eyebrow/legend/workflow/status sizes bumped for legibility without oversized UI.

**Visual QA:** `/dashboard`, `/ceo/overview` — black premium, branch accents, radar labels; lion still shows RGB black disc until asset swap.

**No-regression:** `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` — unchanged.

**Validation:** build PASS; `ceoOverviewTruthfulness` 17/17; `fundingDisplayFormat` 7/7.
---

## C.24.5A-final-close-authorized - Executive Overview transparent asset close

**Status:** COMPLETED.

**Baseline:** `b216182`.

**Asset replacement:** Authorized transparent source `public/brand/ceos-lion-mark.png.png` was copied into `public/brand/ceos-lion-mark.png`; the duplicate `png.png` was removed after verification.

**Lion asset check:** final PNG exists, `Format32bppArgb`, alpha channel present, sampled outer background alpha `0,0,0,0,0,0,0,0`, safe for hero use.

**Runtime selector targeting:** `.ceo-command-badge`, `.ceo-command-hero`, `.ceo-command-status-grid`, `.ceo-priorities-card`, `.ceo-priority-item`, `.ceo-decision-card-priority`, `.ceo-module-posture`, `.ceo-module-progress`, `.ceo-radar-visual-wrap`, `.ceo-radar-point-label`, `.ceo-workflow-step`, `.ceo-step-eyebrow`, `.ceo-lion-mark`.

**Fixes:** hero now uses `/brand/ceos-lion-mark.png`; radar point labels no longer duplicate SVG title text; priority labels are text accents, not navy card-like pills; CEO material CSS is imported and scoped to `.ceo-executive-command-page`.

**Branch colors:** existing `WORKSPACE_THEMES` accents remain the source via CEO branch accent utilities; no new palette or score changes.

**Visual QA:** `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` PASS; no ErrorBoundary, no horizontal overflow, no NaN/undefined/Infinity.

**Validation:** build PASS; `ceoOverviewTruthfulness` 17/17; `fundingDisplayFormat` 7/7; unit global PASS (88 files / 557 tests).

---

## C.24.5C - Final Executive Readability & Surface Balance

**Status:** COMPLETED.

**Baseline:** `189614f`.

**Hero balance:** Runtime targeting showed the hero still carried too much dark mass and a tall right rail. CEO-scoped material CSS now tightens the hero shell, strengthens the headline, keeps the transparent lion in the primary command surface, preserves the gold CTA row and keeps Executive Readiness Index plus Top Priorities in the hero.

**Surface/card presence:** Decision Queue, Cross-Module Summary, Module Readiness, Board Review Workflow, Briefing Packs, readiness/priorities and radar surfaces now use warmer charcoal/gold borders, stronger shadows and more readable internal hierarchy without returning to navy SaaS panels.

**Radar improvement:** Option B selected. `CorporateHealthRadar.jsx` now keeps the existing radar values and adds a lightweight branch status list using existing branch colors, score display and N/A for missing inputs. Runtime QA shows labels intact: M&A, Comp., Funding, Gov., PMI, Bridge, Risk, Report., Strategy.

**Typography/readability:** Hero headline, section copy, card bodies, status labels, module scores, workflow text, briefing packs and radar note/list labels were tuned for recording readability while keeping N/A, insufficient_data and DSS/human-review language visible.

**Branch colors:** Existing CEO branch accent utilities remain the color source for radar nodes/labels and Module Readiness bars/dots; no new palette and no score changes.

**Visual QA:** `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` PASS; no ErrorBoundary, no horizontal overflow, no NaN/undefined/Infinity.

**Validation:** build PASS; `ceoOverviewTruthfulness` 17/17; `fundingDisplayFormat` 7/7.

---

---

## C.24.5F - Executive Overview Compliance radar consistency check

**Status:** COMPLETED.

**Baseline:** `ce18cad`.

**Finding:** Module Readiness Compliance could show a local frontend supplier-readiness score such as `4/100` while Corporate Health Radar showed the backend Executive API Compliance branch as `0% Attention`.

**Source analysis:** Module Readiness used `getComplianceOverview()` from local Compliance supplier/evidence/review inputs. Corporate Health Radar preferred `executiveCommand.corporateHealthRadar`, where Compliance is the backend executive legal-health score derived from the latest Compliance audit baseline (`legalHealthScore`). Those were different display sources for the same visible branch.

**Decision:** When a canonical Executive API radar branch exists for Compliance, the Compliance Module Readiness card now aligns its displayed score to that same branch. Local supplier scoring remains fallback-only when no command Compliance branch exists.

**Truthfulness:** Real zero remains displayable when the command Compliance branch is eligible. Pending/insufficient Compliance radar data maps the module card to `N/A` / `Pending inputs`, not fake `0`. Bridge still blocks `100` with `Pending inputs`; Heritage remains `N/A` / `Pending inputs` without invented score.

**Validation:** `npm run build` PASS; `ceoOverviewTruthfulness` 22/22 PASS; `fundingDisplayFormat` 7/7 PASS; `npm run test:unit` PASS (88 files / 562 tests). Playwright route smoke PASS for `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` using a conflict fixture where local Compliance would be `4/100` and command radar Compliance is `0%`.

---

---

## C.24.5E - Executive Overview radar and branch integrity fix

**Status:** COMPLETED.

**Baseline:** `15bc867`.

**Scope:** Executive Overview radar/readiness branch integrity only. No redesign, backend, formulas, Golden Dataset, Formula Registry, package/config, auth/router, migration or cross-module implementation changes.

**Issue corrected:** C.24.5D could display duplicate Executive Overview radar branches when backend axes used canonical keys and fallback axes used legacy aliases (`legal`, `financial`, `ops`, `esg`). Radar merge now canonicalizes aliases before deduping.

**Canonical radar order:** M&A, Funding, Compliance, Risk, PMI, Governance, Strategy, Reporting, Bridge, Heritage.

**Bridge truthfulness:** Bridge no longer displays `100/100` when the underlying posture/status is `Pending inputs` or otherwise insufficient. In that state it remains `N/A` / `Pending inputs`.

**Heritage truthfulness:** Heritage remains visible as an executive branch, but missing/non-calculable inputs stay `N/A` / `Pending inputs`; no fake Heritage score or formula was introduced.

**Validation:** `npm run build` PASS; `ceoOverviewTruthfulness` 20/20 PASS; `fundingDisplayFormat` 7/7 PASS; `npm run test:unit` PASS (88 files / 560 tests). Playwright route smoke PASS for `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard`; `/ceo/overview` checked with duplicate legacy/canonical radar payload and Bridge `100` + `Pending inputs` source data.

---

## C.24.5D - Executive Overview final recording polish with Heritage branch

**Status:** COMPLETED.

**Baseline:** `2ce5a45`.

**Scope:** Executive Overview visual/data-display plumbing only. Module Readiness now shows M&A, Funding, Compliance, Risk, PMI / Synergies, Governance, Strategy, Reporting, Bridge and Heritage using existing branch accent colors.

**Heritage:** Added to Module Readiness and Corporate Health Radar/status list as a visible branch with honest `N/A` / `Pending inputs` handling when no persisted score exists. No Heritage score, formula, backend source, Golden Dataset or Formula Registry output was invented.

**Radar and readability:** Corporate Health Radar keeps calculable values only in the polygon; non-calculable branches remain `N/A`. The branch status list uses clear names and `Pending inputs` consistently. Branch cards received subtle accent rails/washes and stronger readable text without changing the black/gold premium direction.

**Safety:** No backend, auth/router, package/config, migrations, Golden Dataset, Formula Registry, cross-module source-of-truth, report logic or executive formulas changed. `backend-server.err` and screenshots remain untracked-only noise.

**Validation:** `npm run build` PASS; `ceoOverviewTruthfulness` 17/17 PASS; `fundingDisplayFormat` 7/7 PASS; `npm run test:unit` PASS (88 files / 557 tests). Frontend-only route smoke PASS for `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard`; authenticated Playwright navigation smoke blocked by backend API not running on `127.0.0.1:4000`.

---

## C.24.5B - Executive Overview layout and readability pass

**Status:** COMPLETED.

**Baseline:** `ed8a9dc`.

**Hero composition:** runtime measured hero text at 106px wide with 12 headline line fragments and 758px hero height. The CEO material CSS now gives the hero copy 300px, reduces lion footprint to 240px, prevents readiness/priorities stretch, and lowers hero height to 476px.

**Empty space reduction:** readiness/priorities cards no longer stretch to 656px; hero grid is aligned to start; radar and briefing packs use denser, more present spacing without turning into tables.

**Radar labels:** `CorporateHealthRadar.jsx` moves point labels inward (`labelRadius = rMax + 28`). Runtime QA shows all labels visible with no clipping: Legal, M&A, Ops, ESG, Funding, Risk, Strat., Bridge.

**Typography/readability:** Decision Queue, Cross-Module Summary, Module Readiness, Workflow, Briefing Packs and radar labels received CEO-scoped font-size/line-height increases. Micro-status labels remain visible and no longer inherit navy card wrappers.

**Branch colors:** existing workspace accents remain the display source for Module Readiness and Corporate Health Radar; no new palette or data values.

**Visual QA:** `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` PASS; no ErrorBoundary, no overflow, no NaN/undefined/Infinity.

**Validation:** build PASS; `ceoOverviewTruthfulness` 17/17; `fundingDisplayFormat` 7/7.

---

## C.24.5H — Visible premium gold accents and Module Readiness shell correction

**Baseline:** `11da2fa`.

**Problem:** C.24.5G gold too subtle; `.ceo-module-readiness-block` navy bleed from transparent shell over section blue gradient.

**Fix files:** `ceoMaterialSystem.css`, `ExecutiveCommandCenterView.jsx`, `CorporateHealthRadar.jsx`, `executivePolish.css`, `workspaceAccent.css`.

**Outcome:** Visible warm gold on general Executive Overview surfaces; opaque black/gold Module Readiness parent; branch cards unchanged (`--branch-tone`). No logic/backend/formula changes.

---

## C.24.6B — Executive Decision Intelligence MVP

**Status:** COMPLETED.

**Baseline:** `2353cc0` (HEAD = origin/main).

**Scope:** Frontend wiring only — Executive Overview actionable layer from existing executive API sources. No visual redesign; hero, lion, radar visual, branch cards and gold system unchanged.

**Sources wired:**

| Source | Used for | File |
|---|---|---|
| `GET /executive/overview` → `decisionQueue` | Executive Decision Queue — Live | `ExecutiveCommandCenterView.jsx`, `ceoOverviewTruthfulness.js` |
| `alerts` + `signals` | Recommended Actions | same |
| `readiness.missingData` + module postures | Blocked by Missing Inputs | same |
| `boardView` + readiness + board pack `generatedAt` | Board Readiness Summary | same |
| `decisionQueue` / alerts / signals | Executive attention priority rows (real first) | `ceoOverviewTruthfulness.js`, `CEOOverviewPage.jsx` |

**In scope:** Live queue (≤12 items, backend order), recommended actions (3–5), input blockers, board readiness summary, informational fallback for static priority copy.

**Out of scope preserved:** What changed since last review; cost of inaction; synthetic deadlines; real owner assignment; new ranking formula; snapshot diff; backend changes.

**Truthfulness:** N/A / Pending inputs / insufficient_data preserved; no fake 0; no invented owners/deadlines; DSS + Human Review Required; Board Review Draft only; `localStorage` not used as board-pack SoT.

**Tests:** `ceoOverviewTruthfulness` 30/30; `fundingDisplayFormat` 7/7; `npm run build` PASS.

**Visual QA:** `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard` — no hero/radar/branch-card redesign; new compact panels visible in Sections 02, 04, 05.

---

## C.24.6C — Executive Intelligence Layout Compression

**Status:** COMPLETED.

**Baseline:** `0bae8e1`.

**Scope:** Compress and reorder C.24.6B intelligence panels only — no new data, no backend, no hero/radar/branch-card changes.

**Blockers:** Renamed to **Executive Readiness Blockers**; deduplicated one row per module; capped at 6 visible with `+X additional blockers require review`; opaque black/gold compact card (no navy table/grid).

**Board readiness:** Integrated mini-card above workflow steps with status + compact summary lines.

**Tests:** `ceoOverviewTruthfulness` 33/33; `fundingDisplayFormat` 7/7; build PASS.

---

## C.24.6D — Executive Blockers Final Compression & Surface Fix

**Status:** COMPLETED.

**Baseline:** `597339c`.

**Scope:** Blockers surface + compression only; light Board Readiness card polish. No data/backend/formula changes.

**Blockers:** Moved outside `ceo-module-readiness-block` shell; opaque black/gold card; max 4 visible with priority sort; one-line `description · effect`; no Open column; `+X additional blockers require review`.

**Board readiness:** Wider integrated mini-card (720px), gold bullets, clearer status head.

**Tests:** `ceoOverviewTruthfulness` 35/35; build PASS.

---

## C.24.7B — Global Black Premium Surface Token Migration

**Status:** COMPLETED.

**Baseline:** `c684b2c` (HEAD = origin/main).

**Scope:** Token-only migration at design-system root — global navy/blue surfaces → black premium charcoal; branch accent RGB preserved; no logic/backend/formula changes; module JSX inline styles deferred to C.24.7C.

**Tokens migrated:**

| File | Token/selector | Before | After |
|---|---|---|---|
| `src/styles.css` | `--surface` / `--surface-2` / `--surface-3` | `#05070d` / `#070a12` / `#0a0e18` | `#080807` / `#0D0C0A` / `#11100D` |
| `workspaceTheme.js` | `buildTheme()` hero/card gradients | navy tail `rgba(15,23,42)` / `rgba(2,6,23)` | `#050505`→`#080807` / `#0a0908`→`#050504` |
| `workspaceTheme.js` | risk branch override gradients | navy tail | black/charcoal tail |
| `executivePolish.css` | polish surface tokens + M&A enterprise surfaces | navy `rgba(15,23,42)` | `rgba(5,5,5,0.98)` / `rgba(8,7,6,0.92)` |
| `executivePolish.css` | `[class*="block"]` flatten | broad substring navy bleed | removed from flatten selectors |
| `workspaceAccent.css` | `--ws-hero-gradient` / `--ws-card-gradient` defaults | navy tail | black/charcoal tail |
| `workspaceAccent.css` | `.ceos-executive-inner-surface` + `::before` | `rgba(15,23,42)` + blue radial | `#0a0908` charcoal + gold ambient |
| `ExecutiveCommandCenterView.jsx` | blockers/board cards | `ceos-executive-inner-surface` (re-applied navy) | overview-only black/gold classes |

**Branch accents preserved:** all `workspaceTheme.js` branch RGB maps; `--branch-tone`; `getCeoBranchAccentHex()`; compliance blue, funding cyan, risk red progress/chart accents; danger/warning/info/success; gold system.

**CEO Overview fix:** removed `ceos-executive-inner-surface` from blockers and board readiness cards; `ceoMaterialSystem.css` black premium styles apply without blue `::before` bleed.

**Visual smoke routes:** `/dashboard`, `/ceo/overview`, `/ma/dashboard`, `/ma/valuation`, `/funding/dashboard`, `/compliance/dashboard`, `/risk/register`, `/governance/dashboard`, `/pmi/dashboard`, `/reporting/library`, `/login`.

**Tests:** `npm run build` PASS; `ceoOverviewTruthfulness` 35/35; `fundingDisplayFormat` 7/7.

**Remaining C.24.7C:** per-module JSX inline `rgba(15,23,42,…)` navy in module pages (50+ files) — not touched in this phase.

---

## C.24.8 — Executive Copy & Decision Clarity Pass

**Status:** COMPLETED.

**Baseline:** `7aa9450` (HEAD = origin/main).

**Scope:** Copy-only — executive language, deduplication, blocker humanization, board readiness clarity. No visual redesign; hero/radar/branch cards unchanged.

**Copy improvements:**
- `buildExecutiveConclusion()` drives hero headline/subline from readiness + blockers.
- `MODULE_READINESS_NA_CLARIFICATION` in Module Readiness section header.
- Recommended actions deduped from live decision queue; honest fallbacks without deadlines.
- Board readiness: `requiredBeforeDistribution`, status never bare "Ready" when inputs/review pending.
- Static priority rows labeled `· not a scored signal`.

**Deduplication:** Intelligence "Board Review Draft" card → "Input gaps"; recommended actions skip queue duplicates; section descriptions clarify non-overlap.

**Blockers humanized:** per-branch executive copy (funding, risk, compliance, governance, etc.) — missing data ≠ performance failure.

**Tests:** `ceoOverviewTruthfulness` 41/41; `fundingDisplayFormat` 7/7; build PASS.

---

## C.24.8B — Executive Action Deduplication Pass

**Status:** COMPLETED.

**Baseline:** `f1886bc` (HEAD = origin/main).

**Scope:** Recommended Actions deduplication only — no hero/radar/module readiness/board workflow/branch card changes.

**Deduplication rules:**
- Cap at 5 executive recommended actions; one primary action per module.
- Priority: critical/high → real `recommendedAction` → compliance/pmi/risk → grouped pending signals last.
- Multiple `signal not available` rows collapse to one `Pending module signals` item.
- Compliance appears at most once in Recommended Actions; Decision Queue retains detail.
- Fallback copy: `Review source module before board circulation.` / `Complete source inputs before board circulation.` (no repeated `Open module` rows).

**Files:** `ceoOverviewTruthfulness.js`, `ceoOverviewTruthfulness.test.js`.

**Tests:** build PASS; `ceoOverviewTruthfulness` 47/47; `fundingDisplayFormat` 7/7.

---

## C.24.8C — Final Executive Copy Deduplication & Closing Pass

**Status:** COMPLETED.

**Baseline:** `d20ac2b` (HEAD = origin/main).

**Scope:** Final copy/dedup closure — hero attention, recommended actions (3+1), board readiness bullets, CTA microcopy. No visual redesign.

**Changes:**
- Hero Executive Attention: max 3 unique modules; no Compliance duplicate; removed recommended-actions bleed into hero.
- Recommended Actions: cap 3 main + 1 grouped pending; `Review Executive` → `Review readiness blockers`.
- CTAs: `Open module` → `Review source module` in decision intelligence panels.
- Board Readiness Summary: bullet list only (no duplicated joined subtitle).

**Tests:** build PASS; `ceoOverviewTruthfulness` 49/49; `fundingDisplayFormat` 7/7.

---

## C.24.9 — CEO Overview Final Demo Release Candidate

**Status:** COMPLETED.

**Baseline:** `dcea74f` (HEAD = origin/main).

**Scope:** Final demo/video readiness — executive clarity, board distribution decision, suggested owners (labeled), blocker human copy, dedup audit. No visual redesign.

**Final improvements:**
- Hero conclusion unchanged (truthfulness-safe executive summary).
- Recommended Actions: 3 main + 1 pending group; `Review PMI`; `Suggested owner:` labels on module actions.
- Board Readiness: `Board distribution: Not ready` + required-before-distribution bullets.
- Blockers: CEO human copy; N/A clarification once in Module Readiness.
- Cross-Module Focus Area deduped from Compliance when PMI alerts exist.

**Tests:** build PASS; `ceoOverviewTruthfulness` 51/51; `fundingDisplayFormat` 7/7.

**Next:** production spot-check + recording rehearsal.

---

## C.24.10B — Buttons & Provenance Demo Safety Fix

**Status:** COMPLETED.

**Baseline:** `ad1f779`.

**Demo safety fixes:**
- Briefing Packs: status-only microcopy on every card; section header clarifies not downloadable.
- BoardPackModal: `Print draft preview` + browser print hint; null metrics → N/A (no fake 0).
- Board review draft status: session `generatedAt` preferred over localStorage trace (`Previous draft trace`).
- Generate Board Review Draft: disabled hint for non-admin/board_member roles.

**Tests:** build PASS; `ceoOverviewTruthfulness` 54/54; `boardPackModalDisplay` 3/3; `fundingDisplayFormat` 7/7.

**Next:** production spot-check + recording rehearsal.

---

## C.24.10C — Board Review Draft Print Preview Demo Safety Fix

**Status:** COMPLETED.

**Baseline:** `a903550` (C.24.10B).

**Print preview fixes:**
- Scoped `@media print` CSS on `BoardPackModal`: `board-pack-print-root` visibility technique hides app shell/sidebar/topbar/backdrop/buttons.
- Print-only draft banner: decision support, human review required, not board-approved.
- White A4-friendly layout; dark text; section page-break avoidance.
- Button remains `Print draft preview`; hint: browser print, draft only, layout may vary by browser.
- No certified PDF; no server-side PDF renderer.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); `ceoOverviewTruthfulness`; build + `fundingDisplayFormat`.

**Manual print QA:** Generate Board Review Draft → Print draft preview → confirm draft-only content, no shell/buttons.

**Next:** production spot-check + recording rehearsal; defer print click during recording if browser layout still varies.

---

## C.24.11 — Premium Board Review Draft Print Renderer

**Status:** COMPLETED.

**Baseline:** `aca9d79` (C.24.10D blank print fix).

**Renderer:** Premium HTML/CSS layout in `BoardPackModal.jsx` — black/gold executive header with CEO's OS lion emblem, draft badges, grouped metric cards, execution profile, readiness/risk summary, briefing pack status, softened recommendations, legal footer.

**Print:** Browser print only via `runBoardPackPrintPreview()` + `printing-board-pack` body class. No server-side PDF. `print-color-adjust: exact` for premium backgrounds where supported.

**Truthfulness:** Draft-only · Human review required · Not certified · Not board-approved · Status only · N/A preserved · No Export PDF claim.

**No changes:** backend, formulas, Golden Dataset, Formula Registry.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); `ceoOverviewTruthfulness`; `fundingDisplayFormat`; build.

**Manual print QA:** Generate Board Review Draft → Print draft preview → confirm premium layout, no blank page, no app shell.

**Next:** production spot-check + recording rehearsal.

---

## C.24.11B — Premium Board Review Draft Print Layout Polish

**Status:** COMPLETED.

**Baseline:** `a549430` (C.24.11).

**Print polish:** Two-page print structure (`board-pack-print-page-1/2`), gold-bordered `board-pack-print-document`, compact 4-column metric grids, `@page` A4 `8mm` margin, `print-color-adjust: exact`, black/gold tokens. Execution Profile hidden in print (screen-only); metrics compacted to target 2–3 pages.

**Browser limitation:** App cannot remove browser print headers/footers — documented in `BOARD_PACK_PRINT_CLEAN_OUTPUT_HINT` and demo guides. Disable browser headers and footers in print dialog for clean recording/export.

**Truthfulness:** Draft-only, decision support, human review, not certified, not board-approved preserved. Recommendations further softened.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); build; `ceoOverviewTruthfulness`; `fundingDisplayFormat`.

**Next:** production spot-check + recording rehearsal; future dedicated PDF renderer if browser print remains insufficient.

---

## C.24.11C — Board Review Draft Final Print Polish

**Status:** COMPLETED.

**Baseline:** `8c4a4dc` (C.24.11B).

**Fixes:** Print CSS now hides real app chrome (`ceos-main-build-strip`, build strip tagline/actions, logout, topbar). Page 2 flex layout fills A4 with footer anchored; font/card sizes increased for demo legibility while keeping 2-page target.

**Browser limitation:** Disable browser headers/footers in print dialog for clean recording — app cannot remove them via CSS.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); build; `ceoOverviewTruthfulness`; `fundingDisplayFormat`.

**Next:** production spot-check + recording rehearsal.

---

## C.24.11D — Board Review Draft Pagination Balance Fix

**Status:** COMPLETED.

**Baseline:** `914d5e5` (C.24.11C).

**Fixes:** Removed hard `page-break-after` on page 1 wrapper that stranded Execution Metrics on page 2. Execution Metrics moved into page 1 flow. Intentional `break-before: page` on Governance / Bridge / Heritage section. Page 2 flex layout without forced `min-height: 272mm`; footer anchored with `margin-top: auto`. Compact 5-column Execution Metrics grid on page 1.

**Preserved:** Browser print only; draft-only/human review/not certified copy; no backend/PDF server-side; no formula or score changes; app chrome hidden from print.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); build; `ceoOverviewTruthfulness`; `fundingDisplayFormat`.

**Next:** final production spot-check + recording rehearsal.

---

## C.24.11D — Board Review Draft Pagination Balance Fix

**Status:** COMPLETED.

**Baseline:** `914d5e5` (C.24.11C).

**Fixes:** Removed hard `page-break-after` on page 1 wrapper that stranded Execution Metrics on page 2. Execution Metrics moved into page 1 flow. Intentional `break-before: page` on Governance / Bridge / Heritage section. Page 2 flex layout without forced `min-height: 272mm`; footer anchored with `margin-top: auto`. Compact 5-column Execution Metrics grid on page 1.

**Preserved:** Browser print only; draft-only/human review/not certified copy; no backend/PDF server-side; no formula or score changes; app chrome hidden from print.

**Tests:** `boardPackModalDisplay` (ceo-overview + reporting); build; `ceoOverviewTruthfulness`; `fundingDisplayFormat`.

**Next:** final production spot-check + recording rehearsal.
