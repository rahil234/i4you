import UserDTO from '@/dtos/user.dtos';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import MatchesResponseDTO from '@/dtos/matchs.response.dtos';
import AdminDTO from '@/dtos/admin.dtos';

export default interface IUserService {
  getUserById(
    id: string,
    role?: UserJwtPayload['role']
  ): Promise<UserDTO | AdminDTO>;

  getUsers(): Promise<UserDTO[]>;

  updateUser(id: string, data: any): Promise<UserDTO>;

  updateUserStatus(userId: string, status: string): Promise<void>;

  getMatches(userId: string): Promise<MatchesResponseDTO[]>;

  onBoarding(userId: string, data: OnboardingRequestDTO): Promise<void>;
}