import { expect, test } from '@playwright/test';

test('switches units and reports invalid timestamp input @level-2', async ({ page }) => {
  await page.goto('/tools/timestamp');
  await page.getByLabel('Unix timestamp').fill('1000');
  await page.getByLabel('Input unit').selectOption('milliseconds');
  await page.getByRole('button', { name: 'Convert' }).click();

  await expect(page.getByText('UTC: 1970-01-01T00:00:01.000Z')).toBeVisible();

  await page.getByLabel('Unix timestamp').fill('not-a-timestamp');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(
    page.getByText('Enter a valid numeric Unix timestamp.', { exact: true }),
  ).toBeVisible();
});

test('resets a completed conversion when current time is selected @level-2', async ({ page }) => {
  await page.goto('/tools/timestamp');
  await page.getByLabel('Unix timestamp').fill('0');
  await page.getByRole('button', { name: 'Convert' }).click();
  await page.getByRole('button', { name: 'Use current time' }).click();

  await expect(page.getByText('Converted date', { exact: true })).not.toBeVisible();
  await expect(page.getByLabel('Unix timestamp')).not.toHaveValue('0');
});
