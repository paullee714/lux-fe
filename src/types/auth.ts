/**
 * Authentication-related types
 */

import type { BaseEntity } from "./common";

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Login response */
export interface LoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    expires_at: string;
  };
}

/** Register request payload */
export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
  language?: "ko" | "en";
}

/** Register response - same as login, returns user and tokens */
export interface RegisterResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    expires_at: string;
  };
}

/** Password reset request */
export interface ForgotPasswordRequest {
  email: string;
}

/** Password reset confirmation */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/** User entity */
export interface User extends BaseEntity {
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  language: string;
  role: UserRole;
  status: string;
  email_verified: boolean;
  last_login_at?: string;
}

/** User roles */
export type UserRole = "user" | "admin" | "moderator";

/** Update profile request */
export interface UpdateProfileRequest {
  display_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  language?: "ko" | "en";
}

/** Auth state for stores */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Auth actions for stores */
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}
