import { Request, Response, NextFunction } from 'express';
import { AuthError } from '@/errors/AuthError';
import { ForbiddenError } from '@/errors/ForbiddenError';
import { UserJwtPayload } from '@repo/shared';

export const authenticateAndAuthorizeMiddleware = (
  roles: Array<UserJwtPayload['role']> = []
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as UserJwtPayload['role'];

    if (!userId || !userRole) {
      return next(new AuthError('User not authenticated'));
    }

    req.user = { id: userId, role: userRole };

    if (roles.length && !roles.includes(userRole as 'member' | 'admin')) {
      return next(new ForbiddenError('Unauthorized'));
    }

    next();
  };
};
