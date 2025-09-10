export interface IInteractionService {
  getInteractedUserIds(userId: string): Promise<string[]>;
}
