import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { pickingList } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";
import { formatDateForMySQL } from "@/lib/date-utils";

export const revalidate = 60;

export async function GET() {
  const locations = await db.select().from(pickingList);
  return NextResponse.json(locations, { status: 200 });
}

export async function POST() {
  try {
    // Insert a new empty picking list
    await db.insert(pickingList).values({});
    
    // Fetch the newly created picking list to return it
    const newList = await db.select().from(pickingList).orderBy(pickingList.picklistId).limit(1);
    
    return NextResponse.json(newList[0], { status: 201 });
  } catch (error) {
    console.error("Error creating picking list: ", error);
    return NextResponse.json(
      { error: "Failed to create picking list" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { picklistId } = body;
  if (!picklistId)
    return NextResponse.json(
      { message: "Missing picklistId" },
      { status: 400 }
    );
  try {
    const deletedPickingList = await db
      .delete(pickingList)
      .where(eq(pickingList.picklistId, picklistId));
    return NextResponse.json(
      { message: "Picking list deleted successfully", deleted: deletedPickingList },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting picking list: ", error);
    return NextResponse.json(
      { error: "Failed to delete picking list" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);
    
    const { picklistId, doneAt } = body;
    
    if (!picklistId) {
      return NextResponse.json(
        { message: "Missing picklistId" },
        { status: 400 }
      );
    }
    
    // Convert picklistId to number to ensure proper comparison with database
    const picklistIdNum = Number(picklistId);
    if (isNaN(picklistIdNum)) {
      console.error("Invalid picklistId format:", picklistId);
      return NextResponse.json(
        { error: `Invalid picklistId format: ${picklistId}` },
        { status: 400 }
      );
    }
    
    console.log("Updating picking list:", { picklistIdNum, doneAt });    // Format the date properly for MySQL using our utility function
    let formattedDoneAt;
    
    try {
      // If doneAt is null, it will remain null
      // Otherwise it will be formatted for MySQL
      formattedDoneAt = formatDateForMySQL(doneAt);
      console.log("Formatted date for MySQL:", formattedDoneAt);
    } catch (e) {
      console.error("Error formatting date:", e);
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    
    // Update the picking list
    await db
      .update(pickingList)
      .set({
        doneAt: formattedDoneAt // using the correctly formatted date
      })
      .where(eq(pickingList.picklistId, picklistIdNum));
      // Fetch the updated picking list to return it
    const updated = await db
      .select()
      .from(pickingList)
      .where(eq(pickingList.picklistId, picklistIdNum));
    
    if (updated.length === 0) {
      console.error("Picking list not found after update:", picklistIdNum);
      return NextResponse.json(
        { error: "Picking list not found after update" },
        { status: 404 }
      );
    }
    
    console.log("Successfully updated picking list:", updated[0]);
    return NextResponse.json(
      { message: "Picking list updated successfully", data: updated[0] },
      { status: 200 }
    );  } catch (error) {
    console.error("Error updating picking list: ", error);
    
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
        error: `Failed to update picking list: ${errorMessage}`,
        details: error instanceof Error ? error.message : undefined
      },
      { status }
    );
  }
}
