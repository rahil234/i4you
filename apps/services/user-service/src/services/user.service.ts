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
import ICacheService from '@/services/interfaces/ICacheService';
import IUserService from '@/services/interfaces/IUserService';
import IKafkaService from '@/events/interfaces/IKafkaService';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository,
    @inject(TYPES.KafkaService) private kafkaService: IKafkaService,
    @inject(TYPES.CacheService) private cacheService: ICacheService
  ) {}

  async getUserById(id: string, role: UserJwtPayload['role'] = 'member') {
    const cacheKey = `${role === 'admin' ? 'admin' : 'member'}:${id}`;
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return role === 'admin' ? new AdminDTO(cached) : new UserDTO(cached);
    }

    const data =
      role === 'admin'
        ? await this.adminRepository.findById(id)
        : await this.userRepository.findById(id);

    await this.cacheService.set(cacheKey, data);

    console.log(`Get user ${id} with role ${role}`, data);

    return role === 'admin' ? new AdminDTO(data) : new UserDTO(data);
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

    await this.cacheService.del(`user:${id}`);

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

    await this.cacheService.del(`user:${userId}`);

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

  async likeUser(userId: string, likedUserId: string) {
    // maybe call userRepository.likeUser(...)

    await this.kafkaService.emit('user-events', 'user_liked', {
      userId,
      likedUserId,
      timestamp: new Date().toISOString(),
    });

    return { message: 'User liked successfully' };
  }

  async onBoarding(userId: string, data: OnboardingRequestDTO) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    await this.cacheService.del(`member:${userId}`);

    console.log('Onboarding data:', data);

    await this.userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });
  }
}
