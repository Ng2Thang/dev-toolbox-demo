import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';

test('retains an epoch result when save persistence is unavailable @level-3', async ({ page }) => {
  await mockRunSave(page, { status: 500 });
  await page.goto('/tools/timestamp');
  await page.getByLabel('Unix timestamp').fill('-1');
  await page.getByRole('button', { name: 'Convert' }).click();
  await page.getByRole('button', { name: 'Save run' }).click();

  await expect(page.getByText('Unable to save run.', { exact: true })).toBeVisible();
  await expect(page.getByText('UTC: 1969-12-31T23:59:59.000Z')).toBeVisible();
});

test('rejects an out-of-range timestamp without producing a result @level-3', async ({ page }) => {
  await page.goto('/tools/timestamp');
  await page.getByLabel('Unix timestamp').fill('1e309');
  await page.getByRole('button', { name: 'Convert' }).click();

  await expect(
    page.getByText('Enter a valid numeric Unix timestamp.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Converted date', { exact: true })).not.toBeVisible();
});
