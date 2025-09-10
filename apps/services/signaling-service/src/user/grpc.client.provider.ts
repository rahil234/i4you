import { Injectable } from '@nestjs/common';
import { credentials } from '@grpc/grpc-js';
import { UserServiceClient } from '@i4you/proto-files/user/v2';

const USER_GRPC_SERVER_URL = process.env.USER_GRPC_SERVER_URL!;

@Injectable()
export class GrpcClientProvider {
  public readonly userClient = new UserServiceClient(
    USER_GRPC_SERVER_URL,
    credentials.createInsecure(),
  );

  constructor() {
    this.connectWithRetry();
  }

  private connectWithRetry(retries = 5, delayMs = 3000) {
    const attempt = (remainingRetries: number) => {
      const deadline = new Date(Date.now() + 1000);

      this.userClient.waitForReady(deadline, (err) => {
        if (err) {
          console.error(
            `gRPC connection to ${USER_GRPC_SERVER_URL} failed. Retries left: ${remainingRetries}. Error:`,
            err.message,
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
