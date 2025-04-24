import request from 'supertest';
import app from '../App';
import * as fs from 'fs-extra';
import * as path from 'path';

const TEMP_USER_FILE = path.join(__dirname, '../../data/temp-user.json');
const REFRESH_TOKENS_FILE = path.join(__dirname, '../../data/refresh-tokens.json');

// Test user credentials
const testUser = {
  username: 'jestuser',
  password: 'password123'
};

let accessToken: string;
let refreshToken: string;

// Clean up files before and after tests
beforeAll(async () => {
  await fs.remove(TEMP_USER_FILE).catch(() => {});
  await fs.remove(REFRESH_TOKENS_FILE).catch(() => {});
});

afterAll(async () => {
  await fs.remove(TEMP_USER_FILE).catch(() => {});
  await fs.remove(REFRESH_TOKENS_FILE).catch(() => {});
});

describe('Authentication API', () => {
  // Test registration
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toEqual('Account created successfully');
  });

  // Test login
  test('should login and return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toEqual('Authentication successful');
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    
    // Save tokens for later tests
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  // Test verify token
  test('should verify valid access token', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${accessToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.user.username).toEqual(testUser.username);
  });

  // Test refresh token
  test('should refresh access token with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/token/refresh')
      .send({ refreshToken });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.accessToken).toBeDefined();
    
    // Save new access token
    accessToken = res.body.accessToken;
  });

  // Test logout
  test('should logout by invalidating refresh token', async () => {
    const res = await request(app)
      .post('/api/token/logout')
      .send({ refreshToken });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toEqual('Logged out successfully');
  });

  // Test refresh after logout (should fail)
  test('refresh should fail after logout', async () => {
    const res = await request(app)
      .post('/api/token/refresh')
      .send({ refreshToken });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBeFalsy();
  });
});