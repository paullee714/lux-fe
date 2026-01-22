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
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Register request payload */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

/** Register response */
export interface RegisterResponse {
  user: User;
  message: string;
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
  name: string;
  phone?: string;
  profileImage?: string;
  role: UserRole;
  isVerified: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

/** User roles */
export type UserRole = "user" | "admin" | "moderator";

/** User preferences */
export interface UserPreferences {
  language: "ko" | "en";
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
}

/** Update profile request */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
  preferences?: Partial<UserPreferences>;
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
