import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';

test('formats valid JSON and saves the completed run @level-1', async ({ page }) => {
  await mockRunSave(page);
  await page.goto('/tools/json');

  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill('{"z":3,"a":1}');
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(page.getByLabel('JSON output editor')).toContainText('"z": 3');
  await page.getByRole('button', { name: 'Save Run' }).click();
  await expect(page.getByRole('status')).toHaveText('Successfully formatted and saved.');
});

test('formats an array with the selected indentation @level-1', async ({ page }) => {
  await page.goto('/tools/json');
  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill('[{"id":1},{"id":2}]');
  await page.getByRole('button', { name: '4 Spaces' }).click();
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(page.getByLabel('JSON output editor')).toContainText('    "id": 1');
});
