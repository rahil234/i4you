import express from 'express';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

import httpLogger from 'express-logr';

import { env } from '@/config/index';
import userRoutes from '@/routes/user.routes';
import { connectDB } from '@/config/db.config';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.use(express.json());

app.use(httpLogger() as () => void);

app.use(httpLogger({ logFilePath: path.join(dirname, 'logs/user_service.log') }) as () => void);

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
