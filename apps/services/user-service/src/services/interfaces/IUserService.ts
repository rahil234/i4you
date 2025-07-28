import UserDTO from '@/dtos/user.dtos';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import MatchesResponseDTO from '@/dtos/matchs.response.dtos';
import AdminDTO from '@/dtos/admin.dtos';

interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}

export default interface IUserService {
  getUserById(
    id: string,
    role?: UserJwtPayload['role']
  ): Promise<UserDTO | AdminDTO>;

  getUsers({
    page,
    limit,
    search,
    status,
    gender,
  }: GetUsersParams): Promise<{ data: UserDTO[]; total: number }>;

  updateUser(id: string, data: any): Promise<UserDTO>;

  updateUserStatus(userId: string, status: string): Promise<void>;

  getMatches(userId: string): Promise<MatchesResponseDTO[]>;

  onBoarding(userId: string, data: OnboardingRequestDTO): Promise<void>;
}
