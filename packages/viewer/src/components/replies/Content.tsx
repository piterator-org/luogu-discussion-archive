// eslint-disable
// Not impl: Context
"use client";

import "katex/dist/katex.min.css";
import "highlight.js/styles/tokyo-night-dark.css";
import { useEffect, useRef } from "react";
// import { computePosition, shift } from "@floating-ui/dom";
// import type { UserMetioned } from "@/lib/serialize-reply";
// import UserInfo from "@/components/UserInfo";
// import UserAvatar from "@/components/UserAvatar";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default function Content({
  // Markdown
  content,
  discussionAuthor,
  // usersMetioned,
  userIdState,
}: {
  content: string;
  discussionAuthor: number;
  // usersMetioned: UserMetioned[];
  // eslint-disable-next-line react/require-default-props
  userIdState?: [number | null, (userId: number | null) => void];
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  // const userRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // useEffect(() => {
  //   contentRef.current?.querySelectorAll("a[data-uid]").forEach((element) => {
  //     const uid = parseInt(element.getAttribute("data-uid")!, 10);
  //     const tooltip = userRefs.current[uid]!;
  //     if (!tooltip) return;

  //     function update() {
  //       // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //       computePosition(element as HTMLElement, tooltip, {
  //         placement: "top",
  //         middleware: [shift()],
  //       }).then(({ x, y }) =>
  //         Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` }),
  //       );
  //     }
  //     function showTooltip() {
  //       update();
  //       tooltip.style.display = "block";
  //     }
  //     function hideTooltip() {
  //       tooltip.style.display = "none";
  //     }

  //     (
  //       [
  //         ["mouseenter", showTooltip],
  //         ["mouseleave", hideTooltip],
  //         ["focus", showTooltip],
  //         ["blur", hideTooltip],
  //         ...(userIdState
  //           ? [
  //               [
  //                 "click",
  //                 (event: Event) => {
  //                   event.preventDefault();
  //                   hideTooltip();
  //                   if (userIdState[0] !== uid) userIdState[1](uid);
  //                   else userIdState[1](null);
  //                 },
  //               ],
  //             ]
  //           : []),
  //       ] as [string, () => void][]
  //     ).forEach(([event, listener]) =>
  //       element.addEventListener(event, listener),
  //     );
  //   });
  // });

  return (
    <>
      <div
        className="markdown text-break overflow-x-auto overflow-y-hidden"
        ref={contentRef}
      />
      <Markdown
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkMath]}
        children={content}
        skipHtml={true}
      />
      {/* {usersMetioned.map((user) => (
        <div
          ref={(el) => {
            userRefs.current[user.id] = el;
          }}
          key={user.id}
          className="position-absolute"
          style={{ display: "none" }}
        >
          <div className="bg-body rounded-4 shadow-bssb-sm px-3 py-2x mb-2">
            <div className="d-flex me-auto">
              <div>
                <UserAvatar className="" user={user} decoratorShadow="sm" />
              </div>
              <div className="ms-2x mt-1x">
                <div>
                  <UserInfo user={user} />
                  {user.id === discussionAuthor ? (
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
                </div>
                <div
                  className="mt-2 text-body-tertiary"
                  style={{ fontSize: ".8em" }}
                >
                  {user.numReplies ? (
                    <>本帖共发言 {user.numReplies} 层</>
                  ) : (
                    "未在本帖发言"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))} */}
    </>
  );
}
