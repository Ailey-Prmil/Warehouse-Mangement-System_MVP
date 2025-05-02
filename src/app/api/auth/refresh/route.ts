import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken, getUserByUsername } from "@/auth/utils/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Get the refresh token from the request body
    const { refreshToken } = await req.json();
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify the refresh token (fully stateless)
    const username = verifyRefreshToken(refreshToken);

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Verify that the user still exists in the database
    const user = await getUserByUsername(username);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User no longer exists" },
        { status: 401 }
      );
    }

    // Generate a new access token
    const accessToken = generateAccessToken(username);

    // Return the new access token
    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      accessToken
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during token refresh" },
      { status: 500 }
    );
  }
}