import { ITokenService } from './interfaces/ITokenService';
import { ITokenRepository } from '@/repositories/interfaces/ITokenRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

const SUBSCRIPTION_LIMITS = {
  free: { likes: 10, superLikes: 1 },
  plus: { likes: 50, superLikes: 5 },
  premium: { likes: 200, superLikes: 20 },
};

@injectable()
export class TokenService implements ITokenService {
  constructor(
    @inject(TYPES.TokenRepository)
    private _tokenRepository: ITokenRepository,
    @inject(TYPES.SubscriptionService)
    private _subscriptionService: ISubscriptionService
  ) {}

  async getTokenDetailsByUserId(userId: string) {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = (await this._tokenRepository.findByUserId(userId))!;
    }

    return user;
  }

  async getLikes(userId: string): Promise<number> {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = await this._tokenRepository.findByUserId(userId);
    }

    return user ? user.likes : 0;
  }

  async getSuperLikes(userId: string): Promise<number> {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = await this._tokenRepository.findByUserId(userId);
    }

    return user ? user.superLikes : 0;
  }

  async consumeLike(userId: string): Promise<boolean> {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = await this._tokenRepository.findByUserId(userId);
    }

    if (!user || user.likes <= 0) return false;

    await this._tokenRepository.updateLikes(userId, user.likes - 1);
    return true;
  }

  async consumeSuperLike(userId: string): Promise<boolean> {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = await this._tokenRepository.findByUserId(userId);
    }

    if (!user || user.superLikes <= 0) return false;

    await this._tokenRepository.updateSuperLikes(userId, user.superLikes - 1);
    return true;
  }

  async refillTokens(userId: string): Promise<void> {
    const { planId } =
      await this._subscriptionService.getUserSubscription(userId);

    console.log(planId);

    const limits = SUBSCRIPTION_LIMITS[planId];

    await this._tokenRepository.create(userId, limits.likes, limits.superLikes);
  }

  async getRefillTime(userId: string): Promise<Date | null> {
    let user = await this._tokenRepository.findByUserId(userId);

    if (!user) {
      await this.refillTokens(userId);
      user = await this._tokenRepository.findByUserId(userId);
    }

    return user ? new Date(user.nextRefill) : null;
  }
}
