import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateAndAuthorizeMiddleware = (
  roles: Array<'admin' | 'customer' | 'seller'>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        next(err);
        return;
      }

      req.user = user as Request['user'];

      if (roles.length && (!req.user || !roles.includes(req.user.role))) {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }
      next();
    });
  };
};
