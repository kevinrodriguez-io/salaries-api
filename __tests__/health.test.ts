import { test, expect } from '@playwright/test';
import { createMocks } from 'node-mocks-http';
import health from '../pages/api/v1/health';

test('GET /api/v1/health: should return 200', async () => {
  const { req, res } = createMocks({ method: 'GET' });
  await health(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
  expect(res._getData()).toBe('{"ok":true}');
});
