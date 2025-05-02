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

/**
 * Generate a new user account and save it to the database
 */
async function generateAccount(username: string, password: string, email?: string): Promise<void> {
  try {
    // Ensure the User table exists before proceeding
    const setupSuccess = await setupUserTable();
    if (!setupSuccess) {
      throw new Error('Database setup failed. Cannot proceed with account creation.');
    }
    
    console.log('Generating new account...');
    
    // Create the user object
    const user: User = {
      username,
      password, // The saveUser function will hash this
      email,
      createdAt: new Date().toISOString()
    };
    
    // Save user to database
    await saveUser(user);
    
    console.log(`Account created successfully for user: ${username}`);
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
    console.error('Usage: tsx generate-account.ts <username> <password> [email]');
    process.exit(1);
  }
  
  const username = args[0];
  const password = args[1];
  const email = args.length > 2 ? args[2] : undefined;
  
  generateAccount(username, password, email)
    .catch(err => {
      console.error('Failed to generate account:', err);
      process.exit(1);
    });
}

export { generateAccount };
