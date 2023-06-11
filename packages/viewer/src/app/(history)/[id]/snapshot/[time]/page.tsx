import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { id: string; time: string };
}) {
  const snapshot =
    (await prisma.snapshot.findUnique({
      where: {
        discussionId_time: {
          discussionId: parseInt(params.id, 10),
          time: decodeURIComponent(params.time),
        },
      },
    })) ?? notFound();
  return (
    <>
      {snapshot.time.toLocaleString("zh")} -{" "}
      {snapshot.until.toLocaleString("zh")}
    </>
  );
}
