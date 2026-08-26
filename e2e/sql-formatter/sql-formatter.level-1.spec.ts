import { expect, test } from '@playwright/test';

test('formats PostgreSQL and copies the result @level-1', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.goto('/tools/sql-formatter');
  await page.getByRole('textbox', { name: 'Input SQL' }).fill('select id,name from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();

  await expect(page.getByLabel('Formatted SQL editor')).toContainText('SELECT');
  await expect(page.getByText('Valid PostgreSQL syntax')).toBeVisible();
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByText('Copied to clipboard', { exact: true })).toBeVisible();
});

test('formats a SQL Server query with lowercase keywords @level-1', async ({ page }) => {
  await page.goto('/tools/sql-formatter');
  await page.getByLabel('SQL dialect').selectOption('sqlserver');
  await page.getByRole('button', { name: 'Lowercase' }).click();
  await page.getByRole('textbox', { name: 'Input SQL' }).fill('SELECT TOP 5 id FROM users');
  await page.getByRole('button', { name: 'Format SQL' }).click();

  await expect(page.getByLabel('Formatted SQL editor')).toContainText('select top 5');
  await expect(page.getByText('Valid SQL Server syntax')).toBeVisible();
});
