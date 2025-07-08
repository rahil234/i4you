import { RequestHandler } from 'express';

export const requestLogger = (): RequestHandler => (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    console.log(
      `${timestamp} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
