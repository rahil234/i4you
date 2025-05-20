import { RequestHandler } from 'express';

export const requestLogger = (): RequestHandler => (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    const originalUri = req.headers['x-original-uri'] as string;
    const originalMethoed = req.headers['x-original-methoed'] as string;

    console.log(
      `${timestamp} ${originalMethoed} ${originalUri} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
