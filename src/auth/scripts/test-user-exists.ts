// Test script to check user authentication
import { getUser, comparePassword } from '../utils/auth-utils';

async function testUserExists() {
  console.log('Starting test to check if user exists in data directory...');
  console.log('Current working directory:', process.cwd());
  
  try {
    // Try to get the user
    const user = await getUser();
    
    if (user) {
      console.log('✅ User found successfully!');
      console.log('Username:', user.username);
      console.log('Password hash exists:', !!user.password);
      return true;
    } else {
      console.log('❌ No user found in the data directory.');
      return false;
    }
  } catch (error) {
    console.error('Error during test:', error);
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testUserExists()
    .then(result => {
      if (!result) {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check if temp-user.json exists in src/auth/data/ directory');
        console.log('2. Try regenerating a user with generate-account.ts script');
        console.log('3. Verify file permissions allow reading the file');
      }
    })
    .catch(error => {
      console.error('Test failed with error:', error);
    });
}

export { testUserExists };