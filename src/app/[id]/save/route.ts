import { NextResponse } from "next/server";
import fetchDiscussion from "@/lib/fetch";
import { collection } from "@/lib/mongodb";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await fetchDiscussion(parseInt(params.id, 10));
  await (await collection).insertOne(data);
  return NextResponse.json({ data });
}
