/**
 * Authentication API functions
 */

import { apiClient, tokenManager } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
  UpdateProfileRequest,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

/**
 * Login user
 */
export async function login(
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

  // Store tokens
  if (response.success && response.data) {
    tokenManager.setTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
  }

  return response;
}

/**
 * Register new user
 */
export async function register(
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> {
  return apiClient.post<RegisterResponse>("/auth/register", data);
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    tokenManager.clearTokens();
  }
}

/**
 * Request password reset
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/forgot-password", data);
}

/**
 * Reset password with token
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/reset-password", data);
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient.get<User>("/users/me");
}

/**
 * Update current user profile
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<ApiResponse<User>> {
  return apiClient.patch<User>("/users/me", data);
}

/**
 * Refresh tokens
 */
export async function refreshTokens(): Promise<
  ApiResponse<{ accessToken: string; refreshToken: string }>
> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/refresh", { refreshToken });

  if (response.success && response.data) {
    tokenManager.setTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
  }

  return response;
}

/**
 * Verify email
 */
export async function verifyEmail(
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/verify-email", { token });
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiClient.post<{ message: string }>("/auth/resend-verification");
}

/**
 * Change password (for logged-in users)
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/change-password", data);
}
