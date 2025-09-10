import { Request, Response, NextFunction } from 'express';
import { createError } from '@i4you/http-errors';
import { UserJwtPayload } from '@i4you/shared';

export const authenticateAndAuthorizeMiddleware = (
  roles: Array<UserJwtPayload['role']> = []
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as UserJwtPayload['role'];

    if (!userId || !userRole) {
      return next(createError.Unauthorized('User not authenticated'));
    }

    req.user = { id: userId, role: userRole };

    if (roles.length && !roles.includes(userRole as 'member' | 'admin')) {
      return next(createError.Forbidden('User not authorized'));
    }

    next();
  };
};
