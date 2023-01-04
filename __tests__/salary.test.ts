import { createMocks } from 'node-mocks-http';
import createSalary from '../pages/api/v1/salary/index';

describe('/api/v1/salary', () => {
  test('should return 200', async () => {
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
});
