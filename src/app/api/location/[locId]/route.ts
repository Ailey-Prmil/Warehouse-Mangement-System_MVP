import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/database";
import { locationBin } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

type LocationIdParams = {
  params: {
    locId: string;
  };
};

export async function GET(request: NextRequest, { params }: LocationIdParams) {
  const locId = params.locId;

  if (!locId) {
    return NextResponse.json(
      { message: "Location ID is required" },
      { status: 400 }
    );
  }

  try {
    const locationData = await db
      .select()
      .from(locationBin)
      .where(eq(locationBin.locId, locId))
      .limit(1);

    if (!locationData || locationData.length === 0) {
      return NextResponse.json(
        { message: `No location found with ID ${locId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(locationData[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { message: "Error fetching location" },
      { status: 500 }
    );
  }
}