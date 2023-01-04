import type { NextApiHandler } from 'next';
import Cors from 'cors';

import { runMiddleware } from '../../../lib/runMiddleware';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

type HealthResponse = {
  ok: boolean;
};

const handler: NextApiHandler<HealthResponse> = async (req, res) => {
  await runMiddleware(req, res, cors);
  res.status(200).json({ ok: true });
};

export default handler;
