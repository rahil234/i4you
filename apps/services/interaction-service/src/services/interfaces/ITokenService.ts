import { Token } from '@/entities/token.entity';

export interface ITokenService {
  getTokenDetailsByUserId(userId: string): Promise<Token>;

  getLikes(userId: string): Promise<number>;
  getSuperLikes(userId: string): Promise<number>;

  consumeLike(userId: string): Promise<boolean>;
  consumeSuperLike(userId: string): Promise<boolean>;

  refillTokens(userId: string): Promise<void>;
  getRefillTime(userId: string): Promise<Date | null>;
}
