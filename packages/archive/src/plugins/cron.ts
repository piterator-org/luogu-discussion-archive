import { once } from "node:events";
import type { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import delay from "../utils/delay";
import getDiscussionList from "../lib/list";
import { emitters, startTask } from "../lib/discussion";

const AUTO_SAVE_INTERVAL = 20000;

export default fastifyPlugin(
  function cron(fastify, options, done) {
    const save: () => Promise<unknown> = () =>
      (async (after) => [
        ...(await getDiscussionList(fastify.log, fastify.prisma, 1, after)),
        ...(await getDiscussionList(fastify.log, fastify.prisma, 2, after)),
      ])(Math.floor(new Date().getTime() / 1000) - 86400)
        .then((discussions) => {
          return discussions.reduce(
            (promise: Promise<unknown>, id) =>
              promise
                .then(() => {
                  fastify.log.debug({ targrt: id }, "started");
                  startTask(
                    fastify.log,
                    fastify.prisma,
                    fastify.io.to(id.toString()),
                    id
                  );
                  return once(emitters[id], "done");
                })
                .catch((err) => fastify.log.error(err))
                .then(() => fastify.log.debug({ targrt: id }, "finished"))
                .then(() => delay(500)),
            Promise.resolve()
          );
        })
        .catch((err) => fastify.log.error(err))
        .finally(() =>
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            save();
          }, AUTO_SAVE_INTERVAL)
        );
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    save();
    done();
  } as FastifyPluginCallback,
  { decorators: { fastify: ["prisma", "io"] } }
);
