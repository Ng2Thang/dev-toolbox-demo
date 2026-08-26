import { expect, test } from '@playwright/test';

test('round-trips Unicode text in the browser @level-3', async ({ page }) => {
  await page.goto('/tools/base64');
  const input = 'Xin chào 👋 — café';
  await page.getByRole('textbox', { name: 'Input' }).fill(input);
  await page.getByRole('button', { name: 'Encode Base64' }).click();
  await page.getByRole('button', { name: 'Swap' }).click();
  await page.getByRole('button', { name: 'Decode Base64' }).click();

  await expect(page.getByLabel('Base64 output editor')).toContainText(input);
});

test('reports unavailable clipboard access without losing the converted output @level-3', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });
  await page.goto('/tools/base64');
  await page.getByRole('textbox', { name: 'Input' }).fill('Hello');
  await page.getByRole('button', { name: 'Encode Base64' }).click();
  await page.getByRole('button', { name: 'Copy output' }).click();

  await expect(
    page.getByText('Clipboard access is unavailable in this browser.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Base64 output editor')).toContainText('SGVsbG8=');
});
