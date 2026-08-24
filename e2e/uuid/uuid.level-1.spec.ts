import { expect, test } from '@playwright/test';

import { uuidPatterns } from '../helpers/uuid';

test('generates the requested number of v4 UUIDs @level-1', async ({ page }) => {
  await page.goto('/tools/uuid');
  await page.getByLabel('Quantity').fill('2');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();

  const generatedUuids = page.locator('.uuid-list code');
  await expect(generatedUuids).toHaveCount(2);
  await expect(generatedUuids.first()).toHaveText(uuidPatterns.v4);
});

test('generates valid v1 and v7 UUIDs from the selected versions @level-1', async ({ page }) => {
  await page.goto('/tools/uuid');

  for (const [version, pattern] of [
    ['v1', uuidPatterns.v1],
    ['v7', uuidPatterns.v7],
  ] as const) {
    await page.getByRole('button', { name: version }).click();
    await page.getByRole('button', { name: 'Generate UUIDs' }).click();
    await expect(page.locator('.uuid-list code').first()).toHaveText(pattern);
  }
});
