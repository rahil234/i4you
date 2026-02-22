import express from 'express';

import userRoutes from '@/routes/user.routes';
import { requestLogger } from '@/middlwares/request-logger.middleware';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';

const app = express();

app.use(express.json());

app.use(requestLogger());

app.get('/api-docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (_req, res) => {
  res.send('User Service is up and running');
});

app.use('/', userRoutes);

setupSwaggerDocs(app);

app.use(errorHandlerMiddleware);

export default app;
