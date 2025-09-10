import express, { Express } from 'express';
import { requestLogger } from '@/middlwares/request-logger.middleware';

export function applyGlobalMiddlewares(app: Express) {
  app.use(express.json());

  app.use(requestLogger());
}
