import { NextResponse } from "next/server";
import getCounterData from "../get-counter-data";

export const dynamic = "force-dynamic";

export const GET = async () => NextResponse.json(await getCounterData());
