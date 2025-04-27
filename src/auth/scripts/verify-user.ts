import { getUser, comparePassword, generateTokens } from '../utils/auth-utils';
import { AuthResult } from '../utils/types';

/**
 * Verify user credentials and generate JWT tokens if successful
 */
async function verifyUser(username: string, password: string): Promise<AuthResult> {
  try {
    console.log(`Attempting to verify user: ${username}`);
    
    // Get user from temporary file
    const user = await getUser();
    
    if (!user) {
      console.log('Authentication failed: No user found');
      return {
        success: false,
        message: 'No user account found'
      };
    }
    
    // Check if username matches
    if (user.username !== username) {
      console.log('Authentication failed: Username does not match');
      return {
        success: false,
        message: 'Invalid username'
      };
    }
    
    // Check if password matches
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Authentication failed: Password is incorrect');
      return {
        success: false,
        message: 'Invalid password'
      };
    }
    
    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateTokens(user.username);
    
    console.log('Authentication successful');
    console.log(`User: ${username}`);
    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);
    
    return {
      success: true,
      message: 'Authentication successful',
      accessToken,
      refreshToken,
      token: accessToken // For backward compatibility
    };
  } catch (error) {
    console.error('Error during verification:', error);
    return {
      success: false,
      message: 'An error occurred during verification'
    };
  }
}

// If this script is run directly, process command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: ts-node verify-user.ts <username> <password>');
    process.exit(1);
  }
  
  const username = args[0];
  const password = args[1];
  
  // Direct verification from data directory
  verifyUser(username, password)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      
      // If successful, display token information for direct usage 
      if (result.success) {
        console.log("\n=== Authentication Successful ===");
        console.log("Copy these tokens for direct use in the application:");
        console.log(`Access Token: ${result.accessToken}`);
        console.log(`Refresh Token: ${result.refreshToken}`);
        console.log("=============================");
      }
    })
    .catch(err => {
      console.error('Failed to verify user:', err);
      process.exit(1);
    });
}

export { verifyUser };

// Note: API integration commented out for now as the API is not fully implemented
// To integrate with the API later, uncomment and adjust the following endpoint calls:
/*
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await verifyUser(username, password);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});
*/