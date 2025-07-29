export interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GuestUserData {
  name: string;
}

export interface AuthMeResponse {
  user: User;
}