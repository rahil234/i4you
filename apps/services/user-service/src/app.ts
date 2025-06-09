import express from 'express';

import { env } from '@/config/index';
import userRoutes from '@/routes/user.routes';
import { connectDB } from '@/config/db.config';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import { requestLogger } from '@/middlwares/request-logger.middleware';

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

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log('User Server running on port ', env.PORT);
  });
};

// noinspection JSIgnoredPromiseFromCall
startServer();
