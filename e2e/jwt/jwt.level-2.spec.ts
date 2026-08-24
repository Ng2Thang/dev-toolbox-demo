import { expect, test } from '@playwright/test';

import { validJwt } from '../helpers/jwt';

test('clears a decoded JWT and reports malformed input @level-2', async ({ page }) => {
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill(validJwt);
  await page.getByRole('button', { name: 'Decode token' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(page.getByLabel('JWT token')).toHaveValue('');
  await expect(page.getByText('Decoded header and payload will appear here.')).toBeVisible();

  await page.getByLabel('JWT token').fill('only.two');
  await page.getByRole('button', { name: 'Decode token' }).click();
  await expect(
    page.getByText('Invalid JWT format. Expected three dot-separated segments.'),
  ).toBeVisible();
});

test('rejects an invalid base64url segment without calling the save API @level-2', async ({
  page,
}) => {
  let savedRuns = 0;
  await page.route('**/api/runs', async (route) => {
    savedRuns += 1;
    await route.fulfill({ status: 201 });
  });
  await page.goto('/tools/jwt');
  await page.getByLabel('JWT token').fill('%%%.eyJzdWIiOiIxIn0.signature');
  await page.getByRole('button', { name: 'Decode token' }).click();

  await expect(
    page.getByText('JWT contains an invalid Base64URL segment.', { exact: true }),
  ).toBeVisible();
  expect(savedRuns).toBe(0);
});
