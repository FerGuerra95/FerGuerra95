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
