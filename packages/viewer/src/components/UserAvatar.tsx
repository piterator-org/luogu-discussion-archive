import Image from "next/image";
import { getUserAvatarUrl, getUserUrl } from "@/lib/luogu";

export default function UserAvatar({
  className,
  user: { id },
}: {
  className: string;
  user: { id: number };
}) {
  return (
    <a
      href={getUserUrl(id)}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={getUserAvatarUrl(id)}
        className="rounded-circle shadow-sm"
        width={64}
        height={64}
        alt={id.toString()}
      />
    </a>
  );
}
