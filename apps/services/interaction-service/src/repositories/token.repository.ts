import { redisClient } from '@/config/redis.config';
import { ITokenRepository } from './interfaces/ITokenRepository';
import { Token } from '@/entities/token.entity';

interface TokenDocument {
  userId: string;
  likes: string;
  superLikes: string;
  nextRefill: string;
}

export class RedisTokenRepository implements ITokenRepository {
  private _client;

  constructor() {
    this._client = redisClient;
  }

  private _toDomain(doc: TokenDocument): Token {
    return new Token(
      doc.userId,
      parseInt(doc.likes, 10),
      parseInt(doc.superLikes, 10),
      new Date(doc.nextRefill)
    );
  }

  private getKey(userId: string) {
    return `user:tokens:${userId}`;
  }

  private _getMidNightIST(): Date {
    const now = new Date();
    const midnightIST = new Date(
      new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    );
    midnightIST.setHours(24, 0, 0, 0);

    // Convert back to UTC
    return new Date(midnightIST.toLocaleString('en-US', { timeZone: 'UTC' }));
  }
  async create(
    userId: string,
    likes: number,
    superLikes: number
  ): Promise<void> {
    const key = this.getKey(userId);

    const expireInSeconds = Math.floor(this._getMidNightIST().getTime() / 1000);

    await this._client.hSet(key, {
      userId,
      likes: likes.toString(),
      superLikes: superLikes.toString(),
      nextRefill: this._getMidNightIST().toISOString(),
    });

    await this._client.expireAt(key, expireInSeconds);
  }

  async findByUserId(userId: string): Promise<Token | null> {
    const data = await this._client.hGetAll(this.getKey(userId));

    if (!data || Object.keys(data).length === 0) return null;

    return this._toDomain(data as unknown as TokenDocument);
  }

  async updateLikes(userId: string, likes: number): Promise<void> {
    await this._client.hSet(this.getKey(userId), { likes: likes.toString() });
  }

  async updateSuperLikes(userId: string, superLikes: number): Promise<void> {
    await this._client.hSet(this.getKey(userId), {
      superLikes: superLikes.toString(),
    });
  }
}
