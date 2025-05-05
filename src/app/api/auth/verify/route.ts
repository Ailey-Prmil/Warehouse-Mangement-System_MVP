import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserByUsername } from "@/auth/utils/auth-utils";

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    
    // Verify the token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Verify that the user still exists in the database
    const user = await getUserByUsername(decoded.username);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User no longer exists" },
        { status: 401 }
      );
    }

    // If token is valid, return user information
    return NextResponse.json({
      success: true,
      message: "Token is valid",
      user: {
        username: decoded.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during token verification" },
      { status: 500 }
    );
  }
}