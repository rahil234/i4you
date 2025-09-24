export interface ITransactionService {
    acquireLock(userId: string): Promise<boolean>;

    releaseLock(userId: string): Promise<boolean>;
}
