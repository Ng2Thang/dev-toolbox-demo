import { expect, test } from '@playwright/test';

import { uuidPatterns } from '../helpers/uuid';

test('generates 100 unique UUIDs at the supported quantity boundary @level-3', async ({ page }) => {
  await page.goto('/tools/uuid');
  await page.getByLabel('Quantity').fill('100');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();

  const generatedUuids = page.locator('.uuid-list code');
  await expect(generatedUuids).toHaveCount(100);
  await expect(generatedUuids.first()).toHaveText(uuidPatterns.v4);

  const values = await generatedUuids.allTextContents();
  expect(new Set(values).size).toBe(100);
});
