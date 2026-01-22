/**
 * Event-related types
 */

import type { BaseEntity, PaginationParams } from "./common";
import type { UserSummary } from "./user";

/** Event entity */
export interface Event extends BaseEntity {
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: EventLocation;
  status: EventStatus;
  visibility: EventVisibility;
  maxAttendees?: number;
  currentAttendees: number;
  host: UserSummary;
  categories: string[];
  tags: string[];
  settings: EventSettings;
}

/** Event status */
export type EventStatus =
  | "draft"
  | "published"
  | "ongoing"
  | "completed"
  | "cancelled";

/** Event visibility */
export type EventVisibility = "public" | "private" | "unlisted";

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

/** Create event request */
export interface CreateEventRequest {
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: EventLocation;
  visibility: EventVisibility;
  maxAttendees?: number;
  categories?: string[];
  tags?: string[];
  settings?: Partial<EventSettings>;
}

/** Update event request */
export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: EventStatus;
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

/** Event summary (for lists) */
export interface EventSummary {
  id: string;
  title: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  location: Pick<EventLocation, "type" | "venue" | "city">;
  status: EventStatus;
  currentAttendees: number;
  maxAttendees?: number;
  host: UserSummary;
}

/** Invitation entity */
export interface Invitation extends BaseEntity {
  eventId: string;
  event: EventSummary;
  senderId: string;
  sender: UserSummary;
  recipientId?: string;
  recipientEmail: string;
  recipient?: UserSummary;
  status: InvitationStatus;
  message?: string;
  respondedAt?: string;
  expiresAt?: string;
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
