import { getUserAvatarUrl } from "@/lib/luogu";
import type getReplyRaw from "../../get-reply-raw";

export default (
  reply: Omit<Awaited<ReturnType<typeof getReplyRaw>>, "time"> & {
    time: string;
  },
  { width }: { width: number },
) => `<!DOCTYPE html>
  <html>
    <style>
      * {
        box-sizing: border-box;
      }
      a {
        color: #0d6efd;
        text-decoration: underline;
      }
      .badge {
        display: inline-block;
        padding: 0.35em 0.65em;
        font-size: 0.75em;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.375rem;
      }
      .markdown p {
        line-height: 1.3em;
      }
      .link-at-user {
        text-decoration: none;
        color: #00b5ad;
      }
      .link-at-user::after {
        content: "#" attr(data-uid);
        font-weight: 300;
        color: rgba(144, 146, 148);
        font-size: 0.75em;
      }
      a.link-failed {
        color: #dc3545;
      }
      a[data-linkid] {
        text-decoration: none;
      }
      a[data-linkid]::after {
        content: "[" attr(data-linkid) "]";
        font-weight: 300;
        font-size: 0.75em;
        position: relative;
        top: -0.5em;
      }
      .markdown ul > li {
        margin-left: -0.2em !important;
      }
      .markdown ul > li::before {
        top: -0.25em;
        left: -1.5em !important;
      }
      #content {
        margin-left: 3rem;
      }
      #content::before {
        content: "“";
        font-family: "Source Han Sans";
        font-size: 5.5rem;
        position: absolute;
        top: .1rem;
        left: 0;
        color: #eeedee;
      }
    </style>
    <body
      style="
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue',
          'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        width: ${width}px;
        margin: 0;
        padding: 0;
      "
    >
      <div>
        <span style="white-space: nowrap;">
          <span
            class="lg-fg-${reply.author.color}"
            style="text-decoration-line: none;"
          >
            ${reply.author.username}
          </span>
          ${
            reply.author.checkmark
              ? `<svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="${reply.author.checkmark}"
                style="
                  position: relative;
                  top: .13em;
                  margin-left: .05em;
                "
              >
                <path d="M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z" />
              </svg>`
              : ""
          }
          ${
            reply.author.badge
              ? `<span
                class="badge lg-bg-${reply.author.color}"
                style="
                  display: inline-block;
                  position: relative;
                  top: -.18em;
                  margin-left: .17em;
                "
              >
                ${reply.author.badge}
              </span>`
              : ""
          }
        </span>
        <span
          style="
            display: inline-block;
            font-size: .8em;
            font-weight: 500;
            color: rgba(144, 146, 148);
          "
        >
          （于帖子
          <span style="color: #0d6efd;">
            ${reply.discussion.snapshots[0].title}<span
              style="
                font-weight: 300;
                color: rgba(144, 146, 148);
                font-size: 0.7rem;
              "
              >#${reply.discussion.id}</span></span>）
        </span>
        <div style="float: right;">
          <span style="font-size: .8rem; color: rgba(144, 146, 148);">
            ${reply.time}
          </span>
        </div>
      </div>
      <div id="content">
        <div class="markdown">
          ${reply.content}
        </div>
      </div>
    </body>
  </html>`;
