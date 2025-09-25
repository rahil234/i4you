import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

export const handleAsync = (
  fn: (req: FastifyRequest, reply: FastifyReply) => Promise<any>,
) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await fn(req, reply);
    } catch (err) {
      reply.send(err);
    }
  };
};
