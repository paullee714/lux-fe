# Lux Frontend Implementation Plan

> **Project**: lux-fe (Next.js Web Application)
> **Version**: 1.0.0
> **Last Updated**: 2026-01-20
> **Status**: Ready for Implementation

---

## Overview

This document provides a comprehensive implementation plan for the Lux frontend application, broken down into 5 phases with detailed tasks, acceptance criteria, and dependencies.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (client state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: ky (fetch-based)
- **Internationalization**: next-intl
- **Backend API**: http://localhost:8088

### Project Structure (Target)
```
lux-fe/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (main)/
│   │   │   │   ├── events/
│   │   │   │   ├── invitations/
│   │   │   │   └── profile/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Header, Footer, etc.
│   │   ├── events/          # Event-related components
│   │   ├── invitations/     # Invitation components
│   │   └── forms/           # Form components
│   ├── hooks/
│   ├── lib/
│   │   ├── api/             # API client
│   │   └── utils/           # Utility functions
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── messages/            # i18n translations
│   └── styles/
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1: Foundation

**Duration**: 3-4 days
**Goal**: Establish the project foundation with proper configuration, API client, and layout components.

---

### Task 1.1: Project Initialization

**Story Points**: 3
**Priority**: P0 (Critical)
**Dependencies**: None

**Description**:
As a developer, I want to initialize the Next.js 14 project with all required dependencies so that we have a properly configured development environment.

**Files to Create**:
- `/package.json`
- `/next.config.js`
- `/tsconfig.json`
- `/tailwind.config.ts`
- `/postcss.config.js`
- `/.env.local.example`
- `/.gitignore`
- `/src/app/layout.tsx`
- `/src/app/page.tsx`
- `/src/styles/globals.css`

**Acceptance Criteria**:
- [ ] Next.js 14 project created with App Router
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS installed and configured
- [ ] Environment variables configured for API URL
- [ ] Project runs successfully with `npm run dev`
- [ ] ESLint and Prettier configured
- [ ] Path aliases configured (`@/` for `src/`)

**Technical Notes**:
```bash
# Required dependencies
npx create-next-app@14 lux-fe --typescript --tailwind --eslint --app --src-dir

# Additional dependencies
npm install zustand @tanstack/react-query ky react-hook-form @hookform/resolvers zod
npm install next-intl date-fns clsx tailwind-merge
npm install -D @types/node prettier eslint-config-prettier
```

---

### Task 1.2: shadcn/ui Setup

**Story Points**: 2
**Priority**: P0 (Critical)
**Dependencies**: Task 1.1

**Description**:
As a developer, I want to configure shadcn/ui component library so that we have a consistent design system.

**Files to Create**:
- `/components.json`
- `/src/lib/utils.ts`
- `/src/components/ui/button.tsx`
- `/src/components/ui/input.tsx`
- `/src/components/ui/label.tsx`
- `/src/components/ui/card.tsx`
- `/src/components/ui/dialog.tsx`
- `/src/components/ui/dropdown-menu.tsx`
- `/src/components/ui/avatar.tsx`
- `/src/components/ui/badge.tsx`
- `/src/components/ui/toast.tsx`
- `/src/components/ui/skeleton.tsx`
- `/src/components/ui/select.tsx`
- `/src/components/ui/textarea.tsx`
- `/src/components/ui/form.tsx`
- `/src/components/ui/tabs.tsx`
- `/src/components/ui/separator.tsx`
- `/src/components/ui/alert.tsx`

**Acceptance Criteria**:
- [ ] shadcn/ui CLI configured
- [ ] All base UI components installed
- [ ] Custom theme colors defined (Lux brand colors)
- [ ] Dark mode support configured
- [ ] Toaster component available globally

**Technical Notes**:
```bash
npx shadcn@latest init
npx shadcn@latest add button input label card dialog dropdown-menu avatar badge toast skeleton select textarea form tabs separator alert
```

---

### Task 1.3: TypeScript Types Definition

**Story Points**: 2
**Priority**: P0 (Critical)
**Dependencies**: Task 1.1

**Description**:
As a developer, I want comprehensive TypeScript types for all API entities so that we have type safety throughout the application.

**Files to Create**:
- `/src/types/api.ts` - API response types
- `/src/types/user.ts` - User entity types
- `/src/types/event.ts` - Event entity types
- `/src/types/invitation.ts` - Invitation types
- `/src/types/post.ts` - Post types
- `/src/types/auth.ts` - Authentication types
- `/src/types/index.ts` - Export barrel

**Acceptance Criteria**:
- [ ] All API response types defined
- [ ] All entity types match backend schema
- [ ] Pagination meta type defined
- [ ] Error response types defined
- [ ] Types are exported from single barrel file

**Type Definitions**:
```typescript
// /src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    type: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// /src/types/user.ts
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  role: 'user' | 'admin';
  language: 'ko' | 'en';
  email_verified: boolean;
  created_at: string;
}

// /src/types/event.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  slug: string;
  organizer: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  location: string;
  venue_name?: string;
  address?: Address;
  coordinates?: Coordinates;
  timezone: string;
  starts_at: string;
  ends_at: string;
  capacity?: number;
  attendee_count: number;
  status: 'draft' | 'published' | 'cancelled';
  visibility: 'public' | 'private' | 'invite_only';
  cover_image_url?: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// /src/types/invitation.ts
export interface Invitation {
  id: string;
  event: Event;
  inviter: {
    id: string;
    display_name: string;
  };
  invitee_id?: string;
  invitee_email?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  responded_at?: string;
  created_at: string;
}

