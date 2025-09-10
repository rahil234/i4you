import { IBaseRepository } from '@/repositories/interfaces/IBaseRepositoryInterface';
import { UserDocument } from '@/models/user.model';

interface UserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

export default UserRepository;
