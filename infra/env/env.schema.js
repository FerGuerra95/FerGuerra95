export const envSchema = {
  NODE_ENV: ['development', 'test', 'staging', 'production'],
  PORT: 'number',

  AUTH_SECRET: 'string:min:32',
  DB_PATH: 'string',
  SQLITE_PATH: 'string:optional',
  SQLITE_DB_PATH: 'string:optional',

  PUBLIC_APP_URL: 'url',
  FRONTEND_URL: 'url',
  CORS_ORIGIN: 'csv:url',
  CORS_ORIGINS: 'csv:url',

  BOOTSTRAP_ADMIN_EMAIL: 'email:optional',
  BOOTSTRAP_ADMIN_PASSWORD: 'string:optional',
  BOOTSTRAP_ADMIN_ID: 'string:optional',
  BOOTSTRAP_ADMIN_NAME: 'string:optional',
  BOOTSTRAP_ORGANIZATION_ID: 'string:optional',
  BOOTSTRAP_USERS_JSON: 'json:array:optional',

  VITE_PUBLIC_DEMO_MODE: 'boolean:optional',
  VITE_ENABLE_MA_LOCAL_FALLBACK: 'boolean:optional',

  LOG_LEVEL: ['debug', 'info', 'warn', 'error']
};
