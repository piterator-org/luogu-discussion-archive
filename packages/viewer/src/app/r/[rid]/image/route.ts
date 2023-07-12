import { NextResponse, type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import puppeteer from "puppeteer";

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
        wxhdsb
      </body>
    </html>`);
  const screenshot = await page.screenshot({ fullPage: true });
  await page.close();
  return new NextResponse(screenshot);
}
