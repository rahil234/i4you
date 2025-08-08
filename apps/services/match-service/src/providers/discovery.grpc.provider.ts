import { injectable } from 'inversify';
import { DiscoverServiceClient } from '@i4you/proto-files/discovery/v2';
import { credentials } from '@grpc/grpc-js';
import { env } from '@/config';
import { DiscoveryGrpcService } from '@/services/discovery.grpc.service';

const { DISCOVERY_GRPC_SERVER_URL } = env;

@injectable()
export class DiscoveryGrpcProvider extends DiscoverServiceClient {
  constructor() {
    super(DISCOVERY_GRPC_SERVER_URL, credentials.createInsecure());
    this.connectWithRetry();
  }

  private connectWithRetry(retries = 5, delayMs = 3000) {
    const attempt = (remainingRetries: number) => {
      const deadline = new Date(Date.now() + 1000);

      this.waitForReady(deadline, (err) => {
        if (err) {
          console.error(
            `gRPC connection to ${DISCOVERY_GRPC_SERVER_URL} failed. Retries left: ${remainingRetries}. Error:`,
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
            `Connected to Discovery gRPC server: ${DISCOVERY_GRPC_SERVER_URL}`
          );
        }
      });
    };

    attempt(retries);
  }
}
