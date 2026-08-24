import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';
import { validJwt } from '../helpers/jwt';

test('decodes a valid JWT payload in the browser @level-1', async ({ page }) => {
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill(validJwt);
  await page.getByRole('button', { name: 'Decode token' }).click();

  await expect(page.getByLabel('Decoded JWT header')).toContainText('"alg": "none"');
  await expect(page.getByLabel('Decoded JWT payload')).toContainText('"sub": "e2e-test"');
});

test('saves a successfully decoded JWT run @level-1', async ({ page }) => {
  await mockRunSave(page);
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill(validJwt);
  await page.getByRole('button', { name: 'Decode token' }).click();
  await page.getByRole('button', { name: 'Save run' }).click();

  await expect(page.getByRole('status')).toHaveText('Run saved to history.');
});
