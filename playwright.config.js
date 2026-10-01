import { defineConfig, devices } from '@playwright/test';

import {
  allocateIsolatedE2ePort,
  applyTestEnvironment,
  assertSafeE2eTarget,
  createIsolatedTestEnvironment
} from './scripts/lib/test-isolation.mjs';

const configuredExternalBaseUrl = String(process.env.CEOS_BASE_URL || '').trim();
const useExternalApp = Boolean(configuredExternalBaseUrl);
let managedIsolation = null;

if (!useExternalApp) {
  managedIsolation = createIsolatedTestEnvironment({
    label: 'playwright-managed'
  });
  applyTestEnvironment(managedIsolation.environment);

  const backendPort = await allocateIsolatedE2ePort();
  const frontendPort = await allocateIsolatedE2ePort({
    avoid: [backendPort]
  });

  process.env.PORT = String(backendPort);
  process.env.CEOS_E2E_FRONTEND_PORT = String(frontendPort);
  process.env.CEOS_BASE_URL = `http://127.0.0.1:${frontendPort}`;
  process.env.CEOS_API_BASE_URL = `http://127.0.0.1:${backendPort}/api`;
  process.env.CEOS_E2E = 'true';
  process.env.CEOS_TEST_CLEANUP_OWNER = 'server';
  process.env.CEOS_E2E_TARGET_ISOLATED = '1';
  process.env.CEOS_E2E_TARGET_RUN_ID = managedIsolation.runId;
  process.env.CEOS_E2E_USER =
    process.env.CEOS_E2E_USER || 'admin@ceoos.local';
  process.env.CEOS_E2E_PASSWORD =
    process.env.CEOS_E2E_PASSWORD || 'admin123';
  process.env.BOOTSTRAP_ADMIN_EMAIL = '';
  process.env.BOOTSTRAP_ADMIN_PASSWORD = '';
  process.env.BOOTSTRAP_USERS_JSON = '';
}

const baseURL = process.env.CEOS_BASE_URL;
const apiBaseURL = process.env.CEOS_API_BASE_URL;
assertSafeE2eTarget({
  baseUrl: baseURL,
  apiBaseUrl: apiBaseURL,
  env: process.env
});

const configuredWorkers = Number(
  process.env.CEOS_E2E_WORKERS || process.env.PLAYWRIGHT_WORKERS || 1
);
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
  workers:
    Number.isFinite(configuredWorkers) && configuredWorkers > 0
      ? Math.floor(configuredWorkers)
      : 1,
  expect: {
    timeout: 10_000
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  globalTeardown: managedIsolation
    ? './tests/e2e/global-teardown.mjs'
    : undefined,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects,
  webServer: managedIsolation
    ? {
        command: 'node ./scripts/e2e-playwright-server.mjs',
        env: process.env,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000
      }
    : undefined
});
