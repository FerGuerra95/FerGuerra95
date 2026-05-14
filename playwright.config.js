import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.CEOS_BASE_URL || 'http://127.0.0.1:5173';
const useExternalApp = Boolean(process.env.CEOS_BASE_URL);
const useManagedWebServer =
  !useExternalApp && process.env.CEOS_PLAYWRIGHT_MANAGED_SERVER === '1';
const configuredWorkers = Number(
  process.env.CEOS_E2E_WORKERS || process.env.PLAYWRIGHT_WORKERS || 1
);

if (!useExternalApp) {
  process.env.CEOS_E2E = process.env.CEOS_E2E || 'true';
}

const reuseDevServers = process.env.CEOS_REUSE_DEV_SERVER === '1';

/**
 * Cuando Playwright arranca backend+Vite, el servidor hace `dotenv.config()` y
 * rellenaria BOOTSTRAP_* desde .env si esas claves no existen en process.env.
 * Eso dejaba la API sin DEMO_USERS y rompia login e2e (401). Fijamos claves
 * vacias y NODE_ENV aqui para que dotenv no las sobreescriba desde fichero.
 */
const webServerEnv = useExternalApp
  ? process.env
  : {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
      BOOTSTRAP_ADMIN_EMAIL: process.env.BOOTSTRAP_ADMIN_EMAIL || '',
      BOOTSTRAP_ADMIN_PASSWORD: process.env.BOOTSTRAP_ADMIN_PASSWORD || '',
      BOOTSTRAP_USERS_JSON: process.env.BOOTSTRAP_USERS_JSON || '',
      CEOS_E2E: process.env.CEOS_E2E || 'true'
    };

const extraBrowsers = process.env.CEOS_PLAYWRIGHT_EXTRA_BROWSERS === '1';

const projects = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome']
    }
  }
];

if (extraBrowsers) {
  projects.push(
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    }
  );
}

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  timeout: 60_000,
  workers: Number.isFinite(configuredWorkers) && configuredWorkers > 0
    ? Math.floor(configuredWorkers)
    : 1,
  expect: {
    timeout: 10_000
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects,
  webServer: useManagedWebServer
    ? {
        command: 'node ./scripts/e2e-playwright-server.mjs',
        env: webServerEnv,
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: reuseDevServers,
        timeout: 120_000
      }
    : undefined
});
