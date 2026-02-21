import express from 'express';
import { setupEnvConfig } from '@i4you/env-config';

const app = express();

setupEnvConfig({});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

export default app;
