import { createClient } from 'redis';
import { env } from '@/config';

const redis_host = env.REDIS_HOST;
const redis_port = env.REDIS_PORT;
const redis_password = env.REDIS_PASSWORD;

const redisUrl = `redis://:${redis_password}@${redis_host}:${redis_port}`;

console.log(`Connecting to Redis at ${redisUrl}`);

export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
