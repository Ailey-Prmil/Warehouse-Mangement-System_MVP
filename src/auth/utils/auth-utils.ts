import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User as UserType, TokenPayload } from './types';
import db from '../../database';
import { user } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import * as mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

// JWT configuration (in production, these should be in environment variables)
const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
  ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d'
};

// Helper function to determine if we're running directly as a script
const isRunningAsScript = () => {
  return process.argv[1] && process.argv[1].includes('scripts');
};

// Get database connection based on execution context
const getDb = async () => {
  if (isRunningAsScript()) {
    // When running as a script, create a direct connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return drizzle(connection);
  } else {
    // When running in the application, use the shared connection
    return db;
  }
};

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Save user to database
export const saveUser = async (userData: UserType): Promise<void> => {
  try {
    const hashedPassword = await hashPassword(userData.password);
    const database = await getDb();
    
    await database.insert(user).values({
      username: userData.username,
      password: hashedPassword,
      email: userData.email || null,
      role: userData.role || 'User' // Use provided role or default to 'User'
    });
    
    console.log(`User ${userData.username} saved to database with role: ${userData.role || 'User'}`);
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
};

// Get user from database by username
export const getUserByUsername = async (username: string): Promise<UserType | null> => {
  try {
    const database = await getDb();
    const users = await database.select().from(user).where(eq(user.username, username));
    
    if (users.length === 0) {
      console.log(`User ${username} not found in database`);
      return null;
    }
    
    const userData = users[0];
    console.log(`User ${username} found in database`);
    
    return {
      username: userData.username,
      password: userData.password,
      email: userData.email || undefined,
      role: userData.role as UserType['role'],
      createdAt: userData.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return null;
  }
};

// Update last login timestamp for a user
export const updateLastLogin = async (username: string): Promise<void> => {
  try {
    const database = await getDb();
    await database.update(user)
      .set({ lastLogin: sql`CURRENT_TIMESTAMP` })
      .where(eq(user.username, username));
    
    console.log(`Updated last login for user ${username}`);
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

// Generate access token (stateless)
export const generateAccessToken = (username: string): string => {
  const payload: TokenPayload = {
    username,
    tokenType: 'access',
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_CONFIG.SECRET, { 
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRATION 
  });
};

// Generate refresh token (stateless)
export const generateRefreshToken = (username: string): string => {
  const payload: TokenPayload = {
    username,
    tokenType: 'refresh',
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_CONFIG.SECRET, { 
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRATION 
  });
};

// Verify JWT token (access token)
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    
    // Check if it's an access token
    if (decoded.tokenType !== 'access') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Verify refresh token (stateless)
export const verifyRefreshToken = (token: string): string | null => {
  try {
    // Verify token validity
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    
    if (decoded.tokenType !== 'refresh') {
      return null;
    }
    
    return decoded.username;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

// Generate both access and refresh tokens
export const generateTokens = (username: string): {accessToken: string, refreshToken: string} => {
  const accessToken = generateAccessToken(username);
  const refreshToken = generateRefreshToken(username);
  
  return {
    accessToken,
    refreshToken
  };
};