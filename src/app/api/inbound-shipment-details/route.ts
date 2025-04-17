import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { purchaseOrder, inboundShipmentDetail } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shipId = Number(searchParams.get("shipId"));

  const inboundShipmentDetails = await db
    .select({
      productId: inboundShipmentDetail.productId,
      receivedQuantity: inboundShipmentDetail.receivedQuantity,
    })
    .from(inboundShipmentDetail)
    .where(eq(inboundShipmentDetail.shipId, shipId));

  const purchaseOrders = await db
    .select({
      poId: purchaseOrder.poId,
    })
    .from(purchaseOrder)
    .where(eq(purchaseOrder.shipId, shipId));

  const purchaseOrderIds = purchaseOrders.map((po) => po.poId);

  const response = {
    shipId: shipId,
    inboundShipmentDetails: inboundShipmentDetails,
    purchaseOrderIds: purchaseOrderIds,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
