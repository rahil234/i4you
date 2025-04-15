import express from 'express';
import * as path from 'node:path';
import cookieParser from 'cookie-parser';

import httpLogger from 'express-logr';

import authRoutes from '@/routes/auth.routes';
import { connectDB } from '@/config/db.config';
import { env } from '@/config';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(httpLogger());

app.use(
  httpLogger({ logFilePath: path.join(__dirname, 'logs/auth_service.log') })
);

app.use('/', authRoutes);

app.get('/health', (_req, res) => {
  res.send('Auth Service is up and running');
});

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log('Auth Server running on port ', env.PORT);
  });
};

startServer();
