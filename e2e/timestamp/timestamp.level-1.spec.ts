import { expect, test } from '@playwright/test';

test('converts a Unix timestamp to an unambiguous UTC result @level-1', async ({ page }) => {
  await page.goto('/tools/timestamp');
  await page.getByLabel('Unix timestamp').fill('0');
  await page.getByRole('button', { name: 'Convert' }).click();

  await expect(page.getByText('UTC: 1970-01-01T00:00:00.000Z')).toBeVisible();
  await expect(page.getByText('Unix seconds: 0')).toBeVisible();
});

test('converts a selected local date back to an epoch value @level-1', async ({ page }) => {
  await page.goto('/tools/timestamp');
  await page.getByLabel('Date to timestamp').check();
  await page.getByLabel('Local date and time').fill('2024-01-02T03:04');
  await page.getByRole('button', { name: 'Convert' }).click();

  await expect(page.getByText(/Unix milliseconds: \d+/)).toBeVisible();
});
