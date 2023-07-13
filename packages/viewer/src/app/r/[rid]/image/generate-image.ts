import puppeteer from "puppeteer";
import type renderMathInElement from "katex/contrib/auto-render";
import katex from "katex/dist/katex.min?raw";
import autoRender from "katex/dist/contrib/auto-render.min?raw";
import katexStyles from "katex/dist/katex.min.css?raw";
import luogu3Styles from "@/components/luogu3.css?raw";
import markdownStyles from "@/components/markdown.css?raw";
import type getReplyRaw from "../get-reply-raw";

const browser = await puppeteer.launch();

export default async (
  reply: Omit<Awaited<ReturnType<typeof getReplyRaw>>, "time"> & {
    time: string;
  },
  template: (
    reply: Omit<Awaited<ReturnType<typeof getReplyRaw>>, "time"> & {
      time: string;
    },
    {
      width,
    }: {
      width: number;
    }
  ) => string,
  { width }: { width?: number }
) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: width ?? 840,
    height: 1,
    deviceScaleFactor: 1.5,
  });
  await page.setContent(template(reply, { width: width ?? 840 }));

  await page.addScriptTag({ content: katex });
  await page.addScriptTag({ content: autoRender });
  await page.addStyleTag({ content: katexStyles });
  await page.addStyleTag({ content: luogu3Styles });
  await page.addStyleTag({ content: markdownStyles });
  await page.evaluate(() =>
    (
      window as typeof window & {
        renderMathInElement: typeof renderMathInElement;
      }
    ).renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
    })
  );

  const screenshot = await page.screenshot({
    fullPage: true,
    omitBackground: true,
  });
  await page.close();

  return screenshot;
};
