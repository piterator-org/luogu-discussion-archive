/* eslint-disable react/require-default-props */
import Link from "next/link";
import Image from "next/image";
import { getUserAvatarUrl, getUserUrl } from "@/lib/luogu";

export default function UserAvatar({
  className,
  decoratorShadow,
  user: { id },
}: {
  className?: string;
  decoratorShadow?: string;
  user: { id: number };
}) {
  return (
    <Link href={getUserUrl(id)} className={className}>
      <Image
        src={getUserAvatarUrl(id)}
        className={`rounded-circle shadow${
          decoratorShadow ? `-${decoratorShadow}` : ""
        }`}
        width={64}
        height={64}
        alt={id.toString()}
      />
    </Link>
  );
}
