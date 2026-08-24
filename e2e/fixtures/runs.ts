import type { Page } from '@playwright/test';

type SaveRunOptions = {
  status?: number;
};

export async function mockRunSave(page: Page, { status = 201 }: SaveRunOptions = {}) {
  await page.route('**/api/runs', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      body: JSON.stringify(status >= 400 ? { error: 'Save failed' } : { id: 'e2e-run' }),
      contentType: 'application/json',
      status,
    });
  });
}
