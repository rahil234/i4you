import Redis from 'ioredis';
import Redlock from 'redlock';
import { env } from '@/config/env.config';
import { CompatibleRedisClient } from 'redlock';

const redis_host = env.REDIS_HOST;
const redis_port = env.REDIS_PORT;
const redis_password = env.REDIS_PASSWORD;

const redisUrl = `redis://${redis_password ? `:${redis_password}@` : ''}${redis_host}:${redis_port}`;

const redis = new Redis(redisUrl) as unknown as CompatibleRedisClient;

export const redlock = new Redlock([redis], {
  retryCount: 0,
});
