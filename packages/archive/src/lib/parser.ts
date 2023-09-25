import type { BaseLogger } from "pino";
import { JSDOM } from "jsdom";
import { Color } from "@prisma/client";
import delay from "../utils/delay";

const colors: Record<string, Color> = {
  brown: Color.Cheater,
  gray: Color.Gray,
  bluelight: Color.Blue,
  green: Color.Green,
  orange: Color.Orange,
  red: Color.Red,
  purple: Color.Purple,
};

export interface JudgementProfile {
  id: number;
  name: string;
  color: Color;
  checkmark: string | null;
  badge: string | null;
}

export async function getResponse(
  logger: BaseLogger,
  url: string,
  cookie = true,
  retries = 1,
) {
  const response = await fetch(url, {
    headers: cookie ? { cookie: process.env.COOKIE! } : undefined,
    cache: "no-cache",
  });
  logger.info(
    { retries, url, status: response.status, statusText: response.statusText },
    "fetch",
  );
  if (response.status > 500) {
    if (retries) {
      await delay(1000);
      return getResponse(logger, url, cookie, retries - 1);
    }
    throw Error("Reached maximum retry limit");
  }
  if (!response.ok) throw Error(response.statusText);
  return response;
}

export async function parseApp(
  logger: BaseLogger,
  url: string,
  retries = 1,
): Promise<HTMLElement> {
  const response = await getResponse(logger, url, true, retries);
  const { document } = new JSDOM(await response.text()).window;
  const app = document.getElementById("app-old");
  if (!app)
    throw Error(
      document.querySelector("div")?.textContent?.trim() ?? undefined,
    );
  return app;
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function parseUser(element: Element): JudgementProfile {
  const a = element.querySelector('a[href^="/user/"]')!;
  return {
    id: parseInt(a.getAttribute("href")!.slice("/user/".length), 10),
    name: a.textContent!,
    color:
      colors[a.getAttribute("class")!.split(" ", 1)[0].slice("lg-fg-".length)],
    checkmark: element.querySelector("a > svg")?.getAttribute("fill") ?? null,
    badge: element.querySelector("span.am-badge")?.innerHTML ?? null,
  };
}

export const parseComment = (element: Element) => ({
  time: new Date(
    `${
      Array.from(element.querySelector(".am-comment-meta")!.childNodes)
        .filter((node) => node.nodeType === node.TEXT_NODE)
        .map((node) =>
          /^\d{4}(-\d{2}){2} \d{2}(:\d{2}){1,2}$/.exec(
            node.textContent!.trim(),
          ),
        )
        .filter((node) => node)[0]![0]
    }+8`,
  ),
  content: element.querySelector(".am-comment-bd")!.innerHTML.trim(),
});
