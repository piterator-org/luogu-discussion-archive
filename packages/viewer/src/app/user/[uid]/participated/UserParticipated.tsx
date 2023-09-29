"use client";

import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PostWithLatestContent } from "@/lib/post";
// import type { UserMetioned } from "@/lib/serialize-reply";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Content from "@/components/replies/Content";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import { NUM_MAX_REPLIES_SHOWED_DEFAULT } from "../constants";
import { LatestUser } from "@/lib/user";
import { ReplyWithLatestContentPostMeta } from "@/lib/reply";
import stringifyTime from "@/lib/time";

interface PageData {
  data: (PostWithLatestContent & {
    replies: ReplyWithLatestContentPostMeta[];
  })[];
  nextCursor: number;
}

export default function UserParticipated({
  uid,
  user,
}: {
  uid: string;
  user: LatestUser;
}) {
  const { data, size, setSize, isValidating } = useSWRInfinite<PageData>(
    (pageIndex: number, previousPageData: PageData) =>
      previousPageData && !previousPageData.data.length
        ? null
        : `/user/${uid}/participated/data${
            pageIndex ? `?cursor=${previousPageData.nextCursor}` : ""
          }`,
    fetcher
  );

  return (
    <>
      <InfiniteScroll
        dataLength={data?.reduce((c, a) => c + a.data.length, 0) ?? 0}
        next={() => setSize(size + 1)}
        hasMore={Boolean(data?.[data.length - 1].data.length)}
        loader
        style={{ overflow: "inherit" }}
        scrollThreshold="1024px"
        endMessage={
          isValidating || (
            <p className="mt-4x text-center text-body-tertiary">没有更多了哦</p>
          )
        }
      >
        {data?.map(({ data: discussions }) =>
          discussions.map((discussion) => (
            <div className="entry-md position-relative" key={discussion.id}>
              <UserAvatar
                className="entry-md-avatar"
                user={discussion.snapshots[0].author}
              />
              <div className="entry-md-card rounded-4 shadow-bssb mb-4s">
                <div className="entry-md-meta bg-light-bssb rounded-top-4 pe-4 py-2 overflow-ellipsis">
                  <UserInfo user={discussion.snapshots[0].author} />
                  {discussion.snapshots[0].author.id === user.id ? (
                    <span
                      className="ms-1 badge position-relative bg-orange d-inline-block"
                      style={{
                        top: "-.15em",
                        left: ".08em",
                        marginRight: ".08em",
                      }}
                    >
                      当前用户
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="entry-md-content pe-4 py-3">
                  <Link
                    className="text-decoration-none fw-medium d-inline-block"
                    href={`/${discussion.id}`}
                  >
                    {discussion.snapshots[0].title}
                  </Link>
                  {discussion.snapshots[0].author.id === user.id ? (
                    <details className="my-2">
                      <summary>
                        <span
                          className="link-secondary"
                          style={{ fontSize: ".9rem" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            className="bi bi-journal-bookmark me-1"
                            viewBox="0 0 16 16"
                            style={{ position: "relative", top: "-.11em" }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"
                            />
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />{" "}
                          </svg>
                          <span className="open-hide">查看</span>
                          <span className="d-none open-show-inline">隐藏</span>
                          正文
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            className="bi bi-three-dots ms-1 open-hide"
                            viewBox="0 0 16 16"
                            style={{ position: "relative", top: "-.1125em" }}
                          >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                          </svg>
                        </span>
                      </summary>
                      <Content
                        discussionAuthor={discussion.snapshots[0].author.id}
                        content={discussion.snapshots[0].content}
                        // usersMetioned={discussion.usersMetioned}
                      />
                    </details>
                  ) : undefined}
                  {discussion.replies.length ? (
                    <details
                      className="my-2"
                      open={
                        discussion.replies.length <=
                        NUM_MAX_REPLIES_SHOWED_DEFAULT
                      }
                    >
                      <summary>
                        <span
                          className="link-secondary"
                          style={{ fontSize: ".9rem" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            className="bi bi-archive me-1"
                            viewBox="0 0 16 16"
                            style={{ position: "relative", top: "-.085em" }}
                          >
                            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                          </svg>
                          在该帖子下回复了 {discussion.replies.length} 层
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            className="bi bi-three-dots ms-1 open-hide"
                            viewBox="0 0 16 16"
                            style={{ position: "relative", top: "-.1125em" }}
                          >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                          </svg>
                        </span>
                      </summary>
                      <div className="timeline">
                        {discussion.replies.map((reply) => (
                          <div className="timeline-node" key={reply.id}>
                            <div className="rounded-4 shadow-bssb-sm my-3x">
                              <div className="timeline-connect bg-light-bssb rounded-top-4 px-4 py-2">
                                <UserInfo user={user} />
                                {reply.snapshots[0].author.id ===
                                discussion.snapshots[0].author.id ? (
                                  <span
                                    className="ms-1 badge position-relative bg-teal d-inline-block"
                                    style={{
                                      top: "-.15em",
                                      left: ".08em",
                                      marginRight: ".08em",
                                    }}
                                  >
                                    楼主
                                  </span>
                                ) : (
                                  ""
                                )}
                                <span className="float-end text-body-tertiary">
                                  <span className="d-none d-md-inline">
                                    {stringifyTime(reply.time)}
                                  </span>
                                  <Link
                                    href={`/r/${reply.id}`}
                                    className="ms-2 link-secondary position-relative"
                                    style={{ fontSize: ".8em", top: "-.2em" }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1em"
                                      height="1em"
                                      fill="currentColor"
                                      className="bi bi-box-arrow-up-right"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                                      />
                                    </svg>
                                  </Link>
                                </span>
                              </div>
                              <div className="px-4 py-2 position-relative">
                                <Content
                                  discussionAuthor={
                                    discussion.snapshots[0].author.id
                                  }
                                  content={reply.snapshots[0].content}
                                  // usersMetioned={reply.usersMetioned}
                                />
                                <span
                                  className="text-end text-body-tertiary d-block d-md-none"
                                  style={{ fontSize: ".8rem" }}
                                >
                                  {stringifyTime(reply.time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <div className="my-2">
                      <span
                        className="text-secondary"
                        style={{ fontSize: ".9rem" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          className="bi bi-database-slash me-1"
                          viewBox="0 0 16 16"
                          style={{ position: "relative", top: "-.09em" }}
                        >
                          <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465l3.465-3.465Zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465Zm-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95Z" />
                          <path d="M12.096 6.223A4.92 4.92 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.493 4.493 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.525 4.525 0 0 1-.813-.927C8.5 14.992 8.252 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.552 4.552 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10c.262 0 .52-.008.774-.024a4.525 4.525 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777ZM3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4Z" />
                        </svg>
                        未在该帖子下回复
                      </span>
                    </div>
                  )}
                  <div
                    className="text-body-tertiary mt-1"
                    style={{ fontSize: ".8rem" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      className="bi bi-chat-dots"
                      viewBox="0 0 16 16"
                      style={{ position: "relative", top: "-.1125em" }}
                    >
                      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                    </svg>{" "}
                    {discussion.replyCount}
                    <span className="float-end">{stringifyTime(discussion.time)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
