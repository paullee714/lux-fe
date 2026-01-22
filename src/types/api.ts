/**
 * API-related types
 */

/** HTTP methods */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/** API error response */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

/** API request options */
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  signal?: AbortSignal;
}

/** API client configuration */
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

/** Error codes from the API */
export enum ApiErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  RATE_LIMIT = "RATE_LIMIT",
}

/** Token payload */
export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

/** API endpoints type definitions */
export interface ApiEndpoints {
  // Auth
  login: "/auth/login";
  register: "/auth/register";
  logout: "/auth/logout";
  refresh: "/auth/refresh";
  forgotPassword: "/auth/forgot-password";
  resetPassword: "/auth/reset-password";

  // Users
  users: "/users";
  userById: "/users/:id";
  userProfile: "/users/me";
  updateProfile: "/users/me";

  // Events
  events: "/events";
  eventById: "/events/:id";
  createEvent: "/events";
  updateEvent: "/events/:id";
  deleteEvent: "/events/:id";
  myEvents: "/events/my";

  // Invitations
  invitations: "/invitations";
  invitationById: "/invitations/:id";
  respondInvitation: "/invitations/:id/respond";
  myInvitations: "/invitations/my";
}
