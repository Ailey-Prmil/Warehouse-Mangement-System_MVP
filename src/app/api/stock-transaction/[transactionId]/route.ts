import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { stockTransaction, product, locationBin } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

type TransactionIdParams = {
  params: {
    transactionId: string;
  };
};

export async function GET(request: NextRequest, { params }: TransactionIdParams) {
  const transactionId = params.transactionId;

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get the transaction with product and location details
    const transaction = await db
      .select({
        transactionId: stockTransaction.transactionId,
        productId: stockTransaction.productId,
        locId: stockTransaction.locId,
        transactionType: stockTransaction.transactionType,
        refId: stockTransaction.refId,
        quantity: stockTransaction.quantity,
        transactionTime: stockTransaction.transactionTime,
        productName: product.name,
        productSku: product.sku,
        aisle: locationBin.aisle,
        section: locationBin.section,
        shelf: locationBin.shelf,
      })
      .from(stockTransaction)
      .leftJoin(product, eq(stockTransaction.productId, product.productId))
      .leftJoin(locationBin, eq(stockTransaction.locId, locationBin.locId))
      .where(eq(stockTransaction.transactionId, parseInt(transactionId)))
      .limit(1);

    if (!transaction || transaction.length === 0) {
      return NextResponse.json(
        { message: `No transaction found with ID ${transactionId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching stock transaction:", error);
    return NextResponse.json(
      { message: "Error fetching stock transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: TransactionIdParams) {
  const transactionId = params.transactionId;
  const body = await request.json();
  const { productId, locId, transactionType, refId, quantity } = body;

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
  // Removed restriction on using "Remove" transaction type

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
    }    // Removed restriction on updating "Remove" transaction type

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
      .where(eq(stockTransaction.transactionId, parseInt(transactionId)));

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

export async function DELETE(request: NextRequest, { params }: TransactionIdParams) {
  const transactionId = params.transactionId;
  
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
    }    // Removed restriction on deleting "Remove" transaction type

    // Delete the transaction
    await db
      .delete(stockTransaction)
      .where(eq(stockTransaction.transactionId, parseInt(transactionId)));

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