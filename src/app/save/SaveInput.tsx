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
      className="input-group input-group-lg mx-auto my-5x"
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
          const id = url;
          fetch(`/${id}/save`)
            .then(async (res) => {
              const r = (await res.json()) as
                | { ok: true }
                | { ok: false; err: string };
              if (r.ok) router.push(`/${id}/1`);
              else setError(r.err);
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
