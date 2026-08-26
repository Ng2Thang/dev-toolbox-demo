import { expect, test } from '@playwright/test';

test('shows invalid quantity feedback and preserves generated records @level-2', async ({
  page,
}) => {
  await page.goto('/tools/mock-data');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await page.getByLabel('Quantity').fill('0');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await expect(
    page.getByText('Enter a whole number from 1 to 100.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('/placeholders/avatars/profile-01.svg')).toBeVisible();
});
test('switches structured output to CSV @level-2', async ({ page }) => {
  await page.goto('/tools/mock-data');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await page.getByRole('button', { name: 'CSV' }).click();
  await expect(page.locator('pre')).toContainText('id,status,createdAt');
});
test('clears generated output @level-2', async ({ page }) => {
  await page.goto('/tools/mock-data');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByText('Generated content will appear here.')).toBeVisible();
});
