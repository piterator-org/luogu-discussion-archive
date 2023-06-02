import { notFound } from "next/navigation";
import { collection, users } from "@/lib/mongodb";
import Reply from "../Reply";
import PageButton from "./PageButton";

const REPLIES_PER_PAGE = parseInt(process.env.REPLIES_PER_PAGE ?? "10", 10);
const RADIUS_PAGES_LOCAL_SHOWED = parseInt(
  process.env.RADIUS_PAGES_LOCAL_SHOWED ?? "2",
  10
);

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
            _id: 1,
            replies: {
              $slice: [(page - 1) * REPLIES_PER_PAGE, REPLIES_PER_PAGE],
            },
          },
        }
      )) ?? notFound()
    ).replies.map((reply, i) =>
      users
        .then((u) => u.findOne({ _id: reply.author }))
        .then((u) => ({
          ...reply,
          time: reply.time.toLocaleString("zh").split(":", 2).join(":"),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          author: u!,
          id: (page - 1) * REPLIES_PER_PAGE + i,
        }))
    )
  );

  const numPages = Math.ceil(
    ((
      await (await collection)
        .aggregate([
          { $match: { _id: id } },
          { $project: { size: { $size: "$replies" } } },
        ])
        .toArray()
    )[0].size as number) / REPLIES_PER_PAGE
  );
  const numPagesLocalOverlappedFront = Math.max(
    0,
    2 - (page - RADIUS_PAGES_LOCAL_SHOWED)
  );
  const numPagesLocalOverlappedBack = Math.max(
    0,
    page +
      RADIUS_PAGES_LOCAL_SHOWED +
      numPagesLocalOverlappedFront -
      (numPages - 1)
  );
  const pageLocalFirst = Math.max(
    2,
    page - RADIUS_PAGES_LOCAL_SHOWED - numPagesLocalOverlappedBack
  );
  const pageLocalLast = Math.min(
    numPages - 1,
    page + RADIUS_PAGES_LOCAL_SHOWED + numPagesLocalOverlappedFront
  );
  const pagesLocalAttachedFront = pageLocalFirst === 2;
  const pagesLocalAttachedBack = pageLocalLast === numPages - 1;
  const pagesLocal = Array.from(
    { length: pageLocalLast - pageLocalFirst + 1 },
    (_, k) => k + pageLocalFirst
  );

  const ellipsis = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-three-dots text-end text-secondary mx-1"
      viewBox="0 0 16 16"
    >
      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );

  return (
    <>
      {replies.map((reply) => (
        <Reply reply={reply} key={reply.id} />
      ))}
      {numPages > 1 && (
        <div className="bg-body rounded-4 shadow my-4s px-4 py-3 py-md-4 text-center">
          <PageButton discussion={id} page={1} active={page} />
          {pagesLocalAttachedFront || ellipsis}
          {pagesLocal.map((curPage) => (
            <PageButton
              discussion={id}
              page={curPage}
              active={page}
              key={curPage}
            />
          ))}
          {pagesLocalAttachedBack || ellipsis}
          <PageButton discussion={id} page={numPages} active={page} />
        </div>
      )}
    </>
  );
}
