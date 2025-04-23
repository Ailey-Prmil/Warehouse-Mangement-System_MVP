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

  if (!poId) {
    return NextResponse.json(
      { message: "Purchasing Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const purchaseOrderDetails = await db
      .select({
        productId: purchaseOrderDetail.productId,
        quantity: purchaseOrderDetail.orderedQuantity,
      })
      .from(purchaseOrderDetail)
      .where(eq(purchaseOrderDetail.poId, poId));

    const shipIdRecord = await db
      .select({
        shipId: purchaseOrder.shipId,
      })
      .from(purchaseOrder)
      .where(eq(purchaseOrder.poId, poId))
      .limit(1);
    const shipId = shipIdRecord[0]?.shipId;

    const purchaseOrderDetailsResponse = {
      poId: poId,
      shipId: shipId || null,
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
