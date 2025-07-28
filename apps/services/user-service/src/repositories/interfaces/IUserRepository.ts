import IBaseRepository from '@/repositories/interfaces/IBaseRepositoryInterface';
import { UserDocument } from '@/models/user.model';

interface UserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;

  getMatches(userId: string): Promise<UserDocument[]>;

  findMany(
    filter: any,
    options: { skip: number; limit: number }
  ): Promise<UserDocument[]>;

  count(filter: any): Promise<number>;
}

export default UserRepository;
