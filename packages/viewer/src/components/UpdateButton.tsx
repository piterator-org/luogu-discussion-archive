"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getKey } from "@/app/[id]/InfiniteScrollReplies";

export default function UpdateButton({
  children,
  target,
}: React.PropsWithChildren<{ target: string }>) {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const { mutate } = useSWRConfig();

  const id = parseInt(target, 10);
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
      socket.on("start", () => router.refresh());
      socket.on("success", async () => {
        router.refresh();
        await mutate(unstable_serialize(getKey(id)));
      });
      socket.emit("subscribe", id);
    }
  }, [id, mutate, router]);

  return (
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
  );
}
