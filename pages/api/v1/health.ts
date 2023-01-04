import type { NextApiHandler } from 'next';
import Cors from 'cors';

import { runMiddleware } from '../../../lib/runMiddleware';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

type Response = {
  running: boolean;
};

const handler: NextApiHandler<Response> = async (req, res) => {
  await runMiddleware(req, res, cors);
  res.status(200).json({ running: true });
};

export default handler;
