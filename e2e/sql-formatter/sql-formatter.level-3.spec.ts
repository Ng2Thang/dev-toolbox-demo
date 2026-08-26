import { expect, test } from '@playwright/test';

test('keeps Unicode and CRLF content intact @level-3', async ({ page }) => {
  await page.goto('/tools/sql-formatter');
  await page
    .getByRole('textbox', { name: 'Input SQL' })
    .fill('select "tên", \'Xin chào 👋\' as message\r\nfrom "người_dùng"');
  await page.getByRole('button', { name: 'Format SQL' }).click();

  await expect(page.getByLabel('Formatted SQL editor')).toContainText('tên');
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('Xin chào 👋');
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('người_dùng');
});

test('reports unavailable clipboard access without losing formatted output @level-3', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });
  await page.goto('/tools/sql-formatter');
  const formatter = page.getByRole('region', { name: 'SQL Formatter' });
  await page.getByRole('textbox', { name: 'Input SQL' }).fill('select id from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();
  await page.getByRole('button', { name: 'Copy' }).click();

  await expect(formatter.getByRole('alert')).toContainText(
    'Clipboard access is unavailable in this browser.',
  );
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('SELECT');
});
