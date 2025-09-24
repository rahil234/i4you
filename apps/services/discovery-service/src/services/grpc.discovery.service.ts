import {
    DiscoverServiceServer,
    GetPotentialMatchesRequest,
    GetPotentialMatchesResponse,
} from '@i4you/proto-files/discovery/v2';
import {handleUnaryCall, UntypedHandleCall} from '@grpc/grpc-js';

import {TYPES} from '@/types';
import {container} from '@/config/inversify.config';
import {DiscoveryService} from '@/services/discovery.service';

const discoverService = container.get<DiscoveryService>(TYPES.DiscoverService);

export class discoverGrpcService implements DiscoverServiceServer {
    [name: string]: UntypedHandleCall;

    getPotentialMatches: handleUnaryCall<
        GetPotentialMatchesRequest,
        GetPotentialMatchesResponse
    > = async (call, callback) => {
        try {
            const matches = await discoverService.getPotentialMatches(call.request);
            callback(null, matches);
        } catch (err) {
            console.log('Error in getPotentialMatches:', err);
            callback({code: 13, message: err?.message, stack: err?.stack});
        }
    };
}