// /src/types/post.ts
export interface Post {
  id: string;
  author: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  title?: string;
  content: string;
  post_type: 'update' | 'announcement' | 'reminder';
  attachments: Attachment[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### Task 1.4: API Client Setup

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Task 1.1, Task 1.3

**Description**:
As a developer, I want a centralized API client with authentication handling so that all API calls are consistent and include proper error handling.

**Files to Create**:
- `/src/lib/api/client.ts` - Base ky instance
- `/src/lib/api/auth.ts` - Auth endpoints
- `/src/lib/api/users.ts` - User endpoints
- `/src/lib/api/events.ts` - Event endpoints
- `/src/lib/api/invitations.ts` - Invitation endpoints
- `/src/lib/api/posts.ts` - Post endpoints
- `/src/lib/api/index.ts` - Export barrel

**Acceptance Criteria**:
- [ ] Base API client created with ky
- [ ] Request interceptor adds Authorization header
- [ ] Response interceptor handles 401 errors
- [ ] Automatic token refresh on 401
- [ ] All API endpoints wrapped as functions
- [ ] Error responses properly typed and thrown
- [ ] API base URL configurable via environment

**Technical Implementation**:
```typescript
// /src/lib/api/client.ts
import ky from 'ky';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

export const apiClient = ky.create({
  prefixUrl: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
        const locale = useAuthStore.getState().locale || 'en';
        request.headers.set('Accept-Language', locale);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          const refreshed = await attemptTokenRefresh();
          if (refreshed) {
            return ky(request);
          }
        }
        return response;
      },
    ],
  },
});
```

---

### Task 1.5: Authentication Store (Zustand)

**Story Points**: 3
**Priority**: P0 (Critical)
**Dependencies**: Task 1.1, Task 1.3

**Description**:
As a developer, I want a Zustand store for authentication state so that auth state is accessible throughout the application.

**Files to Create**:
- `/src/stores/auth.ts`

**Acceptance Criteria**:
- [ ] Store holds user, accessToken, refreshToken, isAuthenticated
- [ ] Actions: login, logout, setTokens, setUser, refreshTokens
- [ ] Tokens persisted to localStorage (with encryption consideration)
- [ ] Store properly typed with TypeScript
- [ ] Hydration handled for SSR

**Technical Implementation**:
```typescript
// /src/stores/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  locale: 'ko' | 'en';

  // Actions
  setAuth: (user: User, tokens: { access_token: string; refresh_token: string }) => void;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
  setUser: (user: User) => void;
  setLocale: (locale: 'ko' | 'en') => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      locale: 'ko',

      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
        }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }),

      setUser: (user) => set({ user }),

      setLocale: (locale) => set({ locale }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'lux-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        locale: state.locale,
      }),
    }
  )
);
```

---

### Task 1.6: TanStack Query Setup

**Story Points**: 2
**Priority**: P0 (Critical)
**Dependencies**: Task 1.1, Task 1.4

**Description**:
As a developer, I want TanStack Query configured so that we have efficient server state management with caching.

**Files to Create**:
- `/src/lib/query-client.ts`
- `/src/providers/query-provider.tsx`
- `/src/hooks/queries/use-user.ts`
- `/src/hooks/queries/use-events.ts`
- `/src/hooks/queries/use-invitations.ts`
- `/src/hooks/queries/index.ts`

**Acceptance Criteria**:
- [ ] QueryClient configured with sensible defaults
- [ ] QueryClientProvider wrapped at app root
- [ ] Query keys defined consistently
- [ ] Stale time and cache time configured
- [ ] Error handling configured globally
- [ ] Devtools available in development

**Technical Implementation**:
```typescript
// /src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys
export const queryKeys = {
  user: {
    current: ['user', 'current'] as const,
    profile: (id: string) => ['user', 'profile', id] as const,
  },
  events: {
    all: ['events'] as const,
    list: (filters: Record<string, unknown>) => ['events', 'list', filters] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
    posts: (eventId: string) => ['events', eventId, 'posts'] as const,
  },
  invitations: {
    my: ['invitations', 'my'] as const,
    event: (eventId: string) => ['invitations', 'event', eventId] as const,
    detail: (id: string) => ['invitations', 'detail', id] as const,
  },
};
```

---

### Task 1.7: Layout Components (Header)

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 1.2, Task 1.5

**Description**:
As a user, I want a consistent header across all pages so that I can easily navigate and access my account.

**Files to Create**:
- `/src/components/layout/header.tsx`
- `/src/components/layout/user-menu.tsx`
- `/src/components/layout/mobile-nav.tsx`
- `/src/components/layout/logo.tsx`
- `/src/components/layout/nav-links.tsx`
- `/src/components/layout/language-switcher.tsx`

**Acceptance Criteria**:
- [ ] Logo displayed with link to home
- [ ] Navigation links: Events, My Invitations (when logged in)
- [ ] User menu dropdown when authenticated (Profile, Logout)
- [ ] Login/Register buttons when not authenticated
- [ ] Language switcher (KO/EN)
- [ ] Responsive design with mobile hamburger menu
- [ ] Current route highlighted in navigation

**Wireframe**:
```
Desktop:
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]    Events   My Invitations        [KO|EN]   [Avatar ▼]      │
└─────────────────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────────────────────────────┐
│ [=]  [Logo]                                              [Avatar]   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 1.8: Layout Components (Footer)

**Story Points**: 1
**Priority**: P2 (Medium)
**Dependencies**: Task 1.2

**Description**:
As a user, I want a footer with relevant links and information so that I can access secondary navigation and legal information.

**Files to Create**:
- `/src/components/layout/footer.tsx`

**Acceptance Criteria**:
- [ ] Copyright notice with current year
- [ ] Links: Privacy Policy, Terms of Service, Contact
- [ ] Social media links (placeholder)
- [ ] Responsive design
- [ ] Consistent styling with overall design

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Lux                                                               │
│   The modern event platform                                         │
│                                                                     │
│   ─────────────────────────────────────────────────────────────     │
│                                                                     │
│   Privacy Policy   Terms of Service   Contact                       │
│                                                                     │
│   (c) 2026 Lux. All rights reserved.                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 1.9: Main Layout Implementation

**Story Points**: 2
**Priority**: P0 (Critical)
**Dependencies**: Task 1.6, Task 1.7, Task 1.8

**Description**:
As a developer, I want a main layout component that wraps all pages so that providers and common components are consistent.

**Files to Create**:
- `/src/app/[locale]/layout.tsx`
- `/src/providers/index.tsx`

**Acceptance Criteria**:
- [ ] Layout includes Header and Footer
- [ ] Providers properly nested (Query, Auth, Toast)
- [ ] Locale parameter handled from URL
- [ ] Main content area properly styled
- [ ] Toaster component rendered
- [ ] Metadata configured for SEO

---

## Phase 2: Authentication

**Duration**: 3-4 days
**Goal**: Implement complete authentication flow including login, register, and protected routes.

---

### Task 2.1: Login Page

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Phase 1 complete

**Description**:
As a user, I want to log in to my account so that I can access personalized features.

**Files to Create**:
- `/src/app/[locale]/(auth)/login/page.tsx`
- `/src/components/forms/login-form.tsx`
- `/src/lib/validations/auth.ts`

**Acceptance Criteria**:
- [ ] Email input with validation (required, valid email format)
- [ ] Password input with validation (required, min 8 characters)
- [ ] Show/hide password toggle
- [ ] Form validation using Zod + React Hook Form
- [ ] Error messages displayed inline
- [ ] API error messages displayed (invalid credentials, etc.)
- [ ] Loading state during submission
- [ ] Redirect to intended page after successful login
- [ ] Link to register page
- [ ] Bilingual support (KO/EN)

**Validation Schema**:
```typescript
// /src/lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

**Wireframe**:
```
┌─────────────────────────────────────────┐
│                                         │
│              Welcome Back               │
│         Log in to your account          │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Email                           │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Password                    [o] │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │           Log In                │   │
│   └─────────────────────────────────┘   │
│                                         │
│   Don't have an account? Register       │
│                                         │
└─────────────────────────────────────────┘
```

---

### Task 2.2: Register Page

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Task 2.1

**Description**:
As a new user, I want to create an account so that I can use the platform.

**Files to Create**:
- `/src/app/[locale]/(auth)/register/page.tsx`
- `/src/components/forms/register-form.tsx`

**Acceptance Criteria**:
- [ ] Display name input (required, 2-50 characters)
- [ ] Email input with validation
- [ ] Password input (min 8 chars, must include number and special char)
- [ ] Confirm password input with match validation
- [ ] Language preference selector (KO/EN)
- [ ] Terms acceptance checkbox (required)
- [ ] Form validation with Zod
- [ ] API error handling (email already exists, etc.)
- [ ] Loading state during submission
- [ ] Auto-login after successful registration
- [ ] Link to login page
- [ ] Bilingual support

**Validation Schema**:
```typescript
export const registerSchema = z.object({
  display_name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
  confirm_password: z.string(),
  language: z.enum(['ko', 'en']),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});
```

---

### Task 2.3: Auth Mutations (TanStack Query)

**Story Points**: 3
**Priority**: P0 (Critical)
**Dependencies**: Task 1.4, Task 1.5, Task 1.6

**Description**:
As a developer, I want TanStack Query mutations for auth operations so that login/register have proper loading and error states.

**Files to Create**:
- `/src/hooks/mutations/use-login.ts`
- `/src/hooks/mutations/use-register.ts`
- `/src/hooks/mutations/use-logout.ts`
- `/src/hooks/mutations/index.ts`

**Acceptance Criteria**:
- [ ] useLogin mutation with proper error handling
- [ ] useRegister mutation with proper error handling
- [ ] useLogout mutation that clears cache and store
- [ ] Success callbacks update auth store
- [ ] Error callbacks provide typed error messages
- [ ] Mutations properly typed

**Technical Implementation**:
```typescript
// /src/hooks/mutations/use-login.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/events');
    },
    onError: (error) => {
      // Handle specific error types
    },
  });
}
```

---

### Task 2.4: Token Refresh Logic

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Task 1.4, Task 1.5

**Description**:
As a user, I want my session to automatically refresh so that I don't get logged out unexpectedly.

**Files to Modify**:
- `/src/lib/api/client.ts` - Add refresh interceptor

**Files to Create**:
- `/src/lib/api/token-refresh.ts`

**Acceptance Criteria**:
- [ ] Automatic token refresh when access token expires (401)
- [ ] Refresh token rotation handled
- [ ] Queued requests retried after refresh
- [ ] Logout on refresh failure
- [ ] No infinite refresh loops
- [ ] Multiple concurrent 401s handled (single refresh)

**Technical Implementation**:
```typescript
// /src/lib/api/token-refresh.ts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function attemptTokenRefresh(): Promise<boolean> {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    return false;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(!!token);
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) throw new Error('Refresh failed');

    const data = await response.json();
    setTokens(data.data);
    onRefreshed(data.data.access_token);
    isRefreshing = false;
    return true;
  } catch {
    logout();
    isRefreshing = false;
    return false;
  }
}
```

---

### Task 2.5: Protected Routes Middleware

**Story Points**: 3
**Priority**: P0 (Critical)
**Dependencies**: Task 1.5, Task 2.1

**Description**:
As a developer, I want protected routes that redirect unauthenticated users so that private pages are secure.

**Files to Create**:
- `/src/middleware.ts`
- `/src/components/auth/auth-guard.tsx`
- `/src/hooks/use-auth.ts`

**Acceptance Criteria**:
- [ ] Middleware checks auth status for protected routes
- [ ] Unauthenticated users redirected to login
- [ ] Login redirect includes return URL
- [ ] Authenticated users redirected away from auth pages
- [ ] Auth guard component for client-side protection
- [ ] Loading state while checking auth

**Protected Routes**:
- `/events/create`
- `/events/[id]/edit`
- `/invitations`
- `/profile`

**Middleware Implementation**:
```typescript
// /src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/events/create', '/invitations', '/profile'];
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies (set from client)
  const token = request.cookies.get('lux-access-token')?.value;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.includes(path));

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### Task 2.6: User Profile Hook

**Story Points**: 2
**Priority**: P1 (High)
**Dependencies**: Task 1.4, Task 1.6, Task 2.4

**Description**:
As a developer, I want a hook to fetch and cache the current user profile so that user data is available throughout the app.

**Files to Create**:
- `/src/hooks/queries/use-current-user.ts`

**Acceptance Criteria**:
- [ ] Fetches user profile on mount (if authenticated)
- [ ] Data cached by TanStack Query
- [ ] Refetches on focus when stale
- [ ] Updates auth store with user data
- [ ] Handles logout on 401

**Technical Implementation**:
```typescript
// /src/hooks/queries/use-current-user.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { queryKeys } from '@/lib/query-client';

export function useCurrentUser() {
  const { isAuthenticated, setUser, logout, setLoading } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      const data = await usersApi.getMe();
      setUser(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        logout();
        return false;
      }
      return failureCount < 2;
    },
  });
}
```

---

### Task 2.7: Auth Hydration

**Story Points**: 2
**Priority**: P0 (Critical)
**Dependencies**: Task 1.5, Task 2.5

**Description**:
As a user, I want my auth state to persist across page refreshes so that I stay logged in.

**Files to Create**:
- `/src/providers/auth-provider.tsx`

**Acceptance Criteria**:
- [ ] Auth state hydrated from localStorage on mount
- [ ] Loading state shown during hydration
- [ ] Token validation on hydration
- [ ] Expired tokens cleared
- [ ] No flash of unauthenticated content

**Technical Implementation**:
```typescript
// /src/providers/auth-provider.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useCurrentUser } from '@/hooks/queries/use-current-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, setLoading } = useAuthStore();

  // Hydrate Zustand store
  useEffect(() => {
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
      setLoading(false);
    });

    // If already hydrated (e.g., hot reload)
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      setLoading(false);
    }

    return () => {
      unsubFinishHydration();
    };
  }, [setLoading]);

  // Fetch user profile if authenticated
  const { isLoading: isUserLoading } = useCurrentUser();

  if (!isHydrated || (isAuthenticated && isUserLoading)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

---

## Phase 3: Events

**Duration**: 5-6 days
**Goal**: Implement complete event management including listing, creation, editing, and status changes.

---

### Task 3.1: Event List Page

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Phase 2 complete

**Description**:
As a user, I want to browse events so that I can find interesting events to attend.

**Files to Create**:
- `/src/app/[locale]/(main)/events/page.tsx`
- `/src/components/events/event-list.tsx`
- `/src/components/events/event-card.tsx`
- `/src/components/events/event-filters.tsx`
- `/src/hooks/queries/use-events.ts`

**Acceptance Criteria**:
- [ ] Display events in a responsive grid
- [ ] Event cards show: cover image, title, date, location, organizer, attendee count
- [ ] Pagination (load more or numbered pages)
- [ ] Filter by: category, date range, search query
- [ ] Sort by: date, popularity
- [ ] Loading skeleton while fetching
- [ ] Empty state when no events
- [ ] Error state with retry option
- [ ] URL reflects current filters (shareable)

**Query Parameters**:
- `?category=technology`
- `?q=meetup`
- `?starts_after=2026-01-01`
- `?page=2`

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  Events                                           [+ Create Event]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Search...]            [Category ▼]    [Date Range ▼]              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   [Image]   │  │   [Image]   │  │   [Image]   │                 │
│  │             │  │             │  │             │                 │
│  │  Tech       │  │  Music      │  │  Sports     │                 │
│  │  Meetup     │  │  Festival   │  │  Tournament │                 │
│  │             │  │             │  │             │                 │
│  │  Jan 25     │  │  Feb 10     │  │  Feb 15     │                 │
│  │  Seoul      │  │  Busan      │  │  Seoul      │                 │
│  │             │  │             │  │             │                 │
│  │  45/100     │  │  200/500    │  │  30/50      │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                     │
│                    [Load More]                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 3.2: Event Card Component

