export interface User {
  username: string;
  password: string; // This will be the hashed password
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string; // Legacy field
  accessToken?: string;
  refreshToken?: string;
}

export interface TokenPayload {
  username: string;
  tokenType: 'access' | 'refresh';
  iat: number;
  exp?: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken?: string;
}