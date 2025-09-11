export interface IUserService {
  isSuspended(userId: string): Promise<boolean>;

  suspendUser(userId: string, reason: string): Promise<void>;
}
