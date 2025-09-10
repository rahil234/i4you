import { injectable } from 'inversify';
import { credentials } from '@grpc/grpc-js';
import { env } from '@/config';
import { InteractionServiceClient } from '@i4you/proto-files/interaction/v1';

const { INTERACTION_GRPC_SERVER_URL } = env;

@injectable()
export class InteractionGrpcProvider extends InteractionServiceClient {
  constructor() {
    super(INTERACTION_GRPC_SERVER_URL, credentials.createInsecure());
    this.connectWithRetry();
  }

  private connectWithRetry(retries = 5, delayMs = 3000) {
    const attempt = (remainingRetries: number) => {
      const deadline = new Date(Date.now() + 1000);

      this.waitForReady(deadline, (err) => {
        if (err) {
          console.error(
            `gRPC connection to ${INTERACTION_GRPC_SERVER_URL} failed. Retries left: ${remainingRetries}. Error:`,
            err.message
          );
          if (remainingRetries > 0) {
            setTimeout(() => attempt(remainingRetries - 1), delayMs);
          } else {
            console.error('gRPC connection failed after all retries.');
            throw err;
          }
        } else {
          console.log(
            `Connected to Interaction gRPC server: ${INTERACTION_GRPC_SERVER_URL}`
          );
        }
      });
    };

    attempt(retries);
  }
}
