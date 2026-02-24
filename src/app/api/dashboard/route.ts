import { NextResponse } from "next/server";
import { getDashboardDataFromDb } from "@/lib/server/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") === "main" ? "main" : "full";
    const country = searchParams.get("country") ?? undefined;
    const companyId = searchParams.get("companyId") ?? undefined;
    const result = await getDashboardDataFromDb({ scope, country, companyId });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
