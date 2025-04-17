import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { pickingList } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  const locations = await db.select().from(pickingList);
  return NextResponse.json(locations, { status: 200 });
}

export async function POST() {
  try {
    const newPickingList = db.insert(pickingList).values({});
    return NextResponse.json(newPickingList, { status: 201 });
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
  const { picklistId } = body.picklistId;

  try {
    const deletedPickingList = await db
      .delete(pickingList)
      .where(eq(pickingList.picklistId, picklistId));
    return NextResponse.json(deletedPickingList, { status: 200 });
  } catch (error) {
    console.error("Error deleting picking list: ", error);
    return NextResponse.json(
      { error: "Failed to delete picking list" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { picklistId } = body.picklistId;
  const { doneAt } = body.doneAt;

  try {
    const updatedPickingList = await db
      .update(pickingList)
      .set(
        {
          doneAt: doneAt, // only this field is being updated for now
        } // Add other fields to update as needed
      )
      .where(eq(pickingList.picklistId, picklistId));
    return NextResponse.json(updatedPickingList, { status: 200 });
  } catch (error) {
    console.error("Error updating picking list: ", error);
    return NextResponse.json(
      { error: "Failed to update picking list" },
      { status: 500 }
    );
  }
}
