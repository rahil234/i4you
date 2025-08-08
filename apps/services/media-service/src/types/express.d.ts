import { UserJwtPayload } from '@repo/shared';

type User = Omit<UserJwtPayload, 'sub' | 'email'> & {
  id: string;
  role: 'member' | 'admin';
};

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
