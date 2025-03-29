import {AuthModel, UserDocument} from '@/models/auth.model';
import IAuthRepository from '@/repositories/interfaces/IAuthRepository';
import {BaseRepository} from '@/repositories/base.repository';

export class AuthRepository
    extends BaseRepository<UserDocument>
    implements IAuthRepository {
    constructor() {
        super(AuthModel);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.model.findOne({email}).exec();
    }
}
