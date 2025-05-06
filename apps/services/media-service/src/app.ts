import express from 'express';
import cookieParser from 'cookie-parser';

import { env } from '@/config/index';
import mediaRoutes from '@/routes/media.routes';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { requestLogger } from '@/middlwares/request-logger.middleware';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger());

app.get('/api-docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', mediaRoutes);

app.get('/health', (_req, res) => {
  res.send('Meadia Service is up and running');
});

app.use(errorHandlerMiddleware);

setupSwaggerDocs(app);

const startServer = async () => {
  app.listen(env.PORT);
};

startServer()
  .then(() => {
    console.log('Media Server running on port ', env.PORT);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
