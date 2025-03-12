import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';

const app = express();
app.use(cors());

app.use(
    '/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

app.listen(4000, () => console.log('Gateway running on port 4000'));