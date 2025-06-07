import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import {
  purchaseOrder,
  inboundShipmentDetail,
  purchaseOrderDetail,
  inboundShipment,
} from "@/../drizzle/schema";
import { eq, sum, and } from "drizzle-orm";
type InboundShipmentIdParams = {
  params: {
    shipmentId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: InboundShipmentIdParams
) {
  const shipmentId = await Number(params.shipmentId);

  const purchaseOrders = await db
    .select({
      poId: purchaseOrder.poId,
      productId: purchaseOrderDetail.productId,
      orderedQuantity: sum(purchaseOrderDetail.orderedQuantity),
    })
    .from(purchaseOrder)
    .where(eq(purchaseOrder.shipmentId, shipmentId))
    .leftJoin(
      purchaseOrderDetail,
      eq(purchaseOrderDetail.poId, purchaseOrder.poId)
    )
    .groupBy(purchaseOrder.poId, purchaseOrderDetail.productId);

  let inboundShipmentDetails = await db
    .select({
      productId: inboundShipmentDetail.productId,
      receivedQuantity: inboundShipmentDetail.receivedQuantity,
    })
    .from(inboundShipmentDetail)
    .where(eq(inboundShipmentDetail.shipmentId, shipmentId));

  inboundShipmentDetails = inboundShipmentDetails.map((detail) => {
    const products = purchaseOrders.filter(
      (po) => po.productId === detail.productId
    );
    const totalQuantity = products.reduce(
      (acc, cur) => acc + Number(cur.orderedQuantity),
      0
    );

    // Find the corresponding product in purchaseOrders

    return {
      ...detail,
      orderedQuantity: totalQuantity,
    };
  });

  const purchaseOrderIds = purchaseOrders.map((po) => po.poId);
  const uniquePurchaseOrderIds = [...new Set(purchaseOrderIds)];

  const response = {
    shipmentId: shipmentId,
    inboundShipmentDetails: inboundShipmentDetails,
    purchaseOrderIds: uniquePurchaseOrderIds,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  // a trigger will be used to insert data into this table
  // so this function is not essential
  // when a purchase order ref to an inbound shipment, trigger insert shipmentId, and productId into this table and set receivedQuantity to 0
  const body = await request.json();
  const { shipmentId, productId, receivedQuantity } = body;

  if (!shipmentId || !productId || !receivedQuantity) {
    return NextResponse.json(
      { message: "Ship ID, Product ID and Received Quantity are required" },
      { status: 400 }
    );
  }

  try {
    const newInboundShipmentDetail = await db
      .insert(inboundShipmentDetail)
      .values({
        shipmentId: shipmentId,
        productId: productId,
        receivedQuantity: receivedQuantity,
      });
    return NextResponse.json(newInboundShipmentDetail, {
      status: 201,
    });
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
  const { shipmentId, productId, receivedQuantity } = body;

  if (!shipmentId || !productId || !receivedQuantity) {
    return NextResponse.json(
      { message: "Ship ID, Product ID and Received Quantity are required" },
      { status: 400 }
    );
  }

  try {
    const updatedInboundShipmentDetail = await db
      .update(inboundShipmentDetail)
      .set({
        receivedQuantity: receivedQuantity,
      })
      .where(
        and(
          eq(inboundShipmentDetail.shipmentId, shipmentId),
          eq(inboundShipmentDetail.productId, productId)
        )
      );
    return NextResponse.json(updatedInboundShipmentDetail, {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Error updating data" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: InboundShipmentIdParams
) {
  const shipmentId = Number(params.shipmentId);
  const body = await request.json();
  const { shipmentTime } = body;

  if (!shipmentId) {
    return NextResponse.json(
      { message: "Shipment ID is required" },
      { status: 400 }
    );
  }
  try {
    await db
      .update(inboundShipment)
      .set({
        shipmentTime: shipmentTime || new Date().toISOString(),
      })
      .where(eq(inboundShipment.shipmentId, shipmentId));

    return NextResponse.json(
      { success: true, shipmentId },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating shipment time:", error);
    return NextResponse.json(
      { message: "Error updating shipment time" },
      { status: 500 }
    );
  }
}
