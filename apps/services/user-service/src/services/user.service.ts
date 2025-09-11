import { injectable, inject } from 'inversify';
import type { RootFilterQuery } from 'mongoose';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import {
  GetUsersRequestDTO,
  MatchEventPayload,
  Subscription,
  TYPES,
} from '@/types';
import UserDTO from '@/dtos/user.dtos';
import { BadRequestError } from '@/errors/BadRequestError';
import { IAdminRepository } from '@/repositories/interfaces/IAdminRepository';
import { UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import ICacheService from '@/services/interfaces/ICacheService';
import { IUserService } from '@/services/interfaces/IUserService';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { createError } from '@i4you/http-errors';
import IMediaService from '@/services/interfaces/IMediaService';
import { USER_ROLES } from '@/constants/roles.constant';
import { Admin } from '@/entities/admin.entity';
import { User } from '@/entities/user.entity';
import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService,
    @inject(TYPES.SubscriptionService)
    private _subscriptionService: ISubscriptionService,
    @inject(TYPES.KafkaService) private _kafkaService: IKafkaService,
    @inject(TYPES.CacheService) private _cacheService: ICacheService
  ) {}

  private async suspendUser(userId: string) {
    await this._cacheService.set(`suspend:${userId}`, 'true', 60 * 60 * 24 * 7);
  }

  private async reInitiateUser(userId: string) {
    await this._cacheService.del(`suspend:${userId}`);
  }

  async getUserById(id: string, role?: 'member'): Promise<User>;
  async getUserById(id: string, role: 'admin'): Promise<Admin>;
  async getUserById(
    id: string,
    role: UserJwtPayload['role'] = USER_ROLES.MEMBER
  ) {
    const cacheKey = `${role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.MEMBER}:${id}`;
    const cached = await this._cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const data =
      role === 'admin'
        ? await this._adminRepository.findById(id)
        : await this._userRepository.findById(id);

    await this._cacheService.set(cacheKey, data);

    return data;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const subscription = await this._subscriptionService.getUserSubscription(
      user.id
    );

    return new UserDTO(user, subscription);
  }

  async getUsers({ page, limit, search, status, gender }: GetUsersRequestDTO) {
    const offset = (page - 1) * limit;

    const whereClause: RootFilterQuery<User> = {};

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

    const users = await this._userRepository.findMany(whereClause, {
      skip: offset,
      limit,
    });

    const total = await this._userRepository.count(whereClause);

    const data = await Promise.all(
      users.map(async (user) => {
        const photos = await this._mediaService.getUserImages(
          user.id.toString()
        );
        const subscription =
          await this._subscriptionService.getUserSubscription(
            user.id.toString()
          );
        return new UserDTO(user, subscription, photos);
      })
    );

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createUser({
    name,
    email,
    password,
  }: Pick<User, 'name' | 'email' | 'password'>) {
    const user = await this._userRepository.findByEmail(email);

    if (user) {
      throw createError.Conflict('User Already Exists');
    }

    const newUser = await this._userRepository.create({
      name,
      email,
      password,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to Create user');
    }

    return newUser;
  }

  async updateUser(id: string, data: User): Promise<User> {
    const user = await this._userRepository.findById(id);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    await this._cacheService.del(`member:${id}`);

    console.log('Updating user:', id, data);

    const location = data.location
      ? {
          type: 'Point' as const,
          coordinates:
            data.location?.coordinates[0] !== 0 &&
            data.location?.coordinates[1] !== 0
              ? data.location?.coordinates
              : user.location.coordinates,
          displayName: data.location?.displayName || user.location?.displayName,
        }
      : undefined;

    const newUser = await this._userRepository.update(id, {
      ...data,
      location,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to update user');
    }

    await this._kafkaService.emit('user.events', 'user.profile.updated', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      interests: newUser.interests,
      preferences: newUser.preferences,
      location: newUser.location,
      gender: newUser.gender,
      age: newUser.age,
      status: newUser.status,
    });

    return newUser;
  }

  async updateUserStatus(userId: string, status: string) {
    const user = await this._userRepository.find({ id: userId });

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

    await this._cacheService.del(`member:${userId}`);

    await this._userRepository.update(userId, {
      status: status as 'active' | 'suspended',
    });
  }

  async userMatched(userA: string, userB: string) {
    const user1 = await this._userRepository.findById(userA);
    const user2 = await this._userRepository.findById(userB);

    if (!user1 || !user2) {
      throw new BadRequestError('One or both users not found');
    }

    console.log(`User ${user1.name} matched with user ${user2.id}`);

    await this._kafkaService.emit('notification.events', 'user_matched', {
      recipientId: user1.id,
      data: {
        userId: user2.id,
        matchedUserId: user2.id,
        name: user2.name,
        photo: (await this._mediaService.getUserImages(user2.id))[0],
        timestamp: new Date(),
      },
    } as MatchEventPayload);

    await this._kafkaService.emit('notification.events', 'user_matched', {
      recipientId: user2.id,
      data: {
        userId: user1.id,
        matchedUserId: user1.id,
        name: user1.name,
        photo: (await this._mediaService.getUserImages(user1.id))[0],
        timestamp: new Date().toISOString(),
      },
    });

    return;
  }

  async likeUser(
    userId: string,
    likedUserId: string
  ): Promise<{ message: string } | null> {
    console.log(`User ${userId} liked user ${likedUserId}`);

    await this._kafkaService.emit('user.events', 'user_liked', {
      userId,
      likedUserId,
      timestamp: new Date().toISOString(),
    });

    return { message: 'User liked successfully' };
  }

  async onBoarding(userId: string, data: OnboardingRequestDTO) {
    const newUser = await this._userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to complete onboarding');
    }

    await this._cacheService.del(`member:${userId}`);

    await this._kafkaService.emit('user.events', 'user.created', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      interests: newUser.interests,
      preferences: newUser.preferences,
      location: newUser.location,
      gender: newUser.gender,
      age: newUser.age,
      status: newUser.status,
    });
  }

  async getUserPhotos(userId: string) {
    return this._mediaService.getUserImages(userId);
  }

  getUserSubscription(userId: string): Promise<Subscription> {
    return this._subscriptionService.getUserSubscription(userId);
  }
}
