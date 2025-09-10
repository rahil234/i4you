import express from 'express';

import setupSwaggerDocs from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import { applyGlobalMiddlewares } from '@/middleware';
import { registerRoutes } from '@/routes';

export const createApp = () => {
  const app = express();

  applyGlobalMiddlewares(app);
  setupSwaggerDocs(app);
  registerRoutes(app);
  app.use(errorHandlerMiddleware);

  return app;
};
