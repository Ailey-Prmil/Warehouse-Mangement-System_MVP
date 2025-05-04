import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { customerOrder } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  const customerOrders = await db.select().from(customerOrder);
  return NextResponse.json(customerOrders, {
    status: 200,
  });
}
// when inserting data, do not use the customerOrderId, it is auto-incremented
// status field is also automated, so it is not needed in the request body
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { orderDate, address } = body;
  try {
    const newOrder = await db.insert(customerOrder).values({
      orderDate: orderDate,
      address: address,
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Error inserting data" },
      { status: 500 }
    );
  }
}
// only update the status of the order, not the orderId or address
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { orderId, newStatus } = body;
  try {
    const updatedOrder = await db
      .update(customerOrder)
      .set({
        status: newStatus,
      })
      .where(eq(customerOrder.customerOrderId, orderId));
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
