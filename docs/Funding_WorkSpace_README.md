# Funding workspace patch

> **HISTORICAL RECORD — NOT CURRENT AUTHORITY.** This dated status/audit/closure is retained for provenance. Current execution truth is `docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md`; verified current source/runtime evidence wins.

Este paquete añade el tercer workspace visible de la plataforma:

- Funding Dashboard
- Investor Readiness
- Capital Structure
- Fundraising Scenarios
- Data Room

## Qué incluye

- `src/modules/funding/*`
- actualización de `routeConfig.jsx`
- actualización de `routes.jsx`
- actualización de `Sidebar.jsx`
- actualización de `WorkspaceSwitcher.jsx`

## Cómo integrarlo

1. Copia los archivos sobre tu proyecto actual.
2. Ejecuta `npm.cmd run dev`.
3. Comprueba que aparece el workspace **Funding** en el switcher superior.
4. Valida rutas:
   - `/funding/dashboard`
   - `/funding/readiness`
   - `/funding/capital-structure`
   - `/funding/scenarios`
   - `/funding/data-room`
