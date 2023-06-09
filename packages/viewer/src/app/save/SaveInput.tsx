"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveInput() {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return (
    <div
      className="input-group input-group-lg mx-auto"
      style={{ maxWidth: "40em" }}
    >
      <input
        className="form-control shadow"
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
        className={`btn btn-${error ? "danger" : "success"} shadow`}
        type="button"
        disabled={disabled}
        onClick={() => {
          setDisabled(true);
          const id = url.split("?", 1)[0].split("/").reverse()[0];
          fetch(`${process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? ""}/${id}`)
            .then(async (res) => {
              if (res.ok) router.push(`/${id}/1`);
              else setError(((await res.json()) as { error: string }).error);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setDisabled(false));
        }}
      >
        立即保存
      </button>
    </div>
  );
}
