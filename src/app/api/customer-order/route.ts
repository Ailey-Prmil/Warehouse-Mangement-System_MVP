import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { customerOrder } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";
import { formatDateForMySQL } from "@/lib/date-utils";

export const revalidate = 60;

export async function GET() {
  const customerOrders = await db.select().from(customerOrder);
  return NextResponse.json(customerOrders, {
    status: 200,
  });
}
// when inserting data, do not use the customerOrderId, it is auto-incremented
// status field is also automated, so it is not needed in the request body
// orderTime is now automatically set to current time
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address } = body;
  try {
    const newOrder = await db.insert(customerOrder).values({
      orderTime: formatDateForMySQL(new Date()),
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
// also update the orderTime to current time when status changes
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { orderId, newStatus } = body;
  try {
    const updatedOrder = await db
      .update(customerOrder)
      .set({
        status: newStatus,
        orderTime: formatDateForMySQL(new Date()),
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
