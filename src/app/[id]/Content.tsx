"use client";

import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";

export default function Content({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderMathInElement(contentRef.current as HTMLDivElement, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }, [content]);

  return (
    <div
      className="markdown"
      ref={contentRef}
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}