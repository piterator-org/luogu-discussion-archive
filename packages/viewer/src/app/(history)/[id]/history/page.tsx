import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const snapshots = await prisma.snapshot.findMany({
    where: { discussionId: id },
    orderBy: { time: "desc" },
  });
  return (
    <li>
      {snapshots.map((snapshot) => (
        <ul key={snapshot.time.toISOString()}>
          <Link href={`/${id}/snapshot/${snapshot.time.toISOString()}`}>
            {snapshot.time.toLocaleString("zh")} -{" "}
            {snapshot.until.toLocaleString("zh")}
          </Link>
        </ul>
      ))}
    </li>
  );
}
