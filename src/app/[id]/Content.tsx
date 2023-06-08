"use client";

import "katex/dist/katex.css";
import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";

export default function Content({ content }: { content: string }) {
  const refContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderMathInElement(refContent.current as HTMLDivElement, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    });
  }, [content]);

  return (
    <div
      className="markdown text-break overflow-x-auto overflow-y-hidden"
      ref={refContent}
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
