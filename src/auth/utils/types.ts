export interface User {
  username: string;
  password: string; // This will be the hashed password
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
}
