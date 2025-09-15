import { injectable } from 'inversify';
import { UserModel, UserDocument } from '@/models/user.model';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { MongoBaseRepository } from '@/repositories/base.repository';
import { User } from '@/entities/user.entity';
import { RootFilterQuery } from 'mongoose';

function toDomain(doc: UserDocument): User {
  return new User(
    doc._id.toString(),
    doc.name,
    doc.email,
    doc.password,
    doc.age,
    doc.gender,
    doc.bio,
    doc.interests,
    doc.preferences,
    doc.location,
    doc.onboardingCompleted,
    doc.status,
    doc.createdAt,
    doc.updatedAt
  );
}

@injectable()
export class MongoUserRepository
  extends MongoBaseRepository<User, UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel, toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model
      .findOne({ email } as RootFilterQuery<UserDocument>)
      .lean();
    return doc ? this.toDomain(doc) : null;
  }

  async findMany(
    filter: Partial<UserDocument>,
    options: { skip: number; limit: number }
  ): Promise<User[]> {
    const docs = await this.model
      .find(filter as RootFilterQuery<UserDocument>)
      .skip(options.skip)
      .limit(options.limit)
      .lean();
    return docs.map(this.toDomain);
  }

  async count(filter: Partial<UserDocument>): Promise<number> {
    return this.model.countDocuments(filter as RootFilterQuery<UserDocument>);
  }
}
