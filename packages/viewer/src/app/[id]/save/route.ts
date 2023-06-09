import { NextResponse } from "next/server";
import { startTask } from "@/lib/discussion";

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  try {
    await startTask(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, err: (err as Error).message });
  }
}
