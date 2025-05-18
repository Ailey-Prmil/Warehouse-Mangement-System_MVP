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
  const { carrier, trackingNumber } = body;

  try {
    // shipmentTime will be automatically set by the defaultNow() in the schema
    const newOutboundShipment = await db.insert(outboundShipment).values({
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
  const { shipmentId, shipmentTime, carrier, trackingNumber } = body;  if (!shipmentId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  
  const updateData: Record<string, string | number | null> = {};
  if (shipmentTime !== undefined) updateData.shipmentTime = shipmentTime;
  if (carrier !== undefined) updateData.carrier = carrier;
  if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "No fields provided to update." },
      { status: 400 }    );
  }
  
  try {
    console.log("Updating shipment with ID:", shipmentId);
    console.log("Update data:", updateData);
      // Ensure shipmentId is treated as a number
    const shipmentIdNum = Number(shipmentId);
    const updatedShipment = await db
      .update(outboundShipment)
      .set(updateData)
      .where(eq(outboundShipment.shipmentId, shipmentIdNum));
      console.log("Update result:", updatedShipment);
    return NextResponse.json(updatedShipment, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Error updating data: ${errorMessage}` },
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
  }  try {
    // Ensure shipmentId is treated as a number
    const shipmentIdNum = Number(shipmentId);
    const deletedShipment = await db
      .delete(outboundShipment)
      .where(eq(outboundShipment.shipmentId, shipmentIdNum));
    return NextResponse.json(deletedShipment, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Error deleting data" },
      { status: 500 }
    );
  }
}
