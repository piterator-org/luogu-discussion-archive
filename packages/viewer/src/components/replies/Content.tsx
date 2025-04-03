"use client";

import "katex/dist/katex.min.css";
import "highlight.js/styles/base16/tomorrow.min.css";

import remarkLuoguFlavor from "@luogu-discussion-archive/remark-lda-lfm";
import rehypeHighlight from "rehype-highlight";

import { MutableRefObject, useEffect, useRef, useState } from "react";

import { computePosition, shift } from "@floating-ui/dom";

import UserInfo from "@/components/UserInfo";
import UserAvatar from "@/components/UserAvatar";
import useSWR from "swr";
import { LatestUser } from "@/lib/user";
import fetcher from "@/lib/fetcher";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

function Tooltip({
  uid,
  discussionAuthor,
  mentionedRef,
}: {
  uid: number;
  discussionAuthor: number;
  mentionedRef: MutableRefObject<Record<number, HTMLDivElement | null>>;
}) {
  const { data } = useSWR<LatestUser>(`/user/${uid}/info`, fetcher);

  return (
    <div
      ref={(el) => {
        // eslint-disable-next-line no-param-reassign
        mentionedRef.current[uid] = el;
      }}
      key={uid}
      className="position-absolute"
      style={{ display: "none" }}
    >
      <div className="bg-body rounded-4 shadow-bssb-sm px-3 py-2x mb-2">
        <div className="d-flex me-auto">
          <div>
            <UserAvatar user={{ id: uid }} decoratorShadow="sm" />
          </div>
          <div className="ms-2x mt-1x">
            <div>
              {data ? <UserInfo user={data} /> : "Loading..."}
              {uid === discussionAuthor ? (
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
              ) : null}
            </div>
            <div
              className="mt-2 text-body-tertiary"
              style={{ fontSize: ".8em" }}
            >
              {/* {user.numReplies ? (
                  <>本帖共发言 {user.numReplies} 层</>
                ) : (
                  "未在本帖发言"
                )} */}
              {/* TODO: 把这个统计修好 */}
              被提到的用户
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Content({
  content,
  postAuthor,
  userMentionedState,
}: {
  content: string;
  postAuthor: number;
  // eslint-disable-next-line react/require-default-props
  userMentionedState?: [number | null, (uid: number | null) => void];
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const userRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [userMentions, setUserMentions] = useState<number[]>([]);

  useEffect(() => {
    const uids: number[] = [];

    contentRef.current?.querySelectorAll(".lfm-user-mention").forEach((e) => {
      const uid = parseInt(e.getAttribute("data-uid")!, 10);
      uids.push(uid);
    });

    setUserMentions(uids);
  }, [contentRef]);

  useEffect(() => {
    contentRef.current
      ?.querySelectorAll(".lfm-user-mention")
      .forEach((element) => {
        const uid = parseInt(element.getAttribute("data-uid")!, 10);
        const tooltip = userRefs.current[uid]!;
        if (!tooltip) return;

        function update() {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          computePosition(element as HTMLElement, tooltip, {
            placement: "top",
            middleware: [shift()],
          }).then(({ x, y }) =>
            Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` }),
          );
        }

        function showTooltip() {
          update();
          tooltip.style.display = "block";
        }

        function hideTooltip() {
          tooltip.style.display = "none";
        }

        (
          [
            ["mouseenter", showTooltip],
            ["mouseleave", hideTooltip],
            ["focus", showTooltip],
            ["blur", hideTooltip],
            [
              "mousedown",
              (event: Event) => {
                if (!userMentionedState) return;
                event.preventDefault();
                hideTooltip();
                if (userMentionedState[0] !== uid) {
                  userMentionedState[1](uid);
                } else {
                  userMentionedState[1](null);
                }
              },
            ],
            [
              "click",
              (event: Event) => {
                if (userMentionedState) event.preventDefault();
              },
            ],
          ] as [string, () => void][]
        ).forEach(([event, listener]) =>
          element.addEventListener(event, listener),
        );
      });
  }, [contentRef, userMentions, userMentionedState]);

  return (
    <>
      <div
        className="markdown text-break overflow-x-auto overflow-y-hidden"
        ref={contentRef}
      >
        <Markdown
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          remarkPlugins={[
            [remarkMath, {}],
            [remarkLuoguFlavor, { userLinkPointToLuogu: false }],
          ]}
          skipHtml
        >
          {content}
        </Markdown>
      </div>
      {userMentions.map((uid) => (
        <Tooltip
          mentionedRef={userRefs}
          discussionAuthor={postAuthor}
          uid={uid}
          key={uid}
        />
      ))}
    </>
  );
}
