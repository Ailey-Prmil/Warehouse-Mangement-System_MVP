import db from "@/database";
import { outboundShipment } from "@/../drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const shipmentId = params.id;

  if (!shipmentId) {
    return NextResponse.json(
      { message: "Shipment ID is required" },
      { status: 400 }
    );
  }

  try {
    const shipmentData = await db
      .select()
      .from(outboundShipment)
      .where(eq(outboundShipment.shipmentId, parseInt(shipmentId)));

    if (!shipmentData || shipmentData.length === 0) {
      return NextResponse.json(
        { message: `Outbound shipment with ID ${shipmentId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(shipmentData[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching outbound shipment:", error);
    return NextResponse.json(
      { message: "Error fetching outbound shipment data" },
      { status: 500 }
    );
  }
}
