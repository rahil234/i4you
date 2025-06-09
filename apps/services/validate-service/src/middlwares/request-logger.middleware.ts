import { RequestHandler } from 'express';

export const requestLogger = (): RequestHandler => (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    const forwardedUri = req.headers['x-forwarded-uri'] as string;
    const forwardedMethod = req.headers['x-forwarded-method'] as string;

    if (
      forwardedUri.startsWith('/api') ||
      forwardedUri.startsWith('/socket.io') ||
      res.statusCode >= 400
    ) {
      console.log(
        `${timestamp} ${forwardedMethod} ${forwardedUri} - ${res.statusCode} - ${duration}ms`
      );
    }
  });

  next();
};
