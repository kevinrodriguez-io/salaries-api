import { test, expect } from '@playwright/test';
import { createMocks } from 'node-mocks-http';
import createSalary from '../pages/api/v1/salary/index';
import deleteSalary from '../pages/api/v1/salary/[name]';
import getSummaryStatistics from '../pages/api/v1/salary/summary-statistics';
import auth from '../pages/api/v1/auth/index';

test('POST /api/v1/salary: should return 200', async () => {
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'POST',
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    body: {
      name: 'Test',
      salary: 145_000,
      currency: 'USD',
      department: 'Engineering',
      sub_department: 'Platform',
    },
  });
  await createSalary(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
});

test('DELETE /api/v1/salary/Test: should return 200', async () => {
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'DELETE',
    query: { name: 'Test' },
    headers: { authorization: `Bearer ${jwt}` },
  });
  await deleteSalary(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
});

test('GET /api/v1/salary/summary-statistics: should return 200', async () => {
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'GET',
    headers: { authorization: `Bearer ${jwt}` },
  });
  await getSummaryStatistics(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
  const { min, max, mean } = JSON.parse(res._getData());
  expect(min).toBe(30);
  expect(max).toBe(200_000_000);
  expect(mean).toBe(22_295_010);
});

test('GET /api/v1/salary/summary-statistics?onContract=true: should return 200', async () => {
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'GET',
    query: { onContract: true },
    headers: { authorization: `Bearer ${jwt}` },
  });
  await getSummaryStatistics(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
  const { min, max, mean } = JSON.parse(res._getData());
  expect(min).toBe(90_000);
  expect(max).toBe(110_000);
  expect(mean).toBe(100_000);
});

test('GET /api/v1/salary/summary-statistics?allDepartments=true: should return 200', async () => {
  const allDepartmentsResponse = {
    Engineering: { min: 30, max: 200000000, mean: 40099006 },
    Banking: { min: 90000, max: 90000, mean: 90000 },
    Operations: { min: 30, max: 70000, mean: 35015 },
    Administration: { min: 30, max: 30, mean: 30 },
  };
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'GET',
    query: { allDepartments: true },
    headers: { authorization: `Bearer ${jwt}` },
  });
  await getSummaryStatistics(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
  const response = JSON.parse(res._getData());
  expect(response).toEqual(allDepartmentsResponse);
});

test('GET /api/v1/salary/summary-statistics?allDepartments=true&allSubdepartments=true: should return 200', async () => {
  const snapshottedResponse = {
    Engineering: {
      Platform: {
        min: 30,
        max: 200000000,
        mean: 40099006,
      },
    },
    Banking: {
      Loan: {
        min: 90000,
        max: 90000,
        mean: 90000,
      },
    },
    Operations: {
      CustomerOnboarding: {
        min: 30,
        max: 70000,
        mean: 35015,
      },
    },
    Administration: {
      Agriculture: {
        min: 30,
        max: 30,
        mean: 30,
      },
    },
  };
  const authMocks = createMocks({
    method: 'POST',
    body: { email: '_@kevinrodriguez.io', password: 'Test2423' },
  });
  await auth(authMocks.req as any, authMocks.res as any);
  const data = authMocks.res._getData();
  const { jwt } = JSON.parse(data);
  const { req, res } = createMocks({
    method: 'GET',
    query: { allDepartments: true, allSubdepartments: true },
    headers: { authorization: `Bearer ${jwt}` },
  });
  await getSummaryStatistics(req as any, res as any);
  expect(res._getStatusCode()).toBe(200);
  const response = JSON.parse(res._getData());
  expect(response).toEqual(snapshottedResponse);
});
