import { UserDocument } from '@/models/user.model';
import { User } from '@i4you/shared';

export function mapMongoUser(doc: UserDocument): Omit<User, 'photos' | 'role'> {
  return {
    ...doc,
    id: doc._id.toString(),
  };
}
