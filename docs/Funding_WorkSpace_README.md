# Funding workspace patch

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
