import type { NextApiHandler } from 'next';
import Cors from 'cors';

import { runMiddleware } from '../../../../lib/runMiddleware';
import { authenticate } from '../auth';
import { getDB, salarySchema } from '../../../../lib/lowWithLodash';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

type SalaryPostResult = { ok: true } | { error?: string };

const handler: NextApiHandler<SalaryPostResult> = async (req, res) => {
  await runMiddleware(req, res, cors);
  const authResult = await authenticate(req);
  if (!authResult) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  const parseResult = await salarySchema.safeParseAsync(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const db = getDB();
  db.get('salaries').push(parseResult.data).write();
  res.status(200).json({ ok: true });
};

export default handler;
