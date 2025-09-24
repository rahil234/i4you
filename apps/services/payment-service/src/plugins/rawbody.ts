import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    function (_req, body, done) {
      try {
        done(null, body);
      } catch (error) {
        error.statusCode = 400;
        done(error, undefined);
      }
    },
  );
});
