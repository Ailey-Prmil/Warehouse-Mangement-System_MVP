import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { purchaseOrder } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  const purchaseOrders = await db.select().from(purchaseOrder);
  return NextResponse.json(purchaseOrders, {
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  // there should be multiple values of existing PO (with or without shipID)
  // not essential
  const body = await request.json();
  const { shipId } = body;
  try {
    const newPurchasingOrder = await db.insert(purchaseOrder).values({
      // po_id is auto generated
      shipId: shipId,
    });
    return NextResponse.json(newPurchasingOrder, { status: 201 });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Error inserting data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { poId, shipId } = body;
  try {
    const updatedOrder = await db
      .update(purchaseOrder)
      .set({
        shipId: shipId,
      })
      .where(eq(purchaseOrder.poId, poId));
    return NextResponse.json(updatedOrder, {
      status: 201,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Error updating data" },
      { status: 500 }
    );
  }
}
