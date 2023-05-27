import { notFound } from "next/navigation";
import { collection } from "@/lib/mongodb";

export default async function Page({ params }: { params: { id: string } }) {
  const { author, content, forum, replies, time } =
    (await (
      await collection
    ).findOne({
      _id: parseInt(params.id, 10),
    })) ?? notFound();
  return (
    <>
      <div>
        {author} at {time.toLocaleString()} in {forum}:{" "}
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {replies.map((reply) => (
        <div>
          {reply.author} at {reply.time.toLocaleString()}:{" "}
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: reply.content }} />
        </div>
      ))}
    </>
  );
}
