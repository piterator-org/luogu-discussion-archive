import { NextResponse, type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { serializeReplyNoninteractive } from "@/lib/serialize-reply";
import getReplyRaw from "../../get-reply-raw";
import generateImage from "../generate-image";
import templateCompact from "./template-compact";

export async function GET(
  request: NextRequest,
  { params }: { params: { rid: string } },
) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  const replyRaw = await getReplyRaw(id);
  const reply = {
    ...replyRaw,
    ...(await serializeReplyNoninteractive(replyRaw)),
  };
  return new NextResponse(
    await generateImage(reply, templateCompact, {
      width: Math.max(
        600,
        Number(request.nextUrl.searchParams.get("width") ?? "840")
      ),
    })
  );
}
