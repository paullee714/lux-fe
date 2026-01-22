/**
 * User-related types (extended)
 */

import type { BaseEntity, PaginationParams } from "./common";

/** User list filters */
export interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
  isVerified?: boolean;
  createdFrom?: string;
  createdTo?: string;
}

/** User summary (for lists) */
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

/** User statistics */
export interface UserStats {
  totalEventsCreated: number;
  totalEventsAttended: number;
  totalInvitationsSent: number;
  totalInvitationsReceived: number;
  upcomingEvents: number;
}

/** User activity */
export interface UserActivity extends BaseEntity {
  userId: string;
  action: UserActivityAction;
  entityType: "event" | "invitation" | "profile";
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/** User activity actions */
export type UserActivityAction =
  | "login"
  | "logout"
  | "register"
  | "profile_update"
  | "event_create"
  | "event_update"
  | "event_delete"
  | "invitation_send"
  | "invitation_respond";

/** User notification */
export interface UserNotification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/** Notification types */
export type NotificationType =
  | "event_invitation"
  | "event_reminder"
  | "event_update"
  | "event_cancelled"
  | "invitation_response"
  | "system";
