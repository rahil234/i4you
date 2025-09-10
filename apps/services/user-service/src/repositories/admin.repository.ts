import { AdminModel, AdminDocument } from '@/models/admin.model';
import { IAdminRepository } from '@/repositories/interfaces/IAdminRepository';
import { MongoBaseRepository } from '@/repositories/base.repository';
import { injectable } from 'inversify';
import { Admin } from '@/entities/admin.entity';

function toDomain(doc: AdminDocument): Admin {
  return new Admin(
    doc._id.toString(),
    doc.name,
    doc.email,
    doc.password,
    doc.status as 'active' | 'suspended',
    doc.createdAt,
    doc.updatedAt
  );
}

@injectable()
export class MongoAdminRepository
  extends MongoBaseRepository<Admin, AdminDocument>
  implements IAdminRepository
{
  constructor() {
    super(AdminModel, toDomain);
  }

  findByEmail(email: string): Promise<Admin | null> {
    return this.model.findOne({ email });
  }
}
