import { redisClient } from '@/config/redis.config';
import { ICacheService } from './interfaces/ICacheService';

export class CacheService implements ICacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 900): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
