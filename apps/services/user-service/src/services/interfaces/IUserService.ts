import UserDTO from '@/dtos/user.dtos';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import AdminDTO from '@/dtos/admin.dtos';
import { User } from '@/entities/user.entity';
import { Admin } from '@/entities/admin.entity';
import { Subscription } from '@/types';

interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}

export interface IUserService {
  getUserById(id: string, role?: 'member'): Promise<User>;
  getUserById(id: string, role: 'admin'): Promise<Admin>;

  getUserById(id: string, role?: UserJwtPayload['role']): Promise<User | Admin>;

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

  updateUser(id: string, data: User): Promise<User>;

  updateUserStatus(userId: string, status: string): Promise<void>;

  likeUser(
    userId: string,
    likedUserId: string
  ): Promise<{ message: string } | null>;

  onBoarding(userId: string, data: OnboardingRequestDTO): Promise<void>;

  getUserPhotos(userId: string): Promise<string[]>;

  getUserSubscription(userId: string): Promise<Subscription>;
}
