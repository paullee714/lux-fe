/**
 * Authentication store using Zustand
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  User,
  AuthState,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/types/auth";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  updateProfile as apiUpdateProfile,
  tokenManager,
} from "@/lib/api";

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  hydrate: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiLogin(credentials);
          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.tokens.access_token,
              refreshToken: response.data.tokens.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRegister(data);
          if (response.success && response.data) {
            // Registration returns tokens - auto-login the user
            set({
              user: response.data.user,
              accessToken: response.data.tokens.access_token,
              refreshToken: response.data.tokens.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Registration failed",
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiLogout();
        } finally {
          set(initialState);
        }
      },

      fetchUser: async () => {
        if (!tokenManager.hasTokens()) {
          return;
        }

        set({ isLoading: true });
        try {
          const response = await getCurrentUser();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          // If fetching user fails, clear auth state
          set(initialState);
          throw error;
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiUpdateProfile(data);
          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Profile update failed",
          });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },

      hydrate: async () => {
        const hasTokens = tokenManager.hasTokens();
        if (hasTokens && !get().user) {
          await get().fetchUser();
        }
      },
    }),
    {
      name: "lux-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthStore) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
