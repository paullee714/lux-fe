/**
 * Posts API functions
 */

import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/common";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
} from "@/types/post";

/**
 * Get posts for an event
 */
export async function getEventPosts(
  eventId: string,
  filters?: PostFilters
): Promise<ApiResponse<PaginatedResponse<Post>>> {
  return apiClient.get<PaginatedResponse<Post>>(`/events/${eventId}/posts`, {
    params: filters as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Get single post by ID
 */
export async function getPost(id: string): Promise<ApiResponse<Post>> {
  return apiClient.get<Post>(`/posts/${id}`);
}

/**
 * Create a new post for an event
 */
export async function createPost(
  eventId: string,
  data: CreatePostRequest
): Promise<ApiResponse<Post>> {
  return apiClient.post<Post>(`/events/${eventId}/posts`, data);
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  data: UpdatePostRequest
): Promise<ApiResponse<Post>> {
  return apiClient.put<Post>(`/posts/${id}`, data);
}

/**
 * Delete a post
 */
export async function deletePost(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/posts/${id}`);
}

/**
 * Pin a post
 */
export async function pinPost(id: string): Promise<ApiResponse<Post>> {
  return apiClient.post<Post>(`/posts/${id}/pin`);
}

/**
 * Unpin a post
 */
export async function unpinPost(id: string): Promise<ApiResponse<Post>> {
  return apiClient.delete<Post>(`/posts/${id}/pin`);
}
