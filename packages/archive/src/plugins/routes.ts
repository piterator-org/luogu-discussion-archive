import type { FastifyPluginCallback } from "fastify";
import { emitters, metadata, startTask } from "../lib/discussion";
import saveJudgements from "../lib/judgement";

export default (function routes(fastify, options, done) {
  fastify.get("/", () => ({
    ok: true,
    metadata: Array.from(metadata),
    current: Object.keys(emitters),
  }));

  fastify.get("/judgement", (request, reply) => {
    saveJudgements(
      fastify.log.child({ reqId: request.id as string, target: "judgement" }),
      fastify.prisma
    )
      .then(() => reply.code(201).send({}))
      .catch((err: Error) => reply.code(500).send({ error: err.message }));
  });

  fastify.get<{ Params: { id: string } }>("/:id", (request, reply) => {
    const id = parseInt(request.params.id, 10);
    startTask(
      fastify.log.child({ reqId: request.id as string, target: id }),
      fastify.prisma,
      id
    )
      .then(() => reply.code(202).send({}))
      .catch((err: Error) =>
        reply.code(500).send({ ok: false, error: err.message })
      );
  });

  done();
} as FastifyPluginCallback);
