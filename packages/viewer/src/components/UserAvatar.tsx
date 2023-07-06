/* eslint-disable react/require-default-props */
import Link from "next/link";
import Image from "next/image";
import { getUserAvatarUrl, getUserUrl } from "@/lib/luogu";

export default function UserAvatar({
  className,
  decoratorShadow,
  size = 64,
  user: { id },
}: {
  className?: string;
  decoratorShadow?: string;
  size?: number;
  user: { id: number };
}) {
  return (
    <Link href={getUserUrl(id)} className={className}>
      <Image
        src={getUserAvatarUrl(id)}
        className={`rounded-circle shadow${
          decoratorShadow ? `-${decoratorShadow}` : ""
        }`}
        width={size}
        height={size}
        alt={id.toString()}
      />
    </Link>
  );
}
