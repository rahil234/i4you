import { UserJwtPayload } from '@repo/shared';

type User = Omit<UserJwtPayload, 'sub' | 'email'> & { id: string };

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
