import { NextResponse, type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import puppeteer from "puppeteer";
import type renderMathInElement from "katex/contrib/auto-render";
import { autoRender, katex, style } from "./katex";

const browser = await puppeteer.launch();

export async function GET(
  request: NextRequest,
  { params }: { params: { rid: string } }
) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1, deviceScaleFactor: 1 });
  await page.setContent(/* HTML */ `<!DOCTYPE html>
    <html>
      <body>
        $x=y^2+1$
      </body>
    </html>`);

  await page.addScriptTag({ content: katex as string });
  await page.addScriptTag({ content: autoRender as string });
  await page.addStyleTag({ content: style as string });
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

  const screenshot = await page.screenshot({ fullPage: true });
  await page.close();
  return new NextResponse(screenshot);
}