**Story Points**: 2
**Priority**: P1 (High)
**Dependencies**: Task 1.2, Task 1.3

**Description**:
As a developer, I want a reusable event card component so that events are displayed consistently.

**Files to Create**:
- `/src/components/events/event-card.tsx`

**Acceptance Criteria**:
- [ ] Cover image with fallback placeholder
- [ ] Event title (truncated if too long)
- [ ] Date and time formatted for locale
- [ ] Location displayed
- [ ] Category badge
- [ ] Organizer avatar and name
- [ ] Attendee count / capacity
- [ ] Status badge (if draft/cancelled)
- [ ] Hover effect and click to navigate
- [ ] Responsive sizing

---

### Task 3.3: Event Detail Page

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Task 3.1

**Description**:
As a user, I want to view event details so that I can learn more about an event.

**Files to Create**:
- `/src/app/[locale]/(main)/events/[id]/page.tsx`
- `/src/components/events/event-detail.tsx`
- `/src/components/events/event-header.tsx`
- `/src/components/events/event-info.tsx`
- `/src/components/events/event-location-map.tsx`
- `/src/components/events/event-organizer.tsx`
- `/src/hooks/queries/use-event.ts`

**Acceptance Criteria**:
- [ ] Large cover image
- [ ] Title, description (markdown support)
- [ ] Date/time with timezone
- [ ] Location with optional map
- [ ] Organizer info with link to profile
- [ ] Attendee count / capacity
- [ ] Category and tags
- [ ] Action buttons (based on user role):
  - Organizer: Edit, Publish/Cancel, Invite
  - Attendee: RSVP status
  - Visitor: Login to RSVP
