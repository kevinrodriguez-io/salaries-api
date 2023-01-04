import { test, expect } from '@playwright/test';
import { createMocks } from 'node-mocks-http';
import createSalary from '../pages/api/v1/salary/index';

test('/api/v1/salary: should return 200', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      name: 'Test',
      salary: 145_000,
      currency: 'USD',
      department: 'Engineering',
      sub_department: 'Platform',
    },
  });
  await createSalary(req, res);
  expect(res._getStatusCode()).toBe(200);
});
