import UserInfo from "@/components/UserInfo";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  const judgements = await prisma.judgement.findMany({
    select: { time: true, user: true, content: true },
  });
  return (
    <ul>
      {judgements.map((judgement) => (
        <div key={`${judgement.time.toISOString()}${judgement.user.id}`}>
          <UserInfo user={judgement.user} /> (
          {judgement.time.toLocaleString("zh")}):{" "}
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: judgement.content }} />
        </div>
      ))}
    </ul>
  );
}
