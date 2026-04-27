import { test, expect } from '@playwright/test';

test('flujo de proveedores compliance', async ({ page }) => {
  await page.goto('/compliance/suppliers');
  await expect(page).toHaveURL(/\/compliance/);
});
