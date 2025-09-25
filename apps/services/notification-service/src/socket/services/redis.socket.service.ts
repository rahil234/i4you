import { Inject, Injectable } from '@nestjs/common';
import { ISocketService } from './interfaces/ISocketService';
import Redis from 'ioredis';

@Injectable()
export class RedisSocketService implements ISocketService {
  constructor(@Inject('REDIS_CLIENT') private readonly _redis: Redis) {}

  async saveSocketMapping(userId: string, socketId: string): Promise<void> {
    await this._redis.set(`socket:${userId}`, socketId);
  }

  async getSocketId(userId: string): Promise<string | null> {
    return this._redis.get(`socket:${userId}`);
  }

  async removeSocketMapping(userId: string): Promise<void> {
    await this._redis.del(`socket:${userId}`);
  }
}
