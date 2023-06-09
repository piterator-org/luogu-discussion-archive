import fastifyPlugin from "fastify-plugin";
import prisma from "../lib/prisma";

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const prismaPlugin = fastifyPlugin(async (fastify) => {
  await prisma.$connect();

  // Make Prisma Client available through the fastify server instance: server.prisma
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});

export default prismaPlugin;
