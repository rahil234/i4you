import { injectable, inject } from 'inversify';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { TYPES } from '@/types';
import UserDTO from '@/dtos/user.dtos';
import { BadRequestError } from '@/errors/BadRequestError';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import MatchesResponseDTO from '@/dtos/matchs.response.dtos';
import AdminDTO from '@/dtos/admin.dtos';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository
  ) {}

  async getUserById(id: string, role: UserJwtPayload['role'] = 'member') {
    if (role === 'admin') {
      return new AdminDTO(await this.adminRepository.findById(id));
    }
    return new UserDTO(await this.userRepository.findById(id));
  }

  async getUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => new UserDTO(user));
  }

  async updateUser(id: string, data: any) {
    console.log(`Update user ${id} with data:`, data);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const newUser = await this.userRepository.update(id, {
      ...data,
      location: data.location
        ? {
            type: 'Point',
            coordinates: user.location?.coordinates || [0, 0],
            displayName:
              data.location?.displayName || user.location?.displayName,
          }
        : undefined,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to update user');
    }

    return new UserDTO(newUser);
  }

  async updateUserStatus(userId: string, status: string) {
    const user = await this.userRepository.find({ _id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    if (!status) {
      throw new BadRequestError('Status is required');
    }

    await this.userRepository.update(userId, {
      status: status as 'active' | 'suspended',
    });
  }

  async getMatches(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    const matches = await this.userRepository.getMatches(userId);
    return matches.map(
      (match) => new MatchesResponseDTO(match, user.location?.coordinates)
    );
  }

  async onBoarding(userId: string, data: OnboardingRequestDTO) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    console.log('Onboarding data:', data);

    await this.userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });
  }
}
