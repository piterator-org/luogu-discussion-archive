import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const snapshots = await prisma.postSnapshot.findMany({
    where: { postId: id },
    orderBy: { time: "desc" },
  });
  return (
    <ul>
      {snapshots.map((snapshot) => (
        <li key={snapshot.time.toISOString()}>
          <Link href={`/${id}/snapshot/${snapshot.time.toISOString()}`}>
            {snapshot.time.toLocaleString("zh")} -{" "}
            {snapshot.until.toLocaleString("zh")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
