"use client";

import { useState } from "react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";

export default function UserInput({ initialValue }: { initialValue: string }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const router = useRouter();
  const segments = useSelectedLayoutSegments();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/user/${inputValue}${["", ...segments].join("/")}`);
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={({ target: { value } }) => setInputValue(value)}
      />
      <button type="submit">查看</button>
    </form>
  );
}
