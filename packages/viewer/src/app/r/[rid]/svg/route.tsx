import { NextResponse, type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import ReplySvg from "./ReplySvg";

const { renderToStaticMarkup } = await import("react-dom/server");

export function GET(
  request: NextRequest,
  { params }: { params: { rid: string } }
) {
  const id = parseInt(params.rid, 10);
  if (Number.isNaN(id)) notFound();
  return new NextResponse(renderToStaticMarkup(<ReplySvg />), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