- [ ] Posts/updates section
- [ ] SEO metadata (Open Graph)

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │                     [Cover Image]                             │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Tech Meetup 2026                                    [Edit] [...]   │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  [Calendar] January 25, 2026 6:00 PM - 9:00 PM KST                 │
│  [Location] Gangnam Convention Center, Seoul                        │
│  [Users] 45 / 100 attending                                         │
│  [Tag] Technology  [Tag] Networking                                 │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  About this event                                                   │
│                                                                     │
│  Join us for an evening of tech talks and networking!               │
│  We'll have speakers from leading tech companies...                 │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Organizer                                                          │
│  ┌─────┐                                                           │
│  │ [A] │  John Doe                                                 │
│  └─────┘  Event Enthusiast                                         │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Updates                                  [+ Add Update] (organizer)│
│                                                                     │
│  [Pinned] Venue Change - Jan 20                                    │
│  The venue has changed to...                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 3.4: Event Creation Form

**Story Points**: 8
**Priority**: P0 (Critical)
**Dependencies**: Task 3.1, Task 2.5

**Description**:
As an organizer, I want to create an event so that I can invite people to my event.

**Files to Create**:
- `/src/app/[locale]/(main)/events/create/page.tsx`
- `/src/components/forms/event-form.tsx`
- `/src/components/forms/event-form-basic.tsx`
- `/src/components/forms/event-form-datetime.tsx`
- `/src/components/forms/event-form-location.tsx`
- `/src/components/forms/event-form-settings.tsx`
- `/src/components/forms/image-upload.tsx`
- `/src/lib/validations/event.ts`
- `/src/hooks/mutations/use-create-event.ts`

**Acceptance Criteria**:
- [ ] Multi-step form or accordion sections:
  1. Basic Info (title, description, category, cover image)
  2. Date & Time (start, end, timezone)
  3. Location (venue name, address, optional coordinates)
  4. Settings (capacity, visibility, tags)
- [ ] Form validation at each step
- [ ] Image upload with preview
- [ ] Date/time picker components
- [ ] Location autocomplete (optional, could use simple input)
- [ ] Tags input (multi-select or free-form)
- [ ] Save as draft option
- [ ] Preview before publishing
- [ ] Loading state during submission
- [ ] Success redirect to event detail

**Validation Schema**:
```typescript
export const eventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  category: z.enum(['social', 'business', 'sports', 'entertainment', 'education', 'other']),
  cover_image_url: z.string().url().optional(),
  location: z.string().min(1).max(200),
  venue_name: z.string().max(100).optional(),
  address: z.object({
    line1: z.string(),
    city: z.string(),
    country: z.string(),
    postal_code: z.string().optional(),
  }).optional(),
  timezone: z.string(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  capacity: z.number().min(1).max(10000).optional(),
  visibility: z.enum(['public', 'private', 'invite_only']),
  tags: z.array(z.string()).max(10),
}).refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
  message: 'End time must be after start time',
  path: ['ends_at'],
});
```

