/**
 * UI state store using Zustand
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode, LanguageCode } from "@/types/common";

interface UIState {
  // Theme
  theme: ThemeMode;
  // Language
  language: LanguageCode;
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  // Mobile menu
  mobileMenuOpen: boolean;
  // Notifications
  notificationCount: number;
  // Loading states
  globalLoading: boolean;
}

interface UIActions {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: LanguageCode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setNotificationCount: (count: number) => void;
  incrementNotificationCount: () => void;
  decrementNotificationCount: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  theme: "system",
  language: "ko",
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  notificationCount: 0,
  globalLoading: false,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },

      setLanguage: (language: LanguageCode) => {
        set({ language });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      setNotificationCount: (count: number) => {
        set({ notificationCount: count });
      },

      incrementNotificationCount: () => {
        set((state) => ({ notificationCount: state.notificationCount + 1 }));
      },

      decrementNotificationCount: () => {
        set((state) => ({
          notificationCount: Math.max(0, state.notificationCount - 1),
        }));
      },

      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },
    }),
    {
      name: "lux-ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: UIStore) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
