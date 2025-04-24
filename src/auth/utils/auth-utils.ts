import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs-extra';
import * as path from 'path';
import { User, TokenPayload } from './types';

// JWT configuration (in production, these should be in environment variables)
const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-here',
  ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d'
};

// Absolute file paths for storing user data
const PROJECT_ROOT = process.cwd();
const TEMP_USER_FILE = path.join(PROJECT_ROOT, 'src/auth/data/temp-user.json');
const REFRESH_TOKENS_FILE = path.join(PROJECT_ROOT, 'src/auth/data/refresh-tokens.json');

// Ensure the data directory exists
const ensureDataDirectoryExists = async (): Promise<void> => {
  const dataDir = path.dirname(TEMP_USER_FILE);
  await fs.ensureDir(dataDir);
};

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Increased from 10 for better security
  return bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Save user to temporary JSON file
export const saveUser = async (user: User): Promise<void> => {
  await ensureDataDirectoryExists();
  await fs.writeJSON(TEMP_USER_FILE, user, { spaces: 2 });
};

// Get user from temporary JSON file
export const getUser = async (): Promise<User | null> => {
  try {
    await ensureDataDirectoryExists();
    console.log(`Checking for user file at: ${TEMP_USER_FILE}`);
    
    if (await fs.pathExists(TEMP_USER_FILE)) {
      const userData = await fs.readJSON(TEMP_USER_FILE) as User;
      console.log('User data found:', { username: userData.username });
      return userData;
    }
    
    console.log('No user file found at path');
    return null;
  } catch (error) {
    console.error('Error reading user file:', error);
    return null;
  }
};

// Generate access token
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

// Generate refresh token
export const generateRefreshToken = async (username: string): Promise<string> => {
  const payload: TokenPayload = {
    username,
    tokenType: 'refresh',
    iat: Math.floor(Date.now() / 1000)
  };
  
  const refreshToken = jwt.sign(payload, JWT_CONFIG.SECRET, { 
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRATION 
  });
  
  // Store refresh token
  await storeRefreshToken(username, refreshToken);
  
  return refreshToken;
};

// Store refresh token
export const storeRefreshToken = async (username: string, token: string): Promise<void> => {
  await ensureDataDirectoryExists();
  
  let refreshTokens: Record<string, string[]> = {};
  
  // Read existing refresh tokens
  if (await fs.pathExists(REFRESH_TOKENS_FILE)) {
    refreshTokens = await fs.readJSON(REFRESH_TOKENS_FILE);
  }
  
  // Add new token
  if (!refreshTokens[username]) {
    refreshTokens[username] = [];
  }
  
  // Limit to 5 refresh tokens per user
  refreshTokens[username].push(token);
  if (refreshTokens[username].length > 5) {
    refreshTokens[username].shift(); // Remove oldest token
  }
  
  // Save updated tokens
  await fs.writeJSON(REFRESH_TOKENS_FILE, refreshTokens, { spaces: 2 });
};

// Verify if refresh token is valid and stored
export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  try {
    // Verify token validity
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    
    if (decoded.tokenType !== 'refresh') {
      return null;
    }
    
    const username = decoded.username;
    
    // Check if token is stored
    if (await fs.pathExists(REFRESH_TOKENS_FILE)) {
      const refreshTokens: Record<string, string[]> = await fs.readJSON(REFRESH_TOKENS_FILE);
      
      if (refreshTokens[username] && refreshTokens[username].includes(token)) {
        return username;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

// Invalidate a refresh token
export const invalidateRefreshToken = async (token: string): Promise<boolean> => {
  try {
    // Verify token first to get the username
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    
    if (decoded.tokenType !== 'refresh') {
      return false;
    }
    
    const username = decoded.username;
    
    // Check if token is stored
    if (await fs.pathExists(REFRESH_TOKENS_FILE)) {
      const refreshTokens: Record<string, string[]> = await fs.readJSON(REFRESH_TOKENS_FILE);
      
      if (refreshTokens[username]) {
        // Remove the token
        refreshTokens[username] = refreshTokens[username].filter(t => t !== token);
        await fs.writeJSON(REFRESH_TOKENS_FILE, refreshTokens, { spaces: 2 });
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
    return false;
  }
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

// Generate both access and refresh tokens
export const generateTokens = async (username: string): Promise<{accessToken: string, refreshToken: string}> => {
  const accessToken = generateAccessToken(username);
  const refreshToken = await generateRefreshToken(username);
  
  return {
    accessToken,
    refreshToken
  };
};