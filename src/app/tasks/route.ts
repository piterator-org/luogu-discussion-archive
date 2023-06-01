import { NextResponse } from "next/server";
import { emitters, metadata } from "@/lib/fetch";

// eslint-disable-next-line import/prefer-default-export
export const GET = () =>
  NextResponse.json({ ok: true, metadata, current: Object.keys(emitters) });
