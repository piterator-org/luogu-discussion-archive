import { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { startTask } from "../lib/discussion";

export interface ServerToClientEvents {
  start: () => void;
  success: () => void;
  failure: (error: string) => void;
}

interface ClientToServerEvents {
  update: (discussion: number) => void;
  subscribe: (discussion: number) => void;
  unsubscribe: (discussion: number) => void;
}

declare module "fastify" {
  interface FastifyInstance {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
  }
}

export default fastifyPlugin(((fastify, options, done) => {
  fastify.decorate(
    "io",
    new Server(fastify.server, {
      serveClient: false,
      cors: {
        origin: [process.env.VIEWER_HOST ?? "", "https://admin.socket.io"],
        credentials: true,
      },
    }),
  );
  instrument(fastify.io, {
    auth: false,
    mode: process.env.NODE_ENV as never,
  });
  // eslint-disable-next-line @typescript-eslint/no-shadow
  fastify.addHook("onClose", (instance, done) => {
    instance.io.close();
    done();
  });

  fastify.io.on("connection", (socket) => {
    socket.on("update", (id) =>
      startTask(fastify.log, fastify.prisma, fastify.io.to(id.toString()), id),
    );
    socket.on("subscribe", (id) => socket.join(id.toString()));
    socket.on("unsubscribe", (id) => socket.leave(id.toString()));
  });
  done();
}) as FastifyPluginCallback);
