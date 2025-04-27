import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/auth/utils/auth-utils"

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(" ")[1]
    
    // Directly use verifyToken function to check the token against the local verification logic
    // Note: This is a temporary workaround until the API is fully implemented
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // If token is valid, return user information
    return NextResponse.json({
      success: true,
      message: "Token is valid",
      user: {
        username: decoded.username
      }
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      { success: false, message: "Server error during token verification" },
      { status: 500 }
    )
  }
}

/* 
 * Note: This is a temporary implementation that directly uses the authentication utilities.
 * When the API is fully implemented, this should be updated to make proper API calls
 * to the authentication backend service.
 */