import prisma from "@/lib/prisma";

export default async function UserStatistics({ uid }: { uid: number }) {
  return (
    <>
      <span className="fw-medium">发帖</span>{" "}
      {await prisma.discussion.count({
        where: { snapshots: { some: { authorId: uid } } },
      })}{" "}
      条<span className="fw-medium ms-2x">回帖</span>{" "}
      {await prisma.reply.count({ where: { authorId: uid } })} 层
    </>
  );
}
