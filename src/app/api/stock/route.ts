import { NextResponse } from "next/server";
import db from "@/database";
import { stock } from "@/../drizzle/schema";

export async function GET() {
  const stocks = await db.select().from(stock);
  return NextResponse.json(stocks, { status: 200 });
}

// This table Stock is auto generated, no need for POST, PUT & DELETE function
