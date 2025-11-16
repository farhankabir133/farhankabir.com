import { test, expect } from '@playwright/test';

test('chatbot returns a reply', async ({ page }) => {
  await page.goto('/');

  // Try a quick fetch to the API endpoint directly from the page context.
  const res = await page.request.post('/api/chat', {
    data: { message: 'Playwright test: hello' },
  });

  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json).toHaveProperty('response');
  // Basic sanity: response should be a non-empty string
  expect(typeof json.response).toBe('string');
  expect(json.response.length).toBeGreaterThan(0);
});
