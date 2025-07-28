import express from 'express';
import cookieParser from 'cookie-parser';

import { env } from '@/config/index';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import { requestLogger } from '@/middlwares/request-logger.middleware';
import { connectRedis } from '@/config/redis.config';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { ValidateController } from '@/controllers/validate.controller';

const app = express();

app.use(requestLogger());

app.use(express.json());
app.use(cookieParser());

const controller = container.get<ValidateController>(TYPES.ValidateController);

app.get('/validate', controller.validate);

app.get('/health', (_req, res) => {
  res.send('Validate service is healthy');
});

app.use(errorHandlerMiddleware);

const PORT = env.PORT;

const startServer = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Validate Service running on port ${PORT}`);
  });
};

// noinspection JSIgnoredPromiseFromCall
startServer();