---

### Task 3.5: Event Edit Form

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 3.4

**Description**:
As an organizer, I want to edit my event so that I can update event details.

**Files to Create**:
- `/src/app/[locale]/(main)/events/[id]/edit/page.tsx`
- `/src/hooks/mutations/use-update-event.ts`

**Acceptance Criteria**:
- [ ] Reuse event form component
- [ ] Pre-populate form with existing event data
- [ ] Only organizer can access edit page
- [ ] Handle draft vs published event differently
- [ ] Show confirmation for significant changes
- [ ] Success redirect to event detail

---

### Task 3.6: Event Actions (Publish/Cancel/Delete)

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 3.3, Task 3.5

**Description**:
As an organizer, I want to publish, cancel, or delete my event so that I can manage the event lifecycle.

**Files to Create**:
- `/src/components/events/event-actions.tsx`
- `/src/components/events/publish-dialog.tsx`
- `/src/components/events/cancel-dialog.tsx`
- `/src/components/events/delete-dialog.tsx`
- `/src/hooks/mutations/use-publish-event.ts`
- `/src/hooks/mutations/use-cancel-event.ts`
- `/src/hooks/mutations/use-delete-event.ts`

**Acceptance Criteria**:
- [ ] Publish button (draft -> published)
  - Confirmation dialog
  - Validates all required fields
- [ ] Cancel button (published -> cancelled)
  - Confirmation dialog with reason
  - Warning about notifying attendees
- [ ] Delete button (any status)
  - Confirmation dialog with "type event name" verification
  - Only available for organizer
- [ ] All actions show loading state
- [ ] Success toast messages
- [ ] Optimistic updates where appropriate

---

### Task 3.7: Event Categories and Tags

**Story Points**: 2
**Priority**: P2 (Medium)
**Dependencies**: Task 3.1

**Description**:
As a developer, I want standardized categories and tags so that events are consistently categorized.

**Files to Create**:
- `/src/lib/constants/categories.ts`
- `/src/components/events/category-select.tsx`
- `/src/components/events/tags-input.tsx`

**Acceptance Criteria**:
- [ ] Predefined categories with icons and translations
- [ ] Category select component with icons
- [ ] Tags input with autocomplete suggestions
- [ ] Tags displayed as badges

**Categories**:
```typescript
export const EVENT_CATEGORIES = [
  { value: 'social', label: { en: 'Social', ko: '소셜' }, icon: 'users' },
  { value: 'business', label: { en: 'Business', ko: '비즈니스' }, icon: 'briefcase' },
  { value: 'sports', label: { en: 'Sports', ko: '스포츠' }, icon: 'trophy' },
  { value: 'entertainment', label: { en: 'Entertainment', ko: '엔터테인먼트' }, icon: 'music' },
  { value: 'education', label: { en: 'Education', ko: '교육' }, icon: 'book' },
  { value: 'other', label: { en: 'Other', ko: '기타' }, icon: 'more-horizontal' },
] as const;
```

---

### Task 3.8: My Events Page

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 3.1

**Description**:
As an organizer, I want to see all my events so that I can manage them in one place.

**Files to Create**:
- `/src/app/[locale]/(main)/events/my/page.tsx`
- `/src/components/events/my-events-list.tsx`

**Acceptance Criteria**:
- [ ] List events created by current user
- [ ] Tabs: All, Draft, Published, Cancelled
- [ ] Quick actions: Edit, Publish, Cancel
- [ ] Event stats: attendees, invitations sent
- [ ] Empty state for each tab
- [ ] Link to create new event

---

## Phase 4: Invitations & Posts

**Duration**: 4-5 days
**Goal**: Implement invitation management and event posts functionality.

---

### Task 4.1: My Invitations Page

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Phase 3 complete

**Description**:
As a user, I want to see my invitations so that I can respond to them.

**Files to Create**:
- `/src/app/[locale]/(main)/invitations/page.tsx`
- `/src/components/invitations/invitation-list.tsx`
- `/src/components/invitations/invitation-card.tsx`
- `/src/hooks/queries/use-my-invitations.ts`

**Acceptance Criteria**:
- [ ] List all invitations received
- [ ] Tabs: All, Pending, Accepted, Declined, Maybe
- [ ] Invitation card shows: event info, inviter, message, received date
- [ ] Quick RSVP buttons on card
- [ ] Click to view event detail
- [ ] Empty state per tab
- [ ] Badge count for pending invitations (in header)

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  My Invitations                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [All (5)]  [Pending (2)]  [Accepted (2)]  [Declined (1)]          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tech Meetup 2026                               Jan 15, 2026  │  │
│  │  Jan 25, 2026 - Seoul                                         │  │
│  │                                                               │  │
│  │  From: John Doe                                               │  │
│  │  "Would love to have you at my event!"                        │  │
│  │                                                               │  │
│  │  [Accept]  [Decline]  [Maybe]                   [View Event]  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Music Festival                                 [ACCEPTED]    │  │
│  │  Feb 10, 2026 - Busan                                         │  │
│  │  ...                                                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 4.2: RSVP Functionality

**Story Points**: 3
**Priority**: P0 (Critical)
**Dependencies**: Task 4.1

**Description**:
As a user, I want to RSVP to invitations so that I can confirm my attendance.

**Files to Create**:
- `/src/components/invitations/rsvp-buttons.tsx`
- `/src/components/invitations/rsvp-dialog.tsx`
- `/src/hooks/mutations/use-respond-invitation.ts`

**Acceptance Criteria**:
- [ ] Accept, Decline, Maybe buttons
- [ ] Optional message when declining
- [ ] Loading state during submission
- [ ] Optimistic UI update
- [ ] Success toast message
- [ ] Update invitation list after RSVP
- [ ] Works from invitation list and event detail page

---

### Task 4.3: Send Invitation Modal

**Story Points**: 5
**Priority**: P1 (High)
**Dependencies**: Task 3.3

**Description**:
As an organizer, I want to send invitations so that I can invite people to my event.

**Files to Create**:
- `/src/components/invitations/send-invitation-modal.tsx`
- `/src/components/invitations/invitee-search.tsx`
- `/src/components/invitations/invitee-list.tsx`
- `/src/hooks/mutations/use-send-invitations.ts`

