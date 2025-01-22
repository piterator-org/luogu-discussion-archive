import { once } from "node:events";
import type { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
// import saveActivities from "../lib/activity";

import delay from "../utils/delay";
import getPostList from "../lib/list";
import { emitters, startTask } from "../lib/post";

const AUTO_SAVE_PAGES = 5;

const AUTO_SAVE_INTERVAL = 1000;

function repeat(functionRef: () => Promise<unknown>) {
  const func: () => Promise<unknown> = () =>
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    functionRef().finally(() => setTimeout(func, AUTO_SAVE_INTERVAL));
  func(); // eslint-disable-line @typescript-eslint/no-floating-promises
}

export default fastifyPlugin(
  function cron(fastify, options, done) {
    const logger = fastify.log.child({ type: "cron" });
    const save = (): Promise<unknown> =>
      Array.from(Array(AUTO_SAVE_PAGES))
        .reduce(
          (prev: Promise<number[]>, curr, i) =>
            prev.then(async (array) =>
              array.concat(
                await getPostList(
                  logger,
                  fastify.prisma,
                  i + 1,
                  Math.floor(new Date().getTime() / 1000) - 86400,
                ),
              ),
            ),
          Promise.resolve([]),
        )
        .then((posts) => {
          return posts.reduce(
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
        });

    repeat(save);
    // repeat(() =>
    //   saveActivities(logger, fastify.prisma).catch((err) => logger.error(err)),
    // );
    done();
  } as FastifyPluginCallback,
  { decorators: { fastify: ["prisma", "io"] } },
);
