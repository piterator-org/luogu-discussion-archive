import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import paginate from "@/lib/pagination";
import PageButtons from "@/components/replies/PageButtons";
import Ostracon from "@/components/Ostracon";
import { selectUser } from "@/lib/user";
import { getPermissionNames } from "@/lib/judgement";

const OSTRACA_PER_PAGE = parseInt(process.env.OSTRACA_PER_PAGE ?? "10", 10);

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10);
  const ostraca =
    (await prisma.judgement.findMany({
      select: {
        time: true,
        user: { select: selectUser.withLatest },
        permissionGranted: true,
        permissionRevoked: true,
        reason: true,
      },
      orderBy: { time: "desc" },
      skip: (page - 1) * OSTRACA_PER_PAGE,
      take: OSTRACA_PER_PAGE,
    })) ?? notFound();

  const numPages = Math.ceil(
    (await prisma.judgement.count()) / OSTRACA_PER_PAGE,
  );

  const { pagesLocalAttachedFront, pagesLocalAttachedBack, pagesLocal } =
    paginate(numPages, page);

  return (
    <>
      {ostraca.map((ostracon) => (
        <Ostracon
          ostracon={ostracon}
          key={`${ostracon.time.toISOString()}${ostracon.user.id}`}
        >
          <ul>
            {getPermissionNames(ostracon.permissionGranted).map((name) => (
              <li>
                授予 <code>{name}</code> 权限
              </li>
            ))}
            {getPermissionNames(ostracon.permissionRevoked).map((name) => (
              <li>
                撤销 <code>{name}</code> 权限
              </li>
            ))}
          </ul>
          {ostracon.reason}。
        </Ostracon>
      ))}
      {numPages > 1 && (
        <div className="bg-body rounded-4 shadow-bssb my-4s px-4 py-3 py-md-4 text-center">
          <PageButtons
            ellipsisFront={!pagesLocalAttachedFront}
            ellipsisBack={!pagesLocalAttachedBack}
            numPages={numPages}
            pagesLocal={pagesLocal}
            generatorUrl={(curPage: number) => `/judgement/${curPage}`}
            active={page}
          />
        </div>
      )}
    </>
  );
}
