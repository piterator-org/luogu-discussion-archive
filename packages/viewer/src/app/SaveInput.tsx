"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDiscussionId } from "@/lib/luogu";

// TODO: 改为使用 Socket.IO 连接
export default function SaveInput() {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return (
    <form
      className="input-group input-group-lg mx-auto"
      style={{ maxWidth: "40em" }}
      onSubmit={(event) => {
        event.preventDefault();
        setDisabled(true);
        const id = getDiscussionId(url);
        fetch(`${process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? ""}/${id}`)
          .then(async (res) => {
            if (res.ok) router.push(`/${id}`);
            else setError(((await res.json()) as { error: string }).error);
          })
          .catch((e: Error) => setError(e.message))
          .finally(() => setDisabled(false));
      }}
    >
      <input
        className="form-control shadow-bssb rounded-start-4 border-0"
        autoComplete="off"
        placeholder="帖子链接或编号"
        disabled={disabled}
        value={url}
        onChange={({ target: { value } }) => {
          setUrl(value);
          setError("");
        }}
      />
      <button
        className={`btn btn-${
          error ? "danger" : "success"
        } rounded-end-4 shadow-bssb`}
        type="submit"
        disabled={disabled}
      >
        立即保存
      </button>
    </form>
  );
}
