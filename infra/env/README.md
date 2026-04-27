# env/

Contiene la configuración base del proyecto:

- `.env.example`: plantilla de variables necesarias.
- `env.schema.js`: referencia de tipos y valores esperados.
- `loadEnv.js`: cargador simple para entornos locales.

En producción conviene sustituir esto por un sistema robusto de validación y secretos.
