import { AdminModel, AdminDocument } from '@/models/admin.model';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { BaseRepository } from '@/repositories/base.repository';

export class AdminRepository
  extends BaseRepository<AdminDocument>
  implements IAdminRepository
{
  constructor() {
    super(AdminModel);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.model.findOne({ email }).exec();
  }
}
