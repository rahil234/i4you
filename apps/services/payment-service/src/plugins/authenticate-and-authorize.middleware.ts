import { FastifyRequest} from 'fastify';
import fp from 'fastify-plugin';
import {UserJwtPayload} from '@i4you/shared';

class AuthError extends Error {
    statusCode = 401;

    constructor(message: string) {
        super(message);
    }
}

class ForbiddenError extends Error {
    statusCode = 403;

    constructor(message: string) {
        super(message);
    }
}

interface Options {
    roles?: Array<UserJwtPayload['role']>;
}

const authenticateAndAuthorize = fp(
    (fastify, opts: Options, done) => {
        fastify.decorate(
            'authenticateAndAuthorize',
            (roles: Array<UserJwtPayload['role']> = []) =>
                async (request: FastifyRequest) => {
                    const userId = request.headers['x-user-id'] as string;
                    const userRole = request.headers['x-user-role'] as UserJwtPayload['role'];

                    if (!userId || !userRole) {
                        throw new AuthError('User not authenticated');
                    }

                    request.user = {id: userId, role: userRole};

                    if (roles.length && !roles.includes(userRole)) {
                        throw new ForbiddenError('Unauthorized');
                    }
                }
        );
        done();
    }
);

export default authenticateAndAuthorize;
