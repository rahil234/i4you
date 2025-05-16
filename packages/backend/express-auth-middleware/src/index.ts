import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errors/AppError';
import { AuthError } from './errors/AuthError';
import { ForbiddenError } from './errors/ForbiddenError';

type Role = 'admin' | 'customer' | 'seller';

interface UserPayload {
  id: string;
  role: Role;

  [key: string]: any;
}

interface AuthConfig {
  jwtSecret: string;
  validRoles: Role[];
}

let config: AuthConfig;

/**
 * Setup function to configure JWT secret and valid roles.
 *
 * @param jwtSecret - Secret key used for verifying JWTs.
 * @param validRoles - Array of valid roles for your app.
 */
export const setupAuth = (jwtSecret: string, validRoles: Role[]) => {
  if (!jwtSecret) throw new Error('JWT secret is required');
  if (!validRoles || !Array.isArray(validRoles)) throw new Error('Valid roles must be an array');

  config = {
    jwtSecret,
    validRoles,
  };
};

// Extend Express.Request with a user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        [key: string]: any;
      };
    }
  }
}

/**
 * Middleware for authorizing users based on roles.
 *
 * @param allowedRoles - Roles allowed to access the route.
 * @returns Express middleware.
 */
export const AuthenticateAndAuthorize = (allowedRoles?: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!config || !config.jwtSecret) {
      return next(new AppError('AuthMiddleware not configured', 500));
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AuthError('Unauthorized: No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;

      const { id, role } = decoded;

      if (!id || !role) {
        return next(new AuthError('Invalid token payload'));
      }

      // ✅ Ensure user is set
      req.user = decoded;

      // ✅ Role validation
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return next(new ForbiddenError('Forbidden: Insufficient permissions'));
      }

      return next(); // ✅ Only called after req.user is set

    } catch (err) {
      return next(new AuthError('Unauthorized: Invalid or expired token'));
    }
  };
};

export default AuthenticateAndAuthorize;
