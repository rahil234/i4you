import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/AppError';

export function errorHandlerMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      type: err.type,
    });
    return;
  }
  if (err.type === 'AUTH_ERROR') {
    console.log('AuthError:', err);
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      type: err.type,
    });
    return;
  }

  // Fallback for unknown errors
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    type: 'INTERNAL_SERVER_ERROR',
  });
}
