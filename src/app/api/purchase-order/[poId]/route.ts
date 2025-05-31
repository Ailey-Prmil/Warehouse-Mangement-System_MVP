import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { purchaseOrderDetail, purchaseOrder } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;
type PoIdParams = {
  params: {
    poId: string;
  };
};
export async function GET(request: NextRequest, { params }: PoIdParams) {
  const poId = Number(params.poId);

  if (!poId || isNaN(poId)) {
    return NextResponse.json(
      { message: "Valid Purchase Order ID is required" },
      { status: 400 }
    );
  }

  try {
    // First, check if the purchase order exists
    const purchaseOrderRecord = await db
      .select({
        poId: purchaseOrder.poId,
        shipmentId: purchaseOrder.shipmentId,
        createdAt: purchaseOrder.createdAt
      })
      .from(purchaseOrder)
      .where(eq(purchaseOrder.poId, poId))
      .limit(1);
    
    if (!purchaseOrderRecord || purchaseOrderRecord.length === 0) {
      return NextResponse.json(
        { message: `No purchase order found with ID ${poId}` },
        { status: 404 }
      );
    }

    // Get all order details
    const purchaseOrderDetails = await db
      .select({
        productId: purchaseOrderDetail.productId,
        quantity: purchaseOrderDetail.orderedQuantity,
      })
      .from(purchaseOrderDetail)
      .where(eq(purchaseOrderDetail.poId, poId));    // No need to check for null, as it will always be an array (possibly empty)

    const purchaseOrderDetailsResponse = {
      poId: poId,
      shipId: purchaseOrderRecord[0].shipmentId,
      createdAt: purchaseOrderRecord[0].createdAt,
      details: purchaseOrderDetails,
    };
    return NextResponse.json(purchaseOrderDetailsResponse, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
// this table uses mock data, so POST and PUT are not essential
