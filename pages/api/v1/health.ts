import type { NextApiHandler } from 'next';

type Response = {
  running: boolean;
};

const handler: NextApiHandler<Response> = (_req, res) => {
  res.status(200).json({ running: true });
};

export default handler;
