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