**Acceptance Criteria**:
- [ ] Search for users by name/email
- [ ] Add email addresses for non-users
- [ ] Selected invitees list with remove option
- [ ] Custom message textarea
- [ ] Bulk selection (up to 50)
- [ ] Loading state during send
- [ ] Success message with count sent
- [ ] Error handling for invalid emails

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  Send Invitations                                              [X]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Search users or enter email                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Search...                                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Selected (3)                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [A] Jane Smith                                          [x] │   │
│  │ [A] Bob Johnson                                         [x] │   │
│  │ [+] guest@example.com                                   [x] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Message (optional)                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Would love to have you at my event!                         │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│                                    [Cancel]  [Send 3 Invitations]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Task 4.4: Event Invitations List (Organizer View)

**Story Points**: 3
**Priority**: P2 (Medium)
**Dependencies**: Task 4.3

**Description**:
As an organizer, I want to see all invitations for my event so that I can track responses.

**Files to Create**:
- `/src/components/events/event-invitations.tsx`
- `/src/hooks/queries/use-event-invitations.ts`

**Acceptance Criteria**:
- [ ] List all invitations sent for event
- [ ] Filter by status (pending, accepted, declined, maybe)
- [ ] Show invitee info and response date
- [ ] Resend option for pending invitations
- [ ] Cancel/revoke invitation option
- [ ] Stats summary (accepted, pending, declined)

---

### Task 4.5: Event Posts List

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 3.3

**Description**:
As a user, I want to see event updates so that I stay informed about the event.

**Files to Create**:
- `/src/components/posts/post-list.tsx`
- `/src/components/posts/post-card.tsx`
- `/src/hooks/queries/use-event-posts.ts`

**Acceptance Criteria**:
- [ ] List posts for an event
- [ ] Pinned posts shown first
- [ ] Post card shows: author, type badge, title, content preview, date
- [ ] Image attachments displayed
- [ ] Expand to full content
- [ ] Post type styling (announcement = important, reminder = warning)

---

### Task 4.6: Create Post Form

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Task 4.5

**Description**:
As an organizer, I want to create posts so that I can update attendees.

**Files to Create**:
- `/src/components/posts/create-post-dialog.tsx`
- `/src/components/posts/post-form.tsx`
- `/src/lib/validations/post.ts`
- `/src/hooks/mutations/use-create-post.ts`

**Acceptance Criteria**:
- [ ] Post type selector (update, announcement, reminder)
- [ ] Title input (optional)
- [ ] Content textarea (required)
- [ ] Image attachment upload (optional)
- [ ] Pin option checkbox
- [ ] Form validation
- [ ] Loading state during submission
- [ ] Success toast and list refresh

---

### Task 4.7: Post Actions (Edit/Delete/Pin)

**Story Points**: 2
**Priority**: P2 (Medium)
**Dependencies**: Task 4.6

**Description**:
As an organizer, I want to manage posts so that I can edit or remove them.

**Files to Create**:
- `/src/components/posts/post-actions.tsx`
- `/src/hooks/mutations/use-update-post.ts`
- `/src/hooks/mutations/use-delete-post.ts`
- `/src/hooks/mutations/use-pin-post.ts`

**Acceptance Criteria**:
- [ ] Edit post (opens dialog with form)
- [ ] Delete post (confirmation dialog)
- [ ] Pin/Unpin toggle
- [ ] Only organizer sees action buttons
- [ ] Optimistic updates for pin toggle

---

## Phase 5: Polish

**Duration**: 4-5 days
**Goal**: Improve UX with responsive design, loading states, error handling, i18n, and accessibility.

---

### Task 5.1: Responsive Design Audit

**Story Points**: 5
**Priority**: P1 (High)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user, I want the app to work well on all devices so that I can use it on mobile.

**Files to Modify**:
- All component files as needed

**Acceptance Criteria**:
- [ ] All pages work on mobile (320px+)
- [ ] All pages work on tablet (768px+)
- [ ] All pages work on desktop (1024px+)
- [ ] Touch targets minimum 44x44px
- [ ] Forms usable on mobile keyboard
- [ ] Images responsive with proper aspect ratios
- [ ] Tables converted to cards on mobile
- [ ] Modals full-screen on mobile

**Breakpoints**:
```css
/* Tailwind defaults */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

### Task 5.2: Loading States

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user, I want clear loading indicators so that I know when content is being fetched.

**Files to Create**:
- `/src/components/ui/loading-spinner.tsx`
- `/src/components/ui/loading-screen.tsx`
- `/src/components/events/event-card-skeleton.tsx`
- `/src/components/events/event-detail-skeleton.tsx`
- `/src/components/invitations/invitation-card-skeleton.tsx`

**Acceptance Criteria**:
- [ ] Skeleton components for all list items
- [ ] Full page loading screen for initial load
- [ ] Button loading states (spinner + disabled)
- [ ] Form submission loading states
- [ ] Shimmer effect on skeletons
- [ ] Smooth transitions from loading to loaded

---

### Task 5.3: Error Handling

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user, I want clear error messages so that I know when something goes wrong.

**Files to Create**:
- `/src/components/ui/error-boundary.tsx`
- `/src/components/ui/error-message.tsx`
- `/src/components/ui/not-found.tsx`
- `/src/app/[locale]/error.tsx`
- `/src/app/[locale]/not-found.tsx`
- `/src/lib/errors.ts`

**Acceptance Criteria**:
- [ ] Error boundary catches rendering errors
- [ ] API errors displayed appropriately
- [ ] Form validation errors inline
- [ ] 404 page for missing resources
- [ ] 500 page for server errors
- [ ] Retry buttons where appropriate
- [ ] User-friendly error messages (no technical jargon)
- [ ] Error messages translated

---

### Task 5.4: Toast Notifications

**Story Points**: 2
**Priority**: P1 (High)
**Dependencies**: Task 1.2

**Description**:
As a user, I want toast notifications so that I receive feedback on my actions.

**Files to Create**:
- `/src/lib/toast.ts`

**Files to Modify**:
- All mutation hooks to add toast notifications

**Acceptance Criteria**:
- [ ] Success toasts for successful actions
- [ ] Error toasts for failed actions
- [ ] Auto-dismiss after 5 seconds
- [ ] Dismiss button on each toast
- [ ] Stack multiple toasts
- [ ] Consistent styling with design system

---

### Task 5.5: Internationalization (i18n)

**Story Points**: 5
**Priority**: P0 (Critical)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user, I want the app in Korean or English so that I can use it in my preferred language.

**Files to Create**:
- `/src/messages/en.json`
- `/src/messages/ko.json`
- `/src/lib/i18n.ts`
- `/src/middleware.ts` (update for locale detection)

**Files to Modify**:
- All pages and components to use translation keys

**Acceptance Criteria**:
- [ ] All static text translated (Korean + English)
- [ ] Language switcher in header
- [ ] URL-based locale (`/en/events`, `/ko/events`)
- [ ] Locale persisted in localStorage
- [ ] Date/time formatting per locale
- [ ] Number formatting per locale
- [ ] Form validation messages translated
- [ ] API error messages translated (if returned by backend)

**Translation Structure**:
```json
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit"
  },
  "auth": {
    "login": "Log in",
    "register": "Register",
    "logout": "Log out",
    "email": "Email",
    "password": "Password"
  },
  "events": {
    "title": "Events",
    "create": "Create Event",
    "myEvents": "My Events",
    "noEvents": "No events found"
  },
  "invitations": {
    "title": "My Invitations",
    "pending": "Pending",
    "accepted": "Accepted",
    "declined": "Declined"
  }
}
```

---

### Task 5.6: Accessibility (a11y)

**Story Points**: 3
**Priority**: P1 (High)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user with disabilities, I want the app to be accessible so that I can use it with assistive technologies.

**Files to Modify**:
- All component files as needed

**Acceptance Criteria**:
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Skip to main content link
- [ ] ARIA labels on icon buttons
- [ ] ARIA live regions for dynamic content
- [ ] Form labels properly associated
- [ ] Color contrast meets WCAG AA
- [ ] Images have alt text
- [ ] Reduced motion support
- [ ] Screen reader tested (VoiceOver/NVDA)

**Key Patterns**:
```tsx
// Icon button with ARIA
<Button size="icon" aria-label="Edit event">
  <PencilIcon className="h-4 w-4" />
