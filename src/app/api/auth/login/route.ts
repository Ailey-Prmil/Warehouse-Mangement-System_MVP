import { NextRequest, NextResponse } from "next/server";
import { comparePassword, generateTokens, getUserByUsername, updateLastLogin } from "@/auth/utils/auth-utils";

export async function POST(req: NextRequest) {
  try {
    console.log("Login API called");
    
    const { username, password } = await req.json();

    // Validate request body
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Get user from database
    const user = await getUserByUsername(username);
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Password is incorrect");
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Update last login timestamp
    await updateLastLogin(username);
    
    // Generate tokens - now synchronous with fully stateless tokens
    const { accessToken, refreshToken } = generateTokens(username);
    
    console.log("Authentication successful for user:", username);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}