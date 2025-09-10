export interface IGRPCInteractionService {
  getAlreadyInteractedUsers(userId: string): Promise<string[]>;
}
