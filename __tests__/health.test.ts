import { createMocks } from 'node-mocks-http';
import health from '../pages/api/v1/health';

describe('/api/v1/health', () => {
  test('should return 200', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await health(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe('{"ok":true}');
  });
});
