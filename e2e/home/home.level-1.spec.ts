import { expect, test } from '@playwright/test';

test('opens every registered tool from the home catalogue @level-1', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Developer tools that just work.' }),
  ).toBeVisible();

  for (const [name, href] of [
    ['JWT Decoder', '/tools/jwt'],
    ['JSON Formatter', '/tools/json'],
    ['Unix Timestamp', '/tools/timestamp'],
    ['UUID Generator', '/tools/uuid'],
  ]) {
    const toolLink = page.locator('.popular-grid').getByRole('link', { name: new RegExp(name) });

    await expect(toolLink).toHaveAttribute('href', href);
  }
});
