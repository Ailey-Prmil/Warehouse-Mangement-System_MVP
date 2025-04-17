import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs-extra';
import * as path from 'path';
import { User } from './types';

// JWT secret key (in production, this should be in environment variables)
const JWT_SECRET = 'your-secret-key-here';
const JWT_EXPIRATION = '1h';

// File path for storing temporary user data
const TEMP_USER_FILE = path.join(__dirname, '../data/temp-user.json');

// Ensure the data directory exists
const ensureDataDirectoryExists = async (): Promise<void> => {
  const dataDir = path.dirname(TEMP_USER_FILE);
  await fs.ensureDir(dataDir);
};

// Hash a password
/**
 * @dev we could further salt round for this
 * @param password 
 * @returns 
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
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
    if (await fs.pathExists(TEMP_USER_FILE)) {
      return fs.readJSON(TEMP_USER_FILE) as Promise<User>;
    }
    return null;
  } catch (error) {
    console.error('Error reading user file:', error);
    return null;
  }
};

// Generate a JWT token
export const generateToken = (username: string): string => {
  const payload = {
    username,
    iat: Date.now()
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
