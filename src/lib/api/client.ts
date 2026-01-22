/**
 * API Client with fetch
 * Handles authentication, error handling, and request/response transformation
 */

import type {
  ApiResponse,
  ApiError,
  ApiRequestOptions,
  ApiClientConfig,
  ApiErrorCode,
} from "@/types/api";

/** Default configuration */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088",
  timeout: 30000,
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/** Token storage keys */
const TOKEN_KEY = "lux_access_token";
const REFRESH_TOKEN_KEY = "lux_refresh_token";

/** Custom error class for API errors */
export class ApiClientError extends Error {
  public code: string;
  public status: number;
  public details?: Record<string, string[]>;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromApiError(error: ApiError, status: number): ApiClientError {
    return new ApiClientError(
      error.error.message,
      error.error.code,
      status,
      error.error.details
    );
  }

  static networkError(): ApiClientError {
    return new ApiClientError(
      "Network error. Please check your connection.",
      "NETWORK_ERROR" as ApiErrorCode,
      0
    );
  }

  static timeoutError(): ApiClientError {
    return new ApiClientError(
      "Request timed out. Please try again.",
      "TIMEOUT" as ApiErrorCode,
      408
    );
  }
}

/** Token management utilities */
export const tokenManager = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  },
};

/** Build URL with query parameters */
function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/** Create abort controller with timeout */
function createAbortController(timeout: number): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

/** API client class */
class ApiClient {
  private config: ApiClientConfig;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Get authorization header */
  private getAuthHeader(): Record<string, string> {
    const token = tokenManager.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /** Refresh access token */
  private async refreshAccessToken(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new ApiClientError("No refresh token available", "UNAUTHORIZED", 401);
      }

      try {
        const response = await fetch(
          buildUrl(this.config.baseUrl, "/api/v1/auth/refresh"),
          {
            method: "POST",
            headers: this.config.defaultHeaders,
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!response.ok) {
          tokenManager.clearTokens();
          throw new ApiClientError("Session expired", "UNAUTHORIZED", 401);
        }

        const data = await response.json();
        tokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /** Make API request */
  async request<T>(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      params,
      cache,
      next,
      signal: externalSignal,
    } = options;

    const url = buildUrl(this.config.baseUrl, `/api/v1${path}`, params);

    const { controller, timeoutId } = createAbortController(
      this.config.timeout || DEFAULT_CONFIG.timeout!
    );

    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.config.defaultHeaders,
        ...this.getAuthHeader(),
        ...headers,
      },
      signal: externalSignal || controller.signal,
      cache,
      ...(next && { next }),
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Handle 401 - attempt token refresh
      if (response.status === 401) {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken && !path.includes("/auth/")) {
          try {
            await this.refreshAccessToken();
            // Retry original request with new token
            const retryResponse = await fetch(url, {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                ...this.getAuthHeader(),
              },
            });

            if (!retryResponse.ok) {
              const errorData: ApiError = await retryResponse.json();
              throw ApiClientError.fromApiError(errorData, retryResponse.status);
            }

            return retryResponse.json();
          } catch {
            tokenManager.clearTokens();
            throw new ApiClientError("Session expired", "UNAUTHORIZED", 401);
          }
        }
      }

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw ApiClientError.fromApiError(errorData, response.status);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw ApiClientError.timeoutError();
      }

      throw ApiClientError.networkError();
    }
  }

  /** Convenience methods */
  get<T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  delete<T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

/** Export singleton instance */
export const apiClient = new ApiClient();

/** Export for custom instances */
export { ApiClient };
