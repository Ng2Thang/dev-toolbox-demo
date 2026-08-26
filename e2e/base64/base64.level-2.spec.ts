import { expect, test } from '@playwright/test';

test('recovers from malformed Base64 without replacing the previous output @level-2', async ({
  page,
}) => {
  await page.goto('/tools/base64');
  await page.getByRole('textbox', { name: 'Input' }).fill('Hello');
  await page.getByRole('button', { name: 'Encode Base64' }).click();
  await expect(page.getByLabel('Base64 output editor')).toContainText('SGVsbG8=');

  await page.getByRole('button', { name: 'Switch to Decode mode' }).click();
  await page.getByRole('textbox', { name: 'Input' }).fill('not base64!');
  await page.getByRole('button', { name: 'Decode Base64' }).click();

  await expect(
    page.getByText('Enter valid Base64 characters and padding.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Base64 output editor')).toContainText('SGVsbG8=');

  await page.getByRole('textbox', { name: 'Input' }).fill('SGVsbG8=');
  await page.getByRole('button', { name: 'Decode Base64' }).click();
  await expect(page.getByLabel('Base64 output editor')).toContainText('Hello');
});

test('swaps a result into input and recovers the original text @level-2', async ({ page }) => {
  await page.goto('/tools/base64');
  await page.getByRole('textbox', { name: 'Input' }).fill('Hello');
  await page.getByRole('button', { name: 'Encode Base64' }).click();
  await page.getByRole('button', { name: 'Swap' }).click();

  await expect(page.getByRole('textbox', { name: 'Input' })).toHaveValue('SGVsbG8=');
  await page.getByRole('button', { name: 'Decode Base64' }).click();
  await expect(page.getByLabel('Base64 output editor')).toContainText('Hello');
});

test('clears the local workspace after a successful conversion @level-2', async ({ page }) => {
  await page.goto('/tools/base64');
  await page.getByRole('textbox', { name: 'Input' }).fill('Hello');
  await page.getByRole('button', { name: 'Encode Base64' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(page.getByRole('textbox', { name: 'Input' })).toHaveValue('');
  await expect(page.getByLabel('Base64 output editor')).toContainText(
    'Converted output will appear here.',
  );
});
