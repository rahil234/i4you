import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { env } from '@/config/index';

import { TYPES } from '@/types';
import { handleAsync } from '@/utils/handle-async';
import { CacheService } from '@/services/cache.service';

const ignorePaths = new Set([
  '/public',
  '/api/v1/auth/login',
  '/api/v1/auth/login/admin',
  '/api/v1/auth/login/google',
  '/api/v1/auth/login/facebook',
  '/api/v1/auth/register/google',
  '/api/v1/auth/register/facebook',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/verify-account',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/health',
  '/api/v1/user/health',
  '/api/v1/media/health',
]);

@injectable()
export class ValidateController {
  constructor(@inject(TYPES.CacheService) private cacheService: CacheService) {}

  validate = handleAsync(async (req, res) => {
    const forwardedUri = req.headers['x-forwarded-uri'] as string; // e.g., /api/v1/user
    // const forwardedHost = req.headers['x-forwarded-host'] as string; // e.g., example.com
    // const forwardedMethod = req.headers['x-forwarded-method'] as string; // e.g., GET
    // console.log('Requested:', forwardedMethod, forwardedHost + forwardedUri);

    if (
      forwardedUri.startsWith('/api') ||
      forwardedUri.startsWith('/socket.io')
    ) {
      if (forwardedUri && ignorePaths.has(forwardedUri)) {
        res.sendStatus(200);
        return;
      }

      const token = req.cookies.accessToken;

      if (!token) {
        res.status(401).json({ message: 'Missing access token' });
        return;
      }

      try {
        const payload = jwt.verify(token, env.JWT_SECRET) as {
          sub: string;
          role: string;
        };

        // Check if the user is blocked
        const userKey = `suspend:${payload.sub}`;

        const isSuspented = await this.cacheService.get(userKey);

        if (isSuspented) {
          res.status(403).json({ message: 'User is suspended' });
          return;
        }

        // Inject user info in response headers
        res.set('X-User-ID', payload.sub);
        res.set('X-User-Role', payload.role);

        res.sendStatus(200);
      } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    } else {
      res.sendStatus(200);
      return;
    }
  });
}
