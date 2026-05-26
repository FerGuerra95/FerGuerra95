import { test, expect } from '@playwright/test';

import { loginAsDemoAdmin } from '../helpers/auth.js';

const ERROR_BOUNDARY_PATTERN = /Algo salió mal|Something went wrong/i;
const CRITICAL_CONSOLE_PATTERN =
  /(Cannot read properties of null|Cannot read properties of undefined|Uncaught Error|Maximum update depth exceeded)/i;

const NAV_CYCLE = [
  {
    key: 'overview',
    url: /\/dashboard/,
    heading: /Executive|Command Center|CEO/i
  },
  {
    key: 'reporting',
    url: /\/reporting\/dashboard/,
    heading: /Board packs and executive reporting/i
  },
  {
    key: 'ma',
    url: /\/ma\/dashboard/,
    heading: /M&A/i
  },
  {
    key: 'compliance',
    url: /\/compliance\/dashboard/,
    heading: /Compliance/i
  },
  {
    key: 'funding',
    url: /\/funding\/dashboard/,
    heading: /Funding/i
  },
  {
    key: 'risk',
    url: /\/risk\/dashboard/,
    heading: /Risk command center/i
  },
  {
    key: 'pmi',
    url: /\/pmi\/dashboard/,
    heading: /PMI|integration/i
  },
  {
    key: 'governance',
    url: /\/governance\/dashboard/,
    heading: /Governance/i
  },
  {
    key: 'strategy',
    url: /\/strategy\/dashboard/,
    heading: /Strategic execution command center/i
  }
];

async function selectWorkspace(page, key) {
  const item = page.getByTestId(`workspace-rail-item-${key}`);
  await item.scrollIntoViewIfNeeded();
  await item.click();
}

async function assertHealthyShell(page, routeLabel) {
  await expect(page.getByText(ERROR_BOUNDARY_PATTERN)).toHaveCount(0);
  await expect(page.locator('.app-shell')).toBeVisible();
  await expect(page.getByTestId('workspace-rail')).toBeVisible();
  await expect(page).not.toHaveURL(/\/login/);
}

test.describe('Navigation stability smoke', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (error) => {
      throw new Error(`pageerror on navigation smoke: ${error.message}\n${error.stack || ''}`);
    });

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (!CRITICAL_CONSOLE_PATTERN.test(text)) return;
      throw new Error(`console error on navigation smoke: ${text}`);
    });
  });

  test('survives repeated workspace navigation without ErrorBoundary latch', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsDemoAdmin(page);

    for (let cycle = 0; cycle < 3; cycle += 1) {
      for (const step of NAV_CYCLE) {
        await selectWorkspace(page, step.key);
        await expect(page).toHaveURL(step.url);
        await expect(page.getByRole('heading', { name: step.heading }).first()).toBeVisible();
        await assertHealthyShell(page, `${step.key} cycle ${cycle + 1}`);
      }

      await page.goto('/reporting/board-pack', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/reporting\/board-pack/);
      await expect(
        page.getByRole('heading', { name: /Board pack builder/i })
      ).toBeVisible();
      await assertHealthyShell(page, `reporting-board-pack cycle ${cycle + 1}`);

      await selectWorkspace(page, 'overview');
      await expect(page).toHaveURL(/\/dashboard/);
      await assertHealthyShell(page, `overview-return cycle ${cycle + 1}`);
    }
  });
});
