import { injectable, inject } from 'inversify';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { TYPES } from '@/types';
import UserDTO from '@/dtos/user.dtos';
import { BadRequestError } from '@/errors/BadRequestError';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { User, UserJwtPayload } from '@i4you/shared';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import { AdminDocument } from '@/models/admin.model';
import { UserDocument } from '@/models/user.model';
import AdminDTO from '@/dtos/admin.dtos';
import ICacheService from '@/services/interfaces/ICacheService';
import IUserService from '@/services/interfaces/IUserService';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';
import { createError } from '@i4you/http-errors';
import IMediaService from '@/services/interfaces/IMediaService';

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

interface GetUsersRequestDTO {
  page: number;
  limit: number;
  search: string;
  status: string;
  gender: string;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository,
    @inject(TYPES.MediaService) private mediaService: IMediaService,
    @inject(TYPES.KafkaService) private kafkaService: IKafkaService,
    @inject(TYPES.CacheService) private cacheService: ICacheService
  ) {}

  private async suspendUser(userId: string) {
    await this.cacheService.set(`suspend:${userId}`, 'true', 60 * 60 * 24 * 7);
  }

  private async reInitiateUser(userId: string) {
    await this.cacheService.del(`suspend:${userId}`);
  }

  async getUserById(id: string, role?: 'member'): Promise<UserDocument>;
  async getUserById(id: string, role: 'admin'): Promise<AdminDocument>;
  async getUserById(id: string, role: UserJwtPayload['role'] = 'member') {
    console.log(`Get user by id: ${id} with role: ${role}`);
    const cacheKey = `${role === 'admin' ? 'admin' : 'member'}:${id}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const data =
      role === 'admin'
        ? await this.adminRepository.findById(id)
        : await this.userRepository.findById(id);

    console.log(await this.mediaService.getUserImages('image123'));

    await this.cacheService.set(cacheKey, data);

    console.log(data);

    return data;
  }

  async getUserByEmail(email: string, role?: 'member'): Promise<UserDTO>;
  async getUserByEmail(email: string, role: UserJwtPayload['role'] = 'member') {
    const data =
      role === 'admin'
        ? await this.adminRepository.findByEmail(email)
        : await this.userRepository.findByEmail(email);

    if (!data) {
      return null;
    }

    return role === 'admin'
      ? (new AdminDTO(data) as AdminDTO)
      : new UserDTO(data as UserDocument);
  }

  async getUsers({ page, limit, search, status, gender }: GetUsersRequestDTO) {
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

  async createUser({
    name,
    email,
    password,
  }: Pick<User, 'name' | 'email' | 'password'>) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw createError.Conflict('User Already Exists');
    }

    const newUser = await this.userRepository.create({
      name,
      email,
      password,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to Create user');
    }

    return newUser;
  }

  async updateUser(id: string, data: any): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    await this.cacheService.del(`member:${id}`);

    const location = data.location
      ? {
          type: 'Point',
          coordinates: data.location?.coordinates || [0, 0],
          displayName: data.location?.displayName || user.location?.displayName,
        }
      : undefined;

    const newUser = await this.userRepository.update(id, {
      ...data,
      location,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to update user');
    }

    await this.kafkaService.emit('user.events', 'user.profile.updated', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      interests: newUser.interests,
      preferences: newUser.preferences,
      location: newUser.location,
      photos: newUser.photos,
      gender: newUser.gender,
      age: newUser.age,
      status: newUser.status,
    });

    return newUser;
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
    const newUser = await this.userRepository.update(userId, {
      ...data,
      onboardingCompleted: true,
    });

    if (!newUser) {
      throw new BadRequestError('Failed to complete onboarding');
    }

    await this.cacheService.del(`member:${userId}`);

    await this.kafkaService.emit('user.events', 'user.created', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      interests: newUser.interests,
      preferences: newUser.preferences,
      location: newUser.location,
      photos: newUser.photos,
      gender: newUser.gender,
      age: newUser.age,
      status: newUser.status,
    });
  }

  async getUserPhotos(userId: string) {
    return this.mediaService.getUserImages(userId);
  }
}
