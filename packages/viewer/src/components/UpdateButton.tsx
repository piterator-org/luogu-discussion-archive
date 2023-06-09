"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateButton({
  children,
  target,
}: React.PropsWithChildren<{ target: string }>) {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  return (
    <button
      type="button"
      className="btn btn-outline-primary shadow-sm ms-2"
      onClick={() => {
        setDisabled(true);
        fetch(`${process.env.NEXT_PUBLIC_ARCHIVE_HOST ?? ""}/${target}`)
          .then(() => router.refresh())
          .finally(() => setDisabled(false));
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
