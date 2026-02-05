import { NextResponse } from "next/server";
import { getDashboardDataFromDb } from "@/lib/server/db";

export async function GET() {
  try {
    const data = await getDashboardDataFromDb();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
