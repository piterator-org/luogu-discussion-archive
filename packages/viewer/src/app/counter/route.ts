import { NextResponse } from "next/server";
import getCounterData from "@/lib/counter";

export const dynamic = "force-dynamic";

export const GET = async () => NextResponse.json(await getCounterData());
