import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { InteractionGrpcProvider } from '@/providers/interaction.grpc.provider';
import { IInteractionService } from '@/services/interfaces/IInteractionService';

@injectable()
export class GRPCInteractionService implements IInteractionService {
  constructor(
    @inject(TYPES.InteractionGrpcProvider)
    private _interactionServiceClient: InteractionGrpcProvider
  ) {}

  async getInteractedUserIds(userId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._interactionServiceClient.getAlreadyInteractedUsers(
        { userId },
        (err, response) => {
          if (err) return reject(err);
          resolve(response.usersIds);
        }
      );
    });
  }
}
