import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { customerOrder } from "@/../drizzle/schema";

export async function GET() {
  const customerOrders = await db.select().from(customerOrder);
  console.log(customerOrders);
  return NextResponse.json(customerOrders, {
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { orderId, customerId, orderDate, totalAmount } = body;
  try {
    const newOrder = await db.insert(customerOrder).values({
      orderId,
      customerId,
      orderDate,
      totalAmount,
    });
    return NextResponse.json(newOrder, {
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

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}

export async function PATCH(request: NextRequest) {}
