import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';

test('recovers from invalid JSON with the provided example @level-2', async ({ page }) => {
  await page.goto('/tools/json');
  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill('{"missing": }');
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(
    page.getByText('Check commas, quotes, and brackets.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Example' }).click();
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(page.getByLabel('JSON output editor')).toContainText('"project": "Dev Toolbox"');
});

test('sorts keys and reports an ordinary save failure @level-2', async ({ page }) => {
  await mockRunSave(page, { status: 500 });
  await page.goto('/tools/json');
  await page.getByRole('textbox', { name: 'JSON input', exact: true }).fill('{"z":1,"a":2}');
  await page.getByLabel('Sort keys:').check();
  await page.getByRole('button', { name: 'Format' }).click();

  await expect(page.getByLabel('JSON output editor')).toContainText('"a": 2');
  await page.getByRole('button', { name: 'Save Run' }).click();
  await expect(page.getByText('Unable to save run.', { exact: true })).toBeVisible();
});
