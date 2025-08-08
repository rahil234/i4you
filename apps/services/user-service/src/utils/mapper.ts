import { UserDocument } from '@/models/user.model';
import { User } from '@i4you/shared';

export function mapMongoUser(doc: UserDocument): User {
  return {
    ...doc,
    id: doc._id.toString(),
  };
}
