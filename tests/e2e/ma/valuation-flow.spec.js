import { test, expect } from '@playwright/test';

test('flujo M&A básico', async ({ page }) => {
  await page.goto('/ma/dashboard');
  await expect(page).toHaveURL(/\/ma/);
});
