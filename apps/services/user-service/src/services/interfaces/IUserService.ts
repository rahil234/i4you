import UserDTO from '@/dtos/user.dtos';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import AdminDTO from '@/dtos/admin.dtos';
import { AdminDocument } from '@/models/admin.model';
import { UserDocument } from '@/models/user.model';

interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}

interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}

export default interface IUserService {
  getUserById(id: string, role: 'admin'): Promise<AdminDocument>;

  getUserById(id: string, role?: 'member'): Promise<UserDocument>;

  getUserById(
    id: string,
    role?: UserJwtPayload['role']
  ): Promise<UserDocument | AdminDocument>;

  getUserByEmail(
    email: string,
    role?: UserJwtPayload['role']
  ): Promise<UserDTO | AdminDTO>;

  getUsers({
    page,
    limit,
    search,
    status,
    gender,
  }: GetUsersParams): Promise<{ data: UserDTO[]; total: number }>;

  updateUser(id: string, data: any): Promise<UserDocument>;

  updateUserStatus(userId: string, status: string): Promise<void>;

  onBoarding(userId: string, data: OnboardingRequestDTO): Promise<void>;
}
