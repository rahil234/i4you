import {UserModel, UserDocument} from '@/models/user.model';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import {BaseRepository} from '@/repositories/base.repository';
import { injectable } from 'inversify';

@injectable()
export class UserRepository
    extends BaseRepository<UserDocument>
    implements IUserRepository {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.model.findOne({email}).exec();
    }
}