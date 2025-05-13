import { injectable } from 'inversify';
import { createUserClient } from 'proto-files/client/userClient';
import { env } from '@/config';

const { USER_GRPC_SERVER_URL } = env;

@injectable()
export class GrpcClientProvider {
  public readonly userClient = createUserClient(USER_GRPC_SERVER_URL);

  constructor() {
    this.connectWithRetry();
  }

  private connectWithRetry(retries = 5, delayMs = 3000) {
    const attempt = (remainingRetries: number) => {
      const deadline = new Date(Date.now() + 1000); // 10 seconds max per try

      this.userClient.waitForReady(deadline, (err) => {
        if (err) {
          console.error(
            `gRPC connection to ${USER_GRPC_SERVER_URL} failed. Retries left: ${remainingRetries}. Error:`,
            err.message
          );
          if (remainingRetries > 0) {
            setTimeout(() => attempt(remainingRetries - 1), delayMs);
          } else {
            console.error('gRPC connection failed after all retries.');
            throw err;
          }
        } else {
          console.log(`Connected to User gRPC server: ${USER_GRPC_SERVER_URL}`);
        }
      });
    };

    attempt(retries);
  }
}
