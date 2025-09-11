import { User } from '@i4you/shared';

export interface IUserService {
  getUserById(userId: string): Promise<User>;
}
