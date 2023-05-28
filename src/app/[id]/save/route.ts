import { NextResponse } from "next/server";
import fetchDiscussion from "@/lib/fetch";
import { collection } from "@/lib/mongodb";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  await fetchDiscussion(id);
  const data = await (await collection).findOne({ _id: id });
  return NextResponse.json({ data });
}
