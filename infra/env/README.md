# env/

Contiene la referencia de configuracion del proyecto.

- `.env.example`: plantilla local y de despliegue.
- `env.schema.js`: contrato de variables esperadas.
- `loadEnv.js`: cargador simple para herramientas locales.

Notas enterprise:

- `AUTH_SECRET` debe tener al menos 32 caracteres en produccion.
- `DB_PATH` debe apuntar a almacenamiento persistente en produccion.
- `VITE_PUBLIC_DEMO_MODE` debe estar apagado salvo demo privada.
- `VITE_ENABLE_MA_LOCAL_FALLBACK` no debe estar activo en produccion.

## CI local

- `npm run ci` ejecuta build, presupuesto de bundle, tests unitarios e integracion, E2E Playwright, axe (`npm run test:a11y`), Lighthouse accesibilidad y Lighthouse rendimiento/buenas practicas (`npm run test:lighthouse:perf`).
- En GitHub Actions el job `quality` ejecuta ademas `npm audit --audit-level=critical` tras `npm ci`.
- `npm run check:bundle-budget` valida limites gzip del bundle en `dist/assets` (se incluye en `npm run quality`).
- Tras cambiar CSS o assets del frontend, ejecuta `npm run build` antes de `npm run test:lighthouse`: Lighthouse usa `vite preview` sobre `dist/` y solo refleja el ultimo build.
- En GitHub Actions el job E2E define `CEOS_E2E_USER` / `CEOS_E2E_PASSWORD` al usuario demo del backend (`admin@ceoos.local` / `admin123` en entorno de desarrollo); en local puedes usar `.env` o las mismas variables.
