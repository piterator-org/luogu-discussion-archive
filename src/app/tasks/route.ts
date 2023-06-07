import { NextResponse } from "next/server";
import { emitters, metadata } from "@/lib/discussion";

export const dynamic = "force-dynamic";

export const GET = () =>
  NextResponse.json({ ok: true, metadata, current: Object.keys(emitters) });
