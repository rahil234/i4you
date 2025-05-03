import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import UserDTO from '@/dtos/user.dtos';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { BadRequestError } from '@/errors/BadRequestError';
import { OnboardingData, UserJwtPayload } from '@repo/shared';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository
  ) {}

  async getUserById(id: string, role: UserJwtPayload['role'] = 'member') {
    if (role === 'admin') {
      return new UserDTO(await this.adminRepository.findById(id), role);
    }
    return new UserDTO(await this.userRepository.findById(id), role);
  }

  async getUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => new UserDTO(user, 'member'));
  }

  async updateUserStatus(userId: string, status: string) {
    const user = await this.userRepository.findById(userId);
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

  async onBoarding(userId: string, data: OnboardingData) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    await this.userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });
  }
}
