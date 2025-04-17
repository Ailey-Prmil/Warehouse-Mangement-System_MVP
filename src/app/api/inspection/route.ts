import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { inspection } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  const inspections = await db.select().from(inspection);
  return NextResponse.json(inspections, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { inspectionId, productId, quantity } = body;

  if (!inspectionId || !productId || !quantity) {
    return NextResponse.json(
      { message: "Inspection ID, Product ID and Quantity are required" },
      { status: 400 }
    );
  }

  try {
    const newInspection = await db.insert(inspection).values({
      inspectionId: inspectionId,
      productId: productId,
      quantity: quantity,
    });

    return NextResponse.json(newInspection, { status: 201 });
  } catch (error) {
    console.error("Error creating inspection:", error);
    return NextResponse.json(
      { message: "Error creating inspection" },
      { status: 500 }
    );
  }
}
