import { IBaseRepository } from '@/repositories/interfaces/IBaseRepositoryInterface';
import { AdminDocument } from '@/models/admin.model';

interface AdminRepository extends IBaseRepository<AdminDocument> {
  findByEmail(email: string): Promise<AdminDocument | null>;
}

export default AdminRepository;
