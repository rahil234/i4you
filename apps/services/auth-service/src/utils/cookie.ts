import type { CookieOptions, Response } from 'express';
import { env } from '@/config';

export const setAccessCookie = (res: Response, token: string) => {
  const isProd =
    env.NODE_ENV === 'production' ||
    env.NODE_ENV === 'staging' ||
    env.NODE_ENV === 'test';

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    domain: 'i4you.local.net',
    maxAge: 15 * 60 * 1000,
  };

  res.cookie('accessToken', token, options);
};

export const setRefreshCookie = (res: Response, token: string) => {
  const isProd =
    env.NODE_ENV === 'production' ||
    env.NODE_ENV === 'staging' ||
    env.NODE_ENV === 'test';

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    domain: 'i4you.local.net',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('refreshToken', token, options);
};

export const clearAccessCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    domain: 'i4you.local.net',
    maxAge: 0,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    domain: 'i4you.local.net',
    maxAge: 0,
  });
};
