import type { NextApiHandler } from 'next';
import Cors from 'cors';

import { runMiddleware } from '../../../../lib/runMiddleware';
import { authenticate } from '../auth';
import { getDB } from '../../../../lib/lowWithLodash';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'DELETE'],
});

type SalaryDeleteResult = { ok: true } | { error?: string };

const handler: NextApiHandler<SalaryDeleteResult> = async (req, res) => {
  await runMiddleware(req, res, cors);
  const authResult = await authenticate(req);
  if (!authResult) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  const name = req.query.name as string;
  const db = getDB();
  const item = db
    .get('salaries')
    .remove((salary) => salary.name === name)
    .write();
  if (!item) {
    res.status(404).json({ error: 'NOT_FOUND' });
    return;
  }
  res.status(200).json({ ok: true });
};

export default handler;
