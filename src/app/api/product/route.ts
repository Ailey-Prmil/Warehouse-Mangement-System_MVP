import { NextResponse } from "next/server";
import db from "@/database";
import { product } from "@/../drizzle/schema";

export const revalidate = 60;

export async function GET() {
  const products = await db.select().from(product);
  return NextResponse.json(products, { status: 200 });
}

// this table uses mock data, so we don't need to implement POST, PUT, DELETE methods
