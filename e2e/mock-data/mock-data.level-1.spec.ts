import { expect, test } from '@playwright/test';

test('generates user profiles and copies JSON @level-1', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    }),
  );
  await page.goto('/tools/mock-data');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await expect(page.getByText('/placeholders/avatars/profile-01.svg')).toBeVisible();
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByRole('status')).toHaveText('Copied to clipboard.');
});
test('generates lorem ipsum sentences @level-1', async ({ page }) => {
  await page.goto('/tools/mock-data');
  await page.getByLabel('Output type').selectOption('lorem-ipsum');
  await page.getByLabel('Text unit').selectOption('sentences');
  await page.getByLabel('Quantity').fill('2');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await expect(
    page.getByText('sentences · English · Seed 20260826', { exact: false }),
  ).toBeVisible();
});
