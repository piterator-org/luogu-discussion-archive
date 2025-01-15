/**
 * @luogu-discussion-archive/remark-lda-lfm
 * Copyright (c) 2025 Luogu Discussion Archive Project
 * See AUTHORS.txt in the project root for the full list of contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Please notice that 「洛谷」 (also known as "Luogu") is a registered trademark of
 * Shanghai Luogu Network Technology Co., Ltd (上海洛谷网络科技有限公司).
 *
 * @license AGPL-3.0-or-later
 */

/// <reference types="remark-parse" />
/// <reference types="remark-stringify" />
/// <reference types="mdast" />
/// <reference path="./index.d.ts" />

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('unified').Processor<Root>} Processor
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {RegExp[] | null} [linkRootToLuoguWhiteList]
 *   URL patterns in list will not point to https://www.luogu.com.cn/,
 *   except /user/${uid} (userMention). (optional).
 * @property {boolean | null} [userLinkPointToLuogu]
 *   /user/${uid} (userMention) point to luogu or not. Default true. (optional)
 */

import { visit } from "unist-util-visit";

import { gfmFootnote } from "micromark-extension-gfm-footnote";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";

import {
  gfmAutolinkLiteralFromMarkdown,
  gfmAutolinkLiteralToMarkdown,
} from "mdast-util-gfm-autolink-literal";
import { gfmTableFromMarkdown, gfmTableToMarkdown } from "mdast-util-gfm-table";
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown,
} from "mdast-util-gfm-strikethrough";
import {
  gfmFootnoteFromMarkdown,
  gfmFootnoteToMarkdown,
} from "mdast-util-gfm-footnote";

const mentionReg = /^\/user\/(\d+)$/;
const legacyMentionReg = /^\/space\/show\?uid=(\d+)$/;

/** @type {Options} */
const emptyOptions = {};

/**
 * remark-luogu-flavor plugin.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @this {Processor}
 */
export default function remarkLuoguFlavor(options) {
  const self = this;
  const settings = options || emptyOptions;
  const data = self.data();

  const linkWhiteList = settings.linkRootToLuoguWhiteList ?? [];
  const userLinkPointToLuogu = settings.userLinkPointToLuogu ?? true;

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

  micromarkExtensions.push(
    gfmFootnote(),
    gfmStrikethrough({ singleTilde: false, ...settings }),
    gfmTable(),
    gfmAutolinkLiteral(),
  );

  fromMarkdownExtensions.push(
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown(),
    gfmTableFromMarkdown(),
    gfmAutolinkLiteralFromMarkdown(),
  );

  toMarkdownExtensions.push(
    gfmFootnoteToMarkdown(),
    gfmTableToMarkdown(),
    gfmStrikethroughToMarkdown(),
    gfmAutolinkLiteralToMarkdown(),
  );

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree) => {
    visit(tree, "paragraph", (node) => {
      const childNode = node.children;
      childNode.forEach((child, index) => {
        const lastNode = childNode[index - 1];
        if (
          child.type === "link" &&
          index >= 1 &&
          lastNode.type === "text" &&
          lastNode.value.endsWith("@")
        ) {
          const match =
            mentionReg.exec(child.url) ?? legacyMentionReg.exec(child.url);
          if (!match) return;
          /** @type {import("mdast").UserMention} */
          const newNode = {
            type: "userMention",
            children: child.children,
            uid: parseInt(match[1]),
            data: {
              hName: "a",
              hProperties: {
                href: userLinkPointToLuogu
                  ? `https://www.luogu.com.cn/user/${match[1]}`
                  : `/user/${match[1]}`,
                "data-uid": match[1],
                class: "lfm-user-mention",
              },
            },
          };
          childNode[index] = newNode;
        }
        if (child.type === "image" && child.url.startsWith("bilibili:")) {
          let videoId = child.url.replace("bilibili:", "");
          if (videoId.match(/^[0-9]/)) videoId = "av" + videoId;
          /** @type {import("mdast").BilibiliVideo} */
          const newNode = {
            type: "bilibiliVideo",
            videoId,
            data: {
              hName: "iframe",
              hProperties: {
                scrolling: "no",
                allowfullscreen: "true",
                class: "lfm-bilibili-video",
                src:
                  "https://www.bilibili.com/blackboard/webplayer/embed-old.html?bvid=" +
                  videoId.replace(/[\?&]/g, "&amp;"),
              },
            },
          };
          childNode[index] = newNode;
        }
      });
    });
    visit(tree, "link", (node) => {
      if (!linkWhiteList.some((reg) => reg.test(node.url))) {
        try {
          node.url = new URL(node.url, "https://www.luogu.com.cn/").href;
        } catch (_) {
          // ignore
        }
      }
    });
  };
}
