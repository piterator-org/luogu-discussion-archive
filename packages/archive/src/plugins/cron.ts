import { once } from "node:events";
import type { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import delay from "../utils/delay";
import getDiscussionList from "../lib/list";
import { emitters, startTask } from "../lib/discussion";

const AUTO_SAVE_PAGES = 5;
const AUTO_SAVE_INTERVAL = 15000;

export default fastifyPlugin(
  function cron(fastify, options, done) {
    const save: () => Promise<unknown> = () =>
      Array.from(Array(AUTO_SAVE_PAGES))
        .reduce(
          (prev: Promise<number[]>, curr, i) =>
            prev.then(async (array) =>
              array.concat(
                await getDiscussionList(
                  fastify.log,
                  fastify.prisma,
                  i + 1,
                  Math.floor(new Date().getTime() / 1000) - 86400,
                ),
              ),
            ),
          Promise.resolve([]),
        )
        .then((discussions) => {
          return discussions.reduce(
            (promise: Promise<unknown>, id) =>
              promise
                .then(() => {
                  fastify.log.debug({ target: id }, "started");
                  startTask(
                    fastify.log,
                    fastify.prisma,
                    fastify.io.to(id.toString()),
                    id,
                  );
                  return once(emitters[id], "done");
                })
                .catch((err) => fastify.log.error(err))
                .then(() => fastify.log.debug({ target: id }, "finished"))
                .then(() => delay(500)),
            Promise.resolve(),
          );
        })
        .catch((err) => fastify.log.error(err))
        .finally(() =>
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            save();
          }, AUTO_SAVE_INTERVAL),
        );
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    save();
    done();
  } as FastifyPluginCallback,
  { decorators: { fastify: ["prisma", "io"] } },
);
