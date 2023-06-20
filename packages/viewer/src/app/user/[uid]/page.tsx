import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserParticipated from "./participated/UserParticipated";

export default async function Page({ params }: { params: { uid: string } }) {
  const user =
    (await prisma.user.findUnique({
      where: { id: parseInt(params.uid, 10) },
    })) ?? notFound();
  return <UserParticipated uid={params.uid} user={user} />;
}
