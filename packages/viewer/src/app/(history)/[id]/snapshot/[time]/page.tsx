import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: { id: string; time: string };
}) {
  const snapshot =
    (await prisma.postSnapshot.findUnique({
      where: {
        postId_time: {
          postId: parseInt(params.id, 10),
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
