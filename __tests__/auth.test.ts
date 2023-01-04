import { test, expect } from '@playwright/test';
import { createMocks } from 'node-mocks-http';
import auth from '../pages/api/v1/auth/index';

test('/api/v1/auth: should return 200', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(req, res);
  expect(res._getStatusCode()).toBe(200);
});
