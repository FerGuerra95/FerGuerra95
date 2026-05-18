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
