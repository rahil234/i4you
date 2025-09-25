import { Lock } from 'redlock';
import { redlock } from '@/utils/lock';
import { ITransactionService } from '@/services/interfaces/ITransactionService';

export class TransactionService implements ITransactionService {
  private _activeLocks = new Map<string, Lock>();

  async acquireLock(userId: string, ttl = 60000): Promise<boolean> {
    const lockKey = `lock:user:${userId}`;
    try {
      const lock = await redlock.acquire([lockKey], ttl);
      this._activeLocks.set(userId, lock);
      console.log(`Lock acquired for user ${userId}`);
      return true;
    } catch (err) {
      console.log(`Failed to acquire lock for user ${userId}: `, err);
      return false;
    }
  }

  async releaseLock(userId: string): Promise<boolean> {
    const lock = this._activeLocks.get(userId);
    if (!lock) {
      console.log(`No lock found for user ${userId}`);
      return false;
    }

    try {
      await redlock.release(lock);
      this._activeLocks.delete(userId);
      console.log(`Lock released for user ${userId}`);
      return true;
    } catch (err) {
      console.log(`Failed to release lock for user ${userId}`, err);
      return false;
    }
  }
}
