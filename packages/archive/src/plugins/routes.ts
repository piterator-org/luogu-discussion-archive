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
    saveJudgements()
      .then(() => reply.code(201).send({}))
      .catch((err: Error) => reply.code(500).send({ error: err.message }));
  });

  fastify.get<{ Params: { id: string } }>("/:id", (request, reply) => {
    startTask(parseInt(request.params.id, 10))
      .then(() => reply.code(202).send({}))
      .catch((err: Error) =>
        reply.code(500).send({ ok: false, error: err.message })
      );
  });

  done();
} as FastifyPluginCallback);
