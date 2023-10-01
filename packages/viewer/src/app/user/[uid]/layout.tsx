import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getUserAvatarUrl, getUserRealUrl } from "@/lib/luogu";
import UserInfo from "@/components/UserInfo";
import "@/components/markdown.css";
import { selectUser } from "@/lib/user";
import TabNavigation from "./TabNavigation";
import UserStatistics from "./UserStatistics";

export async function generateMetadata({
  params,
}: {
  params: { uid: string };
}) {
  const uid = parseInt(params.uid, 10);
  const { name } =
    (await prisma.userSnapshot.findFirst({
      where: { userId: uid },
      orderBy: { time: "desc" },
    })) ?? notFound();
  return { title: `@${name} 的黑历史 - 洛谷帖子保存站` };
}

export default async function Layout({
  children,
  params,
}: React.PropsWithChildren<{ params: { uid: string } }>) {
  const user =
    (await prisma.user.findUnique({
      where: { id: parseInt(params.uid, 10) },
      select: selectUser.withLatest,
    })) ?? notFound();
  return (
    <div className="row px-2 px-md-0">
      <div className="col-md-4 col-12 mb-4x">
        <div className="rounded-4 shadow-bssb px-4 py-4 text-center">
          <a
            href={getUserRealUrl(user.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={getUserAvatarUrl(user.id)}
              className="rounded-circle shadow-bssb-sm md-block mb-3x"
              width={96}
              height={96}
              alt={user.id.toString()}
            />
          </a>
          <div className="mb-3" style={{ fontSize: "1.1em" }}>
            <UserInfo user={user} href={getUserRealUrl(user.id)} />
          </div>
          <div className="mb-3 text-secondary">
            <UserStatistics uid={user.id} />
          </div>
          <div>
            <a
              className="btn btn-outline-primary shadow-bssb-sm"
              href={getUserRealUrl(user.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              洛谷个人主页
            </a>
          </div>
        </div>
      </div>
      <div className="col-md-8 col-12">
        <TabNavigation uid={params.uid} />
        {children}
      </div>
    </div>
  );
}
