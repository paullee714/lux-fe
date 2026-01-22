/**
 * Event-related types
 */

import type { BaseEntity, PaginationParams } from "./common";
import type { UserSummary } from "./user";

/** Event entity - matches backend response (snake_case) */
export interface Event extends BaseEntity {
  organizer_id: string;
  title: string;
  description?: string;
  slug: string;
  location?: string;
  venue_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  starts_at: string;
  ends_at: string;
  capacity?: number;
  cover_image_url?: string;
  status: EventStatus;
  visibility: EventVisibility;
  category?: string;
  tags: string[];
  published_at?: string;
  cancelled_at?: string;
}

/** Event status */
export type EventStatus =
  | "draft"
  | "published"
  | "ongoing"
  | "completed"
  | "cancelled";

/** Event visibility */
export type EventVisibility = "public" | "private" | "invite_only";

/** Event location */
export interface EventLocation {
  type: "online" | "offline" | "hybrid";
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  onlineUrl?: string;
  onlinePlatform?: string;
}

/** Event settings */
export interface EventSettings {
  allowComments: boolean;
  allowGuests: boolean;
  requireApproval: boolean;
  sendReminders: boolean;
  reminderTiming: number[]; // hours before event
}

/** Create event request - matches backend API */
export interface CreateEventRequest {
  title: string;
  description?: string;
  location?: string;
  venue_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  starts_at: string;  // ISO datetime
  ends_at: string;    // ISO datetime
  capacity?: number;
  cover_image_url?: string;
  visibility?: EventVisibility;
  category?: string;
  tags?: string[];
}

/** Update event request - matches backend API */
export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  venue_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  starts_at?: string;
  ends_at?: string;
  capacity?: number;
  cover_image_url?: string;
  visibility?: EventVisibility;
  category?: string;
  tags?: string[];
}

/** Event filters */
export interface EventFilters extends PaginationParams {
  search?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
  locationType?: EventLocation["type"];
  category?: string;
  startFrom?: string;
  startTo?: string;
  hostId?: string;
}

/** Event summary (for lists) - matches backend response */
export interface EventSummary {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  slug: string;
  location?: string;
  venue_name?: string;
  city?: string;
  country?: string;
  timezone: string;
  starts_at: string;
  ends_at: string;
  capacity?: number;
  cover_image_url?: string;
  status: EventStatus;
  visibility: EventVisibility;
  category?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/** Invitation entity - matches backend response */
export interface Invitation extends BaseEntity {
  event_id: string;
  inviter_id: string;
  invitee_id?: string;
  invitee_email?: string;
  invitee_name?: string;
  status: InvitationStatus;
  message?: string;
  responded_at?: string;
  expires_at?: string;
  // Optional enriched data (may not always be present)
  event?: EventSummary;
}

/** Invitation status */
export type InvitationStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired"
  | "cancelled";

/** Create invitation request */
export interface CreateInvitationRequest {
  eventId: string;
  recipientEmail: string;
  message?: string;
  expiresAt?: string;
}

/** Respond to invitation request */
export interface RespondInvitationRequest {
  status: "accepted" | "declined";
  message?: string;
}

/** Invitation filters */
export interface InvitationFilters extends PaginationParams {
  eventId?: string;
  status?: InvitationStatus;
  type?: "sent" | "received";
}

/** Event attendee */
export interface EventAttendee extends BaseEntity {
  eventId: string;
  userId: string;
  user: UserSummary;
  status: AttendeeStatus;
  joinedAt: string;
  checkInAt?: string;
}

/** Attendee status */
export type AttendeeStatus =
  | "registered"
  | "waitlisted"
  | "checked_in"
  | "cancelled"
  | "no_show";
