import {
  GetAlreadyInteractedUsersRequest,
  GetAlreadyInteractedUsersResponse,
  InteractionServiceServer,
} from '@i4you/proto-files/interaction/v1';
import {
  sendUnaryData,
  ServerUnaryCall,
  UntypedHandleCall,
} from '@grpc/grpc-js';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { InteractionService } from '@/services/interaction.service';

const interactionService = container.get(
  TYPES.InteractionService
) as InteractionService;

export class InteractionGrpcService implements InteractionServiceServer {
  [name: string]: UntypedHandleCall;

  async getAlreadyInteractedUsers(
    call: ServerUnaryCall<
      GetAlreadyInteractedUsersRequest,
      GetAlreadyInteractedUsersResponse
    >,
    callback: sendUnaryData<GetAlreadyInteractedUsersResponse>
  ): Promise<void> {
    try {
      const { userId } = call.request;
      const usersIds =
        await interactionService.getAlreadyInteractedUsers(userId);
      callback(null, { usersIds });
    } catch (error) {
      callback(error as Error, null);
    }
  }
}
