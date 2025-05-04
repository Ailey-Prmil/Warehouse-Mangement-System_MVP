import { NextResponse } from "next/server";
import db from "@/database";
import { locationBin } from "@/../drizzle/schema";

export const revalidate = 60;

export async function GET() {
  const locations = await db.select().from(locationBin);
  return NextResponse.json(locations, { status: 200 });
}

// this table uses mock data, so we don't need to implement POST, PUT, DELETE methods
