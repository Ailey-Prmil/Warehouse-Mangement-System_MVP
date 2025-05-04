import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as mysql from 'mysql2/promise';

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

// Function to ensure the User table exists in the database
async function setupUserTable(): Promise<boolean> {
  console.log('Setting up database connection...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log(`Connecting to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT}...`);
    
    // Check if User table exists
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'User'`,
      [process.env.DB_NAME]
    );
    
    const tableExists = Array.isArray(tables) && tables.length > 0;
    
    if (!tableExists) {
      console.log('User table does not exist. Creating it now...');
      
      // Create User table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS User (
          UserID INT PRIMARY KEY AUTO_INCREMENT,
          Username VARCHAR(50) NOT NULL UNIQUE,
          Password VARCHAR(255) NOT NULL,
          Role ENUM('Admin', 'User', 'Manager') NOT NULL DEFAULT 'User',
          Email VARCHAR(100) UNIQUE,
          CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          LastLogin TIMESTAMP NULL
        )
      `);
      
      console.log('User table created successfully.');
    } else {
      console.log('User table already exists.');
    }
    
    console.log('Database setup completed successfully.');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  } finally {
    await connection.end();
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupUserTable()
    .then(success => {
      if (success) {
        console.log('\nDatabase is ready for authentication operations.');
      } else {
        console.log('\nDatabase setup failed. Please check your connection settings.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Setup script error:', error);
      process.exit(1);
    });
}

export { setupUserTable };