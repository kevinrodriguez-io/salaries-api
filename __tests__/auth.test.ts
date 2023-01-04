import { test, expect } from '@playwright/test';
import { createMocks } from 'node-mocks-http';
import auth from '../pages/api/v1/auth/index';

test('POST /api/v1/auth: should return 200', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
});
