import IBaseRepository from '@/repositories/interfaces/IBaseRepositoryInterface';
import { User } from '@/entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;

  findMany(
    filter: Partial<User>,
    options: { skip: number; limit: number }
  ): Promise<User[]>;

  count(filter: Partial<User>): Promise<number>;
}
