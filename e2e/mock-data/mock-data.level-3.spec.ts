import { expect, test } from '@playwright/test';

test('keeps Vietnamese seeded output reproducible in the browser (Unicode resilience) @level-3', async ({
  page,
}) => {
  await page.goto('/tools/mock-data');
  await page.getByLabel('Locale').selectOption('vi');
  await page.getByRole('button', { name: 'Generate data' }).click();
  const first = await page.locator('pre').textContent();
  await page.getByRole('button', { name: 'Generate data' }).click();
  await expect(page.locator('pre')).toHaveText(first ?? '');
});
test('keeps output visible when clipboard is unavailable (browser capability resilience) @level-3', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }),
  );
  await page.goto('/tools/mock-data');
  await page.getByRole('button', { name: 'Generate data' }).click();
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(
    page.getByText('Clipboard access is unavailable in this browser.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('/placeholders/avatars/profile-01.svg')).toBeVisible();
});
