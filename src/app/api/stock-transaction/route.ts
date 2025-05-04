import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { stockTransaction } from "@/../drizzle/schema";

export async function GET() {
  const stockTransactions = await db.select().from(stockTransaction);
  return NextResponse.json(stockTransactions, { status: 200 });
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, locId, transactionType, refId, quantity } = body;

  if (!productId || !locId || !quantity) {
    return NextResponse.json(
      {
        message: "ProductID, LocID, TransactionType and Quantity are required",
      },
      { status: 400 }
    );
  }
  if (transactionType.toLowerCase() == "remove") {
    return NextResponse.json(
      {
        message:
          "This transaction is already managed by trigger. Only need to insert into inspection page",
      },
      { status: 400 }
    );
  }

  try {
    const newStockTransaction = await db.insert(stockTransaction).values({
      productId: productId,
      locId: locId,
      transactionType: transactionType || "Store",
      refId: refId || null,
      quantity: quantity,
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

// NO DELETE & PUT FUNCTION FOR STOCK TRANSACTION BECAUSE THERE IS NO TRIGGER FOR DELETE AND UPDATE YET.
