import { expect, test } from '@playwright/test';

test('home page renders the headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Obsidian', level: 1 })).toBeVisible();
});

test('health endpoint responds with ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
});
