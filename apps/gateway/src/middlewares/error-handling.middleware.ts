import { NextFunction, Request, Response } from 'express';

export function errorHandlingMiddleware() {
  return (err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ error: 'Invalid or missing token' });
    } else {
      console.log('Unknown Error:', err);
      next(err);
    }
  };
}