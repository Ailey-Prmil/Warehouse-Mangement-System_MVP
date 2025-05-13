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
  const { shipmentTime, carrier, trackingNumber } = body;

  try {
    const newOutboundShipment = await db.insert(outboundShipment).values({
      shipmentTime: shipmentTime,
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
  const { shipmentId, shipmentTime, carrier, trackingNumber } = body;
  if (!shipmentId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  const updateData: Record<string, string> = {};
  if (shipmentTime !== undefined) updateData.shipmentTime = shipmentTime;
  if (carrier !== undefined) updateData.carrier = carrier;
  if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "No fields provided to update." },
      { status: 400 }
    );
  }
  try {
    const updatedShipment = await db
      .update(outboundShipment)
      .set(updateData)
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
