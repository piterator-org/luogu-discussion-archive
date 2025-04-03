"use client";

import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import type { PostWithLatestContent } from "@/lib/post";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/UserInfo";
import Content from "@/components/replies/Content";
import fetcher from "@/lib/fetcher";
import Spinner from "@/components/Spinner";
import { LatestUser } from "@/lib/user";
import { ReplyWithLatestContentPostMeta } from "@/lib/reply";
import stringifyTime from "@/lib/time";
import {
  BsArchive,
  BsArrowUpRight,
  BsChatDots,
  BsDatabaseSlash,
  BsJournalBookmark,
  BsThreeDots,
} from "react-icons/bs";
import { NUM_MAX_REPLIES_SHOWED_DEFAULT } from "../constants";

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
    fetcher,
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
                          <BsJournalBookmark
                            className="me-1"
                            style={{ position: "relative", top: "-.11em" }}
                          />
                          <span className="open-hide">查看</span>
                          <span className="d-none open-show-inline">隐藏</span>
                          正文
                          <BsThreeDots
                            className="ms-1 open-hide"
                            style={{ position: "relative", top: "-.1125em" }}
                          />
                        </span>
                      </summary>
                      <Content
                        postAuthor={discussion.snapshots[0].author.id}
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
                          <BsArchive
                            className="me-1"
                            style={{ position: "relative", top: "-.085em" }}
                          />
                          在该帖子下回复了 {discussion.replies.length} 层
                          <BsThreeDots
                            className="ms-1 open-hide"
                            style={{ position: "relative", top: "-.1125em" }}
                          />
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
                                    <BsArrowUpRight />
                                  </Link>
                                </span>
                              </div>
                              <div className="px-4 py-2 position-relative">
                                <Content
                                  postAuthor={discussion.snapshots[0].author.id}
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
                        <BsDatabaseSlash
                          className="me-1"
                          style={{ position: "relative", top: "-.09em" }}
                        />
                        未在该帖子下回复
                      </span>
                    </div>
                  )}
                  <div
                    className="text-body-tertiary mt-1"
                    style={{ fontSize: ".8rem" }}
                  >
                    <BsChatDots
                      style={{ position: "relative", top: "-.1125em" }}
                    />{" "}
                    {discussion.replyCount}
                    <span className="float-end">
                      {stringifyTime(discussion.time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )),
        )}
      </InfiniteScroll>
      {isValidating && <Spinner />}
    </>
  );
}
