import { once } from "node:events";
import type { FastifyPluginCallback } from "fastify";
import type { PrismaPromise } from "@prisma/client";
import { emitters, startTask } from "../lib/discussion";
import saveJudgements from "../lib/judgement";
import savePaste from "../lib/paste";
import saveActivities, { saveActivityPage } from "../lib/activity";

export default (function routes(fastify, options, done) {
  fastify.get("/", () => ({ tasks: Object.keys(emitters) }));

  fastify.get("/judgement", (request, reply) => {
    saveJudgements(
      fastify.log.child({ reqId: request.id, target: "judgement" }),
      fastify.prisma,
    )
      .then(() => reply.code(201).send({}))
      .catch((err: Error) => reply.code(500).send({ error: err.message }));
  });

  fastify.get<{ Params: { id: string } }>(
    "/paste/:id([a-z\\d+]{8})",
    (request, reply) => {
      savePaste(
        fastify.log.child({
          reqId: request.id,
          target: request.params.id,
        }),
        fastify.prisma,
        request.params.id,
      )
        .then(() => reply.code(201).send({}))
        .catch((err: Error) => reply.code(500).send({ error: err.message }));
    },
  );

  fastify.get<{ Params: { id: string } }>("/:id(\\d+)", (request, reply) => {
    const id = parseInt(request.params.id, 10);
    startTask(
      fastify.log.child({ reqId: request.id, target: id }),
      fastify.prisma,
      fastify.io.to(request.params.id),
      id,
    );
    once(emitters[id], "done")
      .then(() => reply.code(201).send({}))
      .catch((err: Error) => reply.code(500).send({ error: err.message }));
  });

  fastify.get("/activity", (request, reply) =>
    saveActivities(fastify.log, fastify.prisma).then(() =>
      reply.code(201).send({}),
    ),
  );

  fastify.get<{ Params: { page: string } }>(
    "/activity/:page(\\d+)",
    async (request, reply) => {
      const operations: PrismaPromise<unknown>[] = [];
      const res = await saveActivityPage(
        fastify.log,
        fastify.prisma,
        parseInt(request.params.page, 10),
        operations,
      );
      await fastify.prisma.$transaction(operations);
      return reply.code(201).send(res);
    },
  );

  done();
} as FastifyPluginCallback);
