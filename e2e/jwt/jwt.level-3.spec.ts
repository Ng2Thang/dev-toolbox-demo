import { expect, test } from '@playwright/test';

import { mockRunSave } from '../fixtures/runs';
import { createJwt, validJwt } from '../helpers/jwt';

test('keeps decoded claims visible when saving fails @level-3', async ({ page }) => {
  await mockRunSave(page, { status: 500 });
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill(validJwt);
  await page.getByRole('button', { name: 'Decode token' }).click();
  await page.getByRole('button', { name: 'Save run' }).click();

  await expect(page.getByText('Unable to save run.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Decoded JWT payload')).toContainText('"role": "developer"');
});

test('decodes a large Unicode claim payload without a server request @level-3', async ({
  page,
}) => {
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill(createJwt({ name: 'Nguyễn 👋', note: 'x'.repeat(4096) }));
  await page.getByRole('button', { name: 'Decode token' }).click();

  await expect(page.getByLabel('Decoded JWT payload')).toContainText('Nguyễn 👋');
});
