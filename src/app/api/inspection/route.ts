import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { inspection } from "@/../drizzle/schema";

export const revalidate = 60;

export async function GET() {
  const inspections = await db.select().from(inspection);
  return NextResponse.json(inspections, { status: 200 });
}
// cannot delete because there is no trigger for delete
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { stockId, defectQuantity, reason } = body;

  if (!stockId || !defectQuantity) {
    return NextResponse.json(
      { message: "Stock ID, Defect Quantity are required" },
      { status: 400 }
    );
  }

  try {
    const newInspection = await db.insert(inspection).values({
      stockId: stockId,
      defectQuantity: defectQuantity,
      reason: reason,
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
