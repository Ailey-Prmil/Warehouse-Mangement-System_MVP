import { hashPassword, saveUser } from '../utils/auth-utils';
import { User } from '../utils/types';

/**
 * @todo implement database
 * @dev this currently a temporary solution
 * Generate a new user account and save it to a temporary JSON file
 */
async function generateAccount(username: string, password: string): Promise<void> {
  try {
    console.log('Generating new account...');
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the user object
    const user: User = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Save user to temporary file
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
    console.error('Usage: tsx generate-account.ts <username> <password>');
    process.exit(1);
  }
  
  const username = args[0];
  const password = args[1];
  
  generateAccount(username, password)
    .catch(err => {
      console.error('Failed to generate account:', err);
      process.exit(1);
    });
}

export { generateAccount };
