import Fastify from "fastify";
import cors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma";
import routes from "./plugins/routes";

const fastify = Fastify({
  logger: true,
});

/* eslint-disable @typescript-eslint/no-floating-promises */
fastify.register(prismaPlugin);
fastify.register(cors);
fastify.register(routes);
/* eslint-enable @typescript-eslint/no-floating-promises */

fastify.listen({ port: 3000 }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
