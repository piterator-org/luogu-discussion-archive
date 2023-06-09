import { NextResponse } from "next/server";
import saveJudgements from "@/lib/judgement";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await saveJudgements();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, err: (err as Error).message });
  }
}
