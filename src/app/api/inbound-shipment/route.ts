import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { inboundShipment } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const inboundShipments = await db.select().from(inboundShipment);
  return NextResponse.json(inboundShipments, { status: 200 });
}

export async function POST() {
  try {
    const newInboundShipment = await db.insert(inboundShipment).values({});
    // id and createdAt are auto-generated
    return NextResponse.json(newInboundShipment, { status: 201 });
  } catch (error) {
    console.error("Error creating inbound shipment:", error);
    return NextResponse.json(
      { error: "Failed to create inbound shipment" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  try {
    const deletedInboundShipment = await db
      .delete(inboundShipment)
      .where(eq(inboundShipment.shipId, id));
    return NextResponse.json(deletedInboundShipment, { status: 200 });
  } catch (error) {
    console.error("Error deleting inbound shipment:", error);
    return NextResponse.json(
      { error: "Failed to delete inbound shipment" },
      { status: 500 }
    );
  }
}
