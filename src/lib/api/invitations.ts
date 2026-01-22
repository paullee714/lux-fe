/**
 * Invitations API functions
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  Invitation,
  CreateInvitationRequest,
  RespondInvitationRequest,
  InvitationFilters,
} from "@/types/event";

/**
 * Get paginated list of invitations
 */
export async function getInvitations(
  filters?: InvitationFilters
): Promise<ApiResponse<PaginatedResponse<Invitation>>> {
  return apiClient.get<PaginatedResponse<Invitation>>("/invitations", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get received invitations (invitations sent to the current user)
 */
export async function getReceivedInvitations(
  filters?: Omit<InvitationFilters, "type">
): Promise<ApiResponse<PaginatedResponse<Invitation>>> {
  return apiClient.get<PaginatedResponse<Invitation>>("/users/me/invitations", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get sent invitations (invitations sent by the current user)
 */
export async function getSentInvitations(
  filters?: Omit<InvitationFilters, "type">
): Promise<ApiResponse<PaginatedResponse<Invitation>>> {
  return apiClient.get<PaginatedResponse<Invitation>>("/users/me/invitations/sent", {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get single invitation by ID
 */
export async function getInvitation(
  id: string
): Promise<ApiResponse<Invitation>> {
  return apiClient.get<Invitation>(`/invitations/${id}`);
}

/**
 * Create (send) invitation
 */
export async function createInvitation(
  data: CreateInvitationRequest
): Promise<ApiResponse<Invitation>> {
  return apiClient.post<Invitation>("/invitations", data);
}

/**
 * Send invitations for an event
 */
export async function sendInvitations(
  eventId: string,
  emails: string[],
  message?: string
): Promise<ApiResponse<{ sent: number; failed: string[] }>> {
  return apiClient.post<{ sent: number; failed: string[] }>(
    `/events/${eventId}/invitations`,
    {
      emails,
      message,
    }
  );
}

/**
 * Respond to invitation (accept/decline)
 */
export async function respondToInvitation(
  id: string,
  data: RespondInvitationRequest
): Promise<ApiResponse<Invitation>> {
  return apiClient.put<Invitation>(`/invitations/${id}/respond`, data);
}

/**
 * Cancel invitation (by sender)
 */
export async function cancelInvitation(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/invitations/${id}`);
}

/**
 * Resend invitation
 */
export async function resendInvitation(
  id: string
): Promise<ApiResponse<Invitation>> {
  return apiClient.post<Invitation>(`/invitations/${id}/resend`);
}

/**
 * Get invitation by token (public - for accepting via email link)
 */
export async function getInvitationByToken(
  token: string
): Promise<ApiResponse<Invitation>> {
  return apiClient.get<Invitation>(`/invitations/token/${token}`);
}

/**
 * Respond to invitation by token (public)
 */
export async function respondToInvitationByToken(
  token: string,
  data: RespondInvitationRequest
): Promise<ApiResponse<Invitation>> {
  return apiClient.post<Invitation>(`/invitations/token/${token}/respond`, data);
}

/**
 * Get pending invitation count
 */
export async function getPendingInvitationCount(): Promise<
  ApiResponse<{ count: number }>
> {
  return apiClient.get<{ count: number }>("/invitations/pending/count");
}
