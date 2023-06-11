import prisma from "@/lib/prisma";

export default async function getCounterData() {
  return {
    discussions: await prisma.discussion.count(),
    snapshots: await prisma.snapshot.count(),
    replies: await prisma.reply.count(),
    judgements: await prisma.judgement.count(),
  };
}
