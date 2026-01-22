/**
 * Authentication hook
 */

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { tokenManager } from "@/lib/api";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from "@/types/auth";

interface UseAuthOptions {
  /** Redirect to this path if not authenticated */
  redirectTo?: string;
  /** Redirect to this path if authenticated */
  redirectIfAuthenticated?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    clearError,
  } = useAuthStore();

  const { redirectTo, redirectIfAuthenticated } = options;

  // Handle authentication redirects
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }

    if (isAuthenticated && redirectIfAuthenticated) {
      router.push(redirectIfAuthenticated);
    }
  }, [isAuthenticated, isLoading, redirectTo, redirectIfAuthenticated, router]);

  // Hydrate auth state on mount
  useEffect(() => {
    const hasTokens = tokenManager.hasTokens();
    if (hasTokens && !user) {
      fetchUser().catch(() => {
        // Token is invalid, will be handled by the store
      });
    }
  }, [fetchUser, user]);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      await login(credentials);
      router.push("/events");
    },
    [login, router]
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      await register(data);
      // Redirect to verification pending page with email
      const email = encodeURIComponent(data.email);
      router.push(`/verification-pending?email=${email}`);
    },
    [register, router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login");
  }, [logout, router]);

  const handleUpdateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      await updateProfile(data);
    },
    [updateProfile]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError,
  };
}
