import { test, expect } from '@playwright/test';
import { loginAsDemoAdmin } from '../helpers/auth.js';

test('flujo de revision de alertas compliance', async ({ page }) => {
  await loginAsDemoAdmin(page);

  await page.goto('/compliance/reviews');
  await expect(page).toHaveURL(/\/compliance/);
});
