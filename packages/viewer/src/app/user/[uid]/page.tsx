import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import UserParticipated from "./participated/UserParticipated";
import { selectUser } from "@/lib/user";

export default async function Page({ params }: { params: { uid: string } }) {
  const user =
    (await prisma.user.findUnique({
      where: { id: parseInt(params.uid, 10) },
      select: selectUser.withLatest,
    })) ?? notFound();
  return <UserParticipated uid={params.uid} user={user} />;
}
