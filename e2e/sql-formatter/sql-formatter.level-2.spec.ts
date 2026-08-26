import { expect, test } from '@playwright/test';

test('shows an empty-input error and recovers after correction @level-2', async ({ page }) => {
  await page.goto('/tools/sql-formatter');
  const formatter = page.getByRole('region', { name: 'SQL Formatter' });
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Format SQL' }).click();
  await expect(formatter.getByRole('alert')).toContainText('Enter SQL to format and validate.');

  await page.getByRole('textbox', { name: 'Input SQL' }).fill('select id from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();
  await expect(page.getByText('Valid PostgreSQL syntax')).toBeVisible();
});

test('preserves valid output after malformed SQL and then recovers @level-2', async ({ page }) => {
  await page.goto('/tools/sql-formatter');
  const formatter = page.getByRole('region', { name: 'SQL Formatter' });
  const input = page.getByRole('textbox', { name: 'Input SQL' });
  await input.fill('select id from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();
  await input.fill('select id from from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();

  await expect(formatter.getByRole('alert')).toContainText('Previous valid output is preserved.');
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('SELECT');

  await input.fill('select name from users');
  await page.getByRole('button', { name: 'Format SQL' }).click();
  await expect(formatter.getByRole('alert')).toHaveCount(0);
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('name');
});

test('switches dialect, casing, indentation, and clears the result @level-2', async ({ page }) => {
  await page.goto('/tools/sql-formatter');
  await page.getByLabel('SQL dialect').selectOption('mysql');
  await page.getByRole('button', { name: 'Lowercase' }).click();
  await page.getByLabel('Indentation').selectOption('4');
  await page.getByRole('textbox', { name: 'Input SQL' }).fill('SELECT id FROM users');
  await page.getByRole('button', { name: 'Format SQL' }).click();

  await expect(page.getByText('Valid MySQL syntax')).toBeVisible();
  await expect(page.getByLabel('Formatted SQL editor')).toContainText('select');
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByRole('textbox', { name: 'Input SQL' })).toHaveValue('');
  await expect(page.getByText('Your formatted SQL will appear here.')).toBeVisible();
});
