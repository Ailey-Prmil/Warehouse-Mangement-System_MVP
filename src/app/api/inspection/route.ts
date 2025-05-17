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
  const { stockId, defectQuantity, reason } = body;

  if (!stockId || defectQuantity === undefined) {
    return NextResponse.json(
      { message: "Stock ID and Defect Quantity are required" },
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

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { inspectId, stockId, defectQuantity, reason } = body;

  if (!inspectId) {
    return NextResponse.json(
      { message: "Inspection ID is required" },
      { status: 400 }
    );
  }
  const updateData: Record<string, string | number | null> = {};
  if (stockId !== undefined) updateData.stockId = stockId;
  if (defectQuantity !== undefined) updateData.defectQuantity = defectQuantity;
  if (reason !== undefined) updateData.reason = reason;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "No fields provided to update." },
      { status: 400 }
    );
  }

  try {
    const updatedInspection = await db
      .update(inspection)
      .set(updateData)
      .where(eq(inspection.inspectId, inspectId));
    return NextResponse.json(updatedInspection, { status: 200 });
  } catch (error) {
    console.error("Error updating inspection:", error);
    return NextResponse.json(
      { message: "Error updating inspection" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { inspectId } = await request.json();

  if (!inspectId) {
    return NextResponse.json(
      { message: "Inspection ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedInspection = await db
      .delete(inspection)
      .where(eq(inspection.inspectId, inspectId));
    return NextResponse.json(deletedInspection, { status: 200 });
  } catch (error) {
    console.error("Error deleting inspection:", error);
    return NextResponse.json(
      { message: "Error deleting inspection" },
      { status: 500 }
    );
  }
}
