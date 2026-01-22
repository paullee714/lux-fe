/**
 * Events API functions
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  Event,
  EventSummary,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  EventAttendee,
} from "@/types/event";

/**
 * Get paginated list of events
 */
export async function getEvents(
  filters?: EventFilters
): Promise<ApiResponse<PaginatedResponse<EventSummary>>> {
  return apiClient.get<PaginatedResponse<EventSummary>>("/events", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get single event by ID
 */
export async function getEvent(id: string): Promise<ApiResponse<Event>> {
  return apiClient.get<Event>(`/events/${id}`);
}

/**
 * Create new event
 */
export async function createEvent(
  data: CreateEventRequest
): Promise<ApiResponse<Event>> {
  return apiClient.post<Event>("/events", data);
}

/**
 * Update existing event
 */
export async function updateEvent(
  id: string,
  data: UpdateEventRequest
): Promise<ApiResponse<Event>> {
  return apiClient.patch<Event>(`/events/${id}`, data);
}

/**
 * Delete event
 */
export async function deleteEvent(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/events/${id}`);
}

/**
 * Get events created by current user
 */
export async function getMyEvents(
  filters?: Omit<EventFilters, "hostId">
): Promise<ApiResponse<PaginatedResponse<EventSummary>>> {
  return apiClient.get<PaginatedResponse<EventSummary>>("/events/my", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get events user is attending
 */
export async function getAttendingEvents(
  filters?: Omit<EventFilters, "hostId">
): Promise<ApiResponse<PaginatedResponse<EventSummary>>> {
  return apiClient.get<PaginatedResponse<EventSummary>>("/events/attending", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Publish draft event
 */
export async function publishEvent(id: string): Promise<ApiResponse<Event>> {
  return apiClient.post<Event>(`/events/${id}/publish`);
}

/**
 * Cancel event
 */
export async function cancelEvent(
  id: string,
  reason?: string
): Promise<ApiResponse<Event>> {
  return apiClient.post<Event>(`/events/${id}/cancel`, { reason });
}

/**
 * Get event attendees
 */
export async function getEventAttendees(
  eventId: string,
  filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }
): Promise<ApiResponse<PaginatedResponse<EventAttendee>>> {
  return apiClient.get<PaginatedResponse<EventAttendee>>(
    `/events/${eventId}/attendees`,
    {
      params: filters as Record<string, string | number | boolean | undefined>,
    }
  );
}

/**
 * Register for event (as attendee)
 */
export async function registerForEvent(
  eventId: string
): Promise<ApiResponse<EventAttendee>> {
  return apiClient.post<EventAttendee>(`/events/${eventId}/register`);
}

/**
 * Unregister from event
 */
export async function unregisterFromEvent(
  eventId: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/events/${eventId}/register`);
}

/**
 * Check in attendee
 */
export async function checkInAttendee(
  eventId: string,
  attendeeId: string
): Promise<ApiResponse<EventAttendee>> {
  return apiClient.post<EventAttendee>(
    `/events/${eventId}/attendees/${attendeeId}/check-in`
  );
}

/**
 * Get upcoming events (public)
 */
export async function getUpcomingEvents(
  limit?: number
): Promise<ApiResponse<EventSummary[]>> {
  return apiClient.get<EventSummary[]>("/events/upcoming", {
    params: { limit },
  });
}

/**
 * Search events
 */
export async function searchEvents(
  query: string,
  filters?: Omit<EventFilters, "search">
): Promise<ApiResponse<PaginatedResponse<EventSummary>>> {
  return apiClient.get<PaginatedResponse<EventSummary>>("/events/search", {
    params: {
      q: query,
      ...(filters as Record<string, string | number | boolean | undefined>),
    },
  });
}
