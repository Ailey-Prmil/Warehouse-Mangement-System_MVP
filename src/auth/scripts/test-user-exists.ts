// Test script to check user authentication
import { getUserByUsername } from '../utils/auth-utils';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import db from '../../database';
import { user } from '../../../drizzle/schema';
import { sql } from 'drizzle-orm';

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

async function testUserExists(username?: string) {
  console.log('Starting test to check if users exist in database...');
  
  try {
    if (username) {
      // Check for a specific user
      const user = await getUserByUsername(username);
      
      if (user) {
        console.log(`✅ User '${username}' found successfully!`);
        console.log('Username:', user.username);
        console.log('Password hash exists:', !!user.password);
        console.log('Email:', user.email || 'Not provided');
        return true;
      } else {
        console.log(`❌ User '${username}' not found in the database.`);
        return false;
      }
    } else {
      // Check if any users exist
      const users = await db.select({
        count: sql`count(*)`
      }).from(user);
      
      const userCount = Number(users[0].count);
      
      if (userCount > 0) {
        console.log(`✅ Database contains ${userCount} user(s).`);
        
        // Get a sample of users (limit to 5)
        const sampleUsers = await db.select({
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }).from(user).limit(5);
        
        console.log('Sample users:');
        sampleUsers.forEach((user, index) => {
          console.log(`${index + 1}. Username: ${user.username}, Role: ${user.role}, Created: ${user.createdAt}`);
        });
        
        return true;
      } else {
        console.log('❌ No users found in the database.');
        return false;
      }
    }
  } catch (error) {
    console.error('Error during test:', error);
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  const username = process.argv[2]; // Optional username argument
  
  testUserExists(username)
    .then(result => {
      if (!result) {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check database connection settings');
        console.log('2. Try creating a user with generate-account.ts script');
        console.log('3. Make sure database migrations are up to date');
        console.log('4. Verify the User table exists in your database');
      }
    })
    .catch(error => {
      console.error('Test failed with error:', error);
    });
}

export { testUserExists };