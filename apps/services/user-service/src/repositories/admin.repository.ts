import { AdminModel, AdminDocument } from '@/models/admin.model';
import IAuthRepository from '@/repositories/interfaces/IUserRepository';
import { BaseRepository } from '@/repositories/base.repository';

export class AdminRepository
  extends BaseRepository<AdminDocument>
  implements IAuthRepository
{
  constructor() {
    super(AdminModel);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.model.findOne({ email }).exec();
  }
}
