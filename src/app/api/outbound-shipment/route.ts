import db from "@/database";
import { outboundShipment } from "@/../drizzle/schema";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const revalidate = 60;
export async function GET() {
  const outboundShipments = await db.select().from(outboundShipment);
  return NextResponse.json(outboundShipments, { status: 200 });
  // add info about the customerorders included in the shipment
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { shipmentDate, carrier, trackingNumber } = body;
  if (!shipmentDate || !carrier || !trackingNumber) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const newOutboundShipment = await db.insert(outboundShipment).values({
      shipmentDate: shipmentDate,
      carrier: carrier,
      trackingNumber: trackingNumber,
    });
    return NextResponse.json(newOutboundShipment, {});
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
  const { shipmentId, shipmentDate, carrier, trackingNumber } = body;
  if (!shipmentId || !carrier || !trackingNumber || !shipmentDate) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const updatedShipment = await db
      .update(outboundShipment)
      .set({
        shipmentDate: shipmentDate,
        carrier: carrier,
        trackingNumber: trackingNumber,
      })
      .where(eq(outboundShipment.shipmentId, shipmentId));
    return NextResponse.json(updatedShipment, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Error updating data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { shipmentId } = await request.json();

  if (!shipmentId) {
    return NextResponse.json(
      { message: "Shipment ID is required" },
      { status: 400 }
    );
  }
  try {
    const deletedShipment = await db
      .delete(outboundShipment)
      .where(eq(outboundShipment.shipmentId, shipmentId));
    return NextResponse.json(deletedShipment, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Error deleting data" },
      { status: 500 }
    );
  }
}
