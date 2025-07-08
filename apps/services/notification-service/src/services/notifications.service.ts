import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NotificationsService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async saveSocketMapping(userId: string, socketId: string): Promise<void> {
    await this.redis.set(`socket:${userId}`, socketId);
  }

  async getSocketId(userId: string): Promise<string | null> {
    return await this.redis.get(`socket:${userId}`);
  }

  async removeSocketMapping(userId: string): Promise<void> {
    await this.redis.del(`socket:${userId}`);
  }

  async getAllKeys(): Promise<string[]> {
    return await this.redis.keys('socket:*');
  }
}
