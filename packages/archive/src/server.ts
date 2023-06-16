import Fastify from "fastify";
import pino from "pino";
import cors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma";
import routes from "./plugins/routes";
import io from "./plugins/socket.io";

const fastify = Fastify({
  logger: process.env.SOURCE_TOKEN
    ? pino(
        pino.transport<{ sourceToken: string }>({
          target: "@logtail/pino",
          options: { sourceToken: process.env.SOURCE_TOKEN },
        })
      )
    : true,
});

/* eslint-disable @typescript-eslint/no-floating-promises */
fastify.register(prismaPlugin);
fastify.register(cors);
fastify.register(routes);
fastify.register(io);
/* eslint-enable @typescript-eslint/no-floating-promises */

fastify
  .listen({ port: parseInt(process.env.PORT ?? "3000", 10) })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
