import { expect, test } from '@playwright/test';

test('encodes text as standard Base64 and copies the result @level-1', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.goto('/tools/base64');
  await page.getByRole('textbox', { name: 'Input' }).fill('Hello, Dev Toolbox!');
  await page.getByRole('button', { name: 'Encode Base64' }).click();

  await expect(page.getByLabel('Base64 output editor')).toContainText(
    'SGVsbG8sIERldiBUb29sYm94IQ==',
  );
  await page.getByRole('button', { name: 'Copy output' }).click();
  await expect(page.getByRole('status')).toHaveText('Copied to clipboard.');
});

test('encodes URL-sensitive text with the URL-safe variant @level-1', async ({ page }) => {
  await page.goto('/tools/base64');
  await page.getByRole('button', { name: 'Select URL-safe Base64' }).click();
  await page.getByRole('textbox', { name: 'Input' }).fill('???');
  await page.getByRole('button', { name: 'Encode Base64' }).click();

  await expect(page.getByLabel('Base64 output editor')).toContainText('Pz8_');
});
