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
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';

interface MatchEventPayload {
  recipientId: string;
  data: {
    userId: string;
    matchedUserId: string;
    name: string;
    photo: string;
    timestamp: Date;
  };
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository,
    @inject(TYPES.KafkaService) private kafkaService: IKafkaService,
    @inject(TYPES.CacheService) private cacheService: ICacheService
  ) {}

  private async suspendUser(userId: string) {
    await this.cacheService.set(`suspend:${userId}`, 'true', 60 * 60 * 24 * 7);
  }

  private async reInitiateUser(userId: string) {
    await this.cacheService.del(`suspend:${userId}`);
  }

  async getUserById(id: string, role: 'admin'): Promise<AdminDTO>;
  async getUserById(id: string, role?: 'member'): Promise<UserDTO>;
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

    return role === 'admin'
      ? (new AdminDTO(data) as AdminDTO)
      : (new UserDTO(data) as UserDTO);
  }

  async getUsers({
    page,
    limit,
    search,
    status,
    gender,
  }: {
    page: number;
    limit: number;
    search: string;
    status: string;
    gender: string;
  }) {
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (gender && gender !== 'all') {
      whereClause.gender = gender;
    }

    const users = await this.userRepository.findMany(whereClause, {
      skip: offset,
      limit,
    });

    const total = await this.userRepository.count(whereClause);

    return {
      data: users.map((user) => new UserDTO(user)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(id: string, data: any) {
    console.log(`Update user ${id} with data:`, data);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    await this.cacheService.del(`member:${id}`);

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

    if (status === 'suspended') {
      await this.suspendUser(userId);
    } else if (status === 'active') {
      await this.reInitiateUser(userId);
    }

    await this.cacheService.del(`member:${userId}`);

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
    console.log(`User ${userId} liked user ${likedUserId}`);

    await this.kafkaService.emit('user.events', 'user_liked', {
      userId,
      likedUserId,
      timestamp: new Date().toISOString(),
    });

    return { message: 'User liked successfully' };
  }

  async userMatched(userA: string, userB: string) {
    const user1 = await this.userRepository.findById(userA);
    const user2 = await this.userRepository.findById(userB);

    if (!user1 || !user2) {
      throw new BadRequestError('One or both users not found');
    }

    console.log(`User ${user1.name} matched with user ${user2.id}`);

    await this.kafkaService.emit('notification.events', 'user_matched', {
      recipientId: user1.id,
      data: {
        userId: user2.id,
        matchedUserId: user2.id,
        name: user2.name,
        photo: user2.photos[0],
        timestamp: new Date(),
      },
    } as MatchEventPayload);

    await this.kafkaService.emit('notification.events', 'user_matched', {
      recipientId: user2.id,
      data: {
        userId: user1.id,
        matchedUserId: user1.id,
        name: user1.name,
        photo: user1.photos[0],
        timestamp: new Date().toISOString(),
      },
    });

    return;
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
