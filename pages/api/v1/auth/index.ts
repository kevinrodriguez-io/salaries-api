import type { NextApiHandler } from 'next';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { signJwt } from '../../../../lib/jwt';

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

const handler: NextApiHandler<SignInResponse> = async (req, res) => {
  // Validate request body
  const { email, password } = await schema.parseAsync(req.body);

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

  const keysDir = path.join(process.cwd(), '.keys');
  const privateKey = await fs.readFile(
    path.join(keysDir, 'private.pem'),
    'utf-8',
  );

  const jwt = await signJwt(jwtPayload, privateKey);

  res.status(200).json({ jwt });
};

export default handler;
