import { test, expect } from '@playwright/test';

test('flujo de revisión de alertas compliance', async ({ page }) => {
  await page.goto('/compliance/reviews');
  await expect(page).toHaveURL(/\/compliance/);
});
