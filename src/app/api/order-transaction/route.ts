import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { orderTransaction } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";
import { formatDateForMySQL } from "@/lib/date-utils";

export const revalidate = 60;

export async function GET() {
  const orderTransactions = await db.select().from(orderTransaction);
  return NextResponse.json(orderTransactions, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerOrderId, refId, transactionType } = body;

  if (!customerOrderId || !transactionType) {
    return NextResponse.json(
      {
        message: "customerOrderID and TransactionType are required",
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
  }  try {
    const newOrderTransaction = await db.insert(orderTransaction).values({
      customerOrderId: customerOrderId,
      transactionType: transactionType,
      refId: refId,
      // Use the formatDateForMySQL utility for proper MySQL datetime format
      transactionTime: formatDateForMySQL(new Date()),
    });

    return NextResponse.json(newOrderTransaction, { status: 201 });  } catch (error) {
    console.error("Error creating order transaction:", error);
    
    // Handle specific database errors
    let status = 500;
    let errorMessage = "Unknown error";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for common MySQL datetime errors
      if (errorMessage.includes("Incorrect datetime value")) {
        status = 400; // Bad request
        errorMessage = "Invalid date format. Please use a valid date.";
      }
    }
    
    return NextResponse.json(
      { 
        message: `Error creating order transaction: ${errorMessage}`,
        details: error instanceof Error ? error.message : undefined
      },
      { status }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { transactionId, customerOrderId, refId, transactionType } = body;

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID is required" },
      { status: 400 }
    );
  }  const updateData: Record<string, unknown> = {};
  if (customerOrderId !== undefined) updateData.customerOrderId = customerOrderId;
  if (refId !== undefined) updateData.refId = refId;
  if (transactionType !== undefined) updateData.transactionType = transactionType;
  // Always update the transaction time when updating a record
  updateData.transactionTime = formatDateForMySQL(new Date());

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "No fields provided to update." },
      { status: 400 }
    );
  }
  try {
    await db
      .update(orderTransaction)
      .set(updateData)
      .where(eq(orderTransaction.transactionId, transactionId));
    
    // Fetch the updated transaction to return
    const updated = await db
      .select()
      .from(orderTransaction)
      .where(eq(orderTransaction.transactionId, transactionId));
    
    if (updated.length === 0) {
      console.error("Transaction not found after update:", transactionId);
      return NextResponse.json(
        { error: "Transaction not found after update" },
        { status: 404 }
      );
    }
    
    console.log("Successfully updated transaction:", updated[0]);
    return NextResponse.json({ 
      message: "Transaction updated successfully", 
      data: updated[0] 
    }, { status: 200 });} catch (error) {
    console.error("Error updating order transaction:", error);
    
    // Handle specific database errors
    let status = 500;
    let errorMessage = "Unknown error";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for common MySQL datetime errors
      if (errorMessage.includes("Incorrect datetime value")) {
        status = 400; // Bad request
        errorMessage = "Invalid date format. Please use a valid date.";
      }
    }
    
    return NextResponse.json(
      { 
        message: `Error updating order transaction: ${errorMessage}`,
        details: error instanceof Error ? error.message : undefined
      },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { transactionId } = await request.json();

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedTransaction = await db
      .delete(orderTransaction)
      .where(eq(orderTransaction.transactionId, transactionId));

    return NextResponse.json(deletedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error deleting order transaction:", error);
    return NextResponse.json(
      { message: "Error deleting order transaction" },
      { status: 500 }
    );
  }
}
