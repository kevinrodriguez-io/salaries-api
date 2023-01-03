import jwt from 'jsonwebtoken';

export type JWTPayload = {
  sub: string;
  name: string;
  email: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
};

export const signJwt = (payload: JWTPayload, privateKey: string) =>
  new Promise<string | undefined>((res, rej) => {
    jwt.sign(
      payload,
      privateKey,
      {
        algorithm: 'RS256',
        keyid: 'YVA5BYBQ0SgTzE_2sWKFGx4-FQanewOqvU734oynfP8',
      },
      (err, token) => {
        if (err) {
          rej(err);
        } else {
          res(token);
        }
      },
    );
  });
