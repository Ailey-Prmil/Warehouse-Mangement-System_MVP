import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/database";
import { stock } from "@/../drizzle/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locId = searchParams.get("locId");
  
  let query = db.select().from(stock);
  
  // Filter by location ID if provided
  if (locId) {
    query = query.where(eq(stock.locId, parseInt(locId)));
  }
  
  const stocks = await query;
  return NextResponse.json(stocks, { status: 200 });
}

// This table Stock is auto generated, no need for POST, PUT & DELETE function
