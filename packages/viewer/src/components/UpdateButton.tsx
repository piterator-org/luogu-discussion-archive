"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getKey } from "./replies/InfiniteScrollReplies";

export default function UpdateButton({
  children,
  target,
}: React.PropsWithChildren<{ target: string }>) {
  const id = parseInt(target, 10);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const toastRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!socketRef.current)
      socketRef.current = io(process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? "");
    return () => {
      socketRef.current?.close();
    };
  }, []);
  useEffect(() => {
    const socket = socketRef.current;
    if (!Number.isNaN(id) && socket) {
      socket.onAny(() => setError(""));
      socket.on("start", () => router.refresh());
      socket.on("success", async () => {
        router.refresh();
        await mutate(unstable_serialize(getKey(id)));
      });
      socket.on("failure", setError);
      socket.emit("subscribe", id);
    }
  }, [id, mutate, router]);

  const bootstrapToastRef = useRef<
    typeof import("bootstrap/js/dist/toast").default | null
  >(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    import("bootstrap/js/dist/toast").then(({ default: Toast }) => {
      bootstrapToastRef.current = Toast;
    });
  }, []);
  useEffect(() => {
    const Toast = bootstrapToastRef.current;
    if (Toast && toastRef.current) {
      const toastError = Toast.getOrCreateInstance(toastRef.current);
      if (error) toastError.show();
      else toastError.hide();
    }
  }, [error, disabled]);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-primary shadow-sm ms-2"
        onClick={() => {
          setDisabled(true);
          if (Number.isNaN(id) || !socketRef.current)
            fetch(`${process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? ""}/${target}`)
              .then(() => router.refresh())
              .finally(() => setDisabled(false));
          else {
            const socket = socketRef.current;
            socket.on("success", () => setDisabled(false));
            socket.on("failure", () => setDisabled(false));
            socket.emit("update", id);
          }
        }}
        disabled={disabled}
      >
        {children}
      </button>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className="toast text-bg-danger border-0 shadow"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref={toastRef}
        >
          <div className="toast-header text-secondary">
            <span className="me-auto fw-medium">
              被骇客<span style={{ color: "#7e42ec" }}>银</span>
              <span style={{ color: "#3367ea" }}>狼</span>阻止的越权访问
            </span>
            <small>保存失败</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            />
          </div>
          <div className="toast-body">{error}</div>
        </div>
      </div>
    </>
  );
}
