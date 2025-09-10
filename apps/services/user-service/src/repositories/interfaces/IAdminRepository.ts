import IBaseRepository from '@/repositories/interfaces/IBaseRepositoryInterface';
import { Admin } from '@/entities/admin.entity';

export interface IAdminRepository extends IBaseRepository<Admin> {
  findByEmail(email: string): Promise<Admin | null>;
}
