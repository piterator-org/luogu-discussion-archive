import prisma from "@/lib/prisma";

export default async function getCounterData() {
  return {
    discussions: await prisma.post.count(),
    snapshots: await prisma.postSnapshot.count(),
    replies: await prisma.reply.count(),
    judgements: await prisma.judgement.count(),
  };
}
