import { notFound } from "next/navigation";
import Image from "next/image";
import { collection, users } from "@/lib/mongodb";
import UserInfo from "./UserInfo";

export default async function Page({ params }: { params: { id: string } }) {
  const { author, content, forum, replies, time } =
    (await (
      await collection
    ).findOne({
      _id: parseInt(params.id, 10),
    })) ?? notFound();
  const r = await Promise.all(
    [{ author, time, content }, ...replies].map((reply) =>
      users
        .then((u) => u.findOne({ _id: reply.author }))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then((u) => ({ ...reply, author: u! }))
    )
  );
  return (
    <ul className="list-group list-group-flush">
      {r.map((reply) => (
        <li className="list-group-item d-flex">
          <a
            href={`https://www.luogu.com.cn/user/${reply.author._id}`}
            className="mx-2 position-relative flex-shrink-0"
            style={{ width: "3em", height: "3em" }}
          >
            <Image
              src={`https://cdn.luogu.com.cn/upload/usericon/${reply.author._id}.png`}
              className="rounded"
              fill
              alt={reply.author._id.toString()}
            />
          </a>
          <div className="flex-grow-1">
            <UserInfo user={reply.author} />
            <span className="float-end">
              {reply.time.toLocaleString("zh").split(":", 2).join(":")}
            </span>
            <div
              className="mt-1"
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: reply.content }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
