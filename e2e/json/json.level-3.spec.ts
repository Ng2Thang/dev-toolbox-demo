import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';

test('retains Unicode input when a save request fails @level-3', async ({ page }) => {
  await mockRunSave(page, { status: 500 });
  await page.goto('/tools/json');

  const input = '{"message":"Xin chào 👋","lines":["one","two"]}';
  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill(input);
  await page.getByRole('button', { name: 'Format' }).click();
  await page.getByRole('button', { name: 'Save Run' }).click();

  await expect(page.getByText('Unable to save run.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'JSON input', exact: true })).toHaveValue(input);
});

test('formats a large deterministic payload without losing entries @level-3', async ({ page }) => {
  await page.goto('/tools/json');
  const input = JSON.stringify({ entries: Array.from({ length: 200 }, (_, index) => ({ index })) });

  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill(input);
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(page.getByLabel('JSON output editor')).toContainText('"index": 199');
});
