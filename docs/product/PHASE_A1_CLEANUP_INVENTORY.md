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
| C.13 | Pendiente | Logic Integrity — decisión fórmula Compliance + fixes (C.13.1C-f1B+) |
| C.14 | Pendiente | Informe final Logic Integrity / Legacy / Duplicidades |

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
| C13-P1-03 | Funding FE `localStorage` vs backend API | `fundingStore.jsx`, `fundingApi.js`, `FUNDING_STORAGE_KEYS` | Duplicidad source-of-truth escenarios/drafts |
| C13-P1-04 | Compliance weighted risk mismatch | Golden 0.4/0.4/0.2 **no implementado**; ver C.13.1C | **OPEN** — pendiente decisión f1B |
| C13-P1-05 | Compliance resilience mismatch | Golden `100-risk+bonus` ≠ motor FE `base 72…` | **OPEN** — pendiente decisión f1B |
| C13-P1-06 | Compliance FE recalcula `riskScore` vs BE persistido | `useComplianceEngine.js` pisa API | **OPEN** — pendiente decisión f1B |
| C13-P1-07 | Bridge priority mismatch | Golden `bridge_priority_score_basic`; `calculateSignalPriority` en `bridge.service.js` | Señales DSS mal priorizadas |
| C13-P1-08 | Risk score mismatch | Golden `risk_score_likelihood_impact_basic` (likelihood×impact); `riskScoreFrom` en `risk.service.js` | Register/heatmap incoherente con oráculo |
| C13-P1-09 | PMI `mergeWithDemo` mezcla demo siempre | `pmiStore.jsx` `mergeWithDemo` + `DEMO_PMI_CASE` | Demo contamina casos reales |
| C13-P1-10 | PMI zero forecast devuelve `0` vs golden `null` | `pmi.service.js` `synergyCaptureRatio` cuando target≤0 | Edge case golden `pmi_synergy_zero_forecast` |
| C13-P1-11 | M&A EV simple (EBITDA×multiple) source unclear | Golden `ma_valuation_ebitda_multiple_basic`; FE principal `valuationFormulas.js` = DCF/core | Oráculo simple sin ancla clara |
| C13-P1-12 | M&A waterfall simple source unclear | Golden `ma_waterfall_simple_distribution`; sin helper `netCashToSeller` localizado en `src/modules/ma` | Proceeds seller no verificables vs golden |

### 6. P2

| ID | Hallazgo | Nota |
|---|---|---|
| C13-P2-01 | Bridge marketplace ruta viva demo unlisted | `/bridge/marketplace` en `routes.jsx`; no en sidebar; `DEMO_BRIDGE_*` fallback |
| C13-P2-02 | Bridge service acoplado a 8+ módulos | `bridge.service.js` imports cross-module summaries |
| C13-P2-03 | Executive Overview aggregator, no master SoT | `executiveOverview.service.js`, `readinessIndex.service.js` |
| C13-P2-04 | Reporting variance source unclear | Sin implementación `varianceAmount` localizada en `backend/services/reporting` |
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
| `bridge_priority_score_basic` | **mismatch** | `calculateSignalPriority` distinto |
| `risk_score_likelihood_impact_basic` | **mismatch** | `riskScoreFrom` distinto |
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
| C13-P1-03 | Pendiente — FE `localStorage` vs backend API (no abordado en esta subfase) |

### 10. Siguiente paso recomendado (post C.13.1C)

**C.13.1C-f1B** — Compliance scoring Formula Decision / Source-of-Truth docs.

**No** tests ni fix hasta decisión documental A/B/C (ver C.13.1C).

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
| Tests implementation vs `compliance_weighted_*` | **GAP — no existen** |

### 8. Issues C.13.0 — estado post auditoría

| ID | Hallazgo | Estado |
|---|---|---|
| C13-P1-04 | Weighted risk golden sin implementación | **OPEN** — requiere decisión f1B |
| C13-P1-05 | Resilience golden ≠ motor FE | **OPEN** — requiere decisión f1B |
| C13-P1-06 | FE recalcula y oculta scores persistidos BE | **OPEN** — requiere decisión f1B |

**P0:** ninguno confirmado en esta subfase (scoring).

### 9. Product truthfulness

- La UI muestra `riskScore` / `resilienceScore` como si fueran únicos, pero en dashboard son **scores calculados en cliente**, no necesariamente los persistidos en SQLite.
- Golden oracle **no valida** el motor operativo actual en CI.
- Riesgo de confundir **tres conceptos** bajo nombres similares: `weightedRiskScore`, `operationalRiskScore` (FE), `resilienceScore` (dos fórmulas posibles).

### 10. Decisión pendiente (A / B / C) — NO implementada

| Opción | Descripción | Implicación |
|---|---|---|
| **A) Golden manda** | Implementar helper weighted 3 dimensiones + resilience golden | Nuevo código + tests golden; posible rename métricas |
| **B) Motor operativo FE manda** | Golden/registry = modelo pedagógico simplificado, no oracle del motor actual | Actualizar golden o registry con revisión humana |
| **C) Híbrido (recomendación auditoría)** | Separar métricas: weighted (informes/oracle), operational (UI DSS), persistido (BE); resolver C13-P1-06 con etiquetas y/o persist-on-save | Docs f1B + fix acotado en dos fases |

**Condición para avanzar:** decisión documental explícita en **C.13.1C-f1B** antes de tests de implementación o controlled fix.

### 11. Archivos clave (referencia lectura)

- `docs/testing/golden_inputs.json` — datasets compliance
- `src/modules/compliance/engine/complianceScoring.js`
- `src/modules/compliance/engine/resilienceScore.js`
- `src/modules/compliance/engine/useComplianceEngine.js`
- `backend/services/compliance/suppliers.service.js`
- `src/modules/compliance/services/suppliersApi.js`

### 12. Siguiente paso

**C.13.1C-f1B** — Formula Decision / Source-of-Truth en `FORMULA_REGISTRY.md` + `SOURCE_OF_TRUTH_REGISTRY.md` (y/o inventario).

**Prohibido hasta f1B:** C.13.1C-f2 tests implementation, C.13.1C-f3 controlled fix.

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
