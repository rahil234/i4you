import {UserJwtPayload} from "@i4you/shared";

declare module 'fastify' {
    interface FastifyRequest {
        user?: { id: string; role: UserJwtPayload['role'] };
    }

    interface FastifyInstance {
        authenticateAndAuthorize: (
            roles?: Array<UserJwtPayload['role']>
        ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}