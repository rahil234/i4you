import { IUserService } from '@/services/interfaces/IUserService';
import { inject } from 'inversify';
import { ICacheService } from '@/services/interfaces/ICacheService';
import { TYPES } from '@/types';

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.CacheService) private readonly _repo: ICacheService
  ) {}

  async isSuspended(userId: string): Promise<boolean> {
    const userKey = `suspend:${userId}`;
    return Boolean(await this._repo.get<boolean>(userKey));
  }

  suspendUser(userId: string, reason: string): Promise<void> {
    const userKey = `suspend:${userId}`;
    return this._repo.set(userKey, true);
  }
}
