import fetchDiscussion from "@/lib/fetch";

export default async function Page({ params }: { params: { id: string } }) {
  const { author, content, forum, replies, time } = await fetchDiscussion(
    params.id
  );
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
