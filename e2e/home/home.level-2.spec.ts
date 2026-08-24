import { expect, test } from '@playwright/test';

test('keeps shared navigation available on the home route @level-2', async ({ page }) => {
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });

  await expect(navigation.getByRole('link', { name: /JWT Decoder/ })).toHaveAttribute(
    'href',
    '/tools/jwt',
  );
  await expect(navigation.getByRole('link', { name: /Saved runs/ })).toHaveAttribute(
    'href',
    '/history',
  );
});
