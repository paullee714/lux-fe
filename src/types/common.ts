/**
 * Common types used across the application
 */

/** Pagination parameters for list requests */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** Base entity with common fields (snake_case from backend) */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/** Status types */
export type Status = "active" | "inactive" | "pending" | "deleted";

/** Language codes supported */
export type LanguageCode = "ko" | "en";

/** Theme modes */
export type ThemeMode = "light" | "dark" | "system";

/** Date range for filtering */
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

/** Generic select option */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** Form field error */
export interface FieldError {
  field: string;
  message: string;
}

/** Action result */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: FieldError[];
}
