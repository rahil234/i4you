import type { CookieOptions, Response } from 'express';
import { env } from '@/config';

export const setRefreshCookie = (res: Response, token: string) => {
  const isProd =
    env.NODE_ENV === 'production' ||
    env.NODE_ENV === 'staging' ||
    env.NODE_ENV === 'test';

  console.log(`\n\n\nisProd: ${isProd}\n\n\n`);

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    domain: "localhost",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('refreshToken', token, options);
};
