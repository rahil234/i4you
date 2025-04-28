import express from 'express';
import * as path from 'node:path';
import cookieParser from 'cookie-parser';

import httpLogger from 'express-logr';

import { env } from '@/config/index';
import { connectDB } from '@/config/db.config';
import authRoutes from '@/routes/auth.routes';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(httpLogger() as () => void);

app.use(
  httpLogger({
    logFilePath: path.join(dirname, 'logs/auth_service.log'),
  }) as () => void
);

app.get('/api-docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', authRoutes);

app.get('/health', (_req, res) => {
  res.send('Auth Service is up and running');
});

app.use(errorHandlerMiddleware);

setupSwaggerDocs(app);

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT);
};

startServer()
  .then(() => {
    console.log('Auth Server running on port ', env.PORT);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
