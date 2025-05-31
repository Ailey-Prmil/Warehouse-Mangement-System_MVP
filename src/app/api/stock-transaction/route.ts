import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { stockTransaction } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

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
  }  // Removed restriction on "Remove" transaction type

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
    console.error("Error creating stock transaction:", error);
    return NextResponse.json(
      { message: "Error creating stock transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { transactionId, productId, locId, transactionType, refId, quantity } = body;

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID is required" },
      { status: 400 }
    );
  }

  if (!productId || !locId || !quantity) {
    return NextResponse.json(
      {
        message: "ProductID, LocID, and Quantity are required",
      },
      { status: 400 }
    );
  }

  if (transactionType && transactionType.toLowerCase() === "remove") {
    return NextResponse.json(
      {
        message:
          "Can't update to 'Remove' type. Remove transactions are managed by the inspection system.",
      },
      { status: 400 }
    );
  }

  try {
    // Check if the transaction exists
    const existingTransaction = await db
      .select()
      .from(stockTransaction)
      .where(eq(stockTransaction.transactionId, transactionId))
      .limit(1);

    if (!existingTransaction || existingTransaction.length === 0) {
      return NextResponse.json(
        { message: `No transaction found with ID ${transactionId}` },
        { status: 404 }
      );
    }

    // Check if this is a "Remove" transaction which shouldn't be updated manually
    if (existingTransaction[0].transactionType === "Remove") {
      return NextResponse.json(
        {
          message: "Can't update 'Remove' type transactions. These are managed by the inspection system.",
        },
        { status: 400 }
      );
    }

    // Update the transaction
    const updatedTransaction = await db
      .update(stockTransaction)
      .set({
        productId: productId,
        locId: locId,
        transactionType: transactionType || existingTransaction[0].transactionType,
        refId: refId !== undefined ? refId : existingTransaction[0].refId,
        quantity: quantity,
      })
      .where(eq(stockTransaction.transactionId, transactionId));

    // The stock update trigger will handle updating the stock automatically

    return NextResponse.json(
      { 
        message: "Transaction updated successfully",
        data: updatedTransaction 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating stock transaction:", error);
    return NextResponse.json(
      { message: "Error updating stock transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const transactionId = url.searchParams.get("id");
  
  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the transaction exists
    const existingTransaction = await db
      .select()
      .from(stockTransaction)
      .where(eq(stockTransaction.transactionId, parseInt(transactionId)))
      .limit(1);

    if (!existingTransaction || existingTransaction.length === 0) {
      return NextResponse.json(
        { message: `No transaction found with ID ${transactionId}` },
        { status: 404 }
      );
    }

    // Check if this is a "Remove" transaction which shouldn't be deleted manually
    if (existingTransaction[0].transactionType === "Remove") {
      return NextResponse.json(
        {
          message: "Can't delete 'Remove' type transactions. These are managed by the inspection system.",
        },
        { status: 400 }
      );
    }

    // Delete the transaction
    await db
      .delete(stockTransaction)
      .where(eq(stockTransaction.transactionId, parseInt(transactionId)));

    // Note: When deleting a stock transaction, you would typically need to update the stock accordingly
    // This would require implementing a compensation logic to reverse the effect of the transaction

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting stock transaction:", error);
    return NextResponse.json(
      { message: "Error deleting stock transaction" },
      { status: 500 }
    );
  }
}
