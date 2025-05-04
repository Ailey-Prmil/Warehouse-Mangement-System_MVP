import { saveUser } from '../utils/auth-utils';
import { User } from '../utils/types';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { setupUserTable } from './setup-db';

// Load environment variables - prioritize .env.local if it exists
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  console.log('Loading environment from .env.local');
  dotenv.config({ path: envLocalPath });
} else {
  console.log('Loading environment from .env');
  dotenv.config({ path: envPath });
}

// Define valid roles
const VALID_ROLES = ['Admin', 'User', 'Manager'] as const;
type UserRole = typeof VALID_ROLES[number];

/**
 * Generate a new user account and save it to the database
 */
async function generateAccount(
  username: string, 
  password: string, 
  email?: string, 
  role: UserRole = 'User'
): Promise<void> {
  try {
    // Validate role
    if (!VALID_ROLES.includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}. Valid roles are: ${VALID_ROLES.join(', ')}`);
    }
    
    // Ensure the User table exists before proceeding
    const setupSuccess = await setupUserTable();
    if (!setupSuccess) {
      throw new Error('Database setup failed. Cannot proceed with account creation.');
    }
    
    console.log(`Generating new account with role: ${role}...`);
    
    // Create the user object
    const user: User = {
      username,
      password, // The saveUser function will hash this
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    // Save user to database
    await saveUser(user);
    
    console.log(`Account created successfully for user: ${username}`);
    console.log(`Role: ${role}`);
    console.log(`Creation timestamp: ${user.createdAt}`);
  } catch (error) {
    console.error('Error generating account:', error);
    process.exit(1);
  }
}

// If this script is run directly, process command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: tsx generate-account.ts <username> <password> [email] [role]');
    console.error('Valid roles: Admin, User, Manager (defaults to User if not specified)');
    process.exit(1);
  }
  
  const username = args[0];
  const password = args[1];
  const email = args.length > 2 ? args[2] : undefined;
  const role = args.length > 3 ? args[3] as UserRole : 'User';
  
  generateAccount(username, password, email, role)
    .catch(err => {
      console.error('Failed to generate account:', err);
      process.exit(1);
    });
}

export { generateAccount };
