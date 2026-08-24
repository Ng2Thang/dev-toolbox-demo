import { expect, test } from '@playwright/test';

import { uuidPatterns } from '../helpers/uuid';

test('switches UUID versions and preserves results after invalid quantity input @level-2', async ({
  page,
}) => {
  await page.goto('/tools/uuid');
  await page.getByRole('button', { name: 'v7' }).click();
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();

  const generatedUuid = page.locator('.uuid-list code').first();
  await expect(generatedUuid).toHaveText(uuidPatterns.v7);

  const valueBeforeInvalidInput = await generatedUuid.textContent();
  await page.getByLabel('Quantity').fill('101');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();

  await expect(
    page.getByText('Enter a whole number from 1 to 100.', { exact: true }),
  ).toBeVisible();
  await expect(generatedUuid).toHaveText(valueBeforeInvalidInput ?? '');
});

test('clears generated UUIDs and can regenerate them @level-2', async ({ page }) => {
  await page.goto('/tools/uuid');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(page.getByText('No UUIDs yet')).toBeVisible();
  await page.getByRole('button', { name: 'Regenerate' }).click();
  await expect(page.locator('.uuid-list code')).toHaveCount(1);
});
