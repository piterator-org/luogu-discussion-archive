import { once } from "node:events";
import type { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import delay from "../utils/delay";
import getDiscussionList from "../lib/list";
import { emitters, startTask } from "../lib/discussion";
import saveActivities from "../lib/activity";

const AUTO_SAVE_PAGES = 5;
const AUTO_SAVE_INTERVAL = 1000;

export default fastifyPlugin(
  function cron(fastify, options, done) {
    const logger = fastify.log.child({ type: "cron" });
    const save = (): Promise<unknown> =>
      Array.from(Array(AUTO_SAVE_PAGES))
        .reduce(
          (prev: Promise<number[]>, curr, i) =>
            prev.then(async (array) =>
              array.concat(
                await getDiscussionList(
                  logger,
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
                  logger.debug({ id }, "started");
                  startTask(
                    logger,
                    fastify.prisma,
                    fastify.io.to(id.toString()),
                    id,
                  );
                  return once(emitters[id], "done");
                })
                .catch((err) => logger.error(err))
                .then(() => logger.debug({ id }, "finished"))
                .then(() => delay(500)),
            Promise.resolve(),
          );
        })
        .then(() => saveActivities(logger, fastify.prisma))
        .catch((err) => logger.error(err))
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
