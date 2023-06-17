"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export default function UpdateButton({
  children,
  target,
}: React.PropsWithChildren<{ target: string }>) {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  const id = parseInt(target, 10);
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? "");
      socket.on("start", () => router.refresh());
      socket.on("success", () => router.refresh());
      socketRef.current = socket;
    }
    return () => {
      socketRef.current?.close();
    };
  }, [router]);

  useEffect(() => {
    if (!Number.isNaN(id)) socketRef.current?.emit("subscribe", id);
  }, [id]);

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
