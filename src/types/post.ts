/**
 * Post-related types
 */

import type { BaseEntity } from "./common";
import type { UserSummary } from "./user";

/** Post type enum */
export type PostType = "update" | "announcement" | "reminder";

/** Post entity */
export interface Post extends BaseEntity {
  eventId: string;
  authorId: string;
  author: UserSummary;
  type: PostType;
  title?: string;
  content: string;
  images?: string[];
  isPinned: boolean;
  pinnedAt?: string;
}

/** Create post request */
export interface CreatePostRequest {
  type?: PostType;
  title?: string;
  content: string;
  images?: string[];
}

/** Update post request */
export interface UpdatePostRequest {
  type?: PostType;
  title?: string;
  content?: string;
  images?: string[];
}

/** Post filters */
export interface PostFilters {
  page?: number;
  limit?: number;
  type?: PostType;
}
