import { NextRequest, NextResponse } from "next/server"
import * as fs from 'fs-extra'
import * as path from 'path'
import { comparePassword, generateTokens } from "@/auth/utils/auth-utils"

// Directly use absolute paths to ensure we can find the user data
const PROJECT_ROOT = process.cwd()
const TEMP_USER_FILE = path.join(PROJECT_ROOT, 'src/auth/data/temp-user.json')

export async function POST(req: NextRequest) {
  try {
    console.log("Login API called")
    console.log("Checking for user file at:", TEMP_USER_FILE)
    
    const { username, password } = await req.json()

    // Validate request body
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      )
    }
    
    // Check if user file exists
    if (!await fs.pathExists(TEMP_USER_FILE)) {
      console.error("User file not found at:", TEMP_USER_FILE)
      return NextResponse.json(
        { success: false, message: "No user account found" },
        { status: 401 }
      )
    }
    
    // Read user directly from file
    const user = await fs.readJSON(TEMP_USER_FILE)
    console.log("Found user with username:", user.username)
    
    // Check if username matches
    if (user.username !== username) {
      console.log("Username does not match:", username)
      return NextResponse.json(
        { success: false, message: "Invalid username" },
        { status: 401 }
      )
    }
    
    // Check if password matches
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      console.log("Password is incorrect")
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      )
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(username)
    console.log("Authentication successful for user:", username)
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    )
  }
}

/* 
 * Note: This is a temporary implementation that directly uses the authentication scripts.
 * When the API is fully implemented, this should be updated to make proper API calls
 * to the authentication backend service.
 */