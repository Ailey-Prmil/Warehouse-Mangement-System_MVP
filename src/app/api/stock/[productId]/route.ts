// File: app/api/stock/by-product/[productId]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { stock, locationBin } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

type ProductIdParams = {
  params: {
    productId: string;
  };
};

export async function GET(request: NextRequest, { params }: ProductIdParams) {
  const productId = params.productId;
  
  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Join stock and locationBin tables to get stock with location details
    const stockWithLocations = await db
      .select({
        stock: stock,
        location: locationBin,
      })
      .from(stock)
      .innerJoin(locationBin, eq(stock.locId, locationBin.locId))
      .where(eq(stock.productId, productId));

    return NextResponse.json(stockWithLocations, { status: 200 });
  } catch (error) {
    console.error("Error fetching stock by product:", error);
    return NextResponse.json(
      { message: "Error fetching stock" },
      { status: 500 }
    );
  }
}