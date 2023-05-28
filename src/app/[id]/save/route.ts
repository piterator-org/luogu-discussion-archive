import { NextResponse } from "next/server";
import saveDiscussion from "@/lib/fetch";
import { collection } from "@/lib/mongodb";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  await saveDiscussion(id);
  const data = await (await collection).findOne({ _id: id });
  return NextResponse.json({ data });
}
