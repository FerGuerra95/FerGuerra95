import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.CEOS_BASE_URL || 'http://127.0.0.1:5173';
const useExternalApp = Boolean(process.env.CEOS_BASE_URL);
const configuredWorkers = Number(
  process.env.CEOS_E2E_WORKERS || process.env.PLAYWRIGHT_WORKERS || 1
);

if (!useExternalApp) {
  process.env.CEOS_E2E = process.env.CEOS_E2E || 'true';
}

const webServerEnv = {
  ...process.env,
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
  webServer: useExternalApp
    ? undefined
    : [
        {
          command: 'npm run server',
          env: webServerEnv,
          url: 'http://127.0.0.1:4000/health',
          reuseExistingServer: true,
          timeout: 120_000
        },
        {
          command: 'npm run dev -- --host 127.0.0.1 --port 5173',
          env: webServerEnv,
          url: 'http://127.0.0.1:5173',
          reuseExistingServer: true,
          timeout: 120_000
        }
      ]
});
