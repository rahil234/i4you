import { UserModel } from '../models/user.model';
import UserRepository from '../core/interface/repositories/IUserRepository';

export class UserRepositoryImpl implements UserRepository {
    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async create(user: any) {
        return UserModel.create(user);
    }
}
