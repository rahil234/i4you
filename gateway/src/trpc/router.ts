import { t } from './index';
import { userRouter } from '../../../services/user-service/src/trpc/router';

export const appRouter = t.router({
    user: userRouter,
});

export type AppRouter = typeof appRouter;