</Button>

// Live region for updates
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

### Task 5.7: SEO and Metadata

**Story Points**: 2
**Priority**: P2 (Medium)
**Dependencies**: Phases 1-4 complete

**Description**:
As a marketing team, I want proper SEO so that events are discoverable via search engines.

**Files to Create**:
- `/src/lib/metadata.ts`
- `/src/app/[locale]/opengraph-image.tsx` (if using dynamic OG)

**Files to Modify**:
- All page files to include metadata

**Acceptance Criteria**:
- [ ] Page titles descriptive and unique
- [ ] Meta descriptions for all pages
- [ ] Open Graph tags for social sharing
- [ ] Twitter card tags
- [ ] Canonical URLs set
- [ ] Dynamic metadata for event detail pages
- [ ] Structured data (JSON-LD) for events
- [ ] robots.txt configured
- [ ] sitemap.xml generated

**Metadata Example**:
```typescript
// /src/app/[locale]/(main)/events/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await getEvent(params.id);

  return {
    title: `${event.title} | Lux`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description,
      images: [event.cover_image_url],
      type: 'website',
    },
  };
}
```

---

### Task 5.8: Performance Optimization

**Story Points**: 3
**Priority**: P2 (Medium)
**Dependencies**: Phases 1-4 complete

**Description**:
As a user, I want fast page loads so that I have a good experience.

**Files to Modify**:
- Various as needed

**Acceptance Criteria**:
- [ ] Images optimized with next/image
- [ ] Code splitting per route
- [ ] Dynamic imports for heavy components
- [ ] Prefetch on link hover
- [ ] Query deduplication working
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse score > 90 (Performance)
- [ ] Core Web Vitals green

**Optimizations**:
```typescript
// Dynamic import for heavy components
const MapComponent = dynamic(() => import('./map'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,
});

// Image optimization
<Image
  src={event.cover_image_url}
  alt={event.title}
  width={800}
  height={400}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={blurHash}
/>
```

---

### Task 5.9: Testing Setup

**Story Points**: 3
**Priority**: P2 (Medium)
**Dependencies**: Phase 1 complete

**Description**:
As a developer, I want testing infrastructure so that we can write tests.

**Files to Create**:
- `/jest.config.js`
- `/jest.setup.ts`
- `/src/__tests__/example.test.tsx`
- `/.github/workflows/test.yml` (optional CI)

**Acceptance Criteria**:
- [ ] Jest configured for Next.js
- [ ] React Testing Library configured
- [ ] MSW for API mocking
- [ ] Test utilities for common patterns
- [ ] At least one example test per component type
- [ ] npm test command working

---

## Summary

### Phase Overview

| Phase | Duration | Tasks | Story Points |
|-------|----------|-------|--------------|
| Phase 1: Foundation | 3-4 days | 9 tasks | 23 SP |
| Phase 2: Authentication | 3-4 days | 7 tasks | 26 SP |
| Phase 3: Events | 5-6 days | 8 tasks | 31 SP |
| Phase 4: Invitations & Posts | 4-5 days | 7 tasks | 24 SP |
| Phase 5: Polish | 4-5 days | 9 tasks | 29 SP |
| **Total** | **19-24 days** | **40 tasks** | **133 SP** |

### Critical Path

```
Phase 1 (Foundation)
    └── Task 1.1 (Project Init)
        ├── Task 1.2 (shadcn/ui)
        ├── Task 1.3 (Types)
        └── Task 1.4 (API Client)
            └── Task 1.5 (Auth Store)
                └── Task 1.6 (TanStack Query)
                    └── Tasks 1.7-1.9 (Layout)

Phase 2 (Authentication)
    └── Task 2.1 (Login)
        └── Task 2.2 (Register)
        └── Task 2.3 (Mutations)
        └── Task 2.4 (Token Refresh)
        └── Task 2.5 (Protected Routes)

Phase 3 (Events)
    └── Task 3.1 (Event List)
        └── Task 3.3 (Event Detail)
            └── Task 3.4 (Create Event)
                └── Task 3.5 (Edit Event)
                └── Task 3.6 (Event Actions)

Phase 4 (Invitations & Posts)
    └── Task 4.1 (My Invitations)
        └── Task 4.2 (RSVP)
    └── Task 4.3 (Send Invitations)
    └── Task 4.5 (Posts List)
        └── Task 4.6 (Create Post)

Phase 5 (Polish)
    └── All polish tasks can run in parallel
```

### Key Dependencies

1. **Types** (Task 1.3) must be complete before API client work
2. **Auth Store** (Task 1.5) must be complete before protected routes
3. **Login Page** (Task 2.1) should be complete before other auth pages
4. **Event List** (Task 3.1) should be complete before event detail
5. **Event Detail** (Task 3.3) should be complete before posts/invitations features

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API changes during development | Medium | High | Define types early, use OpenAPI spec if available |
| shadcn/ui component limitations | Low | Medium | Customize components as needed |
| Complex form state management | Medium | Medium | Use proven patterns, test early |
| i18n complexity | Low | High | Set up infrastructure early |
| Performance issues | Low | Medium | Monitor bundle size, use profiler |

