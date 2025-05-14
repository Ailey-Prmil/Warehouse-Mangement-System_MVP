import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { product } from "@/../drizzle/schema";
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
    const productData = await db
      .select()
      .from(product)
      .where(eq(product.productId, productId))
      .limit(1);

    if (!productData || productData.length === 0) {
      return NextResponse.json(
        { message: `No product found with ID ${productId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(productData[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}

// This table uses mock data, so POST, PUT, DELETE are not implemented