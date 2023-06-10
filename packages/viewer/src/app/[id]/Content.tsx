"use client";

import "katex/dist/katex.css";
import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import { computePosition } from "@floating-ui/dom";
import type { User } from "@prisma/client";
import UserInfo from "@/components/UserInfo";

export default function Content({
  content,
  usersMetioned,
}: {
  content: string;
  usersMetioned: User[];
}) {
  const refContent = useRef<HTMLDivElement>(null);
  const refsUser = useRef<Record<number, HTMLDivElement | null>>({});
  const refContext = useRef<HTMLDivElement>(null);
  const refUserRealLink = useRef<HTMLSpanElement>(null);
  const refUserStats = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    renderMathInElement(refContent.current as HTMLDivElement, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });

    refContent.current?.querySelectorAll("a[data-uid]").forEach((element) => {
      const tooltip = refsUser.current[
        parseInt(element.getAttribute("data-uid") as string, 10)
      ] as HTMLDivElement;

      function update() {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        computePosition(element as HTMLElement, tooltip, {
          placement: "top",
        }).then(({ x, y }) =>
          Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` })
        );
      }
      function showTooltip() {
        if ((refContext.current as HTMLDivElement).style.display === "none") {
          update();
          tooltip.style.display = "block";
        }
      }
      function hideTooltip() {
        tooltip.style.display = "none";
      }
      function switchContextHint() {
        (refContext.current as HTMLDivElement).style.display =
          (refContext.current as HTMLDivElement).style.display === "none"
            ? "block"
            : "none";
        if ((refContext.current as HTMLDivElement).style.display === "block") {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          computePosition(
            element as HTMLElement,
            refContext.current as HTMLDivElement,
            {
              placement: "top",
            }
          ).then(({ y }) =>
            Object.assign((refContext.current as HTMLDivElement).style, {
              top: `${y}px`,
            })
          );
        }
      }

      (
        [
          ["mouseenter", showTooltip],
          ["mouseleave", hideTooltip],
          ["focus", showTooltip],
          ["blur", hideTooltip],
          [
            "click",
            () => {
              hideTooltip();
              switchContextHint();
            },
          ],
        ] as [string, () => void][]
      ).forEach(([event, listener]) =>
        element.addEventListener(event, listener)
      );
    });
  }, [content]);

  return (
    <>
      <div
        className="markdown text-break overflow-x-auto overflow-y-hidden"
        ref={refContent}
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {usersMetioned.map((user) => (
        <div
          ref={(el) => {
            refsUser.current[user.id] = el;
          }}
          key={user.id}
          className="position-absolute"
          style={{ display: "none" }}
        >
          <div className="bg-body rounded-4 shadow-sm px-3 py-2x mb-2">
            <UserInfo user={user} />
          </div>
        </div>
      ))}
      {usersMetioned && (
        <div
          ref={refContext}
          className="position-absolute"
          style={{ display: "none", width: "100%", left: 0 }}
        >
          <div className="bg-body rounded-4 shadow px-4 py-3x mb-3">
            <div>
              <span ref={refUserRealLink} />
              <span ref={refUserStats} className="float-end" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
