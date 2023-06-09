import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";

const fastify = Fastify({
  logger: true,
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
fastify.register(prismaPlugin);

fastify.get("/", (request, reply) => {
  return { hello: "world" };
});

fastify.listen({ port: 3000 }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
