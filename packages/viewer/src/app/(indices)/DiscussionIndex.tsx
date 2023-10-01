import stringifyTime from "@/lib/time";
import type { PostWithLatestSnapshotMeta } from "@/lib/post";
import DiscussionEntry from "@/components/DiscussionEntry";
import { BsChatDots } from "react-icons/bs";

export default function PostIndex({
  posts,
}: {
  posts: PostWithLatestSnapshotMeta[];
}) {
  return (
    <>
      {posts.map((post) => (
        <DiscussionEntry
          discussion={post}
          key={post.id}
          decoratorBreakpoint="md"
          metaBottom={
            <>
              <BsChatDots style={{ position: "relative", top: "-.1125em" }} />{" "}
              {post.replyCount}
              <span className="float-end">
                {stringifyTime(post.time)}
              </span>
            </>
          }
        />
      ))}
    </>
  );
}
