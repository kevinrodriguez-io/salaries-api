import type { NextApiHandler, NextApiRequest } from 'next';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import Cors from 'cors';

import { signJwt, verifyJwt } from '../../../../lib/jwt';
import { runMiddleware } from '../../../../lib/runMiddleware';

const keysDir = path.join(process.cwd(), '.keys');

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInResponse = {
  jwt?: any;
  error?: string;
};

// TODO: Check credentials in a proper database.
const checkCredentials = async (email: string, password: string) => {
  return email === '_@kevinrodriguez.io' && password === 'Test2423';
};

export const authenticate = async (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return false;
  }
  const [authType, jwt] = authHeader.split(' ');
  if (authType !== 'Bearer') {
    return false;
  }
  if (!jwt) {
    return false;
  }
  const publicKey = await fs.readFile(
    path.join(keysDir, 'public.pem'),
    'utf-8',
  );
  return verifyJwt(jwt, publicKey);
};

const handler: NextApiHandler<SignInResponse> = async (req, res) => {
  await runMiddleware(req, res, cors);
  try {
    const parseResult = await schema.safeParseAsync(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'INVALID_REQUEST' });
      return;
    }
    const {
      data: { email, password },
    } = parseResult;

    if (!checkCredentials(email, password)) {
      res.status(401).json({ error: 'INVALID_CREDENTIALS' });
      return;
    }

    const jwtPayload = {
      sub: email,
      name: email,
      email: email,
      aud: 'urn:clipboard-health',
      iss: 'http://localhost:3000',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };

    const privateKey = await fs.readFile(
      path.join(keysDir, 'private.pem'),
      'utf-8',
    );

    const jwt = await signJwt(jwtPayload, privateKey);

    res.status(200).json({ jwt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};

export default handler;
