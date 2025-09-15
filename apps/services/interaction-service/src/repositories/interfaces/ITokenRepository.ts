import { Token } from '@/entities/token.entity';

export interface ITokenRepository {
  findByUserId(userId: string): Promise<Token | null>;

  create(userId: string, likes: number, superLikes: number): Promise<void>;

  updateLikes(userId: string, likes: number): Promise<void>;

  updateSuperLikes(userId: string, superLikes: number): Promise<void>;
}
