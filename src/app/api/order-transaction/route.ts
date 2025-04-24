import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { orderTransaction } from "@/../drizzle/schema";

export async function GET() {
  const orderTransactions = await db.select().from(orderTransaction);
  return NextResponse.json(orderTransactions, { status: 200 });
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerOrderId, refId, transactionType, transactionTime } = body;

  if (!customerOrderId || !transactionType) {
    return NextResponse.json(
      {
        message: "customerOrderID, refID, and TransactionType are required",
      },
      { status: 400 }
    );
  }
  if (transactionType.toLowerCase() == "receive" || !refId) {
    return NextResponse.json(
      {
        message:
          "This transaction is already managed by trigger. Only need to insert into customerOrder page",
      },
      { status: 400 }
    );
  }

  try {
    const newStockTransaction = await db.insert(orderTransaction).values({
      customerOrderId: customerOrderId,
      transactionType: transactionType,
      refId: refId,
      transactionTime: transactionTime || null,
    });

    return NextResponse.json(newStockTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating inspection:", error);
    return NextResponse.json(
      { message: "Error creating inspection" },
      { status: 500 }
    );
  }
}

// TEMPORARILY NO DELETE & PUT FUNCTION FOR ORDER TRANSACTION
// BECAUSE THE REQUIREMENT NOT CLEAR HERE (COMPLEX PROCESS).