### Definition of Done (Global)

- [ ] Feature implemented according to acceptance criteria
- [ ] Code reviewed and approved
- [ ] TypeScript errors resolved
- [ ] ESLint warnings resolved
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility basics verified
- [ ] Translations added for KO and EN
- [ ] Loading and error states implemented
- [ ] Documentation updated if needed

---

## Appendix A: File Structure Summary

```
lux-fe/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (main)/
│   │   │   │   ├── events/
│   │   │   │   │   ├── page.tsx              # Event list
│   │   │   │   │   ├── create/page.tsx       # Create event
│   │   │   │   │   ├── my/page.tsx           # My events
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx          # Event detail
│   │   │   │   │       └── edit/page.tsx     # Edit event
│   │   │   │   ├── invitations/page.tsx      # My invitations
│   │   │   │   └── profile/page.tsx          # User profile
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                      # Home/landing
│   │   │   ├── error.tsx
│   │   │   └── not-found.tsx
│   │   └── api/                              # API routes if needed
│   │
│   ├── components/
│   │   ├── ui/                               # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── user-menu.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── logo.tsx
│   │   │   └── language-switcher.tsx
│   │   ├── events/
│   │   │   ├── event-list.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── event-card-skeleton.tsx
│   │   │   ├── event-detail.tsx
│   │   │   ├── event-detail-skeleton.tsx
│   │   │   ├── event-filters.tsx
│   │   │   ├── event-actions.tsx
│   │   │   ├── event-invitations.tsx
│   │   │   └── category-select.tsx
│   │   ├── invitations/
│   │   │   ├── invitation-list.tsx
│   │   │   ├── invitation-card.tsx
│   │   │   ├── invitation-card-skeleton.tsx
│   │   │   ├── rsvp-buttons.tsx
│   │   │   ├── send-invitation-modal.tsx
│   │   │   └── invitee-search.tsx
│   │   ├── posts/
│   │   │   ├── post-list.tsx
│   │   │   ├── post-card.tsx
│   │   │   ├── create-post-dialog.tsx
│   │   │   └── post-actions.tsx
│   │   ├── forms/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── event-form.tsx
│   │   │   ├── event-form-basic.tsx
│   │   │   ├── event-form-datetime.tsx
│   │   │   ├── event-form-location.tsx
│   │   │   ├── event-form-settings.tsx
│   │   │   ├── post-form.tsx
│   │   │   └── image-upload.tsx
│   │   └── auth/
│   │       └── auth-guard.tsx
│   │
│   ├── hooks/
│   │   ├── queries/
│   │   │   ├── use-current-user.ts
│   │   │   ├── use-events.ts
│   │   │   ├── use-event.ts
│   │   │   ├── use-my-invitations.ts
│   │   │   ├── use-event-invitations.ts
│   │   │   ├── use-event-posts.ts
│   │   │   └── index.ts
│   │   ├── mutations/
│   │   │   ├── use-login.ts
│   │   │   ├── use-register.ts
│   │   │   ├── use-logout.ts
│   │   │   ├── use-create-event.ts
│   │   │   ├── use-update-event.ts
│   │   │   ├── use-publish-event.ts
│   │   │   ├── use-cancel-event.ts
│   │   │   ├── use-delete-event.ts
│   │   │   ├── use-send-invitations.ts
│   │   │   ├── use-respond-invitation.ts
│   │   │   ├── use-create-post.ts
│   │   │   ├── use-update-post.ts
│   │   │   ├── use-delete-post.ts
│   │   │   └── index.ts
│   │   └── use-auth.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── token-refresh.ts
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── events.ts
│   │   │   ├── invitations.ts
│   │   │   ├── posts.ts
│   │   │   └── index.ts
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── event.ts
│   │   │   └── post.ts
│   │   ├── constants/
│   │   │   └── categories.ts
│   │   ├── query-client.ts
│   │   ├── i18n.ts
│   │   ├── metadata.ts
│   │   ├── toast.ts
│   │   ├── errors.ts
│   │   └── utils.ts
│   │
│   ├── stores/
│   │   └── auth.ts
│   │
│   ├── providers/
│   │   ├── index.tsx
│   │   ├── query-provider.tsx
│   │   └── auth-provider.tsx
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── user.ts
│   │   ├── event.ts
│   │   ├── invitation.ts
│   │   ├── post.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   │
│   ├── messages/
│   │   ├── en.json
│   │   └── ko.json
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local.example
├── .gitignore
└── README.md
```

---

## Appendix B: Environment Variables

```env
# .env.local.example

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8088

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Lux

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## Appendix C: API Client Reference

```typescript
// Complete API client structure

// Auth API
authApi.register(data: RegisterInput): Promise<AuthResponse>
authApi.login(data: LoginInput): Promise<AuthResponse>
authApi.refresh(refreshToken: string): Promise<TokenResponse>
authApi.logout(): Promise<void>

// Users API
usersApi.getMe(): Promise<User>
usersApi.updateMe(data: UpdateUserInput): Promise<User>
usersApi.getById(id: string): Promise<PublicUser>

// Events API
eventsApi.list(params: EventListParams): Promise<PaginatedResponse<Event>>
eventsApi.getById(id: string): Promise<Event>
eventsApi.create(data: CreateEventInput): Promise<Event>
eventsApi.update(id: string, data: UpdateEventInput): Promise<Event>
eventsApi.delete(id: string): Promise<void>
eventsApi.publish(id: string): Promise<Event>
eventsApi.cancel(id: string): Promise<Event>

// Invitations API
invitationsApi.getMyInvitations(params?: InvitationListParams): Promise<PaginatedResponse<Invitation>>
invitationsApi.getEventInvitations(eventId: string, params?: InvitationListParams): Promise<PaginatedResponse<Invitation>>
invitationsApi.send(eventId: string, data: SendInvitationsInput): Promise<SendInvitationsResponse>
invitationsApi.respond(id: string, status: InvitationStatus): Promise<Invitation>

// Posts API
postsApi.getEventPosts(eventId: string, params?: PostListParams): Promise<PaginatedResponse<Post>>
postsApi.create(eventId: string, data: CreatePostInput): Promise<Post>
postsApi.update(id: string, data: UpdatePostInput): Promise<Post>
postsApi.delete(id: string): Promise<void>
postsApi.pin(id: string, pinned: boolean): Promise<Post>
```

---

*Document generated: 2026-01-20*
*For questions, contact the development team.*
