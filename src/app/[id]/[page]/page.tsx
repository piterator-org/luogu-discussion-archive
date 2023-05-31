import { notFound } from "next/navigation";
import { collection, users } from "@/lib/mongodb";
import Reply from "../Reply";

const REPLIES_PER_PAGE = 20;

export default async function Page({
  params,
}: {
  params: { id: string; page: string };
}) {
  const id = parseInt(params.id, 10);
  const page = parseInt(params.page, 10);
  const replies = await Promise.all(
    (
      (await (
        await collection
      ).findOne(
        { _id: id },
        {
          projection: {
            _id: 0,
            author: 0,
            content: 0,
            forum: 0,
            lastUpdate: 0,
            replies: {
              $slice: [(page - 1) * REPLIES_PER_PAGE, REPLIES_PER_PAGE],
            },
            time: 0,
            title: 0,
          },
        }
      )) ?? notFound()
    ).replies.map((reply) =>
      users
        .then((u) => u.findOne({ _id: reply.author }))
        .then((u) => ({
          ...reply,
          time: reply.time.toLocaleString("zh").split(":", 2).join(":"),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          author: u!,
        }))
    )
  );
  const pages = Math.ceil(
    ((
      await (await collection)
        .aggregate([
          { $match: { _id: id } },
          { $project: { _id: id, size: { $size: "$replies" } } },
        ])
        .toArray()
    )[0].size as number) / REPLIES_PER_PAGE
  );
  return replies.map((reply) => <Reply reply={reply} />);
}
